<img width="1673" height="793" alt="image" src="https://github.com/user-attachments/assets/cd72acd1-0038-4b11-9409-c5fc04047b64" />

EmojiCrypt is a vocabulary-learning web app that turns word lists into emoji-based study cards.

The app is designed around one simple idea: learners first see a surface-level clue (emojis), then uncover deeper meaning (definition + explanation).

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

In each card flow:

1. You see emojis first (surface).
2. You reveal hints and explanation.
3. You connect symbols to the real meaning (beneath the surface).

That “decode first, understand deeper second” pattern is the core learning experience.

At first glance, **EmojiCrypt** looks like a fun, creative way to turn text into secure emoji codes. But if you look a little **underneath the surface**, the inspiration for this project comes from a much deeper place: **seeing a need** in how we learn, specifically for people with dyslexia.

Traditional reading and vocabulary learning heavily rely on decoding abstract text, which can often feel overwhelming or frustrating for neurodiverse minds. This project was built to change that dynamic by introducing visual anchors.

### Connecting the Dots for Dyslexia:
* **Visual Anchors over Abstract Text:** Emojis provide an immediate, concrete visual reference. For someone struggling to process text characters, a vibrant icon bridges the gap between a word’s spelling and its actual meaning.
* **Gamifying the Struggle:** By turning vocabulary building into a cryptographic puzzle, it removes the pressure of "traditional reading" and replaces it with a gamified, multi-sensory experience. It engages different pathways in the brain, helping with memory retention.
* **Designing for Inclusivity:** True accessibility isn't just about screen readers; it’s about reimagining how we interact with language. 

By hiding messages beneath a layer of emojis, **EmojiCrypt** playfully flips the script—inviting users to look closer, see the hidden needs of others, and make learning a more inclusive, joyful experience for everyone.
---

## What it does

Given a topic and list of words, EmojiCrypt generates for each word:

- an emoji clue sequence,
- a concise definition,
- and an explanation of the clue.

<img width="1130" height="619" alt="image" src="https://github.com/user-attachments/assets/2853043f-fa77-4d45-8949-e466eefd4474" />
<img width="1128" height="622" alt="image" src="https://github.com/user-attachments/assets/46a89b77-0bf3-46d7-a72d-fd9f1d4671b8" />
<img width="1129" height="622" alt="image" src="https://github.com/user-attachments/assets/85804663-b968-4d0d-af1f-10f06d831c9d" />


Then it presents the results in interactive study modes.
<img width="1132" height="697" alt="image" src="https://github.com/user-attachments/assets/91ebb781-ac9c-4207-b537-2fdf3f207d93" />

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

<img width="1130" height="777" alt="image" src="https://github.com/user-attachments/assets/d8c98536-77db-4fbf-b0ca-0dd4d0dc126a" />
<img width="1133" height="618" alt="image" src="https://github.com/user-attachments/assets/1dc542d9-a1ed-4c4d-a0bb-21593cb22236" />
<img width="1132" height="557" alt="image" src="https://github.com/user-attachments/assets/342de3c9-1523-41ad-9d50-471220d35b97" />
<img width="1136" height="531" alt="image" src="https://github.com/user-attachments/assets/1c262885-4741-4f5f-ad99-381ed7b1ee1b" />
<img width="897" height="761" alt="image" src="https://github.com/user-attachments/assets/cab55f10-9441-4798-9dfd-d1676de28878" />

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

Video Demonstration : https://drive.google.com/file/d/1LnqHRa-KOBZOlqFVm2n1Yrh2u70zEhT_/view?usp=sharing

**Have fun exploring the hidden meanings of the dull-looking vocabulary!**



