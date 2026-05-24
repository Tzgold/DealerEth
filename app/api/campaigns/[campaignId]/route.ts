import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

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
