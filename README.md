# 🔮 EmojiCrypt

### Beneath the Surface – Where words hide and emojis reveal.

**EmojiCrypt** turns your boring vocabulary list into a deck of cryptic emoji puzzles. Every word becomes a visual riddle—a sequence of 3–5 emojis that somehow, magically, make sense when you crack the code. Built for the **"Beneath the Surface"** hackathon, because the best meanings aren't on the surface—they're waiting to be discovered.

---

## 💡 The Idea

Studying vocabulary is tedious. Flashcards are flat. But a string of emojis that secretly tells a story about a word? That’s sticky. That’s memorable. That’s what EmojiCrypt does.

You type in a topic and a bunch of terms. Our AI generates:

- 🧩 **An emoji sequence** (like `⚡🏭🔋`)
- 📖 **A clear definition**
- 💬 **An explanation** that decodes the emoji story

Suddenly, “Mitochondria” isn’t just a word—it’s a power plant, a spark, a battery. The connection is visual, emotional, and impossible to forget.

---

## 🎮 How It Works

1. **Input** → Choose a topic and add words (type, upload, or paste).
2. **Generate** → AI crafts emojis, definitions, and explanations.
3. **Learn** → Swipe through interactive flashcards.  
   See emojis → get a hint (the story) → flip to reveal the answer.
4. **Master** → Mark words as mastered or review, then export to Anki, PDF, or share a link.

---

## ✨ Features That Make Studying a Game

- 🃏 **Progressive Reveal Flashcards** – Start with pure emojis, peel back layers.
- 🕹️ **Three Study Modes**  
  - *Emoji → Word* (classic decode)  
  - *Word → Emoji* (quiz mode – pick the right emoji)  
  - *Story Mode* (explanation first, then the reveal)
- 💚 **Mastery Tracking** – Thumbs up/down on every card; re-study only what’s shaky.
- 🌌 **Beneath the Surface Dark Theme** – Deep ocean gradients, neon glow, buttery card flips.
- 📤 **Export Anywhere** – Anki deck (`.txt`), PDF, clipboard, or a shareable read-only link.
- ⚡ **AI‑Powered Mnemonics** – Uses OpenAI to create *unique* emoji puzzles for any subject.

---

## 🧪 Try a Sample

**Topic**: Biology – Cell Organelles  
**Word**: *Mitochondria*

| Emoji Code | Definition | Explanation |
|------------|------------|-------------|
| ⚡🏭🔋 | Powerhouse of the cell, produces ATP. | A power plant (🏭) generating electricity (⚡) stored in batteries (🔋) – just like mitochondria turn nutrients into energy. |

That’s the kind of “aha!” moment EmojiCrypt delivers, for every word.

---

## 🛠️ Tech Stack

- **Frontend**: React · TypeScript · Tailwind CSS · Framer Motion
- **Backend**: Next.js API routes (Node.js)
- **AI**: OpenAI GPT‑4o / GPT‑3.5‑turbo
- **State**: React Context + custom hooks
- **Storage**: localStorage for offline resilience

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/emojicrypt.git
cd emojicrypt
npm install
```

Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-your-key-here
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start memorizing.

*(API key is used only server‑side and never exposed to the browser.)*

---

## 🤫 The Secret Sauce

We wanted studying to feel less like work and more like solving a puzzle. The “Beneath the Surface” theme was a perfect metaphor: every emoji hides a deeper story, just like every vocabulary word carries a hidden network of meaning. EmojiCrypt doesn’t just show you definitions—it helps you *feel* the connections.

---

## 🧩 Future Depths

- Spaced repetition (SRS) built‑in
- Community‑shared vocabulary packs
- Offline generation with Web‑LLM
- Multi‑language support (emojis transcend borders)

---

**Made with ❤️, caffeine, and a love for emojis 🫧**  
*Beneath the Surface Hackathon, 2026*
