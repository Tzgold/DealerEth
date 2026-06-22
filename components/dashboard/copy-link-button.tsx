"use client";

import { useState } from "react";

export function CopyLinkButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="de-btn de-btn-secondary min-h-8 px-3 py-1.5 text-xs"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M9 3a2 2 0 0 0-2 2v1H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H9Zm0 2h9v11h-1V8a2 2 0 0 0-2-2H9V5Zm-3 3h9v11H6V8Z"
        />
      </svg>
      {copied ? "Copied" : label}
    </button>
  );
}
