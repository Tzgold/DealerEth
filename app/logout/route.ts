import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/session";

export async function GET() {
  await clearSessionCookie();
  redirect("/login");
}
