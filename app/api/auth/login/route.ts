import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
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
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid login data." }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed. Check DATABASE_URL and redeploy." }, { status: 503 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: "Database is not ready. Run migrations or check the production database." }, { status: 503 });
    }

    return NextResponse.json({ error: "Could not sign in. Please try again." }, { status: 500 });
  }
}
