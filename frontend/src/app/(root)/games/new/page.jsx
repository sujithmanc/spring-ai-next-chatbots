import GameForm from "../components/GameForm";
import { createGameAction } from "../actions";

export default function NewGamePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Game</h1>
      <GameForm action={createGameAction} />
    </div>
  );
}
