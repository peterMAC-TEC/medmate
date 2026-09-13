"use client";

import { useState } from "react";
import { useAppState } from "@/contexts/AppStateContext";
import { Logo } from "./Logo";
import { PrimaryAction } from "./PrimaryAction";

export function OnboardingScreen() {
  const { completeOnboarding } = useAppState();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const ageNumber = Number(age);
  const canSubmit = name.trim().length > 0 && age.trim().length > 0 && ageNumber > 0 && ageNumber < 120;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    completeOnboarding(name.trim(), ageNumber);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>

        <div className="rounded-3xl bg-warm-white p-7 shadow-[0_4px_24px_-8px_rgba(24,48,46,0.12)] border border-ink/5">
          <h1 className="text-3xl font-bold text-ink leading-tight">Welcome to MedMate</h1>
          <p className="mt-2 text-base text-muted">
            Let&apos;s set up your profile so MedMate can start remembering your own health journey — not a
            demo one.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
            <label className="block">
              <span className="mb-2 block text-base font-semibold text-ink">Your name</span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sharma ji"
                className="min-h-[56px] w-full rounded-2xl border-2 border-ink/10 bg-cream px-5 text-lg text-ink outline-none focus:border-teal placeholder:text-muted"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-base font-semibold text-ink">Your age</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={119}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 68"
                className="min-h-[56px] w-full rounded-2xl border-2 border-ink/10 bg-cream px-5 text-lg text-ink outline-none focus:border-teal placeholder:text-muted"
              />
            </label>

            <PrimaryAction type="submit" disabled={!canSubmit}>
              Get started
            </PrimaryAction>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          Your medicines, symptoms, and conditions start empty — add them by voice or from the app.
        </p>
      </div>
    </div>
  );
}
