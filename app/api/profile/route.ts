import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { formatTikTokHandle, isReservedPathSegment, normalizeCreatorUsername } from "@/lib/slugs";
import { getSessionUser } from "@/lib/session";
import { creatorProfileSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "CREATOR") {
    return NextResponse.json({ error: "Creator profile is only available for creator accounts." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      email: true,
      googleAvatarUrl: true,
      googleDisplayName: true,
      tiktokOpenId: true,
      tiktokAvatarUrl: true,
      tiktokUsername: true,
      tiktokDisplayName: true,
      tiktokFollowers: true,
      profile: true,
    },
  });

  const tiktokVerified = Boolean(user?.tiktokOpenId);

  return NextResponse.json(
    {
      profile: user?.profile ?? null,
      verification: {
        tiktokVerified,
        tiktokVerifiedAt: user?.profile?.tiktokVerifiedAt ?? null,
        canEditTikTokStats: !tiktokVerified,
      },
      defaults: {
        name: user?.tiktokDisplayName ?? user?.googleDisplayName ?? "",
        avatarUrl: user?.tiktokAvatarUrl ?? user?.googleAvatarUrl ?? "",
        tiktokHandle: formatTikTokHandle(user?.tiktokUsername),
        followers: user?.tiktokFollowers ?? "",
        email: user?.email ?? "",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "CREATOR") {
    return NextResponse.json({ error: "Creator profile is only available for creator accounts." }, { status: 403 });
  }

  try {
    const rawPayload = await request.json();
    const payload = creatorProfileSchema.parse(rawPayload);
    const username = normalizeCreatorUsername(payload.username);

    if (isReservedPathSegment(username)) {
      return NextResponse.json({ error: "That username is reserved." }, { status: 400 });
    }

    const existing = await prisma.creatorProfile.findUnique({
      where: { username },
      select: { userId: true },
    });

    if (existing && existing.userId !== session.userId) {
      return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        tiktokOpenId: true,
        tiktokUsername: true,
        tiktokFollowers: true,
        tiktokAvatarUrl: true,
      },
    });

    const tiktokVerified = Boolean(user?.tiktokOpenId);
    const tiktokHandle = tiktokVerified
      ? formatTikTokHandle(user?.tiktokUsername) || payload.tiktokHandle
      : payload.tiktokHandle;
    const followers =
      tiktokVerified && typeof user?.tiktokFollowers === "number"
        ? Math.max(0, Math.floor(user.tiktokFollowers))
        : payload.followers;

    await prisma.creatorProfile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        username,
        name: payload.name,
        avatarUrl: payload.avatarUrl || user?.tiktokAvatarUrl || null,
        tiktokHandle,
        bio: payload.bio,
        niche: payload.niche,
        followers,
        priceRange: payload.priceRange,
        sampleVideos: payload.sampleVideos,
        tiktokVerifiedAt: tiktokVerified ? new Date() : null,
      },
      update: {
        username,
        name: payload.name,
        avatarUrl: payload.avatarUrl || null,
        tiktokHandle,
        bio: payload.bio,
        niche: payload.niche,
        followers,
        priceRange: payload.priceRange,
        sampleVideos: payload.sampleVideos,
        tiktokVerifiedAt: tiktokVerified ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, tiktokVerified });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid profile data." }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  }
}
