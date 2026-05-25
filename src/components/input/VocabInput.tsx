"use client";

import { useState } from "react";
import { parsePastedText } from "@/utils/parsePastedText";
import { parseFile } from "@/utils/parseFile";
import { normalizeWords } from "@/utils/wordFormat";

type VocabInputProps = {
  words: string[];
  setWords: (words: string[]) => void;
  setTopic?: (topic: string) => void;
};

const tabs = ["Manual", "File Upload", "Paste & Parse"] as const;
type Tab = (typeof tabs)[number];

const EXAMPLE_TXT = `topic: Cell Biology
words:
mitochondria
osmosis
ribosome
photosynthesis
enzyme`;

const EXAMPLE_JSON = `{
  "topic": "Cell Biology",
  "words": [
    "mitochondria",
    "osmosis",
    "ribosome",
    "photosynthesis",
    "enzyme"
  ]
}`;

function parseStructuredInput(input: string): { topic?: string; words: string[] } {
  const trimmed = input.trim();
  if (!trimmed) return { words: [] };

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as { topic?: string; words?: unknown };
      const words = Array.isArray(parsed.words)
        ? parsed.words.map((w) => (typeof w === "string" ? w.trim() : "")).filter(Boolean)
        : [];
      return { topic: parsed.topic?.trim(), words };
    } catch {
      return { words: [] };
    }
  }

  const blockTopic = trimmed.match(/^topic:\s*(.+)$/im)?.[1]?.trim();
  const wordsBlockMatch = trimmed.match(/words:\s*([\s\S]*)$/im);
  if (wordsBlockMatch) {
    const words = wordsBlockMatch[1]
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean);
    return { topic: blockTopic, words };
  }

  return { words: parsePastedText(trimmed) };
}

export default function VocabInput({ words, setWords, setTopic }: VocabInputProps) {
  const [tab, setTab] = useState<Tab>("Manual");
  const [raw, setRaw] = useState(words.join("\n"));
  const [showExample, setShowExample] = useState(false);

  const applyParse = (input: string) => {
    const parsed = parseStructuredInput(input);
    const deduped = normalizeWords(parsed.words.map((w) => w.trim()).filter(Boolean));
    setWords(deduped);
    if (parsed.topic && setTopic) setTopic(parsed.topic);
  };

  return (
    <section className="card p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-11 rounded-xl px-4 ${tab === t ? "bg-neonCyan/20 ring-1 ring-neonCyan" : "bg-slate-800/60"}`}
          >
            {t}
          </button>
        ))}
        <button type="button" className="h-11 rounded-xl border px-4" onClick={() => setShowExample((v) => !v)}>
          View example
        </button>
      </div>

      {showExample && (
        <div className="mb-4 space-y-3 rounded-xl border border-cyan-500/30 bg-slate-900/40 p-3 text-sm">
          <div>
            <p className="mb-1 font-semibold text-slate-200">TXT format</p>
            <pre className="whitespace-pre-wrap text-slate-300">{EXAMPLE_TXT}</pre>
          </div>
          <div>
            <p className="mb-1 font-semibold text-slate-200">JSON format</p>
            <pre className="whitespace-pre-wrap text-slate-300">{EXAMPLE_JSON}</pre>
          </div>
        </div>
      )}

      {tab === "Manual" && (
        <textarea
          value={raw}
          onChange={(e) => {
            const nextRaw = e.target.value;
            setRaw(nextRaw);
            setWords(parsePastedText(nextRaw));
          }}
          className="min-h-40 w-full rounded-xl border border-cyan-500/30 bg-slate-900/50 p-3"
          placeholder="Enter one word per line"
        />
      )}

      {tab === "File Upload" && (
        <label className="flex min-h-40 cursor-pointer items-center justify-center rounded-xl border border-dashed border-cyan-400/40">
          <input
            type="file"
            className="hidden"
            accept=".txt,.json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const parsed = await parseFile(file);
              const merged = parsed.join("\n");
              setRaw(merged);
              applyParse(merged);
            }}
          />
          Drop or select a .txt/.json file
        </label>
      )}

      {tab === "Paste & Parse" && (
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="min-h-40 w-full rounded-xl border border-cyan-500/30 bg-slate-900/50 p-3"
          placeholder="Paste TXT or JSON format"
        />
      )}

      {tab === "Paste & Parse" && (
        <button type="button" onClick={() => applyParse(raw)} className="mt-3 h-11 rounded-xl border border-neonCyan/50 px-4">
          Parse text
        </button>
      )}
    </section>
  );
}
