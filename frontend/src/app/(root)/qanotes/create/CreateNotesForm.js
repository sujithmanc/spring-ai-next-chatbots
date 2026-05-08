"use client";

import { useActionState } from "react";
import { createNotes } from "../action";

const initialState = {
    success: false,
    message: "",
};

export default function CreateNotesForm({ topics }) {
    const [state, formAction, isPending] = useActionState(
        createNotes,
        initialState
    );

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create QA Notes</h1>

            <form action={formAction} className="space-y-4">

                {/* Date */}
                <div>
                    <label className="label">
                        <span className="label-text">Date</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={today}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Topic Dropdown */}
                <div>
                    <label className="label">
                        <span className="label-text">Topic</span>
                    </label>
                    <select
                        name="topic"
                        className="select select-bordered w-full"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select a topic
                        </option>

                        {topics?.map((topic) => (
                            <option key={topic.id} value={topic.name}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Textarea */}
                <div>
                    <label className="label">
                        <span className="label-text">Notes</span>
                    </label>
                    <textarea
                        name="content"
                        rows={12}
                        placeholder={`Q: What did I learn today?
A: ...

Q: What mistake did I make?
A: ...`}
                        className="textarea textarea-bordered w-full font-mono"
                        required
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <a href="/qanotes" className="btn btn-ghost">
                        Cancel
                    </a>

                    <button
                        type="submit"
                        className={`btn btn-primary ${isPending ? "loading" : ""}`}
                    >
                        {isPending ? "Saving..." : "Save Notes"}
                    </button>
                </div>

                {/* Feedback */}
                {state?.message && (
                    <div
                        className={`alert ${state.success ? "alert-success" : "alert-error"
                            }`}
                    >
                        {state.message}
                    </div>
                )}
            </form>
        </div>
    );
}