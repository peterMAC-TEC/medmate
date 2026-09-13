import type {
  Appointment,
  Caregiver,
  Doctor,
  HealthEntry,
  Medication,
  MedicationEvent,
  Prescription,
  Symptom,
  TimelineEvent,
  User,
} from "./types";

export const demoUser: User = {
  id: "user-001",
  name: "Sharma ji",
  age: 68,
  preferredLanguage: "en",
  voiceSpeed: "normal",
  voiceStyle: "warm",
  photoInitial: "S",
};

export const doctors: Doctor[] = [
  {
    id: "doc-mehta",
    name: "Dr. Mehta",
    specialty: "Cardiologist",
    clinic: "Sunrise Heart Clinic",
    phone: "+91 98765 43210",
  },
  {
    id: "doc-rao",
    name: "Dr. Rao",
    specialty: "General Physician",
    clinic: "Green Valley Clinic",
    phone: "+91 91234 56789",
  },
];

export const medications: Medication[] = [
  {
    id: "med-001",
    name: "Amlodipine",
    dosage: "10 mg",
    frequency: "Every morning",
    time: "08:00",
    purpose: "For blood pressure",
    doctorId: "doc-mehta",
    prescribedDate: "2026-08-12",
    startDate: "2026-08-12",
    status: "active",
    instructions: "Take with water after breakfast.",
    color: "teal",
    doseChanges: [
      { date: "2026-08-20", from: "5 mg", to: "10 mg", reason: "Blood pressure still slightly high" },
    ],
    notes: ["Feeling slightly dizzy in the mornings, discussed with Dr. Mehta."],
  },
  {
    id: "med-002",
    name: "Metformin",
    dosage: "500 mg",
    frequency: "Twice daily",
    time: "08:00,20:00",
    purpose: "For blood sugar",
    doctorId: "doc-rao",
    prescribedDate: "2026-06-02",
    startDate: "2026-06-02",
    status: "active",
    instructions: "Take after meals.",
    color: "sage",
    doseChanges: [],
    notes: [],
  },
  {
    id: "med-003",
    name: "Atorvastatin",
    dosage: "10 mg",
    frequency: "Every night",
    time: "21:00",
    purpose: "For cholesterol",
    doctorId: "doc-mehta",
    prescribedDate: "2026-08-12",
    startDate: "2026-08-12",
    status: "active",
    instructions: "Take before bed.",
    color: "lavender",
    doseChanges: [],
    notes: [],
  },
];

export const medicationEvents: MedicationEvent[] = [
  { id: "evt-1", medicationId: "med-001", type: "started", date: "2026-08-12" },
  { id: "evt-2", medicationId: "med-001", type: "taken", date: "2026-08-13", time: "08:05" },
  { id: "evt-3", medicationId: "med-001", type: "taken", date: "2026-08-14", time: "08:10" },
  { id: "evt-4", medicationId: "med-001", type: "dose-changed", date: "2026-08-20", detail: "5 mg → 10 mg" },
  { id: "evt-5", medicationId: "med-001", type: "taken", date: "2026-08-21", time: "08:02" },
  { id: "evt-6", medicationId: "med-001", type: "missed", date: "2026-08-25" },
  { id: "evt-7", medicationId: "med-002", type: "started", date: "2026-06-02" },
  { id: "evt-8", medicationId: "med-003", type: "started", date: "2026-08-12" },
];

export const symptoms: Symptom[] = [
  { id: "sym-1", name: "Dizziness", severity: "mild", date: "2026-08-14", timeOfDay: "morning", reportedVia: "voice" },
  { id: "sym-2", name: "Dizziness", severity: "mild", date: "2026-08-18", timeOfDay: "morning", reportedVia: "voice" },
  { id: "sym-3", name: "Dizziness", severity: "moderate", date: "2026-08-23", timeOfDay: "morning", reportedVia: "voice" },
  { id: "sym-4", name: "Knee pain", severity: "mild", date: "2026-09-10", timeOfDay: "morning", reportedVia: "manual" },
  { id: "sym-5", name: "Knee pain", severity: "mild", date: "2026-09-12", timeOfDay: "evening", reportedVia: "voice" },
  { id: "sym-6", name: "Fatigue", severity: "mild", date: "2026-09-05", timeOfDay: "afternoon", reportedVia: "voice" },
];

export const healthEntries: HealthEntry[] = [
  { id: "he-1", date: "2026-09-13", timeOfDay: "morning", feeling: "okay", note: "Little dizzy this morning.", symptomIds: [] },
  { id: "he-2", date: "2026-09-12", timeOfDay: "evening", feeling: "good", symptomIds: ["sym-5"] },
  { id: "he-3", date: "2026-09-12", timeOfDay: "morning", feeling: "okay" },
  { id: "he-4", date: "2026-09-11", timeOfDay: "morning", feeling: "good" },
  { id: "he-5", date: "2026-09-10", timeOfDay: "morning", feeling: "not-great", symptomIds: ["sym-4"] },
  { id: "he-6", date: "2026-09-09", timeOfDay: "morning", feeling: "good" },
];

export const caregivers: Caregiver[] = [
  {
    id: "care-1",
    name: "Anjali Sharma",
    relationship: "Daughter",
    phone: "+91 90000 11122",
    notifyOnMissedDose: true,
    notifyOnSymptom: true,
  },
];

export const appointments: Appointment[] = [
  { id: "appt-1", doctorId: "doc-mehta", date: "2026-09-28", time: "11:00", reason: "Blood pressure follow-up" },
];

export const prescriptions: Prescription[] = [
  {
    id: "presc-1",
    medicationId: "med-002",
    doctorId: "doc-rao",
    date: "2026-06-02",
    dosage: "500 mg",
    reason: "Blood sugar management",
  },
  {
    id: "presc-2",
    medicationId: "med-001",
    doctorId: "doc-mehta",
    date: "2026-08-12",
    dosage: "5 mg",
    reason: "Blood pressure management",
  },
  {
    id: "presc-3",
    medicationId: "med-003",
    doctorId: "doc-mehta",
    date: "2026-08-12",
    dosage: "10 mg",
    reason: "Cholesterol management",
  },
  {
    id: "presc-4",
    medicationId: "med-001",
    doctorId: "doc-mehta",
    date: "2026-08-20",
    dosage: "10 mg",
    reason: "Blood pressure management",
    changeFrom: "5 mg",
  },
];

export const medicationTimeline: TimelineEvent[] = [
  { id: "tl-1", date: "2026-08-12", kind: "prescription", title: "Amlodipine started", detail: "5 mg · For blood pressure", medicationId: "med-001" },
  { id: "tl-2", date: "2026-08-14", kind: "symptom", title: "Mild dizziness reported", medicationId: "med-001", severity: "mild" },
  { id: "tl-3", date: "2026-08-18", kind: "symptom", title: "Dizziness reported again", medicationId: "med-001", severity: "mild" },
  { id: "tl-4", date: "2026-08-20", kind: "dose-change", title: "Dose changed", detail: "5 mg → 10 mg", medicationId: "med-001" },
  { id: "tl-5", date: "2026-08-23", kind: "symptom", title: "Increased dizziness reported", medicationId: "med-001", severity: "moderate" },
  { id: "tl-6", date: "2026-09-05", kind: "symptom", title: "Fatigue reported", severity: "mild" },
  { id: "tl-7", date: "2026-09-10", kind: "symptom", title: "Knee pain reported", severity: "mild" },
];

export function getDoctor(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

export function getMedication(id: string): Medication | undefined {
  return medications.find((m) => m.id === id);
}

export function getMedicationEvents(medicationId: string): MedicationEvent[] {
  return medicationEvents
    .filter((e) => e.medicationId === medicationId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getAdherence(medicationId: string): number {
  const events = getMedicationEvents(medicationId);
  const taken = events.filter((e) => e.type === "taken").length;
  const missed = events.filter((e) => e.type === "missed").length;
  const total = taken + missed;
  if (total === 0) return 100;
  return Math.round((taken / total) * 100);
}

export function getSymptomsFor(medicationId?: string): Symptom[] {
  if (!medicationId) return symptoms;
  return symptoms;
}

export function symptomHistory(name: string, days = 7): boolean[] {
  const today = new Date("2026-09-13");
  const result: boolean[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    result.push(symptoms.some((s) => s.name === name && s.date === iso));
  }
  return result;
}

export function todayISO(): string {
  return "2026-09-13";
}
