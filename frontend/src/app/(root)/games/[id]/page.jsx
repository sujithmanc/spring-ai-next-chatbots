import { getGameById } from "../service";
import GameDetails from "../components/GameDetails";

export default async function GameDetailsPage({ params }) {
  const { id } = await params;
  const game = await getGameById(id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Game Details</h1>
      <GameDetails game={game} />
    </div>
  );
}
