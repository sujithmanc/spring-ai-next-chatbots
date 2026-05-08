import Link from "next/link";
import { qaNotes } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import db from "@/drizzle";

export default async function DatePage({ params }) {
  const { date } = await params;

  const notes = await db
    .select()
    .from(qaNotes)
    .where(eq(qaNotes.date, date))
    .orderBy(qaNotes.id);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <Link href="/qanotes" className="btn btn-ghost btn-sm">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold mt-2">{date}</h1>
        </div>

        <Link href="/qanotes/create" className="btn btn-primary btn-sm">
          + Add More
        </Link>
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No notes for this date.
        </div>
      )}

      {/* Accordion */}
      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            {/* 🔥 Radio = only one open at a time */}
            <input type="radio" name="qa-accordion" />

            {/* Question */}
            <div className="collapse-title font-semibold">
              {note.que}
            </div>

            {/* Answer */}
            <div className="collapse-content text-sm whitespace-pre-line">
              {note.ans}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}