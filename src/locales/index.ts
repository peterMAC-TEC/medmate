import type { LanguageCode } from "@/lib/types";
import en from "./en";
import hi from "./hi";
import ta from "./ta";
import te from "./te";
import kn from "./kn";
import ml from "./ml";
import type { Dictionary } from "./en";

export const dictionaries: Record<LanguageCode, Dictionary> = { en, hi, ta, te, kn, ml };

export const languageNames: Record<LanguageCode, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
};

export type { Dictionary };
