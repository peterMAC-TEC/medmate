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
import type { FeelingLevel, HealthEntry, LanguageCode, Symptom, SymptomSeverity } from "@/lib/types";
import { demoUser, healthEntries as seedHealthEntries, medications, symptoms as seedSymptoms, todayISO } from "@/lib/mock-data";
import { dictionaries, type Dictionary } from "@/locales";

interface AppStateShape {
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
  userName: string;
}

const AppStateContext = createContext<AppStateShape | null>(null);

const STORAGE_KEY = "medmate-state-v1";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [voiceStyle, setVoiceStyleState] = useState<"warm" | "bold">(demoUser.voiceStyle);
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>({});
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>(seedHealthEntries);
  const [symptoms, setSymptoms] = useState<Symptom[]>(seedSymptoms);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.language) setLanguageState(parsed.language);
        if (parsed.voiceStyle) setVoiceStyleState(parsed.voiceStyle);
        if (parsed.takenToday) setTakenToday(parsed.takenToday);
        if (parsed.healthEntries) setHealthEntries(parsed.healthEntries);
        if (parsed.symptoms) setSymptoms(parsed.symptoms);
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
        JSON.stringify({ language, voiceStyle, takenToday, healthEntries, symptoms })
      );
    } catch {
      // storage unavailable
    }
  }, [language, voiceStyle, takenToday, healthEntries, symptoms, hydrated]);

  const setLanguage = useCallback((lang: LanguageCode) => setLanguageState(lang), []);
  const setVoiceStyle = useCallback((style: "warm" | "bold") => setVoiceStyleState(style), []);

  const markTaken = useCallback((medId: string) => {
    setTakenToday((prev) => ({ ...prev, [medId]: true }));
  }, []);

  const addHealthEntry = useCallback((feeling: FeelingLevel, note?: string) => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
    setHealthEntries((prev) => [
      { id: `he-${Date.now()}`, date: todayISO(), timeOfDay, feeling, note },
      ...prev,
    ]);
  }, []);

  const addSymptom = useCallback((name: string, severity: SymptomSeverity, note?: string) => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
    setSymptoms((prev) => [
      { id: `sym-${Date.now()}`, name, severity, date: todayISO(), timeOfDay, reportedVia: "voice", note },
      ...prev,
    ]);
  }, []);

  const value = useMemo<AppStateShape>(
    () => ({
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
      userName: demoUser.name,
    }),
    [
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
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function nextMedication() {
  return medications.find((m) => m.status === "active");
}
