import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getSafeUrlDiagnostics(value: string | undefined) {
  if (!value) {
    return { configured: false };
  }

  try {
    const url = new URL(value);
    const isSupabasePooler = url.hostname.includes("pooler.supabase.com");
    const isSupabaseDirect = url.hostname.startsWith("db.") && url.hostname.endsWith(".supabase.co");

    return {
      configured: true,
      hostType: isSupabasePooler ? "supabase-pooler" : isSupabaseDirect ? "supabase-direct" : "other",
      port: url.port || "default",
      database: url.pathname.replace("/", "") || "default",
      hasPgbouncer: url.searchParams.get("pgbouncer") === "true",
      hasConnectionLimit: url.searchParams.has("connection_limit"),
    };
  } catch {
    return { configured: true, invalid: true };
  }
}

function getSafeRuntimeDiagnostics() {
  return {
    appUrlConfigured: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
    databaseUrl: getSafeUrlDiagnostics(process.env.DATABASE_URL),
    directUrl: getSafeUrlDiagnostics(process.env.DIRECT_URL),
  };
}

function getSafeErrorDiagnostics(error: unknown) {
  if (!error || typeof error !== "object") {
    return { name: "UnknownError" };
  }

  const maybeError = error as { name?: unknown; code?: unknown };

  return {
    name: typeof maybeError.name === "string" ? maybeError.name : "UnknownError",
    code: typeof maybeError.code === "string" ? maybeError.code : undefined,
  };
}

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      database: "ok",
      runtime: getSafeRuntimeDiagnostics(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "unavailable",
        runtime: getSafeRuntimeDiagnostics(),
        error: getSafeErrorDiagnostics(error),
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
