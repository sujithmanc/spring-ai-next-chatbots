"use client";

import { useRouter } from "next/navigation";

export default function URLAppender({ url }) {
    const router = useRouter();
    const handleChange = (e) => {
        router.reload();
    };

    return (
        <>
            <h2>Current URL: {url}</h2>
            <button type="button" onClick={handleChange}>
                Go Back
            </button>
        </>
    );
}