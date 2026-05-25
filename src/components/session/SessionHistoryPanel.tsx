"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

export default function SessionHistoryPanel() {
  const router = useRouter();
  const { history, removeSessionFromHistory } = useSession();

  const sorted = useMemo(() => [...history].sort((a, b) => b.createdAt - a.createdAt), [history]);

  return (
    <section className="card p-5">
      <h2 className="mb-3 text-lg font-semibold">Session History</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-400">No previous sessions yet.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-cyan-500/20 p-3">
              <div>
                <p className="font-medium text-slate-100">{item.topic}</p>
                <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()} · {item.wordCount} words · ID: {item.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="h-10 rounded-lg border px-3"
                  onClick={() => router.push(`/learn/${item.id}`)}
                >
                  Reopen
                </button>
                <button
                  type="button"
                  className="h-10 rounded-lg border border-rose-400/50 px-3 text-rose-300"
                  onClick={() => removeSessionFromHistory(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
