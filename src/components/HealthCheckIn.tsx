"use client";

import { cn } from "@/lib/utils";
import type { FeelingLevel } from "@/lib/types";
import { useAppState } from "@/contexts/AppStateContext";

const feelings: { key: FeelingLevel; emoji: string }[] = [
  { key: "good", emoji: "🙂" },
  { key: "okay", emoji: "😐" },
  { key: "not-great", emoji: "🙁" },
  { key: "other", emoji: "💬" },
];

const labelKey: Record<FeelingLevel, "feelingGood" | "feelingOkay" | "feelingNotGreat" | "feelingOther"> = {
  good: "feelingGood",
  okay: "feelingOkay",
  "not-great": "feelingNotGreat",
  other: "feelingOther",
};

interface HealthCheckInProps {
  selected?: FeelingLevel | null;
  onSelect: (feeling: FeelingLevel) => void;
}

export function HealthCheckIn({ selected, onSelect }: HealthCheckInProps) {
  const { t } = useAppState();
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
      {feelings.map((f) => (
        <button
          key={f.key}
          onClick={() => onSelect(f.key)}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 py-4 transition-all active:scale-95",
            selected === f.key
              ? "border-teal bg-sage"
              : "border-ink/8 bg-warm-white hover:border-teal/40"
          )}
        >
          <span className="text-3xl" aria-hidden="true">
            {f.emoji}
          </span>
          <span className="text-xs font-semibold text-ink text-center leading-tight">
            {t[labelKey[f.key]]}
          </span>
        </button>
      ))}
    </div>
  );
}
