"use client";

import { useActionState } from "react";
import SubmitButton from "./submit-button";

export default function UserForm({ action, defaultValues = {}, userId }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      {userId && <input type="hidden" name="id" value={userId} />}

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Name</legend>
        <input name="name" defaultValue={defaultValues.name}
          className="input input-bordered w-full" />
        {state?.errors?.name && (
          <p className="text-error text-sm">{state.errors.name[0]}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Username</legend>
        <input name="username" defaultValue={defaultValues.username}
          className="input input-bordered w-full" />
        {state?.errors?.username && (
          <p className="text-error text-sm">{state.errors.username[0]}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input name="email" type="email" defaultValue={defaultValues.email}
          className="input input-bordered w-full" />
        {state?.errors?.email && (
          <p className="text-error text-sm">{state.errors.email[0]}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Date of Birth</legend>
        <input name="dob" type="date" defaultValue={defaultValues.dob}
          className="input input-bordered w-full" />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Gender</legend>
        <select name="gender" defaultValue={defaultValues.gender}
          className="select select-bordered w-full">
          <option value="">Select gender</option>
          {["Male", "Female", "Other"].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Role</legend>
        <select name="role" defaultValue={defaultValues.role ?? "guest"}
          className="select select-bordered w-full">
          {["guest", "user", "admin"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Skills (comma separated)</legend>
        <input name="skills"
          defaultValue={defaultValues.skills?.join(", ")}
          className="input input-bordered w-full"
          placeholder="React, Node.js, MySQL" />
      </fieldset>

      <SubmitButton label={userId ? "Update User" : "Create User"} />
    </form>
  );
}