import type { ConfidenceLevel, LanguageCode, SymptomSeverity } from "./types";
import { medications } from "./mock-data";

/**
 * aiService is a placeholder for the future natural-language layer:
 * multilingual intent understanding, medication identification, symptom
 * extraction, clarification, and conversational summarization. Every
 * function here is deterministic/mock so the prototype needs no API key.
 * A real implementation would swap the bodies below for calls to an LLM,
 * keeping this same interface so UI code never changes.
 */

export type Intent =
  | "confirm-medication-taken"
  | "report-symptom"
  | "report-feeling"
  | "snooze-reminder"
  | "unclear";

export interface NluResult {
  intent: Intent;
  confidence: ConfidenceLevel;
  medicationId?: string;
  symptomName?: string;
  severity?: SymptomSeverity;
  feeling?: "good" | "okay" | "not-great";
  rawText: string;
}

const takenPhrases = ["taken", "took", "le liya", "liya", "done", "finished", "kazhichu", "sevichen", "tegedukondanu"];
const symptomKeywords: Record<string, string> = {
  dizzy: "Dizziness",
  dizziness: "Dizziness",
  chakkar: "Dizziness",
  giddy: "Dizziness",
  headache: "Headache",
  "sar dard": "Headache",
  knee: "Knee pain",
  "ghutna": "Knee pain",
  tired: "Fatigue",
  fatigue: "Fatigue",
  thakaan: "Fatigue",
  nausea: "Nausea",
};

const severityKeywords: Record<string, SymptomSeverity> = {
  mild: "mild",
  thoda: "mild",
  slight: "mild",
  moderate: "moderate",
  severe: "severe",
  bahut: "severe",
  zyada: "moderate",
};

function findMedicationMention(text: string): string | undefined {
  const lower = text.toLowerCase();
  const match = medications.find((m) => lower.includes(m.name.toLowerCase()));
  return match?.id;
}

function findSymptom(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const key of Object.keys(symptomKeywords)) {
    if (lower.includes(key)) return symptomKeywords[key];
  }
  return undefined;
}

function findSeverity(text: string): SymptomSeverity | undefined {
  const lower = text.toLowerCase();
  for (const key of Object.keys(severityKeywords)) {
    if (lower.includes(key)) return severityKeywords[key];
  }
  return undefined;
}

/**
 * Interprets a transcript (already code-switched/mixed-language text from
 * ASR) and returns a structured intent with a confidence tier. Medically
 * consequential intents (medication taken, symptom severity) are only
 * marked "high" confidence when both the action and the specific subject
 * are unambiguous in the text — otherwise the UI must confirm explicitly.
 */
export function interpret(text: string, _language: LanguageCode): NluResult {
  const lower = text.trim().toLowerCase();
  if (!lower) {
    return { intent: "unclear", confidence: "low", rawText: text };
  }

  if (/(later|remind me|thodi der|baad me|abhi nahi)/.test(lower)) {
    return { intent: "snooze-reminder", confidence: "high", rawText: text };
  }

  const mentionsTaken = takenPhrases.some((p) => lower.includes(p));
  const medicationId = findMedicationMention(text);
  if (mentionsTaken) {
    if (medicationId) {
      return { intent: "confirm-medication-taken", confidence: "high", medicationId, rawText: text };
    }
    if (/(blue one|pink one|neeli|gulabi|voh wali)/.test(lower)) {
      return { intent: "confirm-medication-taken", confidence: "medium", rawText: text };
    }
    return { intent: "confirm-medication-taken", confidence: "medium", rawText: text };
  }

  const symptomName = findSymptom(text);
  if (symptomName) {
    const severity = findSeverity(text);
    return {
      intent: "report-symptom",
      confidence: severity ? "high" : "medium",
      symptomName,
      severity,
      rawText: text,
    };
  }

  if (/(good|acha|nalla|bagundi|chennagide|nallaund)/.test(lower)) {
    return { intent: "report-feeling", confidence: "high", feeling: "good", rawText: text };
  }
  if (/(okay|theek|paravaledu|sarle)/.test(lower)) {
    return { intent: "report-feeling", confidence: "high", feeling: "okay", rawText: text };
  }
  if (/(not great|not good|bura|bagoledu|sukhamilla)/.test(lower)) {
    return { intent: "report-feeling", confidence: "high", feeling: "not-great", rawText: text };
  }

  return { intent: "unclear", confidence: "low", rawText: text };
}

/**
 * Bold-style flourishes are only ever appended to light, positive,
 * non-medical confirmations (taken-on-time, feeling good, reminders).
 * Symptom reports and anything medically consequential always stay in
 * the plain, careful tone — no exceptions — per the "never joke around
 * symptoms" rule.
 */
const BOLD_TAKEN_FLOURISHES = ["Semma! Right on time.", "Mind it — that's discipline.", "Superb. Style-a maintain pannunga."];
const BOLD_GOOD_FLOURISHES = ["Semma mood!", "That's the spirit, boss."];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateReply(intent: NluResult, style: "warm" | "bold" = "warm"): string {
  switch (intent.intent) {
    case "confirm-medication-taken":
      if (intent.confidence !== "high") return "Just to make sure — did you take your medicine?";
      return style === "bold" ? `Got it, marked as taken. ${pick(BOLD_TAKEN_FLOURISHES)}` : "Got it. I've marked it as taken.";
    case "report-symptom":
      return intent.severity
        ? `Okay. I've recorded ${intent.severity} ${intent.symptomName?.toLowerCase()} for this session.`
        : `I'm sorry to hear that. Would you say the ${intent.symptomName?.toLowerCase()} is mild, moderate, or severe?`;
    case "report-feeling":
      if (style === "bold" && intent.feeling === "good") {
        return `Thank you for telling me. ${pick(BOLD_GOOD_FLOURISHES)}`;
      }
      return "Thank you for telling me. I've noted how you're feeling.";
    case "snooze-reminder":
      return "No problem. I'll remind you a little later.";
    default:
      return "I'm not quite sure I understood that.";
  }
}

/**
 * Surfaces a pattern worth a doctor conversation without claiming
 * causality. Deterministic mock of what a real summarization layer would
 * generate from the longitudinal timeline.
 */
export function summarizePattern(symptomName: string, aroundEvent: string): string {
  return `${symptomName} was reported after ${aroundEvent}. This may be useful to discuss with your doctor.`;
}
