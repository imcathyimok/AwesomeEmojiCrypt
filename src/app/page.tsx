"use client";

import { useMemo, useState } from "react";
import TopicInput from "@/components/input/TopicInput";
import VocabInput from "@/components/input/VocabInput";
import VocabList from "@/components/input/VocabList";
import ConfirmationModal from "@/components/input/ConfirmationModal";
import { useVocabularyValidation } from "@/hooks/useVocabularyValidation";
import { useVocabularyGeneration } from "@/hooks/useVocabularyGeneration";
import ErrorCard from "@/components/ui/ErrorCard";
import SessionHistoryPanel from "@/components/session/SessionHistoryPanel";
import ProgramGuideModal from "@/components/ui/ProgramGuideModal";

export default function HomePage() {
  const [topic, setTopic] = useState("Academic Vocabulary");
  const [words, setWords] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { run, loading, error } = useVocabularyGeneration();
  const validation = useVocabularyValidation(words);

  const canGenerate = useMemo(() => validation.isValid && validation.validWords.length > 0 && topic.trim().length > 0, [validation, topic]);

  return (
    <main className="h-[calc(100vh-2rem)] overflow-hidden">
      <section className="mb-3 flex items-center justify-between rounded-xl border border-cyan-500/30 bg-slate-900/40 p-4">
        <div>
          <h1 className="text-3xl font-bold text-neonCyan">Beneath the Surface</h1>
          <p className="text-base text-slate-200">Decode emoji clues into deeper word meaning.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="h-12 rounded-xl border border-cyan-500/50 px-4 text-base"
          >
            Program Guide
          </button>
          <button
            type="button"
            disabled={!canGenerate || loading}
            onClick={() => setOpen(true)}
            className="h-12 min-w-44 rounded-xl border border-neonGreen/60 bg-neonGreen/10 px-5 text-lg disabled:opacity-50"
          >
            Confirm & Generate
          </button>
        </div>
      </section>

      <section className="grid h-[calc(100%-5.5rem)] grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="space-y-3 overflow-auto lg:col-span-7 pr-1">
          <TopicInput topic={topic} setTopic={setTopic} />
          <VocabInput words={words} setWords={setWords} setTopic={setTopic} />

          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <section className="card p-4 text-sm">
              {validation.errors.map((e) => <p key={e} className="text-rose-300">{e}</p>)}
              {validation.warnings.map((w) => <p key={w} className="text-amber-300">{w}</p>)}
            </section>
          )}

          {error && <ErrorCard message={error} onRetry={() => run(topic, validation.validWords)} />}
        </div>

        <div className="space-y-3 overflow-auto lg:col-span-5 pr-1">
          <VocabList words={words} setWords={setWords} />
          <SessionHistoryPanel />
        </div>
      </section>

      <ConfirmationModal
        open={open}
        topic={topic}
        words={validation.validWords}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          await run(topic, validation.validWords);
          setOpen(false);
        }}
      />

      <ProgramGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </main>
  );
}
