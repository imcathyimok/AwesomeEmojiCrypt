# EmojiCrypt

EmojiCrypt is a vocabulary-learning web app that turns word lists into emoji-based study cards.

Built for the **Beneath the Surface** theme, the app is designed around one simple idea: learners first see a surface-level clue (emojis), then uncover deeper meaning (definition + explanation).

---

## Why this project

Memorizing vocabulary with plain flashcards can feel repetitive, and words are easy to forget without strong associations.

EmojiCrypt helps by combining:

- visual clues (emojis),
- short explanations,
- and step-by-step reveal.

This makes review more active and easier to remember.

---

## Theme connection: Beneath the Surface

The theme is part of the product design, not just the title.

In each card flow:

1. You see emojis first (surface).
2. You reveal hints and explanation.
3. You connect symbols to the real meaning (beneath the surface).

That “decode first, understand deeper second” pattern is the core learning experience.

---

## What it does

Given a topic and list of words, EmojiCrypt generates for each word:

- an emoji clue sequence,
- a concise definition,
- and an explanation of the clue.

Then it presents the results in interactive study modes.

---

## Main features

- **Topic + word input** (manual, paste, file import)
- **AI generation** of emoji clues, definitions, and explanations
- **Card-based learning flow**
- **Multiple study modes** (flashcard / quiz / story)
- **Session history + review workflow**

---

## How to use

1. Enter a topic and vocabulary words.
2. Generate a study session.
3. Go through cards in your preferred mode.
4. Reveal hint/answer and continue through the deck.
5. Review results and practice again.

---

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Next.js API route relay for model-based generation

**Demo model:** Claude-Opus-4-5

---

## Quick start

```bash
git clone https://github.com/your-username/AwesomeEmojiCrypt.git
cd AwesomeEmojiCrypt
npm install
```

Create `.env.local`:

```bash
YINLI_API_KEY=your_key_here
YINLI_API_URL=https://yinli.one/v1/chat/completions
YINLI_MODEL=claude-opus-4-5-20251101
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Notes

- Keep `.env.local` private.
- Do not commit `.next` or `node_modules`.
- If deployment fails, run `npm run build` locally first to catch type/lint issues.

