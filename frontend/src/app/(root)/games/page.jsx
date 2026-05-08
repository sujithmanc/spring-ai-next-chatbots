import Link from "next/link";
import { getAllGames } from "./service";
import GameTable from "./components/GameTable";

export default async function GamesPage() {
  const games = await getAllGames();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Games</h1>
        <Link href="/games/new" className="btn btn-primary">
          Add Game
        </Link>
      </div>
      <GameTable games={games} />
    </div>
  );
}
