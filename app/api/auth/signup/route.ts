import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
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
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid signup data." }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: "Database connection failed. Check DATABASE_URL and redeploy." }, { status: 503 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: "Database is not ready. Run migrations or check the production database." }, { status: 503 });
    }

    return NextResponse.json({ error: "Could not create account. Please try again." }, { status: 500 });
  }
}
