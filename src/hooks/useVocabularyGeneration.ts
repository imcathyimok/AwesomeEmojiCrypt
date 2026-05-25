"use client";

import { useState } from "react";
import { generateVocabulary } from "@/services/generateVocabulary";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";

export function useVocabularyGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useSession();
  const router = useRouter();

  const run = async (topic: string, words: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const session = await generateVocabulary(topic, words);
      setSession(session);
      router.push(`/learn/${session.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
}
