import type { LanguageCode } from "./types";

/**
 * Per-language reply templates for the voice conversation. Kept separate
 * from aiService.ts so the "what to say" content can grow independently
 * of the "what did they mean" logic. Humor is mixed into routine,
 * non-medical confirmations only (medicine taken, feeling good) — never
 * into symptom reports, severity questions, or anything else medically
 * consequential.
 */

export interface ReplySet {
  takenHigh: string[];
  takenConfirmQuestion: string;
  symptomAskSeverity: (name: string) => string;
  symptomRecorded: (severity: string, name: string) => string;
  feelingThanksGood: string[];
  feelingThanksNeutral: string;
  prescriptionAskConfirm: (name: string, dosage?: string, doctorName?: string, schedule?: string) => string;
  prescriptionRecorded: (name: string, dosage?: string, schedule?: string) => string;
  conditionAskConfirm: (name: string) => string;
  conditionRecorded: (name: string) => string;
  askScheduleTime: string;
  scheduleConfirmed: (times: string) => string;
  snooze: string;
  notUnderstood: string;
}

const en: ReplySet = {
  takenHigh: [
    "Got it. I've marked it as taken.",
    "Done! Medicine first, chai next. ☕",
    "Marked as taken — gold star for you today. ⭐",
    "Taken and logged. You're on a roll!",
  ],
  takenConfirmQuestion: "Just to make sure — did you take your medicine?",
  symptomAskSeverity: (name) => `I'm sorry to hear that. Would you say the ${name.toLowerCase()} is mild, moderate, or severe?`,
  symptomRecorded: (severity, name) => `Okay. I've recorded ${severity} ${name.toLowerCase()} for this session.`,
  feelingThanksGood: ["Good to hear! Glad you're doing well today.", "That's the spirit — keep that going!"],
  feelingThanksNeutral: "Thank you for telling me. I've noted how you're feeling.",
  prescriptionAskConfirm: (name, dosage, doctorName, schedule) =>
    `Just to make sure — should I add ${name}${dosage ? ` ${dosage}` : ""} to your medicines${doctorName ? `, prescribed by ${doctorName}` : ""}${schedule ? `, ${schedule}` : ""}?`,
  prescriptionRecorded: (name, dosage, schedule) =>
    `Got it. I've added ${name}${dosage ? ` ${dosage}` : ""} to your medicines${schedule ? `, ${schedule}` : ""}.`,
  conditionAskConfirm: (name) => `Just to make sure — should I add ${name} to your health record?`,
  conditionRecorded: (name) => `Okay. I've added ${name} to your health record.`,
  askScheduleTime: "And what time would you like to take it — morning, afternoon, evening, or night?",
  scheduleConfirmed: (times) => `Perfect. I'll remind you at ${times}.`,
  snooze: "No problem. I'll remind you a little later.",
  notUnderstood: "I'm not quite sure I understood that.",
};

const hi: ReplySet = {
  takenHigh: [
    "ठीक है। मैंने इसे लिया हुआ दर्ज कर दिया है।",
    "हो गया! पहले दवा, फिर चाय। ☕",
    "लिया हुआ दर्ज हो गया — आज के लिए स्टार आपका। ⭐",
    "दर्ज कर लिया। आप बहुत बढ़िया कर रहे हैं!",
  ],
  takenConfirmQuestion: "बस पक्का करने के लिए — क्या आपने अपनी दवा ले ली?",
  symptomAskSeverity: (name) => `मुझे सुनकर अफ़सोस हुआ। क्या आप कहेंगे कि ${name} हल्की, मध्यम या गंभीर है?`,
  symptomRecorded: (severity, name) => `ठीक है। मैंने इस बार ${severity} ${name} दर्ज कर लिया है।`,
  feelingThanksGood: ["सुनकर अच्छा लगा! आज आप बहुत बढ़िया कर रहे हैं।", "यही तो बात है — ऐसे ही बने रहिए!"],
  feelingThanksNeutral: "मुझे बताने के लिए धन्यवाद। मैंने आपकी भावना दर्ज कर ली है।",
  prescriptionAskConfirm: (name, dosage, doctorName, schedule) =>
    `बस पक्का करने के लिए — क्या मैं ${name}${dosage ? ` ${dosage}` : ""} को आपकी दवाइयों में जोड़ दूँ${doctorName ? `, जो ${doctorName} ने लिखी है` : ""}${schedule ? `, ${schedule}` : ""}?`,
  prescriptionRecorded: (name, dosage, schedule) =>
    `ठीक है। मैंने ${name}${dosage ? ` ${dosage}` : ""} को आपकी दवाइयों में जोड़ दिया है${schedule ? `, ${schedule}` : ""}।`,
  conditionAskConfirm: (name) => `बस पक्का करने के लिए — क्या मैं ${name} को आपके स्वास्थ्य रिकॉर्ड में जोड़ दूँ?`,
  conditionRecorded: (name) => `ठीक है। मैंने ${name} को आपके स्वास्थ्य रिकॉर्ड में जोड़ दिया है।`,
  askScheduleTime: "और आप इसे किस समय लेना चाहेंगे — सुबह, दोपहर, शाम, या रात?",
  scheduleConfirmed: (times) => `ठीक है। मैं आपको ${times} पर याद दिलाऊँगा।`,
  snooze: "कोई बात नहीं। मैं थोड़ी देर बाद याद दिला दूँगा।",
  notUnderstood: "मुझे यकीन नहीं कि मैं ठीक से समझ पाया।",
};

const ta: ReplySet = {
  takenHigh: [
    "சரி. நான் இதை எடுத்ததாக குறித்துவிட்டேன்.",
    "முடிந்தது! மருந்து முதலில், தேநீர் அப்புறம். ☕",
    "எடுத்ததாக பதிவு செய்யப்பட்டது — இன்றைக்கு உங்களுக்கு நல்ல மதிப்பெண். ⭐",
    "பதிவு செய்யப்பட்டது. நீங்கள் அருமையாக செய்கிறீர்கள்!",
  ],
  takenConfirmQuestion: "உறுதிப்படுத்திக் கொள்ள — நீங்கள் உங்கள் மருந்தை எடுத்துக் கொண்டீர்களா?",
  symptomAskSeverity: (name) => `கேட்பதற்கு வருந்துகிறேன். ${name} லேசானதா, மிதமானதா, அல்லது கடுமையானதா?`,
  symptomRecorded: (severity, name) => `சரி. இந்த முறை ${severity} ${name} பதிவு செய்துவிட்டேன்.`,
  feelingThanksGood: ["கேட்பதற்கு மகிழ்ச்சி! இன்று நீங்கள் அருமையாக இருக்கிறீர்கள்.", "அதுதான் சரியான உணர்வு — தொடருங்கள்!"],
  feelingThanksNeutral: "எனக்குச் சொன்னதற்கு நன்றி. உங்கள் உணர்வை பதிவு செய்துவிட்டேன்.",
  prescriptionAskConfirm: (name, dosage, doctorName, schedule) =>
    `உறுதிப்படுத்திக் கொள்ள — ${name}${dosage ? ` ${dosage}` : ""} ஐ உங்கள் மருந்துகளில் சேர்க்கவா${doctorName ? `, ${doctorName} பரிந்துரைத்தது` : ""}${schedule ? `, ${schedule}` : ""}?`,
  prescriptionRecorded: (name, dosage, schedule) =>
    `சரி. ${name}${dosage ? ` ${dosage}` : ""} ஐ உங்கள் மருந்துகளில் சேர்த்துவிட்டேன்${schedule ? `, ${schedule}` : ""}.`,
  conditionAskConfirm: (name) => `உறுதிப்படுத்திக் கொள்ள — ${name} ஐ உங்கள் ஆரோக்கிய பதிவில் சேர்க்கவா?`,
  conditionRecorded: (name) => `சரி. ${name} ஐ உங்கள் ஆரோக்கிய பதிவில் சேர்த்துவிட்டேன்.`,
  askScheduleTime: "இதை எந்த நேரத்தில் எடுக்க விரும்புகிறீர்கள் — காலை, மதியம், மாலை, அல்லது இரவு?",
  scheduleConfirmed: (times) => `சரி. நான் உங்களுக்கு ${times} அன்று நினைவூட்டுவேன்.`,
  snooze: "பரவாயில்லை. கொஞ்ச நேரம் கழித்து நினைவூட்டுகிறேன்.",
  notUnderstood: "எனக்கு சரியாக புரிந்ததா என்று உறுதியாக தெரியவில்லை.",
};

const te: ReplySet = {
  takenHigh: [
    "సరే. దీన్ని తీసుకున్నట్టు గుర్తు పెట్టాను.",
    "అయిపోయింది! ముందు మందు, తర్వాత చాయ్. ☕",
    "తీసుకున్నట్టు నమోదైంది — ఈరోజు మీకు స్టార్. ⭐",
    "నమోదు చేశాను. మీరు అద్భుతంగా చేస్తున్నారు!",
  ],
  takenConfirmQuestion: "నిర్ధారించుకోవడానికి — మీరు మీ మందు తీసుకున్నారా?",
  symptomAskSeverity: (name) => `వినడానికి బాధగా ఉంది. ${name} తేలికపాటిదా, మధ్యస్థమా, లేదా తీవ్రమైనదా?`,
  symptomRecorded: (severity, name) => `సరే. ఈసారి ${severity} ${name} నమోదు చేశాను.`,
  feelingThanksGood: ["వినడానికి సంతోషంగా ఉంది! ఈరోజు మీరు బాగా చేస్తున్నారు.", "అదే స్ఫూర్తి — అలాగే కొనసాగించండి!"],
  feelingThanksNeutral: "నాకు చెప్పినందుకు ధన్యవాదాలు. మీరు ఎలా అనిపిస్తున్నారో నమోదు చేశాను.",
  prescriptionAskConfirm: (name, dosage, doctorName, schedule) =>
    `నిర్ధారించుకోవడానికి — ${name}${dosage ? ` ${dosage}` : ""} మీ మందుల జాబితాలో చేర్చమంటారా${doctorName ? `, ${doctorName} సూచించారు` : ""}${schedule ? `, ${schedule}` : ""}?`,
  prescriptionRecorded: (name, dosage, schedule) =>
    `సరే. ${name}${dosage ? ` ${dosage}` : ""} ను మీ మందుల జాబితాలో చేర్చాను${schedule ? `, ${schedule}` : ""}.`,
  conditionAskConfirm: (name) => `నిర్ధారించుకోవడానికి — ${name} ను మీ ఆరోగ్య రికార్డులో చేర్చమంటారా?`,
  conditionRecorded: (name) => `సరే. ${name} ను మీ ఆరోగ్య రికార్డులో చేర్చాను.`,
  askScheduleTime: "మరియు మీరు దీన్ని ఏ సమయంలో తీసుకోవాలనుకుంటున్నారు — ఉదయం, మధ్యాహ్నం, సాయంత్రం, లేదా రాత్రి?",
  scheduleConfirmed: (times) => `సరే. నేను మీకు ${times} గంటలకు గుర్తు చేస్తాను.`,
  snooze: "పర్వాలేదు. కొంచెం సేపు తర్వాత మళ్ళీ గుర్తు చేస్తాను.",
  notUnderstood: "నాకు సరిగ్గా అర్థమైందో లేదో ఖచ్చితంగా తెలియదు.",
};

const kn: ReplySet = {
  takenHigh: [
    "ಸರಿ. ನಾನು ಇದನ್ನು ತೆಗೆದುಕೊಂಡಂತೆ ಗುರುತಿಸಿದ್ದೇನೆ.",
    "ಆಯಿತು! ಮೊದಲು ಔಷಧಿ, ನಂತರ ಚಹಾ. ☕",
    "ತೆಗೆದುಕೊಂಡಂತೆ ದಾಖಲಾಗಿದೆ — ಇಂದು ನಿಮಗೆ ಸ್ಟಾರ್. ⭐",
    "ದಾಖಲಿಸಿದ್ದೇನೆ. ನೀವು ಚೆನ್ನಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ!",
  ],
  takenConfirmQuestion: "ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು — ನೀವು ನಿಮ್ಮ ಔಷಧಿ ತೆಗೆದುಕೊಂಡಿರಾ?",
  symptomAskSeverity: (name) => `ಕೇಳಿ ಬೇಸರವಾಯಿತು. ${name} ಸೌಮ್ಯವೋ, ಮಧ್ಯಮವೋ, ಅಥವಾ ತೀವ್ರವೋ?`,
  symptomRecorded: (severity, name) => `ಸರಿ. ಈ ಬಾರಿ ${severity} ${name} ದಾಖಲಿಸಿದ್ದೇನೆ.`,
  feelingThanksGood: ["ಕೇಳಿ ಸಂತೋಷವಾಯಿತು! ಇಂದು ನೀವು ಚೆನ್ನಾಗಿದ್ದೀರಿ.", "ಅದೇ ಉತ್ಸಾಹ — ಹಾಗೆಯೇ ಮುಂದುವರಿಸಿ!"],
  feelingThanksNeutral: "ನನಗೆ ಹೇಳಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಭಾವನೆಯನ್ನು ದಾಖಲಿಸಿದ್ದೇನೆ.",
  prescriptionAskConfirm: (name, dosage, doctorName, schedule) =>
    `ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು — ${name}${dosage ? ` ${dosage}` : ""} ಅನ್ನು ನಿಮ್ಮ ಔಷಧಿಗಳ ಪಟ್ಟಿಗೆ ಸೇರಿಸಲೇ${doctorName ? `, ${doctorName} ಸೂಚಿಸಿದ್ದಾರೆ` : ""}${schedule ? `, ${schedule}` : ""}?`,
  prescriptionRecorded: (name, dosage, schedule) =>
    `ಸರಿ. ${name}${dosage ? ` ${dosage}` : ""} ಅನ್ನು ನಿಮ್ಮ ಔಷಧಿಗಳ ಪಟ್ಟಿಗೆ ಸೇರಿಸಿದ್ದೇನೆ${schedule ? `, ${schedule}` : ""}.`,
  conditionAskConfirm: (name) => `ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು — ${name} ಅನ್ನು ನಿಮ್ಮ ಆರೋಗ್ಯ ದಾಖಲೆಗೆ ಸೇರಿಸಲೇ?`,
  conditionRecorded: (name) => `ಸರಿ. ${name} ಅನ್ನು ನಿಮ್ಮ ಆರೋಗ್ಯ ದಾಖಲೆಗೆ ಸೇರಿಸಿದ್ದೇನೆ.`,
  askScheduleTime: "ಮತ್ತು ನೀವು ಇದನ್ನು ಯಾವ ಸಮಯದಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಿ — ಬೆಳಿಗ್ಗೆ, ಮಧ್ಯಾಹ್ನ, ಸಂಜೆ, ಅಥವಾ ರಾತ್ರಿ?",
  scheduleConfirmed: (times) => `ಸರಿ. ನಾನು ನಿಮಗೆ ${times} ಕ್ಕೆ ನೆನಪಿಸುತ್ತೇನೆ.`,
  snooze: "ಪರವಾಗಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ನೆನಪಿಸುತ್ತೇನೆ.",
  notUnderstood: "ನನಗೆ ಸರಿಯಾಗಿ ಅರ್ಥವಾಯಿತೋ ಇಲ್ಲವೋ ಖಚಿತವಿಲ್ಲ.",
};

const ml: ReplySet = {
  takenHigh: [
    "ശരി. ഇത് കഴിച്ചതായി ഞാൻ രേഖപ്പെടുത്തി.",
    "കഴിഞ്ഞു! ആദ്യം മരുന്ന്, പിന്നെ ചായ. ☕",
    "കഴിച്ചതായി രേഖപ്പെടുത്തി — ഇന്ന് നിങ്ങൾക്ക് ഒരു സ്റ്റാർ. ⭐",
    "രേഖപ്പെടുത്തി. നിങ്ങൾ വളരെ നന്നായി ചെയ്യുന്നു!",
  ],
  takenConfirmQuestion: "ഉറപ്പുവരുത്താൻ — നിങ്ങൾ നിങ്ങളുടെ മരുന്ന് കഴിച്ചോ?",
  symptomAskSeverity: (name) => `കേട്ടതിൽ വിഷമമുണ്ട്. ${name} ലഘുവാണോ, മിതമാണോ, അതോ കഠിനമാണോ?`,
  symptomRecorded: (severity, name) => `ശരി. ഈ തവണ ${severity} ${name} രേഖപ്പെടുത്തി.`,
  feelingThanksGood: ["കേട്ടതിൽ സന്തോഷം! ഇന്ന് നിങ്ങൾ നന്നായി ഇരിക്കുന്നു.", "അതെ, അതേ ഊർജ്ജം തുടരൂ!"],
  feelingThanksNeutral: "എന്നോട് പറഞ്ഞതിന് നന്ദി. നിങ്ങളുടെ തോന്നൽ ഞാൻ രേഖപ്പെടുത്തി.",
  prescriptionAskConfirm: (name, dosage, doctorName, schedule) =>
    `ഉറപ്പുവരുത്താൻ — ${name}${dosage ? ` ${dosage}` : ""} നിങ്ങളുടെ മരുന്നുകളിൽ ചേർക്കട്ടെയോ${doctorName ? `, ${doctorName} നിർദ്ദേശിച്ചത്` : ""}${schedule ? `, ${schedule}` : ""}?`,
  prescriptionRecorded: (name, dosage, schedule) =>
    `ശരി. ${name}${dosage ? ` ${dosage}` : ""} നിങ്ങളുടെ മരുന്നുകളിൽ ചേർത്തു${schedule ? `, ${schedule}` : ""}.`,
  conditionAskConfirm: (name) => `ഉറപ്പുവരുത്താൻ — ${name} നിങ്ങളുടെ ആരോഗ്യ രേഖയിൽ ചേർക്കട്ടെയോ?`,
  conditionRecorded: (name) => `ശരി. ${name} നിങ്ങളുടെ ആരോഗ്യ രേഖയിൽ ചേർത്തു.`,
  askScheduleTime: "നിങ്ങൾ ഇത് ഏത് സമയത്താണ് കഴിക്കാൻ ആഗ്രഹിക്കുന്നത് — രാവിലെ, ഉച്ചയ്ക്ക്, വൈകുന്നേരം, അതോ രാത്രിയോ?",
  scheduleConfirmed: (times) => `ശരി. ഞാൻ നിങ്ങളെ ${times} ന് ഓർമ്മിപ്പിക്കും.`,
  snooze: "കുഴപ്പമില്ല. കുറച്ച് കഴിഞ്ഞ് ഞാൻ വീണ്ടും ഓർമ്മിപ്പിക്കാം.",
  notUnderstood: "എനിക്ക് ശരിയായി മനസ്സിലായോ എന്ന് ഉറപ്പില്ല.",
};

export const replyDictionaries: Record<LanguageCode, ReplySet> = { en, hi, ta, te, kn, ml };

// So a spoken reply in, say, Hindi doesn't drop back into English for the
// symptom name and severity word it's reporting — those get looked up
// here rather than interpolated as-is from the (always-English) canonical
// values used internally (Symptom.name, SymptomSeverity).
const severityLabels: Record<LanguageCode, Record<string, string>> = {
  en: { mild: "mild", moderate: "moderate", severe: "severe" },
  hi: { mild: "हल्का", moderate: "मध्यम", severe: "गंभीर" },
  ta: { mild: "லேசான", moderate: "மிதமான", severe: "கடுமையான" },
  te: { mild: "తేలికపాటి", moderate: "మధ్యస్థ", severe: "తీవ్రమైన" },
  kn: { mild: "ಸೌಮ್ಯ", moderate: "ಮಧ್ಯಮ", severe: "ತೀವ್ರ" },
  ml: { mild: "ലഘു", moderate: "മിതമായ", severe: "കഠിനമായ" },
};

const symptomLabels: Record<LanguageCode, Record<string, string>> = {
  en: { Dizziness: "Dizziness", Headache: "Headache", "Knee pain": "Knee pain", Fatigue: "Fatigue", Nausea: "Nausea" },
  hi: { Dizziness: "चक्कर आना", Headache: "सिरदर्द", "Knee pain": "घुटने का दर्द", Fatigue: "थकान", Nausea: "जी मिचलाना" },
  ta: { Dizziness: "தலைச்சுற்றல்", Headache: "தலைவலி", "Knee pain": "முழங்கால் வலி", Fatigue: "சோர்வு", Nausea: "குமட்டல்" },
  te: { Dizziness: "మైకము", Headache: "తలనొప్పి", "Knee pain": "మోకాలి నొప్పి", Fatigue: "అలసట", Nausea: "వికారం" },
  kn: { Dizziness: "ತಲೆ ತಿರುಗುವಿಕೆ", Headache: "ತಲೆನೋವು", "Knee pain": "ಮೊಣಕಾಲು ನೋವು", Fatigue: "ಆಯಾಸ", Nausea: "ವಾಕರಿಕೆ" },
  ml: { Dizziness: "തലകറക്കം", Headache: "തലവേദന", "Knee pain": "മുട്ട് വേദന", Fatigue: "ക്ഷീണം", Nausea: "ഓക്കാനം" },
};

export function localizeSeverity(severity: string, lang: LanguageCode): string {
  return severityLabels[lang]?.[severity] ?? severityLabels.en[severity] ?? severity;
}

export function localizeSymptomName(name: string, lang: LanguageCode): string {
  return symptomLabels[lang]?.[name] ?? name;
}

// Romanized-script hint words, used when the transcript isn't in native
// script (common when someone types or a recognizer transliterates).
const ROMANIZED_HINTS: Partial<Record<LanguageCode, string[]>> = {
  hi: ["liya", "thoda", "abhi", "nahi", "haan", "accha", "acha", "dawa", "dawai", "subah", "raat", "kal", "mera", "hai"],
  ta: ["kazhichu", "sevichen", "nalla", "irukku", "konjam", "illa", "vangi", "eppadi", "romba"],
  te: ["tegedukondanu", "bagundi", "ledu", "koncham", "ela", "tinnanu", "chala", "bane"],
  kn: ["chennagide", "illa", "swalpa", "hege", "adu", "channagi"],
  ml: ["nallaund", "kurachu", "engane", "illa", "sukhamano"],
};

// Native-script Unicode block ranges.
const SCRIPT_RANGES: Partial<Record<LanguageCode, RegExp>> = {
  hi: /[ऀ-ॿ]/,
  ta: /[஀-௿]/,
  te: /[ఀ-౿]/,
  kn: /[ಀ-೿]/,
  ml: /[ഀ-ൿ]/,
};

/**
 * Detects which of the six supported languages a transcript is most
 * likely in — first by Unicode script, then by common romanized words —
 * so MedMate can reply in the same language the person just spoke,
 * regardless of their saved Settings preference. Falls back to
 * `fallback` when nothing distinctive is found (e.g. plain English).
 */
export function detectSpokenLanguage(text: string, fallback: LanguageCode): LanguageCode {
  for (const [lang, pattern] of Object.entries(SCRIPT_RANGES) as [LanguageCode, RegExp][]) {
    if (pattern.test(text)) return lang;
  }

  const lower = text.toLowerCase();
  let bestLang: LanguageCode | null = null;
  let bestScore = 0;
  for (const [lang, hints] of Object.entries(ROMANIZED_HINTS) as [LanguageCode, string[]][]) {
    const score = hints.reduce((acc, h) => (lower.includes(h) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      bestLang = lang;
    }
  }
  if (bestLang && bestScore > 0) return bestLang;

  return fallback;
}
