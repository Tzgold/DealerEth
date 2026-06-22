import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
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

  return NextResponse.json({ url: `/uploads/avatars/${fileName}` });
}
