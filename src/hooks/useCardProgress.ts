"use client";

import { useMemo, useState } from "react";

export type CardViewState = "unseen" | "hint" | "flipped";

export function useCardProgress(total: number) {
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<CardViewState[]>(Array.from({ length: total }, () => "unseen"));

  const setCardState = (cardIndex: number, state: CardViewState) => {
    setStates((prev) => {
      const next = [...prev];
      next[cardIndex] = state;
      return next;
    });
  };

  const reset = (nextTotal: number) => {
    setIndex(0);
    setStates(Array.from({ length: nextTotal }, () => "unseen"));
  };

  const progress = useMemo(() => (total === 0 ? 0 : Math.round(((index + 1) / total) * 100)), [index, total]);

  return { index, setIndex, states, setCardState, progress, reset };
}
