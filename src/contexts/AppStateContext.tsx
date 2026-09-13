"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Condition,
  Doctor,
  FeelingLevel,
  HealthEntry,
  LanguageCode,
  Medication,
  Symptom,
  SymptomSeverity,
} from "@/lib/types";
import {
  conditions as seedConditions,
  demoUser,
  doctors as seedDoctors,
  healthEntries as seedHealthEntries,
  medications as seedMedications,
  symptoms as seedSymptoms,
  todayISO,
} from "@/lib/mock-data";
import { dictionaries, type Dictionary } from "@/locales";

const MEDICATION_COLORS: Medication["color"][] = ["teal", "peach", "lavender", "sage"];

const SELF_REPORTED_DOCTOR: Doctor = { id: "doc-self-reported", name: "Self-reported", specialty: "—", clinic: "—" };

interface AddMedicationInput {
  name: string;
  dosage?: string;
  purpose?: string;
  doctorName?: string;
}

export interface Profile {
  name: string;
  age: number;
}

interface AppStateShape {
  hydrated: boolean;
  profile: Profile | null;
  completeOnboarding: (name: string, age: number) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  voiceStyle: "warm" | "bold";
  setVoiceStyle: (style: "warm" | "bold") => void;
  t: Dictionary;
  takenToday: Record<string, boolean>;
  markTaken: (medId: string) => void;
  healthEntries: HealthEntry[];
  addHealthEntry: (feeling: FeelingLevel, note?: string) => void;
  symptoms: Symptom[];
  addSymptom: (name: string, severity: SymptomSeverity, note?: string) => void;
  medications: Medication[];
  addMedication: (input: AddMedicationInput) => void;
  doctors: Doctor[];
  getDoctorName: (doctorId: string) => string;
  conditions: Condition[];
  addCondition: (name: string, note?: string) => void;
  userName: string;
}

const AppStateContext = createContext<AppStateShape | null>(null);

const STORAGE_KEY = "medmate-state-v1";

function timeOfDayNow(): HealthEntry["timeOfDay"] {
  const hour = new Date().getHours();
  return hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [voiceStyle, setVoiceStyleState] = useState<"warm" | "bold">(demoUser.voiceStyle);
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>({});
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>(seedHealthEntries);
  const [symptoms, setSymptoms] = useState<Symptom[]>(seedSymptoms);
  const [medications, setMedications] = useState<Medication[]>(seedMedications);
  const [doctors, setDoctors] = useState<Doctor[]>(seedDoctors);
  const [conditions, setConditions] = useState<Condition[]>(seedConditions);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.language) setLanguageState(parsed.language);
        if (parsed.voiceStyle) setVoiceStyleState(parsed.voiceStyle);
        if (parsed.takenToday) setTakenToday(parsed.takenToday);
        if (parsed.healthEntries) setHealthEntries(parsed.healthEntries);
        if (parsed.symptoms) setSymptoms(parsed.symptoms);
        if (parsed.medications) setMedications(parsed.medications);
        if (parsed.doctors) setDoctors(parsed.doctors);
        if (parsed.conditions) setConditions(parsed.conditions);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          language,
          voiceStyle,
          takenToday,
          healthEntries,
          symptoms,
          medications,
          doctors,
          conditions,
        })
      );
    } catch {
      // storage unavailable
    }
  }, [profile, language, voiceStyle, takenToday, healthEntries, symptoms, medications, doctors, conditions, hydrated]);

  const setLanguage = useCallback((lang: LanguageCode) => setLanguageState(lang), []);
  const setVoiceStyle = useCallback((style: "warm" | "bold") => setVoiceStyleState(style), []);

  const completeOnboarding = useCallback((name: string, age: number) => {
    setProfile({ name, age });
    // A real profile starts on a clean slate — the seeded sample data
    // (Sharma ji's medicines, symptoms, etc.) was only ever there to
    // demonstrate the product; a real person's own data replaces it.
    setMedications([]);
    setDoctors([SELF_REPORTED_DOCTOR]);
    setSymptoms([]);
    setHealthEntries([]);
    setConditions([]);
    setTakenToday({});
  }, []);

  const markTaken = useCallback((medId: string) => {
    setTakenToday((prev) => ({ ...prev, [medId]: true }));
  }, []);

  const addHealthEntry = useCallback((feeling: FeelingLevel, note?: string) => {
    setHealthEntries((prev) => [
      { id: `he-${Date.now()}`, date: todayISO(), timeOfDay: timeOfDayNow(), feeling, note },
      ...prev,
    ]);
  }, []);

  const addSymptom = useCallback((name: string, severity: SymptomSeverity, note?: string) => {
    setSymptoms((prev) => [
      { id: `sym-${Date.now()}`, name, severity, date: todayISO(), timeOfDay: timeOfDayNow(), reportedVia: "voice", note },
      ...prev,
    ]);
  }, []);

  const addMedication = useCallback(
    (input: AddMedicationInput) => {
      // Resolved from the current `doctors` snapshot (this callback is
      // recreated whenever `doctors` changes, so it's never stale) rather
      // than inside a setState updater — nesting one state update inside
      // another updater risks React invoking it twice (e.g. Strict Mode)
      // and double-adding the medication.
      const existingDoctor = input.doctorName
        ? doctors.find(
            (d) => d.name.toLowerCase().replace(/^dr\.?\s*/, "") === input.doctorName!.toLowerCase().replace(/^dr\.?\s*/, "")
          )
        : undefined;
      const doctorId = existingDoctor?.id ?? (input.doctorName ? `doc-${Date.now()}` : "doc-self-reported");

      if (input.doctorName && !existingDoctor) {
        setDoctors((prev) => [...prev, { id: doctorId, name: input.doctorName!, specialty: "—", clinic: "—" } as Doctor]);
      }

      setMedications((prev) => [
        ...prev,
        {
          id: `med-${Date.now()}`,
          name: input.name,
          dosage: input.dosage ?? "As directed",
          frequency: "Daily",
          time: "08:00",
          purpose: input.purpose ? `For ${input.purpose}` : "Self-reported",
          doctorId,
          prescribedDate: todayISO(),
          startDate: todayISO(),
          status: "active",
          color: MEDICATION_COLORS[prev.length % MEDICATION_COLORS.length],
          doseChanges: [],
          notes: [],
        } as Medication,
      ]);
    },
    [doctors]
  );

  const getDoctorName = useCallback(
    (doctorId: string) => doctors.find((d) => d.id === doctorId)?.name ?? "Self-reported",
    [doctors]
  );

  const addCondition = useCallback((name: string, note?: string) => {
    setConditions((prev) => [
      { id: `cond-${Date.now()}`, name, diagnosedDate: todayISO(), note, reportedVia: "voice" },
      ...prev,
    ]);
  }, []);

  const value = useMemo<AppStateShape>(
    () => ({
      hydrated,
      profile,
      completeOnboarding,
      language,
      setLanguage,
      voiceStyle,
      setVoiceStyle,
      t: dictionaries[language],
      takenToday,
      markTaken,
      healthEntries,
      addHealthEntry,
      symptoms,
      addSymptom,
      medications,
      addMedication,
      doctors,
      getDoctorName,
      conditions,
      addCondition,
      userName: profile?.name ?? demoUser.name,
    }),
    [
      hydrated,
      profile,
      completeOnboarding,
      language,
      setLanguage,
      voiceStyle,
      setVoiceStyle,
      takenToday,
      markTaken,
      healthEntries,
      addHealthEntry,
      symptoms,
      addSymptom,
      medications,
      addMedication,
      doctors,
      getDoctorName,
      conditions,
      addCondition,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
