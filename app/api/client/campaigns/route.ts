import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { campaignPostSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "CLIENT") {
    return NextResponse.json({ error: "Only clients can post campaigns." }, { status: 403 });
  }

  try {
    const payload = campaignPostSchema.parse(await request.json());

    const profile = await prisma.clientProfile.findUnique({ where: { userId: session.userId } });

    if (!profile) {
      return NextResponse.json({ error: "Complete your client profile first." }, { status: 400 });
    }

    await prisma.campaignPost.create({
      data: {
        clientId: profile.id,
        title: payload.title,
        description: payload.description,
        budget: payload.budget,
        niche: payload.niche,
        deliverables: payload.deliverables,
        deadline: payload.deadline || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid campaign data." }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid campaign data." }, { status: 400 });
  }
}
