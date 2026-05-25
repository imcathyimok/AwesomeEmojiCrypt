export default function ErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card p-5">
      <h3 className="mb-2 text-lg text-rose-300">Something went wrong</h3>
      <p className="mb-3 text-sm text-slate-200">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="h-11 rounded-xl border border-rose-400/40 px-4">
          Retry
        </button>
      )}
    </div>
  );
}
