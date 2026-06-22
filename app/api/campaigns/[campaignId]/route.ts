import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { campaignUpdateSchema } from "@/lib/validations";

export async function GET(_request: Request, { params }: { params: Promise<{ campaignId: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { campaignId } = await params;
  const campaign = await prisma.campaignPost.findUnique({
    where: { id: campaignId },
    include: { client: { select: { companyName: true, industry: true, contactName: true, website: true } } },
  });

  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let existingApplicationId: string | null = null;
  if (session.role === "CREATOR") {
    const profile = await prisma.creatorProfile.findUnique({ where: { userId: session.userId } });
    if (profile) {
      const existing = await prisma.campaignApplication.findUnique({
        where: { campaignId_creatorId: { campaignId, creatorId: profile.id } },
      });
      existingApplicationId = existing?.id ?? null;
    }
  }

  return NextResponse.json({ campaign, existingApplicationId });
}

async function ownedCampaign(campaignId: string, userId: string) {
  return prisma.campaignPost.findFirst({
    where: { id: campaignId, client: { userId } },
    include: { _count: { select: { applications: true } } },
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ campaignId: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "CLIENT") return NextResponse.json({ error: "Only brands can manage campaigns." }, { status: 403 });

  const { campaignId } = await params;
  const campaign = await ownedCampaign(campaignId, session.userId);
  if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });

  try {
    const payload = campaignUpdateSchema.parse(await request.json());
    const updated = await prisma.campaignPost.update({ where: { id: campaignId }, data: payload });
    return NextResponse.json({ campaign: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid campaign data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update campaign." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ campaignId: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "CLIENT") return NextResponse.json({ error: "Only brands can manage campaigns." }, { status: 403 });

  const { campaignId } = await params;
  const campaign = await ownedCampaign(campaignId, session.userId);
  if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
  if (campaign._count.applications > 0) {
    return NextResponse.json({ error: "Close campaigns with applications instead of deleting them." }, { status: 409 });
  }

  await prisma.campaignPost.delete({ where: { id: campaignId } });
  return NextResponse.json({ ok: true });
}
