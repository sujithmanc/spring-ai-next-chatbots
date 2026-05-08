import Link from "next/link";
import GameDeleteButton from "./GameDeleteButton";

export default function GameTable({ games }) {
  if (!games || games.length === 0) {
    return (
      <div className="alert alert-info">
        <span>No games found. Add one to get started.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Size</th>
            <th>Dev Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td>{game.name}</td>
              <td>{game.description || "-"}</td>
              <td>{game.size}</td>
              <td>{game.devTeam}</td>
              <td>
                <div className="flex gap-2">
                  <Link
                    href={`/games/${game.id}`}
                    className="btn btn-sm btn-info"
                  >
                    View
                  </Link>
                  <Link
                    href={`/games/${game.id}/edit`}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </Link>
                  <GameDeleteButton id={game.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
