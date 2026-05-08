"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createBookmark, updateBookmark, deleteBookmark } from "./service";

const BookmarkSchema = z.object({
  title: z.string().min(1, "Title must not be blank"),
  uri: z.string().min(1, "URI must not be blank"),
  logo: z.string().optional(),
  altText: z
    .string()
    .min(1, "altText must not be blank")
    .length(2, "altText must be exactly 2 characters"),
  altTextColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "altTextColor must be a valid hex color like #0000FF")
    .optional()
    .default("#0000FF"),
});

export async function createBookmarkAction(prevState, formData) {
  const raw = {
    title: formData.get("title"),
    uri: formData.get("uri"),
    logo: formData.get("logo") || undefined,
    altText: formData.get("altText"),
    altTextColor: formData.get("altTextColor") || "#0000FF",
  };

  const result = BookmarkSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: raw };
  }

  await createBookmark(result.data);
  redirect("/bookmarks");
}

export async function updateBookmarkAction(id, prevState, formData) {
  const raw = {
    title: formData.get("title"),
    uri: formData.get("uri"),
    logo: formData.get("logo") || undefined,
    altText: formData.get("altText"),
    altTextColor: formData.get("altTextColor") || "#0000FF",
  };

  const result = BookmarkSchema.safeParse(raw);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: raw };
  }

  await updateBookmark(id, result.data);
  redirect("/bookmarks");
}

export async function deleteBookmarkAction(id) {
  await deleteBookmark(id);
  redirect("/bookmarks");
}
