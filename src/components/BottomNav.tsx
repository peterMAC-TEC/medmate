"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, HeartPulse, Users, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/contexts/AppStateContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useAppState();

  const items = [
    { href: "/app", label: t.navHome, icon: Home },
    { href: "/app/medicines", label: t.navMedicines, icon: Pill },
    { href: "/app/journal", label: t.navHealth, icon: HeartPulse },
    { href: "/app/family", label: t.navFamily, icon: Users },
    { href: "/app/more", label: t.navMore, icon: Menu },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink/8 bg-warm-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-between px-1">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[60px] flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
                  active ? "text-teal" : "text-muted"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={24} strokeWidth={active ? 2.4 : 2} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
