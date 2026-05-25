"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { Session } from "@/types";

export default function ExportMenu({ session }: { session: Session }) {
  const [message, setMessage] = useState<string | null>(null);

  const copyNotes = async () => {
    const text = session.words
      .map((w) => `Word: ${w.word} | Emoji: ${w.emojis} | Definition: ${w.definition} | Explanation: ${w.explanation}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied to clipboard.");
    } catch {
      setMessage("Could not copy. Please try again.");
    }
  };

  const exportPdf = () => {
    const html = session.words
      .map(
        (w) => `
        <section style="page-break-after: always; padding: 32px; font-family: Arial, sans-serif;">
          <div style="font-size: 64px; margin-bottom: 16px;">${w.emojis}</div>
          <h1 style="font-size: 28px; margin: 0 0 12px;">${w.word}</h1>
          <p style="font-size: 18px; margin-bottom: 12px;"><strong>Definition:</strong> ${w.definition}</p>
          <p style="font-size: 16px;"><strong>Explanation:</strong> ${w.explanation}</p>
        </section>
      `,
      )
      .join("");

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      setMessage("Could not open print window.");
      return;
    }

    win.document.write(`<html><head><title>${session.topic}</title></head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const downloadAnki = () => {
    const rows = session.words
      .map((w) => `${w.emojis}\t${w.word}\n${w.definition}\n${w.explanation}`)
      .join("\n");
    const blob = new Blob([rows], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${session.topic}-anki.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const share = async () => {
    const id = uuid();
    localStorage.setItem(`shared-${id}`, JSON.stringify(session));
    const url = `${window.location.origin}/shared/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage(`Share link copied: ${url}`);
    } catch {
      setMessage(url);
    }
  };

  return (
    <div className="card p-5">
      <h3 className="mb-3 font-semibold">Export</h3>
      <div className="flex flex-wrap gap-2">
        <button className="h-11 rounded-xl border px-4" onClick={copyNotes} type="button">Copy notes</button>
        <button className="h-11 rounded-xl border px-4" onClick={exportPdf} type="button">Export PDF</button>
        <button className="h-11 rounded-xl border px-4" onClick={downloadAnki} type="button">Anki .txt</button>
        <button className="h-11 rounded-xl border px-4" onClick={share} type="button">Share link</button>
      </div>
      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </div>
  );
}
