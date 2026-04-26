import { NextResponse } from "next/server";
import { hashPassword, signSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/session";
import { signUpSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const payload = signUpSchema.parse(await request.json());

    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: await hashPassword(payload.password),
        role: payload.role,
      },
    });

    const token = await signSessionToken({ userId: user.id, email: user.email, role: user.role });
    await createSessionCookie(token);

    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    return NextResponse.json({ error: "Invalid signup data." }, { status: 400 });
  }
}
