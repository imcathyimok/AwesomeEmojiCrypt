"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FlashcardStack from "@/components/flashcard/FlashcardStack";
import { useSession } from "@/contexts/SessionContext";
import type { Session, VocabWord } from "@/types";

export default function LearnPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();
  const reviewMode = searchParams.get("review") === "1";
  const { session, loadSessionById } = useSession();
  const router = useRouter();
  const [reviewWords, setReviewWords] = useState<VocabWord[] | null>(null);

  useEffect(() => {
    if (!session) loadSessionById(sessionId);
  }, [session, loadSessionById, sessionId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!reviewMode) {
      setReviewWords(null);
      return;
    }

    const raw = sessionStorage.getItem(`emojicrypt-review-${sessionId}`);
    if (!raw) {
      setReviewWords([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as VocabWord[];
      setReviewWords(Array.isArray(parsed) ? parsed : []);
    } catch {
      setReviewWords([]);
    }
  }, [reviewMode, sessionId]);

  const displaySession = useMemo<Session | null>(() => {
    if (!session || session.id !== sessionId) return null;
    if (!reviewMode) return session;
    return {
      ...session,
      words: reviewWords ?? [],
    };
  }, [reviewMode, reviewWords, session, sessionId]);

  if (!displaySession) {
    return (
      <main className="card p-6">
        <p className="mb-3">Session not found.</p>
        <button type="button" className="h-11 rounded-xl border px-4" onClick={() => router.push("/")}>Back home</button>
      </main>
    );
  }

  if (reviewMode && reviewWords && reviewWords.length === 0) {
    return (
      <main className="card p-6">
        <p className="mb-3">No difficult words to review.</p>
        <button type="button" className="h-11 rounded-xl border px-4" onClick={() => router.push(`/results/${sessionId}`)}>
          Back to results
        </button>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">
        {displaySession.topic}
        {reviewMode ? " · Review Mode" : ""}
      </h1>
      <FlashcardStack session={displaySession} />
    </main>
  );
}
