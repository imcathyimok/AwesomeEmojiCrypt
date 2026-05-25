import { capitalizeFirst } from "@/utils/wordFormat";

type VocabListProps = {
  words: string[];
  setWords: (words: string[]) => void;
};

export default function VocabList({ words, setWords }: VocabListProps) {
  return (
    <section className="card p-5">
      <h3 className="mb-3 text-lg text-cyan-100">Preview ({words.length})</h3>
      {!words.length ? (
        <p className="text-base text-slate-300">Enter some words to begin.</p>
      ) : (
        <ul className="space-y-2">
          {words.map((word, i) => (
            <li key={`${word}-${i}`} className="flex items-center gap-2">
              <input
                value={word}
                onChange={(e) => {
                  const next = [...words];
                  next[i] = capitalizeFirst(e.target.value);
                  setWords(next);
                }}
                className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 text-lg"
              />
              <button
                type="button"
                className="h-10 min-w-11 rounded-lg border border-rose-400/40"
                onClick={() => setWords(words.filter((_, idx) => idx !== i))}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
