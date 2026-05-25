export default function HowItWorksPage() {
  return (
    <main className="space-y-4">
      <section className="card p-6">
        <h1 className="mb-3 text-3xl font-bold text-neonCyan">How It Works</h1>
        <ol className="list-decimal space-y-2 pl-5 text-lg text-slate-200">
          <li>Enter a topic and vocabulary list (manual, TXT, or JSON).</li>
          <li>AI generates emoji clues, definitions, and explanations for each word.</li>
          <li>Study with Learn, Quiz, or Story modes.</li>
          <li>Mark words as Mastered or Need Review and revisit weak words.</li>
          <li>Export your notes or share a read-only link.</li>
        </ol>
      </section>
    </main>
  );
}
