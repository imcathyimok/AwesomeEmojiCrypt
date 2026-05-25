"use client";

import { useMemo } from "react";

type ExplanationProps = {
  text: string;
  onEmojiHover?: (emoji: string | null) => void;
};

const emojiRegex = /(\p{Extended_Pictographic})/gu;

export default function Explanation({ text, onEmojiHover }: ExplanationProps) {
  const tokens = useMemo(() => {
    return text.split(emojiRegex).filter((token) => token.length > 0);
  }, [text]);

  return (
    <p className="text-sm leading-relaxed text-slate-200">
      {tokens.map((token, i) => {
        const isEmoji = emojiRegex.test(token);
        emojiRegex.lastIndex = 0;

        if (!isEmoji) {
          return <span key={`${token}-${i}`}>{token}</span>;
        }

        return (
          <span
            key={`${token}-${i}`}
            className="emoji-highlight rounded px-0.5 text-neonCyan"
            onMouseEnter={() => onEmojiHover?.(token)}
            onMouseLeave={() => onEmojiHover?.(null)}
            onTouchStart={() => onEmojiHover?.(token)}
            onTouchEnd={() => onEmojiHover?.(null)}
          >
            {token}
          </span>
        );
      })}
    </p>
  );
}
