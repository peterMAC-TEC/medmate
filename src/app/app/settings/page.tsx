"use client";

import { useState } from "react";
import { useAppState } from "@/contexts/AppStateContext";
import { caregivers } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Switch } from "@/components/Switch";

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-ink mb-3">{title}</h2>
      <div className="rounded-3xl bg-warm-white border border-ink/5 divide-y divide-ink/5">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <p className="text-base font-medium text-ink">{label}</p>
      <div className="text-base text-muted">{value}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { t, voiceStyle, setVoiceStyle, profile, medications } = useAppState();
  const [medReminders, setMedReminders] = useState(true);
  const [caregiverNotif, setCaregiverNotif] = useState(true);
  const [dataShare, setDataShare] = useState(true);

  return (
    <div>
      <PageHeader title={t.navSettings} />

      <SettingsSection title={t.myProfile}>
        <Row label={t.name} value={profile?.name} />
        <Row label={t.age} value={profile?.age} />
      </SettingsSection>

      <SettingsSection title={t.voice}>
        <div className="px-5 py-4">
          <p className="text-base font-medium text-ink mb-1">{t.preferredLanguage}</p>
          <p className="text-sm text-muted mb-3">
            MedMate always understands and replies in whichever language you speak — this is just the default
            for recognizing your voice.
          </p>
          <LanguageSelector compact />
        </div>
        <div className="px-5 py-4">
          <p className="text-base font-medium text-ink mb-1">{t.voicePreference}</p>
          <p className="text-sm text-muted mb-3">Choose the personality MedMate speaks with.</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setVoiceStyle("warm")}
              className={`rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-95 ${
                voiceStyle === "warm" ? "border-teal bg-sage" : "border-ink/8 bg-warm-white"
              }`}
            >
              <p className="font-semibold text-ink">Warm &amp; gentle</p>
              <p className="text-xs text-muted mt-0.5">Soft, reassuring tone</p>
            </button>
            <button
              onClick={() => setVoiceStyle("bold")}
              className={`rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-95 ${
                voiceStyle === "bold" ? "border-teal bg-sage" : "border-ink/8 bg-warm-white"
              }`}
            >
              <p className="font-semibold text-ink">Bold &amp; filmy</p>
              <p className="text-xs text-muted mt-0.5">Deeper, confident, a little dramatic</p>
            </button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title={t.myMedicines}>
        <Row label={t.manageMedications} value={medications.length} />
      </SettingsSection>

      <SettingsSection title={t.family}>
        <Row label={t.caregiverAccess} value={caregivers[0]?.name} />
      </SettingsSection>

      <SettingsSection title={t.notifications}>
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-base font-medium text-ink">{t.medicationReminders}</p>
          <Switch checked={medReminders} onChange={setMedReminders} label={t.medicationReminders} />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-base font-medium text-ink">{t.caregiverNotifications}</p>
          <Switch checked={caregiverNotif} onChange={setCaregiverNotif} label={t.caregiverNotifications} />
        </div>
      </SettingsSection>

      <SettingsSection title={t.privacy}>
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-base font-medium text-ink">{t.dataPermissions}</p>
          <Switch checked={dataShare} onChange={setDataShare} label={t.dataPermissions} />
        </div>
      </SettingsSection>
    </div>
  );
}
