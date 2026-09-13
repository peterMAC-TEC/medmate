"use client";

import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  onClick?: () => void;
  size?: number;
  listening?: boolean;
  label?: string;
}

export function VoiceButton({ onClick, size = 76, listening = false, label }: VoiceButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        aria-label={label || "Talk to MedMate"}
        className="relative flex items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        {listening && (
          <>
            <span className="pulse-ring absolute inset-0 rounded-full bg-teal/40" />
            <span
              className="pulse-ring absolute inset-0 rounded-full bg-teal/30"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full bg-teal text-warm-white shadow-[0_10px_30px_-8px_rgba(23,107,99,0.6)] transition-transform active:scale-95",
            listening && "scale-105"
          )}
          style={{ width: size, height: size }}
        >
          <Mic size={size * 0.42} strokeWidth={2} />
        </span>
      </button>
      {label && <p className="text-base font-semibold text-ink">{label}</p>}
    </div>
  );
}
