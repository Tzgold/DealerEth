import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { creatorProfileSchema } from "@/lib/validations";

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

    const existing = await prisma.creatorProfile.findUnique({
      where: { username: payload.username },
      select: { userId: true },
    });

    if (existing && existing.userId !== session.userId) {
      return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
    }

    await prisma.creatorProfile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        username: payload.username,
        name: payload.name,
        tiktokHandle: payload.tiktokHandle,
        bio: payload.bio,
        niche: payload.niche,
        followers: payload.followers,
        priceRange: payload.priceRange,
        sampleVideos: payload.sampleVideos,
      },
      update: {
        username: payload.username,
        name: payload.name,
        tiktokHandle: payload.tiktokHandle,
        bio: payload.bio,
        niche: payload.niche,
        followers: payload.followers,
        priceRange: payload.priceRange,
        sampleVideos: payload.sampleVideos,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid profile data." },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  }
}
