import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { dealRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    const payload = dealRequestSchema.parse(await request.json());

    const creator = await prisma.creatorProfile.findUnique({ where: { id: payload.creatorId } });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    }

    const clientProfile = session?.role === "CLIENT"
      ? await prisma.clientProfile.findUnique({ where: { userId: session.userId } })
      : null;

    const campaignId = payload.campaignId || null;
    if (campaignId && !clientProfile) {
      return NextResponse.json({ error: "Sign in as a client to attach a campaign." }, { status: 403 });
    }

    if (campaignId) {
      const campaign = await prisma.campaignPost.findFirst({
        where: { id: campaignId, clientId: clientProfile?.id },
        select: { id: true },
      });

      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found for this client." }, { status: 404 });
      }
    }

    await prisma.dealRequest.create({
      data: {
        creatorId: payload.creatorId,
        clientId: clientProfile?.id ?? null,
        campaignId,
        name: payload.name,
        email: payload.email,
        description: payload.description,
        budget: payload.budget,
        deliverables: payload.deliverables,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request data." }, { status: 400 });
  }
}
