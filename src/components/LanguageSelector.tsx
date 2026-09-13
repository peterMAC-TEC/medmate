"use client";

import { useAppState } from "@/contexts/AppStateContext";
import { languageNames } from "@/locales";
import type { LanguageCode } from "@/lib/types";
import { cn } from "@/lib/utils";

const codes: LanguageCode[] = ["en", "hi", "ta", "te", "kn", "ml"];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useAppState();
  return (
    <div className={cn("grid gap-2.5", compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3")}>
      {codes.map((code) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={cn(
            "rounded-2xl border-2 px-4 py-3.5 text-base font-semibold transition-all active:scale-95",
            language === code
              ? "border-teal bg-sage text-teal-dark"
              : "border-ink/8 bg-warm-white text-ink hover:border-teal/40"
          )}
        >
          {languageNames[code]}
        </button>
      ))}
    </div>
  );
}
