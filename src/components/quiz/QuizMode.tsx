"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/types";
import { useSession } from "@/contexts/SessionContext";

type QuizModeProps = {
  session: Session;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizMode({ session }: QuizModeProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { updateWord } = useSession();
  const router = useRouter();
  const current = session.words[index];

  const options = useMemo(() => {
    const distractors = shuffle(session.words.filter((w) => w.word !== current.word))
      .slice(0, 3)
      .map((w) => w.emojis || "🤷");

    while (distractors.length < 3) distractors.push("🤷");

    return shuffle([current.emojis || "🤷", ...distractors]);
  }, [session.words, current]);

  const isCorrect = selected !== null && selected === (current.emojis || "🤷");

  return (
    <div className="card p-6">
      <h2 className="mb-1 text-xl font-semibold">Word → Emoji</h2>
      <p className="mb-3 text-sm text-slate-400">Card {index + 1} of {session.words.length}</p>
      <p className="text-lg font-semibold text-neonGreen">{current.word}</p>
      <p className="mb-4 text-slate-200">{current.definition}</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt, i) => {
          const optionIsCorrect = opt === (current.emojis || "🤷");
          const showResult = selected !== null;
          const correctClass = showResult && optionIsCorrect ? "border-green-400 bg-green-500/20" : "";
          const wrongClass = showResult && selected === opt && !optionIsCorrect ? "border-red-400 bg-red-500/20" : "";
          return (
            <button
              key={`${opt}-${i}`}
              disabled={selected !== null}
              className={`h-14 rounded-xl border border-cyan-500/30 text-2xl disabled:cursor-not-allowed ${correctClass} ${wrongClass}`}
              onClick={() => {
                setSelected(opt);
                const correct = opt === (current.emojis || "🤷");
                updateWord(index, { quizCorrect: correct });
                if (correct) {
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 700);
                }
              }}
              type="button"
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showConfetti && <p className="mt-3 text-green-300">✓ Nice! 🎉</p>}
      {selected !== null && !isCorrect && <p className="mt-3 text-red-300">✗ Not quite.</p>}

      {selected !== null && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-slate-200">{current.explanation}</p>
          <div className="flex justify-end">
            <button
              type="button"
              className="h-11 rounded-xl border border-neonGreen/50 px-4"
              onClick={() => {
                setSelected(null);
                if (index + 1 >= session.words.length) {
                  router.push(`/results/${session.id}`);
                  return;
                }
                setIndex((i) => i + 1);
              }}
            >
              {index + 1 >= session.words.length ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
