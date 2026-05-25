"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/types";
import { useCardProgress } from "@/hooks/useCardProgress";
import Flashcard from "./Flashcard";
import ProgressBar from "@/components/ui/ProgressBar";
import { useSession } from "@/contexts/SessionContext";
import QuizMode from "@/components/quiz/QuizMode";

type Mode = "flashcard" | "quiz" | "story";

export default function FlashcardStack({ session }: { session: Session }) {
  const { index, setIndex, states, setCardState, progress } = useCardProgress(session.words.length);
  const [mode, setMode] = useState<Mode>("flashcard");
  const [feedback, setFeedback] = useState<string | null>(null);
  const { updateWord } = useSession();
  const router = useRouter();
  const current = session.words[index];
  const masteredCount = session.words.filter((w) => w.mastered === true).length;
  const reviewCount = session.words.filter((w) => w.mastered === false).length;

  const storyStep = useMemo(() => {
    if (states[index] === "unseen") return 0;
    if (states[index] === "hint") return 1;
    return 2;
  }, [states, index]);

  if (mode === "quiz") return <QuizMode session={session} />;

  const nextCard = () => {
    if (index + 1 >= session.words.length) {
      router.push(`/results/${session.id}`);
      return;
    }
    setIndex((i) => i + 1);
  };

  const markAndAdvance = (mastered: boolean) => {
    updateWord(index, { mastered });
    setFeedback(mastered ? "已标记为 Mastered，正在进入下一个词…" : "已标记为 Need Review，正在进入下一个词…");
    setTimeout(() => {
      setFeedback(null);
      nextCard();
    }, 350);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex gap-2">
          {(["flashcard", "quiz", "story"] as Mode[]).map((m) => (
            <button key={m} className={`h-11 rounded-xl px-4 ${mode === m ? "bg-neonCyan/20" : "bg-slate-800/70"}`} onClick={() => setMode(m)} type="button">
              {m}
            </button>
          ))}
        </div>
        <p className="text-lg text-slate-200">Card {index + 1} of {session.words.length} · Mastered {masteredCount} · Need Review {reviewCount}</p>
      </div>
      <ProgressBar value={progress} />

      {feedback && <p className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">{feedback}</p>}

      {mode === "story" ? (
        <div className="card space-y-3 p-6">
          <p className="text-sm text-slate-100">{current.explanation}</p>
          <p className={`text-5xl transition-opacity duration-500 ${storyStep >= 1 ? "opacity-100" : "opacity-0"}`}>{current.emojis || "🤷"}</p>
          <div className={`transition-opacity duration-500 ${storyStep >= 2 ? "opacity-100" : "opacity-0"}`}>
            <p className="text-xl text-neonGreen">{current.word}</p>
            <p className="text-slate-200">{current.definition}</p>
          </div>
          <div className="flex justify-between gap-2 pt-2">
            <div className="flex gap-2">
              <button className="h-11 rounded-xl border px-4" onClick={() => markAndAdvance(true)} type="button">👍 Mastered</button>
              <button className="h-11 rounded-xl border px-4" onClick={() => markAndAdvance(false)} type="button">👎 Need Review</button>
            </div>
            <button className="h-11 rounded-xl border px-4" onClick={nextCard} type="button">Next</button>
          </div>
        </div>
      ) : (
        <Flashcard
          word={current}
          state={states[index]}
          onRequestHint={() => setCardState(index, "hint")}
          onRevealAnswer={() => setCardState(index, "flipped")}
          onMastered={() => markAndAdvance(true)}
          onReview={() => markAndAdvance(false)}
          onNext={nextCard}
          isLast={index + 1 >= session.words.length}
        />
      )}

      <div className="flex justify-between gap-2">
        <button className="h-11 rounded-xl border px-4" onClick={() => setIndex((i) => Math.max(0, i - 1))} type="button">Previous</button>
        <button className="h-11 rounded-xl border px-4" onClick={() => setIndex((i) => Math.min(session.words.length - 1, i + 1))} type="button">Next</button>
      </div>
    </div>
  );
}
