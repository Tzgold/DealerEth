import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTikTokAuthConfig } from "@/lib/tiktok";

export async function GET(request: Request) {
  try {
    const { clientKey, redirectUri } = getTikTokAuthConfig();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") === "CLIENT" ? "CLIENT" : "CREATOR";
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

    const params = new URLSearchParams({
      client_key: clientKey,
      response_type: "code",
      scope: "user.info.basic,user.info.profile",
      redirect_uri: redirectUri,
      state,
    });

    return NextResponse.redirect(`https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`);
  } catch {
    return NextResponse.redirect(new URL("/login?error=tiktok_setup", request.url));
  }
}
