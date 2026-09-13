import type { ReactNode } from "react";

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[280px] rounded-[2.75rem] border-[10px] border-ink bg-ink shadow-2xl ${className || ""}`}>
      <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-ink" />
      <div className="no-scrollbar relative h-[560px] overflow-y-auto rounded-[2.1rem] bg-cream">
        {children}
      </div>
    </div>
  );
}
