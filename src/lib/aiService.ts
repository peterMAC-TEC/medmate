import type { ConfidenceLevel, LanguageCode, SymptomSeverity } from "./types";
import { medications } from "./mock-data";
import { detectSpokenLanguage, localizeSeverity, localizeSymptomName, replyDictionaries } from "./conversationReplies";
import { findKnownMedicine } from "./medicineDatabase";
import { normalizeSpokenNumbers } from "./speechNumbers";
import { formatTime } from "./utils";

/**
 * aiService is a placeholder for the future natural-language layer:
 * multilingual intent understanding, medication identification, symptom
 * extraction, clarification, and conversational summarization. Every
 * function here is deterministic/mock so the prototype needs no API key.
 * A real implementation would swap the bodies below for calls to an LLM,
 * keeping this same interface so UI code never changes.
 */

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

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
  /** log-prescription: how many times a day, if mentioned ("twice a day"). */
  frequencyPerDay?: number;
  /** log-prescription: how many days to take it for, if mentioned. */
  durationDays?: number;
  /** log-prescription: time of day, only if explicitly said ("in the morning"). */
  explicitTimeOfDay?: TimeOfDay;
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

// English plus common romanized Hindi/Tamil/Telugu/Kannada/Malayalam
// phrasings for "a doctor gave/wrote me a new medicine" — registering a
// prescription needs to work the same regardless of which language was
// spoken, not just English.
const PRESCRIPTION_TRIGGERS =
  /(prescribed|started me on|put me on|new medicine|new medication|doctor gave me|likh diya|shuru kiya|kudutharu|ezhuthi kuduthaanga|ichcharu|raasicharu|kottru|barediddare|tannu|ezhuthi tannu)/i;

// Loanwords like "sugar", "BP", and the condition names themselves are
// commonly spoken as-is even mid-sentence in Hindi/Tamil/Telugu/Kannada/
// Malayalam, so plain keyword matching already covers most real usage
// without needing a full per-language translation.
const conditionKeywords: Record<string, string> = {
  diabetes: "Type 2 Diabetes",
  diabetic: "Type 2 Diabetes",
  sugar: "Type 2 Diabetes",
  hypertension: "Hypertension",
  "high blood pressure": "Hypertension",
  "blood pressure": "Hypertension",
  bp: "Hypertension",
  pressure: "Hypertension",
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

// Words that can immediately follow "doctor"/"dr" in ordinary sentences
// ("the doctor prescribed...", "doctor gave me...") without naming anyone —
// excluded so they're never mistaken for the doctor's actual name.
const DOCTOR_NAME_STOPWORDS = new Set([
  "prescribed", "gave", "said", "told", "wrote", "started", "put", "gives",
  "says", "recommended", "suggested", "changed", "increased", "decreased",
]);

function extractDoctorName(text: string): string | undefined {
  const match = text.match(/(?:dr\.?|doctor)\s+([a-z]+)/i);
  if (!match) return undefined;
  const candidate = match[1].toLowerCase();
  if (DOCTOR_NAME_STOPWORDS.has(candidate)) return undefined;
  return `Dr. ${titleCase(match[1])}`;
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

const FREQUENCY_PATTERNS: [RegExp, number][] = [
  [/\b(once|one time|1 time)s?\s+(a|per)?\s*day\b|\bonce daily\b/i, 1],
  [/\b(twice|two times|2 times)\s+(a|per)?\s*day\b|\btwice daily\b/i, 2],
  [/\b(thrice|three times|3 times)\s+(a|per)?\s*day\b|\bthree times daily\b/i, 3],
  [/\b(four times|4 times)\s+(a|per)?\s*day\b|\bfour times daily\b/i, 4],
];

function extractFrequencyPerDay(text: string): number | undefined {
  for (const [pattern, count] of FREQUENCY_PATTERNS) {
    if (pattern.test(text)) return count;
  }
  return undefined;
}

function extractDurationDays(text: string): number | undefined {
  // "for 5 days", "for the next 5 days", "for the next five days" (already
  // digit-normalized by the time this runs) all need to resolve the same way.
  const daysMatch = text.match(/for\s+(?:the\s+next\s+|a\s+|next\s+)?(\d+)\s*days?/i);
  if (daysMatch) return Number(daysMatch[1]);
  if (/for\s+a\s+week/i.test(text)) return 7;
  const weeksMatch = text.match(/for\s+(\d+)\s*weeks?/i);
  if (weeksMatch) return Number(weeksMatch[1]) * 7;
  if (/for\s+a\s+month/i.test(text)) return 30;
  return undefined;
}

function extractTimeOfDay(text: string): TimeOfDay | undefined {
  const lower = text.toLowerCase();
  if (/\bmorning\b|\bsubah\b/.test(lower)) return "morning";
  if (/\bafternoon\b|\bdopahar\b/.test(lower)) return "afternoon";
  if (/\bevening\b|\bshaam\b/.test(lower)) return "evening";
  if (/\bnight\b|\braat\b/.test(lower)) return "night";
  return undefined;
}

const TIME_OF_DAY_HOUR: Record<TimeOfDay, number> = { morning: 8, afternoon: 14, evening: 19, night: 22 };

/** Human label for how often a medicine is taken, from times-per-day. */
export function frequencyLabel(frequencyPerDay?: number): string {
  switch (frequencyPerDay) {
    case 1:
      return "Once daily";
    case 2:
      return "Twice daily";
    case 3:
      return "Three times daily";
    case 4:
      return "Four times daily";
    default:
      return "Daily";
  }
}

/** Plain-English "twice a day for 5 days" clause, or undefined if neither was mentioned. */
function buildScheduleClause(frequencyPerDay?: number, durationDays?: number): string | undefined {
  const freqPart = frequencyPerDay ? frequencyLabel(frequencyPerDay).toLowerCase() : undefined;
  const durationPart = durationDays ? `for ${durationDays} day${durationDays === 1 ? "" : "s"}` : undefined;
  if (freqPart && durationPart) return `${freqPart} ${durationPart}`;
  return freqPart ?? durationPart;
}

/**
 * Spaces doses evenly across 24 hours starting from the chosen anchor
 * time-of-day, wrapping past midnight if needed, and returns them as
 * "HH:MM" strings in ascending order — e.g. anchor "morning" (8) with
 * frequencyPerDay 2 gives ["08:00", "20:00"].
 */
export function computeDoseTimes(anchor: TimeOfDay, frequencyPerDay = 1): string[] {
  const anchorHour = TIME_OF_DAY_HOUR[anchor];
  const spacing = 24 / Math.max(frequencyPerDay, 1);
  const hours = Array.from({ length: frequencyPerDay }, (_, i) => Math.round(anchorHour + i * spacing) % 24);
  return [...new Set(hours)]
    .sort((a, b) => a - b)
    .map((h) => `${String(h).padStart(2, "0")}:00`);
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
    // Spoken strengths ("dolo six fifty") become digits ("dolo 650") before
    // anything else looks at the text, so name/dosage extraction below —
    // and the known-medicine lookup — see the same shape as typed input.
    const normalized = normalizeSpokenNumbers(text);
    const known = findKnownMedicine(normalized);
    const nameMatch = known ?? extractPrescriptionName(normalized);
    let dosage = extractDosage(normalized);
    if (!dosage && known) {
      const trailingNumber = known.match(/(\d+)\s*$/);
      if (trailingNumber) dosage = `${trailingNumber[1]} mg`;
    }
    return {
      intent: "log-prescription",
      // Medication changes always need explicit confirmation — never
      // auto-recorded at "high" confidence, no matter how clear the text.
      confidence: "medium",
      prescriptionName: nameMatch,
      dosage,
      purpose: extractPurpose(normalized),
      doctorName: extractDoctorName(normalized),
      frequencyPerDay: extractFrequencyPerDay(normalized),
      durationDays: extractDurationDays(normalized),
      explicitTimeOfDay: extractTimeOfDay(normalized),
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
    case "report-symptom": {
      const localizedName = intent.symptomName ? localizeSymptomName(intent.symptomName, intent.spokenLanguage) : "";
      return intent.severity && intent.symptomName
        ? r.symptomRecorded(localizeSeverity(intent.severity, intent.spokenLanguage), localizedName)
        : r.symptomAskSeverity(localizedName);
    }
    case "report-feeling": {
      if (intent.feeling === "good") {
        const base = pick(r.feelingThanksGood);
        return style === "bold" ? `${base} ${pick(BOLD_GOOD_FLOURISHES)}` : base;
      }
      return r.feelingThanksNeutral;
    }
    case "log-prescription": {
      const name = intent.prescriptionName ?? intent.rawText;
      const schedule = buildScheduleClause(intent.frequencyPerDay, intent.durationDays);
      // Known names like "Dolo 650" already say the strength — don't also
      // tack on "650 mg" right after it and repeat the number.
      const numberInName = intent.dosage?.match(/\d+/)?.[0];
      const dosageForSpeech = numberInName && name.includes(numberInName) ? undefined : intent.dosage;
      if (intent.confidence !== "high") return r.prescriptionAskConfirm(name, dosageForSpeech, intent.doctorName, schedule);
      return r.prescriptionRecorded(name, dosageForSpeech, schedule);
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

/** The simple "what time?" follow-up, asked only when speech didn't already say. */
export function scheduleTimeQuestion(lang: LanguageCode): string {
  return (replyDictionaries[lang] ?? replyDictionaries.en).askScheduleTime;
}

/** Announces the actual reminder times once a schedule has been picked. */
export function scheduleConfirmedReply(lang: LanguageCode, times: string[]): string {
  const formatted = times.map(formatTime).join(" and ");
  return (replyDictionaries[lang] ?? replyDictionaries.en).scheduleConfirmed(formatted);
}

/**
 * Surfaces a pattern worth a doctor conversation without claiming
 * causality. Deterministic mock of what a real summarization layer would
 * generate from the longitudinal timeline.
 */
export function summarizePattern(symptomName: string, aroundEvent: string): string {
  return `${symptomName} was reported after ${aroundEvent}. This may be useful to discuss with your doctor.`;
}
