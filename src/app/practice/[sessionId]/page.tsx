"use client";

import { useSession } from "@/contexts/SessionContext";
import { useParams } from "next/navigation";
import QuizMode from "@/components/quiz/QuizMode";

export default function PracticePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session } = useSession();

  if (!session || session.id !== sessionId) {
    return <main className="card p-6">Session not found.</main>;
  }

  return (
    <main>
      <QuizMode session={session} />
    </main>
  );
}
