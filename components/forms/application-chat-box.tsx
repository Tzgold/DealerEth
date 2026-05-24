"use client";

import { FormEvent, useEffect, useState } from "react";

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

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const text = String(formData.get("text") ?? "").trim();
    if (!text) {
      setLoading(false);
      return;
    }

    const response = await fetch(`/api/campaign-applications/${applicationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not send");
      setLoading(false);
      return;
    }

    const data = (await response.json()) as { message: Message };
    setMessages((prev) => [...prev, data.message]);
    event.currentTarget.reset();
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <ul className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3">
        {messages.length === 0 ? (
          <li className="text-sm text-white/50">No messages yet. Start the conversation.</li>
        ) : (
          messages.map((message) => (
            <li
              key={message.id}
              className={`rounded-lg px-3 py-2 text-sm ${
                message.senderRole === viewerRole ? "ml-4 bg-white/10 text-white" : "mr-4 bg-[#25F4EE]/10 text-white/90"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">
                {message.senderRole === "CREATOR" ? "Creator" : "Brand"}
              </p>
              <p className="mt-0.5 leading-6">{message.text}</p>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="text"
          placeholder="Type a message..."
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-900 hover:bg-white/90 disabled:opacity-60"
        >
          Send
        </button>
      </form>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  );
}
