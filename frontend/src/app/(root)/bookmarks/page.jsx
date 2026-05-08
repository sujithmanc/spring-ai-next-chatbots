import Link from "next/link";
import { getAllBookmarks } from "./service";
import BookmarkTable from "./components/BookmarkTable";

export default async function BookmarksPage() {
  const bookmarks = await getAllBookmarks();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Bookmarks</h1>
            <p className="text-base-content/60 mt-1">Manage your saved links</p>
          </div>
          <Link href="/bookmarks/new" className="btn btn-primary gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Bookmark
          </Link>
        </div>
        <BookmarkTable bookmarks={bookmarks} />
      </div>
    </div>
  );
}
