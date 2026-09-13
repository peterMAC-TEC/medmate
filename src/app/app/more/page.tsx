"use client";

import Link from "next/link";
import { ChevronRight, FileClock, Settings, Stethoscope, Mic } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { PageHeader } from "@/components/PageHeader";

export default function MorePage() {
  const { t } = useAppState();

  const items = [
    { href: "/app/prescriptions", label: t.navPrescriptions, icon: FileClock },
    { href: "/app/family/doctor-summary", label: t.medicationSummary, icon: Stethoscope },
    { href: "/app/voice", label: t.talkToMedMate, icon: Mic },
    { href: "/app/settings", label: t.navSettings, icon: Settings },
  ];

  return (
    <div>
      <PageHeader title={t.navMore} />
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl bg-warm-white p-4 border border-ink/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage text-teal-dark">
                <Icon size={20} />
              </span>
              <span className="flex-1 text-lg font-semibold text-ink">{item.label}</span>
              <ChevronRight size={20} className="text-muted" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
