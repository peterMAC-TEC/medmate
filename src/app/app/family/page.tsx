"use client";

import Link from "next/link";
import { ChevronRight, CalendarDays } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { getAdherence, appointments, getDoctor } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { formatDate, formatTime } from "@/lib/utils";

export default function FamilyPage() {
  const { t, symptoms, userName, medications, conditions } = useAppState();

  const overallAdherence = Math.round(
    medications.reduce((sum, m) => sum + getAdherence(m.id), 0) / medications.length
  );

  const symptomCounts = Object.entries(
    symptoms.reduce<Record<string, number>>((acc, s) => {
      acc[s.name] = (acc[s.name] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const doseChanged = medications.find((m) => m.doseChanges.length > 0);
  const nextAppt = appointments[0];
  const doctor = nextAppt ? getDoctor(nextAppt.doctorId) : undefined;

  return (
    <div>
      <PageHeader title={t.dadsHealth.replace("{name}", userName)} subtitle={t.thisWeek} />

      <div className="rounded-3xl bg-teal p-6 text-warm-white">
        <p className="text-sm font-semibold opacity-80">{t.adherence}</p>
        <p className="text-5xl font-bold mt-1">{overallAdherence}%</p>
        <p className="text-sm opacity-80 mt-1">{t.thisWeek}</p>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-ink mb-3">Known conditions</h2>
        <div className="flex flex-col gap-2.5">
          {conditions.length === 0 && <p className="text-base text-muted">{t.nothingHereYet}</p>}
          {conditions.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-2xl bg-warm-white p-4 border border-ink/5">
              <p className="font-semibold text-ink">{c.name}</p>
              {c.diagnosedDate && <span className="text-sm text-muted">since {formatDate(c.diagnosedDate)}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-ink mb-3">{t.recentSymptoms}</h2>
        <div className="flex flex-col gap-2.5">
          {symptomCounts.length === 0 && <p className="text-base text-muted">{t.nothingHereYet}</p>}
          {symptomCounts.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl bg-warm-white p-4 border border-ink/5">
              <p className="font-semibold text-ink">{name}</p>
              <span className="rounded-full bg-peach/60 px-3 py-1 text-sm font-semibold text-[#8a4a2e]">
                {count} {count === 1 ? "report" : "reports"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-ink mb-3">{t.medicationChanges}</h2>
        {doseChanged ? (
          <div className="rounded-2xl bg-warm-white p-4 border border-ink/5">
            <p className="font-semibold text-ink">{doseChanged.name}</p>
            <p className="text-base text-muted mt-0.5">
              {doseChanged.doseChanges[0].from} → {doseChanged.doseChanges[0].to}
            </p>
            <p className="text-sm text-muted mt-1">{formatDate(doseChanged.doseChanges[0].date)}</p>
          </div>
        ) : (
          <p className="text-base text-muted">{t.nothingHereYet}</p>
        )}
      </section>

      {nextAppt && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-ink mb-3">{t.nextAppointment}</h2>
          <div className="flex items-center gap-4 rounded-2xl bg-lavender/40 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warm-white text-teal-dark">
              <CalendarDays size={22} />
            </div>
            <div>
              <p className="font-semibold text-ink">{doctor?.name}</p>
              <p className="text-sm text-muted">
                {formatDate(nextAppt.date)} · {formatTime(nextAppt.time)}
              </p>
            </div>
          </div>
        </section>
      )}

      <Link
        href="/app/family/doctor-summary"
        className="mt-8 flex items-center justify-between rounded-2xl bg-sage px-5 py-4 font-semibold text-teal-dark"
      >
        {t.medicationSummary}
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
