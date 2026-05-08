"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hey there! I'm AIBot. Ask me anything 👋", ts: now() },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    function now() {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function sendMessage() {
        const text = input.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text, ts: now() }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:8080/api/v2/simple-chat?message=${encodeURIComponent(text)}`,
                {
                    headers: {
                        "Authorization": "Bearer YOUR_TOKEN",
                        "Content-Type": "application/json",
                        "username" : "Sujith"
                    }
                }
            );
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.text();
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: data || "No response received.", ts: now() },
            ]);
        } catch (err) {
            console.info(err);
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: `⚠️ ${err.message}`, ts: now(), error: true },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex flex-col h-dvh bg-base-200">

            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-sm flex-shrink-0">
                <div className="navbar-start gap-3">
                    <div className="avatar avatar-placeholder">
                        <div className="bg-primary text-primary-content w-10 rounded-full">
                            <span className="text-lg">🤖</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-base-content leading-tight">AIBot</p>
                        <p className="text-xs text-success flex items-center gap-1">
                            <span className="status status-success status-xs"></span>
                            Online
                        </p>
                    </div>
                </div>
                <div className="navbar-end">
                    <span className="badge badge-ghost badge-sm">localhost:8080</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
                {messages.map((msg, i) =>
                    msg.role === "bot" ? (
                        <div key={i} className="chat chat-start">
                            <div className="chat-image avatar avatar-placeholder">
                                <div className="bg-neutral text-neutral-content w-9 rounded-full">
                                    <span>🤖</span>
                                </div>
                            </div>
                            <div className="chat-header text-xs opacity-50 mb-0.5">AIBot</div>
                            <div
                                className={`chat-bubble ${msg.error ? "chat-bubble-error" : "chat-bubble-neutral"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <div className="chat-footer text-xs opacity-40 mt-0.5">{msg.ts}</div>
                        </div>
                    ) : (
                        <div key={i} className="chat chat-end">
                            <div className="chat-image avatar avatar-placeholder">
                                <div className="bg-primary text-primary-content w-9 rounded-full">
                                    <span>🧑</span>
                                </div>
                            </div>
                            <div className="chat-header text-xs opacity-50 mb-0.5">You</div>
                            <div className="chat-bubble chat-bubble-primary">{msg.text}</div>
                            <div className="chat-footer text-xs opacity-40 mt-0.5">{msg.ts}</div>
                        </div>
                    )
                )}

                {/* Typing indicator */}
                {loading && (
                    <div className="chat chat-start">
                        <div className="chat-image avatar avatar-placeholder">
                            <div className="bg-neutral text-neutral-content w-9 rounded-full">
                                <span>🤖</span>
                            </div>
                        </div>
                        <div className="chat-bubble chat-bubble-neutral">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="bg-base-100 border-t border-base-300 px-4 py-3 flex-shrink-0">
                <div className="flex gap-2 items-end max-w-3xl mx-auto">
                    <textarea
                        className="textarea textarea-bordered flex-1 resize-none"
                        placeholder="Type a message…"
                        rows={1}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="btn btn-primary btn-square"
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        aria-label="Send"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-5 h-5"
                            >
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="text-center text-xs text-base-content/30 mt-2">
                    Enter to send · Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}