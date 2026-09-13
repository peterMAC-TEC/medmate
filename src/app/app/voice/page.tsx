"use client";

import { useRouter } from "next/navigation";
import { VoiceConversation } from "@/components/VoiceConversation";
import { useAppState } from "@/contexts/AppStateContext";

export default function VoicePage() {
  const router = useRouter();
  const { t, userName } = useAppState();
  return (
    <VoiceConversation
      initialPrompt={`${t.goodMorning}, ${userName}. ${t.howAreYouFeeling}`}
      onClose={() => router.back()}
    />
  );
}
