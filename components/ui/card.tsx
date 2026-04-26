import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-3xl border border-black/10 bg-white p-5 shadow-sm", className)}>{children}</div>;
}
