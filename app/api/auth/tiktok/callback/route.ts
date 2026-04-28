import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashPassword, signSessionToken, type SessionRole } from "@/lib/auth";
import { createSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { exchangeTikTokCode, fetchTikTokUserInfo } from "@/lib/tiktok";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const savedState = cookieStore.get("dealereth_tiktok_state")?.value;
  const role = (cookieStore.get("dealereth_tiktok_role")?.value === "CLIENT" ? "CLIENT" : "CREATOR") as SessionRole;

  cookieStore.delete("dealereth_tiktok_state");
  cookieStore.delete("dealereth_tiktok_role");

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL(role === "CLIENT" ? "/client/login?error=tiktok_state" : "/login?error=tiktok_state", request.url));
  }

  try {
    const { accessToken } = await exchangeTikTokCode(code);
    const tiktokUser = await fetchTikTokUserInfo(accessToken);
    const fallbackEmail = `tiktok_${tiktokUser.openId}@dealereth.local`;

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ tiktokOpenId: tiktokUser.openId }, { email: fallbackEmail }],
      },
      include: {
        profile: { select: { id: true } },
        clientProfile: { select: { id: true } },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: fallbackEmail,
          password: await hashPassword(crypto.randomUUID()),
          role,
          authProvider: "tiktok",
          tiktokOpenId: tiktokUser.openId,
          tiktokUsername: tiktokUser.username,
          tiktokDisplayName: tiktokUser.displayName,
          tiktokAvatarUrl: tiktokUser.avatarUrl,
          tiktokFollowers: tiktokUser.followerCount,
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
          authProvider: "tiktok",
          role: user.role ?? role,
          tiktokOpenId: tiktokUser.openId,
          tiktokUsername: tiktokUser.username,
          tiktokDisplayName: tiktokUser.displayName,
          tiktokAvatarUrl: tiktokUser.avatarUrl,
          tiktokFollowers: tiktokUser.followerCount,
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
    return NextResponse.redirect(new URL(role === "CLIENT" ? "/client/login?error=tiktok_failed" : "/login?error=tiktok_failed", request.url));
  }
}
