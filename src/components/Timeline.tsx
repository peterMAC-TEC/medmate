import { cn, formatDate } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/types";
import { Pill, MessageCircle, ArrowRightLeft, Sparkles } from "lucide-react";

const iconMap = {
  prescription: Pill,
  "dose-change": ArrowRightLeft,
  symptom: MessageCircle,
  note: MessageCircle,
  milestone: Sparkles,
};

const severityBg: Record<string, string> = {
  mild: "bg-sage text-teal-dark",
  moderate: "bg-peach text-[#8a4a2e]",
  severe: "bg-danger-bg text-danger",
};

export function MedicationTimeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <ol className="relative ml-3 space-y-6 border-l-2 border-sage-dark pl-7">
      {sorted.map((event) => {
        const Icon = iconMap[event.kind];
        const badge = event.severity ? severityBg[event.severity] : "bg-teal/10 text-teal-dark";
        return (
          <li key={event.id} className="relative">
            <span
              className={cn(
                "absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-cream",
                badge
              )}
            >
              <Icon size={14} strokeWidth={2.5} />
            </span>
            <p className="text-sm font-semibold text-muted">{formatDate(event.date)}</p>
            <p className="text-lg font-bold text-ink leading-snug mt-0.5">{event.title}</p>
            {event.detail && <p className="text-base text-muted mt-0.5">{event.detail}</p>}
          </li>
        );
      })}
    </ol>
  );
}
