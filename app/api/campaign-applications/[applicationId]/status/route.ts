import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { applicationStatusSchema } from "@/lib/validations";

export async function POST(request: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "CLIENT") return NextResponse.json({ error: "Only brands can update status." }, { status: 403 });

  const { applicationId } = await params;

  try {
    const { status } = z.object({ status: applicationStatusSchema }).parse(await request.json());

    const application = await prisma.campaignApplication.findUnique({
      where: { id: applicationId },
      include: { campaign: { include: { client: true } } },
    });

    if (!application || application.campaign.client.userId !== session.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.campaignApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({ application: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid status." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update status." }, { status: 400 });
  }
}
