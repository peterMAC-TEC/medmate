export type LanguageCode = "en" | "hi" | "ta" | "te" | "kn" | "ml";

export type FeelingLevel = "good" | "okay" | "not-great" | "other";

export interface User {
  id: string;
  name: string;
  honorific?: string;
  age: number;
  preferredLanguage: LanguageCode;
  voiceSpeed: "slow" | "normal" | "fast";
  voiceStyle: "warm" | "bold";
  photoInitial: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  phone?: string;
}

export interface DoseChange {
  date: string;
  from: string;
  to: string;
  reason?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  purpose: string;
  doctorId: string;
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "paused";
  instructions?: string;
  color: "teal" | "peach" | "lavender" | "sage";
  doseChanges: DoseChange[];
  notes?: string[];
}

export type MedicationEventType =
  | "started"
  | "taken"
  | "missed"
  | "dose-changed"
  | "stopped"
  | "reminder-sent";

export interface MedicationEvent {
  id: string;
  medicationId: string;
  type: MedicationEventType;
  date: string;
  time?: string;
  detail?: string;
}

export type SymptomSeverity = "mild" | "moderate" | "severe";

export interface Condition {
  id: string;
  name: string;
  diagnosedDate?: string;
  note?: string;
  reportedVia: "voice" | "manual";
}

export interface Symptom {
  id: string;
  name: string;
  severity: SymptomSeverity;
  date: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  reportedVia: "voice" | "manual";
  note?: string;
}

export interface HealthEntry {
  id: string;
  date: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  feeling: FeelingLevel;
  note?: string;
  symptomIds?: string[];
}

export type ConfidenceLevel = "high" | "medium" | "low";

export interface VoiceTurn {
  id: string;
  speaker: "user" | "medmate";
  text: string;
  timestamp: string;
  confidence?: ConfidenceLevel;
}

export interface VoiceConversationLog {
  id: string;
  date: string;
  turns: VoiceTurn[];
  language: LanguageCode;
}

export interface Caregiver {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  notifyOnMissedDose: boolean;
  notifyOnSymptom: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}

export interface Prescription {
  id: string;
  medicationId: string;
  doctorId: string;
  date: string;
  dosage: string;
  reason: string;
  changeFrom?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  kind: "prescription" | "dose-change" | "symptom" | "note" | "milestone";
  title: string;
  detail?: string;
  medicationId?: string;
  severity?: SymptomSeverity;
}
