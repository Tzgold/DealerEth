"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

const DEFAULT_NICHES = [
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Food & Cooking",
  "Tech",
  "Gaming",
  "Comedy",
  "Music",
  "Dance",
  "Fitness",
  "Health & Wellness",
  "Travel",
  "Education",
  "Finance",
  "Business",
  "Parenting",
  "Relationships",
  "Cars",
  "Sports",
  "Art & Design",
  "Photography",
  "ASMR",
  "Pets",
  "Home & DIY",
  "Entertainment",
  "News & Politics",
  "Motivation",
  "Skincare",
  "Makeup",
  "Streetwear",
];

export const CREATOR_NICHES = DEFAULT_NICHES;

export const BRAND_INDUSTRIES = [
  "Fashion",
  "Beauty & Cosmetics",
  "Food & Beverage",
  "Tech & Gadgets",
  "Fintech",
  "E-commerce",
  "Health & Wellness",
  "Education",
  "Entertainment",
  "Travel & Hospitality",
  "Automotive",
  "Sports",
  "Retail",
  "FMCG",
  "Real Estate",
  "Media",
  "Telecom",
  "NGO / Social impact",
];

export function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
  name,
  allowCustom = true,
  className = "de-field",
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  allowCustom?: boolean;
  className?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.toLowerCase().includes(q));
  }, [options, query]);

  const exactMatch = options.some((option) => option.toLowerCase() === query.trim().toLowerCase());
  const showCustom = allowCustom && query.trim().length > 0 && !exactMatch;

  function commit(next: string) {
    const cleaned = next.trim();
    onChange(cleaned);
    setQuery(cleaned);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const total = filtered.length + (showCustom ? 1 : 0);
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((prev) => (total === 0 ? 0 : (prev + 1) % total));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((prev) => (total === 0 ? 0 : (prev - 1 + total) % total));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (showCustom && highlight === 0) {
        commit(query);
      } else {
        const index = showCustom ? highlight - 1 : highlight;
        const option = filtered[index];
        if (option) commit(option);
        else if (allowCustom) commit(query);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery(value);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        name={name}
        className={className}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={query}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        role="combobox"
        onFocus={() => {
          setOpen(true);
          setHighlight(0);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange(event.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          // Keep typed custom value; close handled by outside click / selection.
        }}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label="Open suggestions"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-black/45 transition hover:bg-black/5 hover:text-black"
        onClick={() => {
          setOpen((prev) => !prev);
          setHighlight(0);
        }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>

      {open && !disabled ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-black/10 bg-[#f7f6f2] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          {showCustom ? (
            <li>
              <button
                type="button"
                role="option"
                aria-selected={highlight === 0}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${highlight === 0 ? "bg-black text-white" : "text-black/80 hover:bg-black/5"}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commit(query)}
              >
                <span>Use “{query.trim()}”</span>
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">Custom</span>
              </button>
            </li>
          ) : null}

          {filtered.length === 0 && !showCustom ? (
            <li className="px-3 py-2 text-sm text-black/45">No matches. Keep typing your own niche.</li>
          ) : (
            filtered.map((option, index) => {
              const optionIndex = showCustom ? index + 1 : index;
              const active = highlight === optionIndex;
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${active ? "bg-black text-white" : "text-black/80 hover:bg-black/5"}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => commit(option)}
                  >
                    {option}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
