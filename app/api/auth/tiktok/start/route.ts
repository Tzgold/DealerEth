import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTikTokAuthConfig } from "@/lib/tiktok";
import { getSessionUser } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const intent = searchParams.get("intent") === "link" ? "link" : "login";
  const roleParam = searchParams.get("role") === "CLIENT" ? "CLIENT" : "CREATOR";

  try {
    const session = await getSessionUser();
    const role = intent === "link" ? (session?.role ?? roleParam) : roleParam;

    if (intent === "link") {
      if (!session) {
        return NextResponse.redirect(new URL("/login?error=tiktok_state", request.url));
      }
      if (session.role !== "CREATOR") {
        return NextResponse.redirect(new URL("/client/profile?error=tiktok_creator_only", request.url));
      }
    }

    const { clientKey, redirectUri } = getTikTokAuthConfig();
    const state = crypto.randomUUID();
    const cookieStore = await cookies();

    cookieStore.set("dealereth_tiktok_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    cookieStore.set("dealereth_tiktok_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    cookieStore.set("dealereth_tiktok_intent", intent, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    const params = new URLSearchParams({
      client_key: clientKey,
      response_type: "code",
      scope: "user.info.basic,user.info.profile,user.info.stats",
      redirect_uri: redirectUri,
      state,
    });

    return NextResponse.redirect(`https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`);
  } catch {
    return NextResponse.redirect(
      new URL(roleParam === "CLIENT" ? "/client/login?error=tiktok_setup" : "/login?error=tiktok_setup", request.url),
    );
  }
}
