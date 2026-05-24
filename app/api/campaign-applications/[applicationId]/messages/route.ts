import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { applicationMessageSchema } from "@/lib/validations";

async function canAccessApplication(applicationId: string, userId: string, role: "CREATOR" | "CLIENT") {
  const application = await prisma.campaignApplication.findUnique({
    where: { id: applicationId },
    include: {
      creator: { select: { userId: true } },
      campaign: { include: { client: { select: { userId: true } } } },
    },
  });
  if (!application) return null;
  if (role === "CREATOR" && application.creator.userId === userId) return application;
  if (role === "CLIENT" && application.campaign.client.userId === userId) return application;
  return null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId } = await params;
  const application = await canAccessApplication(applicationId, session.userId, session.role);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await prisma.applicationMessage.findMany({
    where: { applicationId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ messages });
}

export async function POST(request: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId } = await params;
  const application = await canAccessApplication(applicationId, session.userId, session.role);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const payload = applicationMessageSchema.parse(await request.json());
    const message = await prisma.applicationMessage.create({
      data: {
        applicationId,
        senderRole: session.role,
        text: payload.text,
      },
    });

    if (application.status === "APPLIED" && session.role === "CLIENT") {
      await prisma.campaignApplication.update({
        where: { id: applicationId },
        data: { status: "IN_CHAT" },
      });
    }

    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid message." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send message." }, { status: 400 });
  }
}
