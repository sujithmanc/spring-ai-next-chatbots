import Link from "next/link";

export default function BookmarkDetails({ bookmark }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {bookmark.logo ? (
          <div className="avatar">
            <div className="w-16 h-16 rounded-xl">
              <img src={bookmark.logo} alt={bookmark.altText} />
            </div>
          </div>
        ) : (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow"
            style={{ backgroundColor: bookmark.altTextColor || "#0000FF" }}
          >
            {bookmark.altText}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-base-content">{bookmark.title}</h2>
          <a
            href={bookmark.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm break-all"
          >
            {bookmark.uri}
          </a>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">ID</div>
          <div className="stat-value text-lg font-mono">#{bookmark.id}</div>
        </div>

        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Alt Text</div>
          <div className="stat-value text-lg">
            <div
              className="badge badge-lg text-white font-bold"
              style={{ backgroundColor: bookmark.altTextColor || "#0000FF" }}
            >
              {bookmark.altText}
            </div>
          </div>
        </div>

        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Alt Text Color</div>
          <div className="stat-value text-lg flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border border-base-300 shadow-sm"
              style={{ backgroundColor: bookmark.altTextColor || "#0000FF" }}
            />
            <span className="font-mono text-base">{bookmark.altTextColor}</span>
          </div>
        </div>

        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Logo URL</div>
          <div className="stat-value text-sm font-mono break-all">
            {bookmark.logo || <span className="text-base-content/40 italic text-base">None</span>}
          </div>
        </div>

        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Date Created</div>
          <div className="stat-value text-base">
            {new Date(bookmark.dateCreated).toLocaleString()}
          </div>
        </div>

        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Last Updated</div>
          <div className="stat-value text-base">
            {new Date(bookmark.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Link href={`/bookmarks/${bookmark.id}/edit`} className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Link>
        <Link href="/bookmarks" className="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Bookmarks
        </Link>
      </div>
    </div>
  );
}
