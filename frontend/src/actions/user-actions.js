"use server";

import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createUserSchema, updateUserSchema } from "@/validations/user-schema";

export async function createUser(prevState, formData) {
  const raw = Object.fromEntries(formData);
  const parsed = createUserSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await db.insert(users).values(parsed.data);
  redirect("/users");
}

export async function updateUser(prevState, formData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateUserSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { id, ...data } = parsed.data;
  await db.update(users).set(data).where(eq(users.id, id));
  redirect("/users");
}

export async function deleteUser(id) {
  await db.delete(users).where(eq(users.id, id));
  redirect("/users");
}