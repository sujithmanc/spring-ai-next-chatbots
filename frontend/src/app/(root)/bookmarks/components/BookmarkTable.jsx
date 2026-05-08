import Link from "next/link";
import BookmarkDeleteButton from "./BookmarkDeleteButton";

export default function BookmarkTable({ bookmarks }) {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-lg font-semibold text-base-content/60">No bookmarks yet</h3>
          <p className="text-base-content/40">Add your first bookmark to get started.</p>
          <Link href="/bookmarks/new" className="btn btn-primary btn-sm mt-4">
            Add Bookmark
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Title</th>
              <th>URI</th>
              <th>Alt Text</th>
              <th>Color</th>
              <th>Date Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks.map((bookmark) => (
              <tr key={bookmark.id} className="hover">
                <td>
                  {bookmark.logo ? (
                    <div className="avatar">
                      <div className="w-8 h-8 rounded">
                        <img src={bookmark.logo} alt={bookmark.altText} />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: bookmark.altTextColor || "#0000FF" }}
                    >
                      {bookmark.altText}
                    </div>
                  )}
                </td>
                <td className="font-medium">{bookmark.title}</td>
                <td>
                  <span className="text-sm text-base-content/70 truncate max-w-[160px] block">
                    {bookmark.uri}
                  </span>
                </td>
                <td>
                  <div
                    className="badge text-white font-bold"
                    style={{ backgroundColor: bookmark.altTextColor || "#0000FF" }}
                  >
                    {bookmark.altText}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-base-300"
                      style={{ backgroundColor: bookmark.altTextColor || "#0000FF" }}
                    />
                    <span className="text-sm font-mono">{bookmark.altTextColor}</span>
                  </div>
                </td>
                <td className="text-sm text-base-content/60">
                  {new Date(bookmark.dateCreated).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/bookmarks/${bookmark.id}`}
                      className="btn btn-ghost btn-xs"
                      title="View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/bookmarks/${bookmark.id}/edit`}
                      className="btn btn-ghost btn-xs text-info"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <BookmarkDeleteButton id={bookmark.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
