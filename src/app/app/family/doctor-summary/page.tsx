"use client";

import { Download } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { medications, getAdherence } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryAction } from "@/components/PrimaryAction";
import { formatDate } from "@/lib/utils";

export default function DoctorSummaryPage() {
  const { t, symptoms } = useAppState();

  const symptomCounts = Object.entries(
    symptoms.reduce<Record<string, number>>((acc, s) => {
      const label = `${s.severity} ${s.name.toLowerCase()}`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {})
  );

  return (
    <div>
      <PageHeader title={t.medicationSummary} back />

      <div className="flex flex-col gap-4">
        {medications.map((med) => {
          const change = med.doseChanges[0];
          return (
            <div key={med.id} className="rounded-3xl bg-warm-white p-5 border border-ink/5">
              <div className="flex items-baseline justify-between">
                <p className="text-xl font-bold text-ink">{med.name}</p>
                <span className="text-sm font-semibold text-teal-dark">{getAdherence(med.id)}% {t.adherence.toLowerCase()}</span>
              </div>
              {change ? (
                <p className="text-base text-muted mt-1">
                  {change.from} → {change.to} · {t.dozeChanged.toLowerCase()} {formatDate(change.date)}
                </p>
              ) : (
                <p className="text-base text-muted mt-1">{med.dosage} · {med.frequency}</p>
              )}
            </div>
          );
        })}
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-ink mb-3">{t.symptoms}</h2>
        <div className="rounded-3xl bg-warm-white p-5 border border-ink/5">
          <ul className="flex flex-col gap-2">
            {symptomCounts.map(([label, count]) => (
              <li key={label} className="flex justify-between text-base text-ink capitalize">
                <span>{label}</span>
                <span className="font-semibold text-muted">— {count}x</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-ink mb-3">{t.patientNotes}</h2>
        <div className="rounded-3xl bg-lavender/40 p-5">
          <p className="text-base italic text-ink">&ldquo;Feeling slightly dizzy in the mornings.&rdquo;</p>
        </div>
      </section>

      <p className="mt-6 text-sm text-muted">
        This summary organizes patient-reported information. It does not diagnose or claim a cause-and-effect
        relationship between medication and symptoms.
      </p>

      <div className="mt-6">
        <PrimaryAction icon={<Download size={20} />} variant="secondary">
          {t.exportPdf}
        </PrimaryAction>
      </div>
    </div>
  );
}
