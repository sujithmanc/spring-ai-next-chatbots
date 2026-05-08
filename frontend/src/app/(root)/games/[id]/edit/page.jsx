import { getGameById } from "../../service";
import GameForm from "../../components/GameForm";
import { updateGameAction } from "../../actions";

export default async function EditGamePage({ params }) {
  const { id } = await params;
  const game = await getGameById(id);
  const boundAction = updateGameAction.bind(null, id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Game</h1>
      <GameForm action={boundAction} initialData={game} />
    </div>
  );
}
