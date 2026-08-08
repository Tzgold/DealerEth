import { NextResponse } from "next/server";
import { storeAvatarImage } from "@/lib/avatar-storage";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  try {
    const { url } = await storeAvatarImage({ userId: session.userId, file });

    // Existing profiles should reflect a newly uploaded image immediately.
    const result =
      session.role === "CREATOR"
        ? await prisma.creatorProfile.updateMany({
            where: { userId: session.userId },
            data: { avatarUrl: url },
          })
        : await prisma.clientProfile.updateMany({
            where: { userId: session.userId },
            data: { avatarUrl: url },
          });

    return NextResponse.json({ url, savedToProfile: result.count > 0 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "INVALID_IMAGE") {
      return NextResponse.json({ error: "Use a real JPG, PNG, or WebP image." }, { status: 400 });
    }
    if (code === "TOO_LARGE") {
      return NextResponse.json({ error: "Image must be smaller than 3 MB." }, { status: 400 });
    }
    if (code === "BLOB_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Cloud image storage is not configured. Add BLOB_READ_WRITE_TOKEN on Vercel." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Could not upload image. Please try again." }, { status: 500 });
  }
}
