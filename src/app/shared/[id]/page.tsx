"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/types";
import { useParams } from "next/navigation";

export default function SharedPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(`shared-${id}`);
    if (!raw) return;
    try {
      setSession(JSON.parse(raw));
    } catch {
      setSession(null);
    }
  }, [id]);

  if (!session) return <main className="card p-6">Link expired or not found.</main>;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Shared: {session.topic}</h1>
      <ul className="space-y-3">
        {session.words.map((w, i) => (
          <li key={`${w.word}-${i}`} className="card p-4">
            <p className="text-3xl">{w.emojis}</p>
            <p className="text-lg text-neonGreen">{w.word}</p>
            <p className="text-sm text-slate-200">{w.definition}</p>
            <p className="mt-2 text-xs text-slate-300">{w.explanation}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
