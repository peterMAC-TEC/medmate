import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-cream">
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-28 pt-8 md:px-10 md:pb-12 md:pt-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
