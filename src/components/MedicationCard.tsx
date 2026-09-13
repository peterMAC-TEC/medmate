import Link from "next/link";
import { Pill } from "lucide-react";
import type { Medication } from "@/lib/types";
import { formatTime, cn } from "@/lib/utils";

const colorMap = {
  teal: "bg-teal/10 text-teal-dark",
  peach: "bg-peach/50 text-[#8a4a2e]",
  lavender: "bg-lavender/60 text-[#4a3f7a]",
  sage: "bg-sage text-teal-dark",
};

interface MedicationCardProps {
  medication: Medication;
  taken?: boolean;
  href?: string;
  compact?: boolean;
}

export function MedicationCard({ medication, taken, href, compact }: MedicationCardProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-3xl bg-warm-white p-5 shadow-[0_4px_24px_-8px_rgba(24,48,46,0.12)] border border-ink/5",
        compact && "p-4"
      )}
    >
      <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", colorMap[medication.color])}>
        <Pill size={26} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold text-ink leading-tight">{medication.name}</p>
        <p className="text-base text-muted mt-0.5">
          {medication.dosage} · {formatTime(medication.time.split(",")[0])}
        </p>
        <p className="text-sm text-muted mt-0.5">{medication.purpose}</p>
      </div>
      {taken && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-warm-white check-pop">
          ✓
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
