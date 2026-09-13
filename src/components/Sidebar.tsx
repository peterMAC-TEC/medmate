"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, HeartPulse, Users, Settings, FileClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/contexts/AppStateContext";
import { Logo } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useAppState();

  const items = [
    { href: "/app", label: t.navHome, icon: Home },
    { href: "/app/medicines", label: t.navMedicines, icon: Pill },
    { href: "/app/journal", label: t.navJournal, icon: HeartPulse },
    { href: "/app/prescriptions", label: t.navPrescriptions, icon: FileClock },
    { href: "/app/family", label: t.navFamily, icon: Users },
    { href: "/app/settings", label: t.navSettings, icon: Settings },
  ];

  return (
    <aside className="hidden md:flex md:w-72 md:shrink-0 md:flex-col md:border-r md:border-ink/8 md:bg-warm-white md:px-6 md:py-8">
      <Link href="/" className="mb-10 px-2">
        <Logo size={38} />
      </Link>
      <nav className="flex flex-1 flex-col gap-1.5">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-base font-medium transition-colors",
                active ? "bg-sage text-teal-dark" : "text-muted hover:bg-ink/5 hover:text-ink"
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <p className="px-4 text-xs text-muted">MedMate · demo prototype</p>
    </aside>
  );
}
