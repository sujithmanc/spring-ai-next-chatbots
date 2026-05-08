"use client";

import Link from "next/link";

export default function QaNotesError({ error, reset }) {
  console.error(error);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <div className="alert alert-error shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl font-bold">Error!</h2>

          <p>
            Something went wrong. Please cross check your database connection
            and configuration.
          </p>

          <div className="flex gap-2 mt-4">
            <button onClick={() => reset()} className="btn btn-sm btn-primary">
              Retry
            </button>

            <Link href="/" className="btn btn-sm btn-ghost">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}