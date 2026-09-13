"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Keyboard } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { voiceService, isVoiceSupported } from "@/lib/voiceService";
import { interpret, generateReply, type NluResult } from "@/lib/aiService";
import type { LanguageCode } from "@/lib/types";
import { VoiceButton } from "./VoiceButton";
import { ConfidenceConfirm, LowConfidenceHelp } from "./ConfidenceConfirm";
import { PrimaryAction } from "./PrimaryAction";
import type { VoiceTurn } from "@/lib/types";

type Status = "idle" | "listening" | "thinking" | "needs-confirm" | "needs-help" | "typing";

interface VoiceConversationProps {
  initialPrompt?: string;
  onClose?: () => void;
}

let turnCounter = 0;
function nextId() {
  turnCounter += 1;
  return `turn-${Date.now()}-${turnCounter}`;
}

export function VoiceConversation({ initialPrompt, onClose }: VoiceConversationProps) {
  const { t, language, voiceStyle, markTaken, addHealthEntry, addSymptom, medications, addMedication, addCondition } =
    useAppState();
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [pending, setPending] = useState<NluResult | null>(null);
  const [typedValue, setTypedValue] = useState("");
  const [voiceOk, setVoiceOk] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);

  const addTurn = useCallback((speaker: "user" | "medmate", text: string, confidence?: VoiceTurn["confidence"]) => {
    setTurns((prev) => [...prev, { id: nextId(), speaker, text, timestamp: new Date().toISOString(), confidence }]);
  }, []);

  const speak = useCallback(
    (text: string, lang: LanguageCode = language) => {
      addTurn("medmate", text);
      voiceService.speak(text, lang, "normal", voiceStyle);
    },
    [addTurn, language, voiceStyle]
  );

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    setVoiceOk(isVoiceSupported());
    const greeting = initialPrompt || t.tellMeHowYoureFeeling;
    speak(greeting);
  }, [initialPrompt, speak, t.tellMeHowYoureFeeling]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, status]);

  const applyResult = useCallback(
    (result: NluResult) => {
      if (result.intent === "confirm-medication-taken" && result.medicationId) {
        markTaken(result.medicationId);
      } else if (result.intent === "confirm-medication-taken" && !result.medicationId) {
        const active = medications.find((m) => m.status === "active");
        if (active) markTaken(active.id);
      } else if (result.intent === "report-symptom" && result.symptomName && result.severity) {
        addSymptom(result.symptomName, result.severity, result.rawText);
      } else if (result.intent === "report-feeling" && result.feeling) {
        addHealthEntry(result.feeling, result.rawText);
      } else if (result.intent === "log-prescription") {
        addMedication({
          name: result.prescriptionName ?? result.rawText,
          dosage: result.dosage,
          purpose: result.purpose,
          doctorName: result.doctorName,
        });
      } else if (result.intent === "log-condition" && result.conditionName) {
        addCondition(result.conditionName, result.rawText);
      }
      speak(generateReply(result, voiceStyle), result.spokenLanguage);
      setStatus("idle");
      setPending(null);
    },
    [markTaken, addSymptom, addHealthEntry, addMedication, addCondition, speak, voiceStyle]
  );

  const handleTranscript = useCallback(
    (text: string) => {
      addTurn("user", text);
      // Detection falls back to English when the text gives no clear
      // signal — not the Settings recognition-locale — so a plain English
      // sentence never gets answered in Hindi just because that's the
      // saved voice preference.
      const result = interpret(text, "en");
      if (result.confidence === "high") {
        applyResult(result);
      } else if (result.confidence === "medium") {
        setPending(result);
        setStatus("needs-confirm");
        speak(generateReply(result, voiceStyle), result.spokenLanguage);
      } else {
        setPending(result);
        setStatus("needs-help");
        speak(generateReply(result, voiceStyle), result.spokenLanguage);
      }
    },
    [addTurn, applyResult, speak, voiceStyle]
  );

  const startListening = useCallback(() => {
    setLiveTranscript("");
    setStatus("listening");
    voiceService.startListening(language, {
      onResult: (r) => setLiveTranscript(r.transcript),
      onEnd: () => {
        setLiveTranscript((current) => {
          if (current.trim()) {
            handleTranscript(current.trim());
          } else {
            setStatus("idle");
          }
          return current;
        });
      },
      onError: () => {
        setVoiceOk(false);
        setStatus("typing");
      },
    });
  }, [language, handleTranscript]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
  }, []);

  const submitTyped = useCallback(() => {
    if (!typedValue.trim()) return;
    handleTranscript(typedValue.trim());
    setTypedValue("");
  }, [typedValue, handleTranscript]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-cream">
      <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+16px)] pb-3">
        <p className="text-lg font-bold text-ink">MedMate</p>
        {onClose && (
          <button
            onClick={onClose}
            aria-label={t.close}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-warm-white border border-ink/8 active:scale-95"
          >
            <X size={22} />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-5 py-2">
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          {turns.map((turn) => (
            <div
              key={turn.id}
              className={
                turn.speaker === "medmate"
                  ? "float-up self-start max-w-[85%] rounded-3xl rounded-bl-lg bg-warm-white px-5 py-3.5 text-lg text-ink shadow-sm"
                  : "float-up self-end max-w-[85%] rounded-3xl rounded-br-lg bg-teal px-5 py-3.5 text-lg text-warm-white"
              }
            >
              {turn.text}
            </div>
          ))}
          {status === "listening" && liveTranscript && (
            <div className="float-up self-end max-w-[85%] rounded-3xl rounded-br-lg bg-teal/60 px-5 py-3.5 text-lg text-warm-white">
              {liveTranscript}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3">
        {status === "needs-confirm" && pending && (
          <ConfidenceConfirm
            question={t.justToMakeSure}
            onYes={() => applyResult({ ...pending, confidence: "high" })}
            onNo={() => {
              speak(t.tryAgain);
              setStatus("idle");
              setPending(null);
            }}
            onNotSure={() => {
              setStatus("needs-help");
            }}
          />
        )}

        {status === "needs-help" && (
          <LowConfidenceHelp
            onRetry={() => {
              setStatus("idle");
              setPending(null);
            }}
            onType={() => setStatus("typing")}
            onChoose={() => setStatus("typing")}
          />
        )}

        {status === "typing" && (
          <div className="flex flex-col gap-3">
            {!voiceOk && <p className="text-sm text-muted text-center">{t.voiceUnsupported}</p>}
            <div className="flex items-center gap-2 rounded-2xl border-2 border-ink/10 bg-warm-white px-4 py-2">
              <input
                autoFocus
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitTyped()}
                placeholder={t.tellMeHowYoureFeeling}
                className="min-h-[48px] flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
              />
            </div>
            <PrimaryAction onClick={submitTyped}>{t.done}</PrimaryAction>
          </div>
        )}

        {(status === "idle" || status === "listening") && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <VoiceButton
              size={84}
              listening={status === "listening"}
              onClick={status === "listening" ? stopListening : startListening}
              label={status === "listening" ? t.listening : t.tapToSpeak}
            />
            {voiceOk && status === "idle" && (
              <button
                onClick={() => setStatus("typing")}
                className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted"
              >
                <Keyboard size={16} /> {t.typeInstead}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
