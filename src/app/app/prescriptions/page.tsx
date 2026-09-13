"use client";

import { useAppState } from "@/contexts/AppStateContext";
import { prescriptions, getMedication, getDoctor } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/utils";

export default function PrescriptionsPage() {
  const { t } = useAppState();
  const sorted = [...prescriptions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader title={t.navPrescriptions} />
      <div className="flex flex-col gap-4">
        {sorted.map((p) => {
          const med = getMedication(p.medicationId);
          const doctor = getDoctor(p.doctorId);
          return (
            <div key={p.id} className="rounded-3xl bg-warm-white p-5 border border-ink/5">
              <p className="text-sm font-semibold text-muted">{formatDate(p.date)}</p>
              <p className="text-xl font-bold text-ink mt-1">{doctor?.name}</p>
              <p className="text-lg text-ink mt-1">
                {med?.name} · {p.dosage}
                {p.changeFrom && (
                  <span className="text-muted"> (was {p.changeFrom})</span>
                )}
              </p>
              <p className="text-base text-muted mt-1">{p.reason}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
