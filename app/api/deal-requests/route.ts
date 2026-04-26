import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dealRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const payload = dealRequestSchema.parse(await request.json());

    const creator = await prisma.creatorProfile.findUnique({ where: { id: payload.creatorId } });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    }

    await prisma.dealRequest.create({
      data: {
        creatorId: payload.creatorId,
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
