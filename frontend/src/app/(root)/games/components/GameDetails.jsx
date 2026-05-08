import Link from "next/link";

export default function GameDetails({ game }) {
  return (
    <div className="card bg-base-100 shadow-md max-w-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">{game.name}</h2>

        <div className="divider my-1" />

        <div className="flex flex-col gap-3">
          <div>
            <span className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">
              Description
            </span>
            <p className="mt-1">{game.description || "—"}</p>
          </div>

          <div>
            <span className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">
              Size
            </span>
            <p className="mt-1">{game.size}</p>
          </div>

          <div>
            <span className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">
              Dev Team
            </span>
            <p className="mt-1">{game.devTeam}</p>
          </div>

          <div>
            <span className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">
              Date Created
            </span>
            <p className="mt-1">{new Date(game.dateCreated).toLocaleString()}</p>
          </div>

          <div>
            <span className="font-semibold text-sm text-base-content/60 uppercase tracking-wide">
              Last Updated
            </span>
            <p className="mt-1">{new Date(game.lastUpdated).toLocaleString()}</p>
          </div>
        </div>

        <div className="card-actions mt-4 flex gap-2">
          <Link href={`/games/${game.id}/edit`} className="btn btn-warning btn-sm">
            Edit
          </Link>
          <Link href="/games" className="btn btn-ghost btn-sm">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
