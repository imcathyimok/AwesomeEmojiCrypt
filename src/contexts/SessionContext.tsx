"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, SessionHistoryItem, VocabWord } from "@/types";

type SessionContextValue = {
  session: Session | null;
  history: SessionHistoryItem[];
  setSession: (session: Session | null) => void;
  updateWord: (index: number, partial: Partial<VocabWord>) => void;
  loadSessionById: (sessionId: string) => Session | null;
  removeSessionFromHistory: (sessionId: string) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

function sessionKey(sessionId: string) {
  return `emojicrypt-session-${sessionId}`;
}

function historyKey() {
  return "emojicrypt-session-history";
}

function archiveKey(sessionId: string) {
  return `emojicrypt-archive-${sessionId}`;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);

  const persistHistory = useCallback((items: SessionHistoryItem[]) => {
    setHistory(items);
    if (typeof window !== "undefined") {
      localStorage.setItem(historyKey(), JSON.stringify(items));
    }
  }, []);

  const setSession = useCallback((nextSession: Session | null) => {
    setSessionState(nextSession);
    if (typeof window !== "undefined") {
      if (nextSession) {
        sessionStorage.setItem("emojicrypt-session", JSON.stringify(nextSession));
        sessionStorage.setItem(sessionKey(nextSession.id), JSON.stringify(nextSession));
        localStorage.setItem(archiveKey(nextSession.id), JSON.stringify(nextSession));

        const raw = localStorage.getItem(historyKey());
        const existing = raw ? (JSON.parse(raw) as SessionHistoryItem[]) : [];
        const nextHistory = [
          { id: nextSession.id, topic: nextSession.topic, createdAt: nextSession.createdAt, wordCount: nextSession.words.length },
          ...existing.filter((item) => item.id !== nextSession.id),
        ].slice(0, 30);

        persistHistory(nextHistory);
      } else {
        sessionStorage.removeItem("emojicrypt-session");
      }
    }
  }, [persistHistory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawHistory = localStorage.getItem(historyKey());
    if (!rawHistory) return;
    try {
      setHistory(JSON.parse(rawHistory) as SessionHistoryItem[]);
    } catch {
      setHistory([]);
    }
  }, []);

  const updateWord = useCallback((index: number, partial: Partial<VocabWord>) => {
    setSessionState((prev) => {
      if (!prev) return prev;
      const words = [...prev.words];
      words[index] = { ...words[index], ...partial };
      const next = { ...prev, words };
      if (typeof window !== "undefined") {
        sessionStorage.setItem("emojicrypt-session", JSON.stringify(next));
        sessionStorage.setItem(sessionKey(next.id), JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const loadSessionById = useCallback((sessionId: string) => {
    if (typeof window === "undefined") return null;

    const rawHistory = localStorage.getItem(historyKey());
    if (rawHistory) {
      try {
        setHistory(JSON.parse(rawHistory) as SessionHistoryItem[]);
      } catch {
        setHistory([]);
      }
    }

    const scoped = sessionStorage.getItem(sessionKey(sessionId));
    const legacy = sessionStorage.getItem("emojicrypt-session");
    const archived = localStorage.getItem(archiveKey(sessionId));
    const raw = archived ?? scoped ?? legacy;
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as Session;
      if (parsed.id !== sessionId) return null;
      setSessionState(parsed);
      sessionStorage.setItem("emojicrypt-session", JSON.stringify(parsed));
      sessionStorage.setItem(sessionKey(parsed.id), JSON.stringify(parsed));
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const removeSessionFromHistory = useCallback((sessionId: string) => {
    const next = history.filter((item) => item.id !== sessionId);
    persistHistory(next);
    if (typeof window !== "undefined") {
      localStorage.removeItem(archiveKey(sessionId));
      sessionStorage.removeItem(sessionKey(sessionId));
      if (session?.id === sessionId) {
        sessionStorage.removeItem("emojicrypt-session");
        setSessionState(null);
      }
    }
  }, [history, persistHistory, session]);

  const value = useMemo(
    () => ({ session, history, setSession, updateWord, loadSessionById, removeSessionFromHistory }),
    [session, history, setSession, updateWord, loadSessionById, removeSessionFromHistory],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}
