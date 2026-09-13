"use client";

import { useAppState } from "@/contexts/AppStateContext";
import { medications } from "@/lib/mock-data";
import { MedicationCard } from "@/components/MedicationCard";
import { PageHeader } from "@/components/PageHeader";

export default function MedicinesPage() {
  const { t, takenToday } = useAppState();
  return (
    <div>
      <PageHeader title={t.navMedicines} />
      <div className="flex flex-col gap-4">
        {medications.map((med) => (
          <MedicationCard
            key={med.id}
            medication={med}
            taken={takenToday[med.id]}
            href={`/app/medicines/${med.id}`}
          />
        ))}
      </div>
    </div>
  );
}
