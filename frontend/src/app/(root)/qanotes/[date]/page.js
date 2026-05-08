import Link from "next/link";
import { qaNotes } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import db from "@/drizzle";
import FlipCard from "../components/FlipCard";
import CardGrid from "../components/CardGrid";
import Filters from "../cards/Filters";



export default async function DatePage({ params, searchParams }) {
  const { date } = await params;
  const values = await searchParams;
  const selected = values?.filter
    ? values.filter.split(",").filter(Boolean)
    : [];

  let notes = [];

  const conditions = [eq(qaNotes.date, date)];

  if (selected.length) {
    conditions.push(inArray(qaNotes.topic, selected));
  }

  notes = await db
    .select()
    .from(qaNotes)
    .where(and(...conditions))
    .orderBy(qaNotes.id);

  const result = await db
    .selectDistinct({ topic: qaNotes.topic })
    .from(qaNotes)
    .where(eq(qaNotes.date, date));;

  const options = result.map(r => r.topic);



  return (
    <div className="mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <Link href="/qanotes" className="btn btn-ghost btn-sm">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold mt-2">{date}</h1>
          <Filters selected={selected} options={options} />
          <pre>
            {JSON.stringify(selected, null, 3)}
          </pre>
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

      {
        notes.length > 0 && (
          <CardGrid notes={notes} />
        )
      }

    </div>
  );
}