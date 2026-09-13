"use client";

import { useAppState } from "@/contexts/AppStateContext";
import { PrimaryAction } from "./PrimaryAction";

interface ConfidenceConfirmProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
  onNotSure: () => void;
}

export function ConfidenceConfirm({ question, onYes, onNo, onNotSure }: ConfidenceConfirmProps) {
  const { t } = useAppState();
  return (
    <div className="rounded-3xl bg-peach/40 border border-peach-dark/40 p-5">
      <p className="text-lg font-semibold text-ink">{question}</p>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <PrimaryAction variant="primary" size="md" onClick={onYes}>
          {t.yes}
        </PrimaryAction>
        <PrimaryAction variant="ghost" size="md" onClick={onNo}>
          {t.no}
        </PrimaryAction>
        <PrimaryAction variant="ghost" size="md" onClick={onNotSure}>
          {t.notSure}
        </PrimaryAction>
      </div>
    </div>
  );
}

export function LowConfidenceHelp({
  onRetry,
  onType,
  onChoose,
}: {
  onRetry: () => void;
  onType: () => void;
  onChoose: () => void;
}) {
  const { t } = useAppState();
  return (
    <div className="rounded-3xl bg-lavender/40 border border-lavender-dark/50 p-5">
      <p className="text-lg font-semibold text-ink">{t.notSureUnderstood}</p>
      <div className="mt-4 flex flex-col gap-2.5">
        <PrimaryAction variant="primary" size="md" onClick={onRetry}>
          {t.tryAgain}
        </PrimaryAction>
        <PrimaryAction variant="ghost" size="md" onClick={onType}>
          {t.typeInstead}
        </PrimaryAction>
        <PrimaryAction variant="ghost" size="md" onClick={onChoose}>
          {t.chooseOption}
        </PrimaryAction>
      </div>
    </div>
  );
}
