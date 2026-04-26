import { NextResponse } from "next/server";
import { signSessionToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/session";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());

    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user || !(await verifyPassword(payload.password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (payload.role && payload.role !== user.role) {
      return NextResponse.json({ error: `This account is registered as ${user.role.toLowerCase()}.` }, { status: 403 });
    }

    const token = await signSessionToken({ userId: user.id, email: user.email, role: user.role });
    await createSessionCookie(token);

    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    return NextResponse.json({ error: "Invalid login data." }, { status: 400 });
  }
}
