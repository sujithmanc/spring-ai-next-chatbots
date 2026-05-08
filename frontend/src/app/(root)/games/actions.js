"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createGame, updateGame, deleteGame } from "./service";

const GameSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters"),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  size: z
    .string()
    .min(1, "Size is required")
    .max(50, "Size must not exceed 50 characters"),
  devTeam: z
    .string()
    .min(1, "Dev team is required")
    .max(255, "Dev team must not exceed 255 characters"),
});

export async function createGameAction(prevState, formData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    size: formData.get("size"),
    devTeam: formData.get("devTeam"),
  };

  const result = GameSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: raw };
  }

  await createGame(result.data);
  redirect("/games");
}

export async function updateGameAction(id, prevState, formData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    size: formData.get("size"),
    devTeam: formData.get("devTeam"),
  };

  const result = GameSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: raw };
  }

  await updateGame(id, result.data);
  redirect("/games");
}

export async function deleteGameAction(id) {
  await deleteGame(id);
  redirect("/games");
}
