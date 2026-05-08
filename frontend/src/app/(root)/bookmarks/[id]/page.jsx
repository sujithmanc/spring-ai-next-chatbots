import { getBookmarkById } from "../service";
import BookmarkDetails from "../components/BookmarkDetails";

export default async function BookmarkDetailsPage({ params }) {
  const { id } = await params;
  const bookmark = await getBookmarkById(id);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <BookmarkDetails bookmark={bookmark} />
          </div>
        </div>
      </div>
    </div>
  );
}