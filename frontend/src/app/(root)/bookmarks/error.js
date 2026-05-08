"use client";

import Link from "next/link";

export default function BookmarkError({ error, reset }) {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="card bg-base-100 shadow-sm w-full max-w-md">
                <div className="card-body items-center text-center gap-4">

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <div>
                        <h2 className="text-xl font-bold text-base-content">Server Unavailable</h2>
                        <p className="text-base-content/60 mt-1 text-sm">
                            Could not connect to the Bookmarks API at{" "}
                            <code className="font-mono text-xs bg-base-200 px-1.5 py-0.5 rounded">
                                http://localhost:9090/api/bookmarks
                            </code>
                        </p>
                    </div>

                    {/* Error detail */}
                    {error?.message && (
                        <div className="alert alert-error alert-soft w-full text-left text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                            </svg>
                            <span>{error.message}</span>
                        </div>
                    )}

                    {/* Hint */}
                    <p className="text-base-content/50 text-xs">
                        Make sure your Spring Boot server is running on port{" "}
                        <span className="font-semibold text-base-content/70">9090</span>.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 w-full pt-2">
                        <button onClick={reset} className="btn btn-primary flex-1 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry
                        </button>
                        <Link href="/" className="btn btn-ghost flex-1 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}