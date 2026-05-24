import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { campaignApplicationSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "CREATOR") {
    const profile = await prisma.creatorProfile.findUnique({ where: { userId: session.userId } });
    if (!profile) return NextResponse.json({ error: "Profile required" }, { status: 400 });

    const applications = await prisma.campaignApplication.findMany({
      where: { creatorId: profile.id },
      orderBy: { updatedAt: "desc" },
      include: {
        campaign: { include: { client: { select: { companyName: true, industry: true } } } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    return NextResponse.json({ applications });
  }

  if (session.role === "CLIENT") {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: session.userId },
      include: { campaigns: { select: { id: true } } },
    });
    if (!profile) return NextResponse.json({ error: "Profile required" }, { status: 400 });

    const campaignIds = profile.campaigns.map((c) => c.id);
    const applications = await prisma.campaignApplication.findMany({
      where: { campaignId: { in: campaignIds } },
      orderBy: { updatedAt: "desc" },
      include: {
        campaign: { select: { title: true, budget: true, niche: true } },
        creator: { select: { id: true, name: true, username: true, tiktokHandle: true, niche: true, avatarUrl: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    return NextResponse.json({ applications });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "CREATOR") return NextResponse.json({ error: "Only creators can apply." }, { status: 403 });

  try {
    const payload = campaignApplicationSchema.parse(await request.json());
    const profile = await prisma.creatorProfile.findUnique({ where: { userId: session.userId } });
    if (!profile) return NextResponse.json({ error: "Complete your profile first." }, { status: 400 });

    const campaign = await prisma.campaignPost.findUnique({ where: { id: payload.campaignId } });
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });

    const existing = await prisma.campaignApplication.findUnique({
      where: { campaignId_creatorId: { campaignId: payload.campaignId, creatorId: profile.id } },
    });
    if (existing) return NextResponse.json({ error: "You already applied to this campaign." }, { status: 400 });

    const application = await prisma.campaignApplication.create({
      data: {
        campaignId: payload.campaignId,
        creatorId: profile.id,
        coverLetter: payload.coverLetter,
        proposedBudget: payload.proposedBudget || null,
        messages: {
          create: {
            senderRole: "CREATOR",
            text: payload.coverLetter,
          },
        },
      },
    });

    return NextResponse.json({ application });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not submit application." }, { status: 400 });
  }
}
