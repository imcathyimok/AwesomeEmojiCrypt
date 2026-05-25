"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { VocabWord } from "@/types";
import type { CardViewState } from "@/hooks/useCardProgress";
import Explanation from "./Explanation";

type FlashcardProps = {
  word: VocabWord;
  state: CardViewState;
  onRequestHint: () => void;
  onRevealAnswer: () => void;
  onMastered: () => void;
  onReview: () => void;
  onNext: () => void;
};

export default function Flashcard({ word, state, onRequestHint, onRevealAnswer, onMastered, onReview, onNext }: FlashcardProps) {
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);

  const safe = useMemo(
    () => ({
      word: word.word || "Unknown",
      definition: word.definition || "Definition not available",
      emojis: word.emojis || "🤷",
      explanation: word.explanation || "No explanation provided",
    }),
    [word],
  );

  const hintText = useMemo(() => {
    if (!safe.word) return safe.explanation;
    const escaped = safe.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "gi");
    return safe.explanation.replace(pattern, "[hidden]");
  }, [safe.word, safe.explanation]);

  return (
    <div className="card min-h-80 w-full p-8 text-center">
      <motion.div initial={false} animate={{ rotateY: state === "flipped" ? 180 : 0 }} transition={{ duration: 0.4 }} style={{ transformStyle: "preserve-3d" }}>
        {state !== "flipped" ? (
          <div className="space-y-4" style={{ backfaceVisibility: "hidden" }}>
            <p className={`text-center text-7xl ${activeEmoji ? "animate-pulse drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" : ""}`}>{safe.emojis}</p>
            {state === "unseen" && <p className="text-center text-3xl text-slate-400">?</p>}
            <AnimatePresence>
              {state === "hint" && (
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }}>
                  <Explanation text={hintText} onEmojiHover={setActiveEmoji} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4 text-center" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            <p className="text-5xl font-semibold text-neonGreen">{safe.word}</p>
            <p className="text-xl text-slate-200">{safe.definition}</p>
            <Explanation text={safe.explanation} onEmojiHover={setActiveEmoji} />
          </div>
        )}
      </motion.div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {state === "unseen" && (
          <>
            <button className="h-12 rounded-xl border px-5 text-lg" type="button" onClick={onRequestHint}>
              Need a hint?
            </button>
            <button className="h-12 rounded-xl border px-5 text-lg" type="button" onClick={onRevealAnswer}>
              Reveal answer
            </button>
          </>
        )}
        {state === "hint" && (
          <button className="h-12 rounded-xl border px-5 text-lg" type="button" onClick={onRevealAnswer}>
            Reveal answer
          </button>
        )}
        {state === "flipped" && (
          <button className="h-12 rounded-xl border px-5 text-lg" onClick={onNext} type="button">Next</button>
        )}
      </div>
    </div>
  );
}
