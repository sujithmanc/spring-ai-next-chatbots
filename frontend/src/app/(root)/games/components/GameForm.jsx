"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export default function GameForm({ action, initialData }) {
  const [state, formAction] = useActionState(action, { errors: {}, values: {} });

  const values = {
    name: state.values?.name ?? initialData?.name ?? "",
    description: state.values?.description ?? initialData?.description ?? "",
    size: state.values?.size ?? initialData?.size ?? "",
    devTeam: state.values?.devTeam ?? initialData?.devTeam ?? "",
  };

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      {/* Name */}
      <div className="form-control">
        <label className="label" htmlFor="name">
          <span className="label-text">Name <span className="text-error">*</span></span>
        </label>
        <input
          id="name"
          name="name"
          className="input input-bordered"
          defaultValue={values.name}
          key={values.name}
          placeholder="Enter game name"
        />
        {state?.errors?.name && (
          <p className="text-error text-sm mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label" htmlFor="description">
          <span className="label-text">Description</span>
        </label>
        <textarea
          id="description"
          name="description"
          className="textarea textarea-bordered"
          defaultValue={values.description}
          key={values.description}
          placeholder="Enter description (optional)"
          rows={4}
        />
        {state?.errors?.description && (
          <p className="text-error text-sm mt-1">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Size */}
      <div className="form-control">
        <label className="label" htmlFor="size">
          <span className="label-text">Size <span className="text-error">*</span></span>
        </label>
        <input
          id="size"
          name="size"
          className="input input-bordered"
          defaultValue={values.size}
          key={values.size}
          placeholder="e.g. Small, Medium, Large"
        />
        {state?.errors?.size && (
          <p className="text-error text-sm mt-1">{state.errors.size[0]}</p>
        )}
      </div>

      {/* Dev Team */}
      <div className="form-control">
        <label className="label" htmlFor="devTeam">
          <span className="label-text">Dev Team <span className="text-error">*</span></span>
        </label>
        <input
          id="devTeam"
          name="devTeam"
          className="input input-bordered"
          defaultValue={values.devTeam}
          key={values.devTeam}
          placeholder="Enter dev team name"
        />
        {state?.errors?.devTeam && (
          <p className="text-error text-sm mt-1">{state.errors.devTeam[0]}</p>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        <SubmitButton />
        <Link href="/games" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
