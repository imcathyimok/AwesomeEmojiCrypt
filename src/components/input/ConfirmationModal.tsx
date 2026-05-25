type ConfirmationModalProps = {
  open: boolean;
  topic: string;
  words: string[];
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function ConfirmationModal({ open, topic, words, onClose, onConfirm, loading }: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="card w-full max-w-xl p-6">
        <h3 className="mb-2 text-lg font-semibold">Ready to generate?</h3>
        <p className="mb-4 text-sm text-slate-300">Topic: {topic || "Untitled"}</p>
        <p className="mb-3 text-sm text-slate-300">Word count: {words.length}</p>
        <div className="mb-5 max-h-52 overflow-auto rounded-lg bg-slate-900/40 p-3 text-sm">
          {words.join(", ")}
        </div>
        <div className="flex justify-end gap-2">
          <button className="h-11 rounded-xl px-4" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="h-11 rounded-xl border border-neonGreen/60 bg-neonGreen/10 px-4"
            onClick={onConfirm}
            type="button"
            disabled={loading}
          >
            {loading ? "Generating..." : "Confirm & Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
