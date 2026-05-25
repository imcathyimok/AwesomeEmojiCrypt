"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import ExportMenu from "@/components/export/ExportMenu";
import SessionHistoryPanel from "@/components/session/SessionHistoryPanel";

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session, setSession } = useSession();
  const router = useRouter();

  const currentSession = useMemo(() => {
    if (!session || session.id !== sessionId) return null;
    return session;
  }, [session, sessionId]);

  const mastered = useMemo(() => currentSession?.words.filter((w) => w.mastered === true).length ?? 0, [currentSession]);
  const review = useMemo(() => currentSession?.words.filter((w) => w.mastered === false).length ?? 0, [currentSession]);
  const masteredPct = currentSession && currentSession.words.length > 0 ? Math.round((mastered / currentSession.words.length) * 100) : 0;

  if (!currentSession) {
    return <main className="card p-6">Session not found.</main>;
  }

  return (
    <main className="space-y-4">
      <section className="card p-6">
        <h1 className="mb-2 text-2xl font-semibold">Session Summary</h1>
        <p className="mb-2">Topic: {currentSession.topic}</p>
        <p>Mastered (👍): {mastered}</p>
        <p>Needs review (👎): {review}</p>
        <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-neonGreen" style={{ width: `${masteredPct}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-300">{masteredPct}% mastered</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="h-11 rounded-xl border px-4"
            type="button"
            onClick={() => {
              const filteredWords = currentSession.words.filter((w) => w.mastered === false);
              sessionStorage.setItem(`emojicrypt-review-${currentSession.id}`, JSON.stringify(filteredWords));
              router.push(`/learn/${currentSession.id}?review=1`);
            }}
          >
            Review difficult words
          </button>
          <button className="h-11 rounded-xl border px-4" type="button" onClick={() => router.push(`/learn/${currentSession.id}`)}>
            Study again
          </button>
        </div>
      </section>
      <ExportMenu session={session} />
      <SessionHistoryPanel />
    </main>
  );
}
