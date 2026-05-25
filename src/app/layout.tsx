import type { Metadata } from "next";
import "@/styles/globals.css";
import Link from "next/link";
import { SessionProvider } from "@/contexts/SessionContext";

export const metadata: Metadata = {
  title: "EmojiCrypt",
  description: "AI-powered emoji mnemonics for vocabulary learning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="mx-auto min-h-screen max-w-6xl px-4 pb-12">
            <header className="no-print sticky top-0 z-20 mb-8 flex items-center justify-between border-b border-cyan-400/20 bg-abyss/80 py-4 backdrop-blur">
              <Link href="/" className="text-xl font-semibold tracking-wide text-neonCyan">
                EmojiCrypt
              </Link>
              <Link href="/" className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm">
                Home
              </Link>
            </header>
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
