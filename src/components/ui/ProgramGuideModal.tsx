"use client";

type ProgramGuideModalProps = {
  open: boolean;
  onClose: () => void;
};

const MODEL_NAME = "claude-opus-4-5";

export default function ProgramGuideModal({ open, onClose }: ProgramGuideModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-label="Program guide">
      <div className="w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-2xl font-semibold text-cyan-100">Program Guide · Beneath the Surface</h2>
          <button type="button" className="h-10 rounded-lg border px-3" onClick={onClose}>Close</button>
        </div>

        <div className="space-y-4 text-slate-200">
          <section>
            <h3 className="mb-1 text-lg font-medium text-cyan-100">What this program does</h3>
            <p>
              EmojiCrypt converts vocabulary into an interactive decoding experience. For each word, AI generates an emoji sequence,
              a concise definition, and an explanation that links each symbol to the underlying meaning.
            </p>
          </section>

          <section>
            <h3 className="mb-1 text-lg font-medium text-cyan-100">How to use it</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Enter a topic and vocabulary words (manual, TXT, or JSON).</li>
              <li>Generate a session, then study in Learn / Quiz / Story mode.</li>
              <li>Mark each word as Mastered or Need Review.</li>
              <li>Review difficult words, check results, and export/share your set.</li>
            </ol>
            <p className="mt-2 text-sm text-slate-300">Current generation model: {MODEL_NAME}</p>
          </section>

          <section>
            <h3 className="mb-1 text-lg font-medium text-cyan-100">Why “Beneath the Surface”</h3>
            <p>
              The emoji string is the visible surface clue. The explanation reveals the hidden structure beneath it —
              showing how symbols map to deeper meaning, so memory is built from understanding rather than repetition.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
