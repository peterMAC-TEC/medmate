import { cn } from "@/lib/utils";

const severityDot: Record<string, string> = {
  mild: "bg-teal/50",
  moderate: "bg-peach-dark",
  severe: "bg-danger",
};

interface SymptomTrendProps {
  name: string;
  history: boolean[];
  count: number;
}

export function SymptomTrendCard({ name, history, count }: SymptomTrendProps) {
  return (
    <div className="rounded-3xl bg-warm-white p-5 border border-ink/5 shadow-[0_4px_24px_-8px_rgba(24,48,46,0.1)]">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-ink">{name}</p>
        <span className="text-sm font-medium text-muted">7-day history</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {history.map((reported, i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 w-3.5 rounded-full",
              reported ? severityDot.mild : "bg-ink/10"
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">
        Reported {count} {count === 1 ? "time" : "times"}
      </p>
    </div>
  );
}

export function SymptomCard({
  name,
  severity,
  meta,
}: {
  name: string;
  severity: "mild" | "moderate" | "severe";
  meta: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-warm-white p-4 border border-ink/5">
      <span className={cn("h-3 w-3 shrink-0 rounded-full", severityDot[severity])} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{name}</p>
        <p className="text-sm text-muted">{meta}</p>
      </div>
      <span className="shrink-0 rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold capitalize text-muted">
        {severity}
      </span>
    </div>
  );
}
