import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });

  const extension = allowedTypes.get(file.type);
  if (!extension) return NextResponse.json({ error: "Use a JPG, PNG, or WebP image." }, { status: 400 });
  if (file.size > 3 * 1024 * 1024) return NextResponse.json({ error: "Image must be smaller than 3 MB." }, { status: 400 });

  const directory = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(directory, { recursive: true });
  const fileName = `${session.userId}-${randomUUID()}.${extension}`;
  await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));
  const url = `/uploads/avatars/${fileName}`;

  // Existing profiles should reflect a newly uploaded image immediately. This
  // keeps the dashboard shell, public page, and editor preview on one source of
  // truth even when the user navigates away before saving unrelated form edits.
  const result = session.role === "CREATOR"
    ? await prisma.creatorProfile.updateMany({
        where: { userId: session.userId },
        data: { avatarUrl: url },
      })
    : await prisma.clientProfile.updateMany({
        where: { userId: session.userId },
        data: { avatarUrl: url },
      });

  return NextResponse.json({ url, savedToProfile: result.count > 0 });
}
