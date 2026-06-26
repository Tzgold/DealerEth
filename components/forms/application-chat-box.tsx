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
  const otherRoleLabel = viewerRole === "CLIENT" ? "Creator" : "Brand";

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
    <div className="de-chat-surface overflow-hidden rounded-2xl border border-white/10 bg-[#efeee8]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.42] px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Conversation</p>
          <p className="mt-1 text-sm text-white/65">
            {messages.length === 0
              ? `Start the conversation with a clear note to the ${otherRoleLabel.toLowerCase()}.`
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
      <ul ref={listRef} className="max-h-[460px] min-h-[320px] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(17,17,15,0.018))] px-4 py-5">
        {messages.length === 0 ? (
          <li className="flex min-h-[240px] items-center justify-center text-center">
            <div className="max-w-sm rounded-2xl border border-dashed border-white/15 px-5 py-6">
              <p className="text-sm font-bold text-white">No messages yet</p>
              <p className="mt-1 text-sm leading-6 text-white/50">Send the first message to keep this application moving.</p>
            </div>
          </li>
        ) : (
          messages.map((message) => (
            <li
              key={message.id}
              className={`flex ${message.senderRole === viewerRole ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm sm:max-w-[68%] ${
                  message.senderRole === viewerRole
                    ? "de-chat-bubble-self rounded-br-md bg-[#242421] text-white"
                    : "de-chat-bubble-other rounded-bl-md border border-white/70 bg-white/80 text-zinc-950"
              }`}
            >
                <p className={`text-[10px] font-bold uppercase tracking-wide ${message.senderRole === viewerRole ? "text-white/45" : "text-zinc-500"}`}>
                  {message.senderRole === viewerRole ? "You" : message.senderRole === "CREATOR" ? "Creator" : "Brand"}
                </p>
                <p className="mt-1 whitespace-pre-wrap leading-6">{message.text}</p>
                <time className={`mt-2 block text-[10px] ${message.senderRole === viewerRole ? "text-white/35" : "text-zinc-500"}`} dateTime={message.createdAt}>
                  {new Date(message.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 bg-white/[0.55] p-3">
        <textarea name="text" required maxLength={2000} rows={1} placeholder="Write a message..." className="de-field min-h-12 min-w-0 flex-1 resize-none rounded-2xl" />
        <button
          type="submit"
          disabled={loading}
          className="de-btn de-btn-primary min-h-12 shrink-0 rounded-2xl px-5"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {error && <p className="border-t border-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
