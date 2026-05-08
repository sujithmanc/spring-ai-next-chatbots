"use client";

import { deleteUser } from "@/actions/user-actions";

export default function DeleteButton({ id }) {
  return (
    <form action={deleteUser.bind(null, id)}>
      <button type="submit" className="btn btn-sm btn-error">Delete</button>
    </form>
  );
}