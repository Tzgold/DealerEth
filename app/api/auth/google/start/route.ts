import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGoogleAuthConfig } from "@/lib/google";

export async function GET(request: Request) {
  try {
    const { clientId, redirectUri } = getGoogleAuthConfig();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") === "CLIENT" ? "CLIENT" : "CREATOR";
    const state = crypto.randomUUID();
    const cookieStore = await cookies();

    cookieStore.set("dealereth_google_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    cookieStore.set("dealereth_google_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "consent",
      access_type: "offline",
    });

    return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  } catch {
    return NextResponse.redirect(new URL("/login?error=google_setup", request.url));
  }
}
