import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { dealRequestStatusSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: Promise<{ requestId: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "CREATOR") return NextResponse.json({ error: "Only creators can manage requests." }, { status: 403 });

  const { requestId } = await params;
  const dealRequest = await prisma.dealRequest.findFirst({
    where: { id: requestId, creator: { userId: session.userId } },
  });
  if (!dealRequest) return NextResponse.json({ error: "Request not found." }, { status: 404 });

  try {
    const { status } = z.object({ status: dealRequestStatusSchema }).parse(await request.json());
    const updated = await prisma.dealRequest.update({ where: { id: requestId }, data: { status } });
    return NextResponse.json({ request: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid status." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update request." }, { status: 400 });
  }
}
