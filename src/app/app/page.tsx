"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, Pill } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { HealthCheckIn } from "@/components/HealthCheckIn";
import { MedicationCard } from "@/components/MedicationCard";
import { PrimaryAction } from "@/components/PrimaryAction";
import { VoiceButton } from "@/components/VoiceButton";
import type { FeelingLevel } from "@/lib/types";

function greetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return "goodMorning" as const;
  if (hour < 17) return "goodAfternoon" as const;
  return "goodEvening" as const;
}

function isPastScheduledTime(time: string): boolean {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const scheduled = new Date();
  scheduled.setHours(h, m + 90, 0, 0);
  return now.getTime() > scheduled.getTime();
}

export default function HomePage() {
  const { t, userName, takenToday, markTaken, addHealthEntry, medications } = useAppState();
  const router = useRouter();
  const [feeling, setFeeling] = useState<FeelingLevel | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [missedDismissed, setMissedDismissed] = useState(false);

  const activeMeds = useMemo(() => medications.filter((m) => m.status === "active"), [medications]);
  const nextMed = activeMeds.find((m) => !takenToday[m.id]);
  const allDone = activeMeds.length > 0 && !nextMed;
  const isMissed = !!nextMed && !missedDismissed && isPastScheduledTime(nextMed.time.split(",")[0]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleFeeling(f: FeelingLevel) {
    setFeeling(f);
    if (f !== "other") {
      addHealthEntry(f);
      showToast(t.markedTaken.replace("marked it as taken", "noted how you're feeling"));
    } else {
      router.push("/app/voice");
    }
  }

  function handleTaken() {
    if (!nextMed) return;
    markTaken(nextMed.id);
    showToast(t.markedTaken);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-ink leading-tight">
          {t[greetingKey()]}, {userName}
        </h1>
      </div>

      <section>
        <h2 className="text-xl font-bold text-ink mb-3">{t.howAreYouFeeling}</h2>
        <HealthCheckIn selected={feeling} onSelect={handleFeeling} />
      </section>

      <section>
        {activeMeds.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-ink/10 bg-warm-white/60 px-6 py-10 text-center">
            <Pill className="text-teal-dark" size={32} />
            <p className="text-xl font-bold text-ink">No medicines yet</p>
            <p className="max-w-xs text-base text-muted">
              Tell MedMate what you take — like &ldquo;Doctor Mehta prescribed me Amlodipine 5 mg for blood
              pressure&rdquo; — and it&apos;ll keep track for you.
            </p>
            <div className="mt-2 w-full max-w-xs">
              <PrimaryAction onClick={() => router.push("/app/voice")}>{t.talkToMedMate}</PrimaryAction>
            </div>
          </div>
        ) : allDone ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-sage px-6 py-10 text-center">
            <PartyPopper className="text-teal-dark" size={40} />
            <p className="text-2xl font-bold text-teal-dark">{t.allDoneToday}</p>
            <p className="text-base text-teal-dark/80 max-w-xs">{t.allDoneTodayBody}</p>
          </div>
        ) : nextMed ? (
          <>
            <h2 className="text-xl font-bold text-ink mb-3">{t.yourNextMedicine}</h2>
            {isMissed && (
              <div className="mb-4 rounded-3xl bg-peach/50 border border-peach-dark/40 p-5">
                <p className="text-lg font-semibold text-ink">{t.missedTitle}</p>
              </div>
            )}
            <MedicationCard medication={nextMed} taken={takenToday[nextMed.id]} />
            <div className="mt-4 flex flex-col gap-3">
              <PrimaryAction onClick={handleTaken}>{isMissed ? t.takeItNow : t.ivetakenit}</PrimaryAction>
              <PrimaryAction
                variant="ghost"
                onClick={() => {
                  setMissedDismissed(true);
                  showToast(t.remindMeLater);
                }}
              >
                {t.remindMeLater}
              </PrimaryAction>
              {isMissed && (
                <PrimaryAction variant="ghost" onClick={() => router.push("/app/voice")}>
                  {t.imNotSure}
                </PrimaryAction>
              )}
            </div>
          </>
        ) : null}
      </section>

      <section className="mt-2 flex flex-col items-center gap-4 rounded-3xl bg-warm-white/60 py-8">
        <p className="text-lg font-semibold text-ink">{t.talkToMedMate}</p>
        <VoiceButton size={88} onClick={() => router.push("/app/voice")} />
      </section>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-5 md:bottom-8">
          <div className="float-up rounded-2xl bg-ink px-5 py-3.5 text-base font-medium text-warm-white shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
