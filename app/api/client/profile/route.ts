import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { clientProfileSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "CLIENT") {
    return NextResponse.json({ error: "Client profile is only available for client accounts." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      email: true,
      googleAvatarUrl: true,
      googleDisplayName: true,
      clientProfile: true,
    },
  });

  return NextResponse.json({
    profile: user?.clientProfile ?? null,
    defaults: {
      avatarUrl: user?.googleAvatarUrl ?? "",
      contactName: user?.googleDisplayName ?? "",
      email: user?.email ?? "",
    },
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "CLIENT") {
    return NextResponse.json({ error: "Client profile is only available for client accounts." }, { status: 403 });
  }

  try {
    const payload = clientProfileSchema.parse(await request.json());

    await prisma.clientProfile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        companyName: payload.companyName,
        avatarUrl: payload.avatarUrl || null,
        contactName: payload.contactName,
        industry: payload.industry,
        website: payload.website || null,
        description: payload.description,
      },
      update: {
        companyName: payload.companyName,
        avatarUrl: payload.avatarUrl || null,
        contactName: payload.contactName,
        industry: payload.industry,
        website: payload.website || null,
        description: payload.description,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid profile data." }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  }
}
