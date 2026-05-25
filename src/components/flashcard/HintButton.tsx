export default function HintButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="h-11 rounded-xl border border-neonCyan/50 px-4">
      Show Hint
    </button>
  );
}
