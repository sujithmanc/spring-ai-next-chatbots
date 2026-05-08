import Link from "next/link";

import { qaNotes } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import db from "@/drizzle";

export default async function QaNotesPage() {
    const data = await db
        .select({
            date: qaNotes.date,
            count: sql`count(*)`.as("count"),
        })
        .from(qaNotes)
        .groupBy(qaNotes.date)
        .orderBy(sql`${qaNotes.date} desc`);

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">QA Notes</h1>
                <div className="flex gap-2">
                    <Link href="/qanotes/topics" className="btn btn-secondary">
                        + Topic
                    </Link>
                    <Link href="/qanotes/create" className="btn btn-primary">
                        + New
                    </Link>
                </div>
            </div>

            {/* Empty State */}
            {data.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No notes yet. Start by creating one.
                </div>
            )}

            {/* Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item) => (
                    <Link
                        key={item.date}
                        href={`/qanotes/${item.date}`}
                        className="block"
                    >
                        <div className="card bg-base-100 shadow hover:shadow-md transition h-full">
                            <div className="card-body flex flex-row justify-between items-center">
                                <span className="font-medium">{item.date}</span>
                                <span className="badge badge-primary">
                                    {item.count} notes
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}