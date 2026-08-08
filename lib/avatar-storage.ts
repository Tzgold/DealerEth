import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { getOptionalEnv } from "@/lib/env";

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export function extensionForMime(mime: string) {
  return ALLOWED_TYPES.get(mime) ?? null;
}

export function detectImageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export async function storeAvatarImage(params: {
  userId: string;
  file: File;
}): Promise<{ url: string; mime: string }> {
  const buffer = Buffer.from(await params.file.arrayBuffer());
  const detectedMime = detectImageMime(buffer);
  if (!detectedMime) {
    throw new Error("INVALID_IMAGE");
  }

  const claimedExtension = extensionForMime(params.file.type);
  const detectedExtension = extensionForMime(detectedMime);
  if (!claimedExtension || !detectedExtension || claimedExtension !== detectedExtension) {
    throw new Error("INVALID_IMAGE");
  }

  if (buffer.byteLength > 3 * 1024 * 1024) {
    throw new Error("TOO_LARGE");
  }

  const fileName = `avatars/${params.userId}-${randomUUID()}.${detectedExtension}`;
  const token = getOptionalEnv("BLOB_READ_WRITE_TOKEN");

  if (token) {
    const blob = await put(fileName, buffer, {
      access: "public",
      contentType: detectedMime,
      token,
      addRandomSuffix: false,
    });
    return { url: blob.url, mime: detectedMime };
  }

  // Local / missing-token fallback. On Vercel this is ephemeral — refuse there.
  if (process.env.VERCEL) {
    throw new Error("BLOB_NOT_CONFIGURED");
  }

  const directory = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(directory, { recursive: true });
  const localName = `${params.userId}-${randomUUID()}.${detectedExtension}`;
  await writeFile(path.join(directory, localName), buffer);
  return { url: `/uploads/avatars/${localName}`, mime: detectedMime };
}
