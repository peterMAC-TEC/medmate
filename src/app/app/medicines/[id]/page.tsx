"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Pill } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import {
  getMedication,
  getDoctor,
  getAdherence,
  medicationTimeline,
  symptoms as allSymptoms,
} from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { MedicationTimeline } from "@/components/Timeline";
import { formatDate, formatTime } from "@/lib/utils";

export default function MedicationDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useAppState();
  const medication = getMedication(params.id);

  if (!medication) return notFound();

  const doctor = getDoctor(medication.doctorId);
  const adherence = getAdherence(medication.id);
  const events = medicationTimeline.filter((e) => e.medicationId === medication.id);
  const relatedSymptoms = allSymptoms.filter((s) => s.name === "Dizziness" && medication.name === "Amlodipine");

  return (
    <div>
      <PageHeader title={medication.name} back />

      <div className="flex items-center gap-4 rounded-3xl bg-warm-white p-5 border border-ink/5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal-dark">
          <Pill size={30} />
        </div>
        <div>
          <p className="text-3xl font-bold text-ink">{medication.dosage}</p>
          <p className="text-base text-muted mt-0.5">
            {medication.frequency} · {formatTime(medication.time.split(",")[0])}
          </p>
          <p className="text-base text-muted">{medication.purpose}</p>
        </div>
      </div>

      {medication.instructions && (
        <p className="mt-4 rounded-2xl bg-sage/60 px-4 py-3 text-base text-teal-dark">{medication.instructions}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-warm-white p-5 border border-ink/5">
          <p className="text-sm font-semibold text-muted">{t.prescribedBy}</p>
          <p className="text-xl font-bold text-ink mt-1">{doctor?.name}</p>
          <p className="text-sm text-muted mt-1">{formatDate(medication.prescribedDate)}</p>
        </div>
        <div className="rounded-3xl bg-warm-white p-5 border border-ink/5">
          <p className="text-sm font-semibold text-muted">{t.adherence}</p>
          <p className="text-3xl font-bold text-teal-dark mt-1">{adherence}%</p>
        </div>
      </div>

      {relatedSymptoms.length > 0 && (
        <div className="mt-6 rounded-3xl bg-warm-white p-5 border border-ink/5">
          <p className="text-sm font-semibold text-muted">{t.howYoureFeeling}</p>
          <p className="text-xl font-bold text-ink mt-1">Dizziness</p>
          <p className="text-base text-muted mt-0.5">
            {relatedSymptoms.length} {t.reports}
          </p>
        </div>
      )}

      {medication.notes && medication.notes.length > 0 && (
        <div className="mt-6 rounded-3xl bg-lavender/40 p-5">
          <p className="text-sm font-semibold text-muted mb-1">{t.notes}</p>
          {medication.notes.map((note, i) => (
            <p key={i} className="text-base text-ink">
              &ldquo;{note}&rdquo;
            </p>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold text-ink mb-4">{t.history}</h2>
        <MedicationTimeline events={events} />
      </div>
    </div>
  );
}
