import { prisma } from "@/lib/prisma";
import { isReservedPathSegment, slugifyBrandName } from "@/lib/slugs";

export async function allocateBrandSlug(companyName: string, preferred?: string, excludeUserId?: string) {
  const requested = (preferred?.trim() || slugifyBrandName(companyName)).toLowerCase();
  const base = isReservedPathSegment(requested) ? `${requested}-brand` : requested || "brand";

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const existing = await prisma.clientProfile.findUnique({
      where: { slug: candidate },
      select: { userId: true },
    });
    if (!existing || (excludeUserId && existing.userId === excludeUserId)) {
      return candidate;
    }
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function syncCreatorTikTokVerification(params: {
  userId: string;
  tiktokUsername?: string | null;
  tiktokFollowers?: number | null;
  tiktokAvatarUrl?: string | null;
}) {
  const handle = params.tiktokUsername?.trim()
    ? `@${params.tiktokUsername.trim().replace(/^@+/, "")}`
    : null;
  const followers =
    typeof params.tiktokFollowers === "number" && Number.isFinite(params.tiktokFollowers)
      ? Math.max(0, Math.floor(params.tiktokFollowers))
      : null;

  if (!handle && followers === null && !params.tiktokAvatarUrl) {
    return;
  }

  await prisma.creatorProfile.updateMany({
    where: { userId: params.userId },
    data: {
      ...(handle ? { tiktokHandle: handle } : {}),
      ...(followers !== null ? { followers } : {}),
      ...(params.tiktokAvatarUrl ? { avatarUrl: params.tiktokAvatarUrl } : {}),
      tiktokVerifiedAt: new Date(),
    },
  });
}
