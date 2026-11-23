"use client";

import { useEffect, useRef, useState } from "react";

function createWelcomeMessage() {
    return {
        role: "bot",
        text: "Hey there! I'm AIBot. Ask me anything 👋",
        ts: "Just now",
    };
}

function createConversation(name, id) {
    return {
        id,
        name,
        messages: [createWelcomeMessage()],
    };
}

function createConversationId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function timestamp() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatTabs() {
    const [conversations, setConversations] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [loadingIds, setLoadingIds] = useState([]);
    const [input, setInput] = useState("");
    const [showNameDialog, setShowNameDialog] = useState(false);
    const [newName, setNewName] = useState("");
    const bottomRef = useRef(null);
    const nameInputRef = useRef(null);
    const messageInputRef = useRef(null);
    const activeConversation = conversations.find((conversation) => conversation.id === activeId) || null;
    const isLoading = loadingIds.includes(activeConversation?.id);

    useEffect(() => {
        function handleAddChat() {
            setNewName("");
            setShowNameDialog(true);
        }

        window.addEventListener("chat:add", handleAddChat);
        return () => window.removeEventListener("chat:add", handleAddChat);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConversation?.messages, loadingIds, activeId]);

    useEffect(() => {
        if (showNameDialog) nameInputRef.current?.focus();
    }, [showNameDialog]);

    function createNamedConversation(event) {
        event.preventDefault();
        const name = newName.trim();
        if (!name) return;

        const conversation = createConversation(name, createConversationId());
        setConversations((previous) => [...previous, conversation]);
        setActiveId(conversation.id);
        setInput("");
        setShowNameDialog(false);
    }

    function closeConversation(id) {
        const index = conversations.findIndex((conversation) => conversation.id === id);
        const remaining = conversations.filter((conversation) => conversation.id !== id);
        setConversations(remaining);
        setLoadingIds((previous) => previous.filter((loadingId) => loadingId !== id));
        if (activeId === id) {
            setActiveId(remaining[Math.min(index, remaining.length - 1)]?.id ?? null);
            setInput("");
        }
    }

    async function sendMessage() {
        const text = input.trim();
        const conversationId = activeConversation?.id;
        if (!text || !conversationId || loadingIds.includes(conversationId)) return;
        const promptMessageId = createConversationId();

        setConversations((previous) =>
            previous.map((conversation) =>
                conversation.id === conversationId
                    ? {
                        ...conversation,
                        messages: [...conversation.messages, {
                            id: promptMessageId,
                            role: "user",
                            text,
                            ts: timestamp(),
                        }],
                    }
                    : conversation
            )
        );
        setInput("");
        if (messageInputRef.current) messageInputRef.current.style.height = "auto";
        setLoadingIds((previous) => [...previous, conversationId]);

        try {
            const response = await fetch(
                `http://localhost:8080/api/chat-memory/token-usage?message=${encodeURIComponent(text)}`,
                {
                    headers: {
                        Authorization: "Bearer YOUR_TOKEN",
                        "Content-Type": "application/json",
                        username: activeConversation.name,
                    },
                }
            );
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            if (
                typeof data?.message !== "string" ||
                !Number.isFinite(data.promptTokens) ||
                !Number.isFinite(data.completionTokens)
            ) {
                throw new Error("Invalid response received from server.");
            }

            setConversations((previous) =>
                previous.map((conversation) =>
                    conversation.id === conversationId
                        ? {
                            ...conversation,
                            messages: [
                                ...conversation.messages.map((message) =>
                                    message.id === promptMessageId
                                        ? { ...message, promptTokens: data.promptTokens }
                                        : message
                                ),
                                {
                                    role: "bot",
                                    text: data.message,
                                    completionTokens: data.completionTokens,
                                    ts: timestamp(),
                                },
                            ],
                        }
                        : conversation
                )
            );
        } catch (error) {
            console.info(error);
            appendBotMessage(conversationId, `⚠️ ${error.message}`, true);
        } finally {
            setLoadingIds((previous) => previous.filter((id) => id !== conversationId));
        }
    }

    function appendBotMessage(conversationId, text, error = false) {
        setConversations((previous) =>
            previous.map((conversation) =>
                conversation.id === conversationId
                    ? {
                        ...conversation,
                        messages: [
                            ...conversation.messages,
                            { role: "bot", text, ts: timestamp(), ...(error ? { error: true } : {}) },
                        ],
                    }
                    : conversation
            )
        );
    }

    function handleInputKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col bg-base-200">
            <header className="navbar flex-shrink-0 bg-base-100 shadow-sm">
                <div className="navbar-start gap-3">
                    <div className="avatar avatar-placeholder">
                        <div className="w-10 rounded-full bg-primary text-primary-content">
                            <span className="text-lg">🤖</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold leading-tight text-base-content">AIBot</p>
                        <p className="flex items-center gap-1 text-xs text-success">
                            <span className="status status-success status-xs"></span>
                            Online
                        </p>
                    </div>
                </div>
                <div className="navbar-end">
                    <span className="badge badge-ghost badge-sm">localhost:8080</span>
                </div>
            </header>

            {conversations.length === 0 ? (
                <main className="flex flex-1 items-center justify-center px-6 text-center">
                    <div className="max-w-md">
                        <div className="avatar avatar-placeholder mb-4">
                            <div className="w-16 rounded-full bg-primary text-primary-content">
                                <span className="text-3xl">🤖</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold">No chats yet</h2>
                        <p className="mt-2 text-sm text-base-content/60">
                            Select <span className="font-semibold">Add Chat</span> in the navigation bar to start a conversation.
                        </p>
                    </div>
                </main>
            ) : (
                <>
                    <div className="flex flex-shrink-0 items-center border-b border-base-300 bg-base-100 px-3 pt-2">
                        <div
                            role="tablist"
                            aria-label="Chat conversations"
                            className="tabs tabs-boxed min-w-0 flex-nowrap overflow-x-auto"
                        >
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    role="presentation"
                                    className={`flex flex-shrink-0 items-center rounded-t-lg ${
                                        conversation.id === activeId ? "bg-base-200" : "bg-base-100"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={conversation.id === activeId}
                                        className={`tab max-w-48 truncate ${
                                            conversation.id === activeId ? "tab-active" : ""
                                        }`}
                                        onClick={() => {
                                            setActiveId(conversation.id);
                                            setInput("");
                                        }}
                                        title={conversation.name}
                                    >
                                        {conversation.name}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs px-1"
                                        aria-label={`Close ${conversation.name}`}
                                        title="Close chat"
                                        onClick={() => closeConversation(conversation.id)}
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
                        {activeConversation?.messages.map((message, index) =>
                            message.role === "bot" ? (
                                <div key={message.id || `${activeConversation.id}-${index}`} className="chat chat-start">
                                    <div className="chat-image avatar avatar-placeholder">
                                        <div className="w-9 rounded-full bg-neutral text-neutral-content">
                                            <span>🤖</span>
                                        </div>
                                    </div>
                                    <div className="chat-header mb-0.5 text-xs opacity-50">AIBot</div>
                                    <div className={`chat-bubble ${message.error ? "chat-bubble-error" : "chat-bubble-neutral"}`}>
                                        {message.text}
                                    </div>
                                    <div className="chat-footer mt-0.5 text-xs">
                                        {message.ts}
                                        {Number.isFinite(message.completionTokens) && <span>Completion Tokens: {message.completionTokens}</span>}
                                    </div>
                                </div>
                            ) : (
                                <div key={message.id || `${activeConversation.id}-${index}`} className="chat chat-end">
                                    <div className="chat-image avatar avatar-placeholder">
                                        <div className="w-9 rounded-full bg-primary text-primary-content">
                                            <span>🧑</span>
                                        </div>
                                    </div>
                                    <div className="chat-header mb-0.5 text-xs opacity-50">You</div>
                                    <div className="chat-bubble chat-bubble-primary">{message.text}</div>
                                    <div className="chat-footer mt-0.5 text-xs">
                                        {message.ts}
                                        {Number.isFinite(message.promptTokens) && <span>Prompt Tokens: {message.promptTokens}</span>}
                                    </div>
                                </div>
                            )
                        )}

                        {isLoading && (
                            <div className="chat chat-start">
                                <div className="chat-image avatar avatar-placeholder">
                                    <div className="w-9 rounded-full bg-neutral text-neutral-content">
                                        <span>🤖</span>
                                    </div>
                                </div>
                                <div className="chat-bubble chat-bubble-neutral">
                                    <span className="loading loading-dots loading-sm"></span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </main>

                    <footer className="flex-shrink-0 border-t border-base-300 bg-base-100 px-4 py-3">
                        <div className="mx-auto flex max-w-3xl items-end gap-2">
                            <textarea
                                ref={messageInputRef}
                                className="textarea textarea-bordered flex-1 resize-none"
                                placeholder="Type a message…"
                                rows={1}
                                value={input}
                                onChange={(event) => {
                                    setInput(event.target.value);
                                    event.target.style.height = "auto";
                                    event.target.style.height = `${event.target.scrollHeight}px`;
                                }}
                                onKeyDown={handleInputKeyDown}
                            />
                            <button
                                type="button"
                                className="btn btn-primary btn-square"
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                aria-label="Send"
                            >
                                {isLoading ? (
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
                                        className="h-5 w-5"
                                    >
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="mt-2 text-center text-xs text-base-content/30">
                            Enter to send · Shift+Enter for new line
                        </p>
                    </footer>
                </>
            )}

            {showNameDialog && (
                <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="new-chat-title">
                    <div className="modal-box">
                        <h2 id="new-chat-title" className="text-lg font-bold">Name your new chat</h2>
                        <form onSubmit={createNamedConversation}>
                            <label className="form-control mt-4 w-full">
                                <span className="label-text mb-2">Chat name</span>
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="For example, Project ideas"
                                    value={newName}
                                    maxLength={40}
                                    onChange={(event) => setNewName(event.target.value)}
                                    required
                                />
                            </label>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setShowNameDialog(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={!newName.trim()}>
                                    Create chat
                                </button>
                            </div>
                        </form>
                    </div>
                    <button
                        type="button"
                        className="modal-backdrop"
                        aria-label="Close dialog"
                        onClick={() => setShowNameDialog(false)}
                    />
                </div>
            )}
        </div>
    );
}
