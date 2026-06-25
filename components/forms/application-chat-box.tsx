"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  senderRole: "CREATOR" | "CLIENT";
  text: string;
  createdAt: string;
};

export function ApplicationChatBox({
  applicationId,
  initialMessages,
  viewerRole,
}: {
  applicationId: string;
  initialMessages: Message[];
  viewerRole: "CREATOR" | "CLIENT";
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const latestMessage = messages[messages.length - 1];
  const needsViewerReply = latestMessage ? latestMessage.senderRole !== viewerRole : false;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const text = String(formData.get("text") ?? "").trim();
    if (!text) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/campaign-applications/${applicationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not send");
        return;
      }

      const data = (await response.json()) as { message: Message };
      setMessages((prev) => [...prev, data.message]);
      form.reset();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Thread activity</p>
          <p className="mt-1 text-sm text-white/65">
            {messages.length === 0
              ? "Start with a clear note so the next step is easy."
              : needsViewerReply
                ? "The latest message is waiting on your reply."
                : "You sent the latest message."}
          </p>
        </div>
        {needsViewerReply && (
          <span className="rounded-full border border-white/20 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-950">
            Reply needed
          </span>
        )}
      </div>
      <ul ref={listRef} className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3">
        {messages.length === 0 ? (
          <li className="text-sm text-white/50">No messages yet. Start the conversation.</li>
        ) : (
          messages.map((message) => (
            <li
              key={message.id}
              className={`rounded-lg px-3 py-2 text-sm ${
                message.senderRole === viewerRole ? "ml-4 bg-white/10 text-white" : "mr-4 border border-white/10 bg-white/[0.04] text-white/90"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">
                {message.senderRole === "CREATOR" ? "Creator" : "Brand"}
              </p>
              <p className="mt-0.5 leading-6">{message.text}</p>
              <time className="mt-1 block text-[10px] text-white/35" dateTime={message.createdAt}>
                {new Date(message.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
              </time>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="text"
          required
          maxLength={2000}
          placeholder="Type a message..."
          className="de-field min-w-0 flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="de-btn de-btn-primary shrink-0"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  );
}
