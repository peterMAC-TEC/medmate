import type { ConfidenceLevel, LanguageCode, SymptomSeverity } from "./types";
import { medications } from "./mock-data";
import { detectSpokenLanguage, replyDictionaries } from "./conversationReplies";

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
  | "log-prescription"
  | "log-condition"
  | "snooze-reminder"
  | "unclear";

export interface NluResult {
  intent: Intent;
  confidence: ConfidenceLevel;
  medicationId?: string;
  symptomName?: string;
  severity?: SymptomSeverity;
  feeling?: "good" | "okay" | "not-great";
  /** log-prescription: the medication name as best parsed from speech. */
  prescriptionName?: string;
  /** log-prescription: dosage like "10 mg", if mentioned. */
  dosage?: string;
  /** log-prescription: what it's for, if mentioned ("for blood pressure"). */
  purpose?: string;
  /** log-prescription: the prescribing doctor's name, if mentioned. */
  doctorName?: string;
  /** log-condition: canonical condition name matched from speech. */
  conditionName?: string;
  rawText: string;
  /** The language the person actually spoke in, detected from the transcript
   *  itself — not necessarily their saved Settings language. Replies are
   *  generated in this language so MedMate answers in kind, including
   *  mid-conversation code-switches. */
  spokenLanguage: LanguageCode;
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

const PRESCRIPTION_TRIGGERS = /(prescribed|started me on|put me on|new medicine|new medication|doctor gave me|likh diya|shuru kiya)/i;

const conditionKeywords: Record<string, string> = {
  diabetes: "Type 2 Diabetes",
  diabetic: "Type 2 Diabetes",
  sugar: "Type 2 Diabetes",
  hypertension: "Hypertension",
  "high blood pressure": "Hypertension",
  "blood pressure": "Hypertension",
  asthma: "Asthma",
  arthritis: "Arthritis",
  thyroid: "Thyroid",
  cholesterol: "High Cholesterol",
};

function findCondition(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const key of Object.keys(conditionKeywords)) {
    if (lower.includes(key)) return conditionKeywords[key];
  }
  return undefined;
}

function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function extractDoctorName(text: string): string | undefined {
  const match = text.match(/(?:dr\.?|doctor)\s+([a-z]+)/i);
  return match ? `Dr. ${titleCase(match[1])}` : undefined;
}

function extractDosage(text: string): string | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s?(mg|mcg|ml|milligrams?)/i);
  return match ? `${match[1]} mg` : undefined;
}

function extractPurpose(text: string): string | undefined {
  const match = text.match(/for\s+([a-z][a-z\s]{2,30}?)(?:\.|,|$)/i);
  return match ? match[1].trim() : undefined;
}

function extractPrescriptionName(text: string): string | undefined {
  const match = text.match(
    /(?:prescribed(?: me)?|started me on|put me on|doctor gave me|likh diya|shuru kiya)\s+(?:me\s+)?([a-z]+)/i
  );
  return match ? titleCase(match[1]) : undefined;
}

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
export function interpret(text: string, preferredLanguage: LanguageCode): NluResult {
  const spokenLanguage = detectSpokenLanguage(text, preferredLanguage);
  const lower = text.trim().toLowerCase();
  if (!lower) {
    return { intent: "unclear", confidence: "low", rawText: text, spokenLanguage };
  }

  if (/(later|remind me|thodi der|baad me|abhi nahi)/.test(lower)) {
    return { intent: "snooze-reminder", confidence: "high", rawText: text, spokenLanguage };
  }

  if (PRESCRIPTION_TRIGGERS.test(lower)) {
    return {
      intent: "log-prescription",
      // Medication changes always need explicit confirmation — never
      // auto-recorded at "high" confidence, no matter how clear the text.
      confidence: "medium",
      prescriptionName: extractPrescriptionName(text),
      dosage: extractDosage(text),
      purpose: extractPurpose(text),
      doctorName: extractDoctorName(text),
      rawText: text,
      spokenLanguage,
    };
  }

  const mentionsTaken = takenPhrases.some((p) => lower.includes(p));
  const medicationId = findMedicationMention(text);
  if (mentionsTaken) {
    if (medicationId) {
      return { intent: "confirm-medication-taken", confidence: "high", medicationId, rawText: text, spokenLanguage };
    }
    if (/(blue one|pink one|neeli|gulabi|voh wali)/.test(lower)) {
      return { intent: "confirm-medication-taken", confidence: "medium", rawText: text, spokenLanguage };
    }
    return { intent: "confirm-medication-taken", confidence: "medium", rawText: text, spokenLanguage };
  }

  const conditionName = findCondition(text);
  if (conditionName) {
    return {
      intent: "log-condition",
      // A new condition also always gets confirmed before it's saved.
      confidence: "medium",
      conditionName,
      rawText: text,
      spokenLanguage,
    };
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
      spokenLanguage,
    };
  }

  if (/(good|acha|nalla|bagundi|chennagide|nallaund)/.test(lower)) {
    return { intent: "report-feeling", confidence: "high", feeling: "good", rawText: text, spokenLanguage };
  }
  if (/(okay|theek|paravaledu|sarle)/.test(lower)) {
    return { intent: "report-feeling", confidence: "high", feeling: "okay", rawText: text, spokenLanguage };
  }
  if (/(not great|not good|bura|bagoledu|sukhamilla)/.test(lower)) {
    return { intent: "report-feeling", confidence: "high", feeling: "not-great", rawText: text, spokenLanguage };
  }

  return { intent: "unclear", confidence: "low", rawText: text, spokenLanguage };
}

/**
 * Bold-style flourishes are only ever appended to light, positive,
 * non-medical confirmations (taken-on-time, feeling good, reminders).
 * Symptom reports and anything medically consequential always stay in
 * the plain, careful tone — no exceptions — per the "never joke around
 * symptoms" rule. Kept in a mixed, filmy slang register deliberately —
 * it reads as natural code-switching layered on top of the localized
 * base line, the same way the humor examples in the spec do.
 */
const BOLD_TAKEN_FLOURISHES = ["Semma! Right on time.", "Mind it — that's discipline.", "Superb. Style-a maintain pannunga."];
const BOLD_GOOD_FLOURISHES = ["Semma mood!", "That's the spirit, boss."];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Generates MedMate's spoken reply in `intent.spokenLanguage` — the
 * language the person just used — rather than any fixed app setting, so
 * a mid-conversation code-switch (English → Hindi, say) is answered in
 * kind. `style` layers a warm or bold/filmy personality on top.
 */
export function generateReply(intent: NluResult, style: "warm" | "bold" = "warm"): string {
  const r = replyDictionaries[intent.spokenLanguage] ?? replyDictionaries.en;

  switch (intent.intent) {
    case "confirm-medication-taken": {
      if (intent.confidence !== "high") return r.takenConfirmQuestion;
      const base = pick(r.takenHigh);
      return style === "bold" ? `${base} ${pick(BOLD_TAKEN_FLOURISHES)}` : base;
    }
    case "report-symptom":
      return intent.severity && intent.symptomName
        ? r.symptomRecorded(intent.severity, intent.symptomName)
        : r.symptomAskSeverity(intent.symptomName ?? "");
    case "report-feeling": {
      if (intent.feeling === "good") {
        const base = pick(r.feelingThanksGood);
        return style === "bold" ? `${base} ${pick(BOLD_GOOD_FLOURISHES)}` : base;
      }
      return r.feelingThanksNeutral;
    }
    case "log-prescription": {
      const name = intent.prescriptionName ?? intent.rawText;
      if (intent.confidence !== "high") return r.prescriptionAskConfirm(name, intent.dosage, intent.doctorName);
      return r.prescriptionRecorded(name, intent.dosage);
    }
    case "log-condition": {
      const name = intent.conditionName ?? intent.rawText;
      if (intent.confidence !== "high") return r.conditionAskConfirm(name);
      return r.conditionRecorded(name);
    }
    case "snooze-reminder":
      return r.snooze;
    default:
      return r.notUnderstood;
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
