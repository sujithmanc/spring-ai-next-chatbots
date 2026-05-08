import Link from "next/link";
import BookmarkForm from "../components/BookmarkForm";
import { createBookmarkAction } from "../actions";

export default function NewBookmarkPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/bookmarks" className="btn btn-ghost btn-sm gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-base-content">New Bookmark</h1>
          <p className="text-base-content/60 mt-1">Add a new bookmark to your collection</p>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <BookmarkForm action={createBookmarkAction} />
          </div>
        </div>
      </div>
    </div>
  );
}
