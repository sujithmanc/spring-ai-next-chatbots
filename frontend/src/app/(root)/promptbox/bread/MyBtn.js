"use client";

export default function MyBtn({ name = "My Button", onClick }) {
    return (
        <button className="btn btn-primary" onClick={onClick}>
            {name}
        </button>
    );
}