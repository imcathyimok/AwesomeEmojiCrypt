export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full rounded-full bg-slate-800">
      <div className="h-3 rounded-full bg-gradient-to-r from-neonCyan to-neonGreen" style={{ width: `${value}%` }} />
    </div>
  );
}
