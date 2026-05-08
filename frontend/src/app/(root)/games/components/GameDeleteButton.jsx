"use client";

import { useTransition } from "react";
import { deleteGameAction } from "../actions";

export default function GameDeleteButton({ id }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this game?")) return;
    startTransition(() => deleteGameAction(id));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-sm btn-error"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
