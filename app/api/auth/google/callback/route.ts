import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashPassword, signSessionToken, type SessionRole } from "@/lib/auth";
import { createSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { exchangeGoogleCode, fetchGoogleUserInfo } from "@/lib/google";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const savedState = cookieStore.get("dealereth_google_state")?.value;
  const role = (cookieStore.get("dealereth_google_role")?.value === "CLIENT" ? "CLIENT" : "CREATOR") as SessionRole;

  cookieStore.delete("dealereth_google_state");
  cookieStore.delete("dealereth_google_role");

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL(role === "CLIENT" ? "/client/login?error=google_state" : "/login?error=google_state", request.url));
  }

  try {
    const { accessToken } = await exchangeGoogleCode(code);
    const googleUser = await fetchGoogleUserInfo(accessToken);

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleSub: googleUser.sub }, { email: googleUser.email }],
      },
      include: {
        profile: { select: { id: true } },
        clientProfile: { select: { id: true } },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          password: await hashPassword(crypto.randomUUID()),
          role,
          authProvider: "google",
          googleSub: googleUser.sub,
          googleDisplayName: googleUser.name,
          googleAvatarUrl: googleUser.picture,
        },
        include: {
          profile: { select: { id: true } },
          clientProfile: { select: { id: true } },
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          authProvider: "google",
          googleSub: googleUser.sub,
          googleDisplayName: googleUser.name,
          googleAvatarUrl: googleUser.picture,
        },
        include: {
          profile: { select: { id: true } },
          clientProfile: { select: { id: true } },
        },
      });
    }

    const token = await signSessionToken({ userId: user.id, email: user.email, role: user.role });
    await createSessionCookie(token);

    const redirectPath =
      user.role === "CLIENT" ? (user.clientProfile ? "/client/dashboard" : "/client/profile") : user.profile ? "/dashboard" : "/profile/setup";

    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch {
    return NextResponse.redirect(new URL(role === "CLIENT" ? "/client/login?error=google_failed" : "/login?error=google_failed", request.url));
  }
}
