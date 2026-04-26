import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-zinc-400 focus:border-black/30 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
