"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ label = "Submit" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending && <span className="loading loading-spinner loading-sm" />}
      {pending ? "Saving..." : label}
    </button>
  );
}