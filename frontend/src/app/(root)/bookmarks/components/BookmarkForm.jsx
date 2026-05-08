"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Saving...
        </>
      ) : (
        "Save Bookmark"
      )}
    </button>
  );
}

export default function BookmarkForm({ action, initialData }) {
  const [state, formAction] = useActionState(action, { errors: {}, values: {} });

  const values = {
    title: state.values?.title ?? initialData?.title ?? "",
    uri: state.values?.uri ?? initialData?.uri ?? "",
    logo: state.values?.logo ?? initialData?.logo ?? "",
    altText: state.values?.altText ?? initialData?.altText ?? "",
    altTextColor: state.values?.altTextColor ?? initialData?.altTextColor ?? "#0000FF",
  };

  return (
    <form action={formAction} className="space-y-5">
      {/* Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Title <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          name="title"
          defaultValue={values.title}
          key={`title-${values.title}`}
          placeholder="My Bookmark"
          className={`input input-bordered w-full ${state?.errors?.title ? "input-error" : ""}`}
        />
        {state?.errors?.title && (
          <label className="label">
            <span className="label-text-alt text-error">{state.errors.title[0]}</span>
          </label>
        )}
      </div>

      {/* URI */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            URI <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          name="uri"
          defaultValue={values.uri}
          key={`uri-${values.uri}`}
          placeholder="https://example.com"
          className={`input input-bordered w-full ${state?.errors?.uri ? "input-error" : ""}`}
        />
        {state?.errors?.uri && (
          <label className="label">
            <span className="label-text-alt text-error">{state.errors.uri[0]}</span>
          </label>
        )}
      </div>

      {/* Logo */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Logo URL</span>
          <span className="label-text-alt text-base-content/50">Optional</span>
        </label>
        <input
          type="text"
          name="logo"
          defaultValue={values.logo}
          key={`logo-${values.logo}`}
          placeholder="https://example.com/logo.png"
          className="input input-bordered w-full"
        />
        {state?.errors?.logo && (
          <label className="label">
            <span className="label-text-alt text-error">{state.errors.logo[0]}</span>
          </label>
        )}
      </div>

      {/* Alt Text & Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">
              Alt Text <span className="text-error">*</span>
            </span>
            <span className="label-text-alt text-base-content/50">Exactly 2 chars</span>
          </label>
          <input
            type="text"
            name="altText"
            defaultValue={values.altText}
            key={`altText-${values.altText}`}
            placeholder="AB"
            maxLength={2}
            className={`input input-bordered w-full ${state?.errors?.altText ? "input-error" : ""}`}
          />
          {state?.errors?.altText && (
            <label className="label">
              <span className="label-text-alt text-error">{state.errors.altText[0]}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Alt Text Color</span>
            <span className="label-text-alt text-base-content/50">Hex, e.g. #0000FF</span>
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              name="altTextColorPicker"
              defaultValue={values.altTextColor}
              className="input input-bordered w-14 p-1 cursor-pointer"
              onChange={(e) => {
                const textInput = e.target.closest("div").querySelector("input[name=altTextColor]");
                if (textInput) textInput.value = e.target.value;
              }}
            />
            <input
              type="text"
              name="altTextColor"
              defaultValue={values.altTextColor}
              key={`altTextColor-${values.altTextColor}`}
              placeholder="#0000FF"
              className={`input input-bordered flex-1 font-mono ${state?.errors?.altTextColor ? "input-error" : ""}`}
            />
          </div>
          {state?.errors?.altTextColor && (
            <label className="label">
              <span className="label-text-alt text-error">{state.errors.altTextColor[0]}</span>
            </label>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <SubmitButton />
        <Link href="/bookmarks" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
