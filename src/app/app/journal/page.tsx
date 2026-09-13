"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/contexts/AppStateContext";
import { symptomHistory } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { SymptomCard, SymptomTrendCard } from "@/components/SymptomTrend";
import { PrimaryAction } from "@/components/PrimaryAction";
import { formatDate } from "@/lib/utils";

export default function JournalPage() {
  const { t, symptoms } = useAppState();
  const router = useRouter();

  const uniqueSymptomNames = Array.from(new Set(symptoms.map((s) => s.name)));
  const recentSymptoms = [...symptoms].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  if (symptoms.length === 0) {
    return (
      <div>
        <PageHeader title={t.navJournal} />
        <EmptyState
          icon="📔"
          title={t.nothingHereYet}
          body={t.nothingHereYetBody}
          action={
            <PrimaryAction onClick={() => router.push("/app/voice")}>{t.talkToMedMate}</PrimaryAction>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t.navJournal} />

      <div className="flex flex-col gap-4 mb-8">
        {uniqueSymptomNames.map((name) => {
          const count = symptoms.filter((s) => s.name === name).length;
          return <SymptomTrendCard key={name} name={name} history={symptomHistory(name)} count={count} />;
        })}
      </div>

      <h2 className="text-xl font-bold text-ink mb-4">{t.history}</h2>
      <div className="flex flex-col gap-3">
        {recentSymptoms.map((s) => (
          <SymptomCard
            key={s.id}
            name={s.name}
            severity={s.severity}
            meta={`${formatDate(s.date)} · ${s.timeOfDay}`}
          />
        ))}
      </div>
    </div>
  );
}
