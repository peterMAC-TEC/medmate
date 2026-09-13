import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  tone?: "teal" | "cream";
}

export function LogoMark({ size = 40, tone = "teal" }: { size?: number; tone?: "teal" | "cream" }) {
  const bg = tone === "teal" ? "#176B63" : "#FFFDFC";
  const fg = tone === "teal" ? "#FFFDFC" : "#176B63";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="16" fill={bg} />
      <path
        d="M24 33.5c-.5 0-1-.17-1.4-.5-3.4-2.75-8.6-7.4-8.6-12.2 0-3.4 2.6-6 5.9-6 1.9 0 3.6.9 4.1 2.4.5-1.5 2.2-2.4 4.1-2.4 3.3 0 5.9 2.6 5.9 6 0 4.8-5.2 9.45-8.6 12.2-.4.33-.9.5-1.4.5z"
        fill={fg}
        opacity="0.95"
      />
      <rect
        x="20.6"
        y="17.6"
        width="6.8"
        height="6.8"
        rx="3.4"
        transform="rotate(45 24 21)"
        fill={bg}
        stroke={fg}
        strokeWidth="1.4"
      />
      <line x1="21.6" y1="21" x2="26.4" y2="21" stroke={bg} strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({ size = 40, showWordmark = true, className, tone = "teal" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} tone={tone} />
      {showWordmark && (
        <span
          className={cn(
            "font-bold tracking-tight",
            tone === "teal" ? "text-ink" : "text-warm-white"
          )}
          style={{ fontSize: size * 0.5 }}
        >
          MedMate
        </span>
      )}
    </div>
  );
}
