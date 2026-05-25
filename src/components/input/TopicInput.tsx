type TopicInputProps = {
  topic: string;
  setTopic: (topic: string) => void;
};

const surpriseTopics = ["Biology", "SAT Vocabulary", "World History", "Poetry", "Psychology"];

export default function TopicInput({ topic, setTopic }: TopicInputProps) {
  return (
    <section className="card p-5">
      <label className="mb-2 block text-sm text-cyan-100">Topic</label>
      <div className="flex gap-3">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Academic Vocabulary"
          className="h-11 w-full rounded-xl border border-cyan-500/30 bg-slate-900/50 px-3 outline-none focus:ring-2 focus:ring-neonCyan"
        />
        <button
          type="button"
          className="h-11 min-w-28 rounded-xl border border-neonGreen/50 px-4"
          onClick={() => setTopic(surpriseTopics[Math.floor(Math.random() * surpriseTopics.length)])}
        >
          Surprise me
        </button>
      </div>
    </section>
  );
}
