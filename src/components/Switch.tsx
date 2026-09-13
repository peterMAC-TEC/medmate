"use client";

import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-8 w-14 shrink-0 rounded-full transition-colors",
        checked ? "bg-teal" : "bg-ink/15"
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-6 w-6 rounded-full bg-warm-white shadow transition-transform",
          checked ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  );
}
