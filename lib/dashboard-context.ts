import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function requireCreatorProfile() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role !== "CREATOR") redirect("/client/dashboard");

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.userId },
    include: {
      user: { select: { tiktokAvatarUrl: true, googleAvatarUrl: true, email: true } },
      dealRequests: { orderBy: { createdAt: "desc" } },
      applications: {
        orderBy: { updatedAt: "desc" },
        include: {
          campaign: { include: { client: { select: { companyName: true } } } },
          messages: { orderBy: { createdAt: "asc" }, take: 1 },
        },
      },
    },
  });

  if (!profile) redirect("/profile/setup");
  return { session, profile };
}

export async function requireClientProfile() {
  const session = await getSessionUser();
  if (!session) redirect("/client/login");
  if (session.role !== "CLIENT") redirect("/dashboard");

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: session.userId },
    include: {
      user: { select: { googleAvatarUrl: true, email: true } },
      campaigns: {
        orderBy: { createdAt: "desc" },
        include: {
          applications: {
            orderBy: { updatedAt: "desc" },
            include: {
              creator: { select: { name: true, username: true, tiktokHandle: true, niche: true, avatarUrl: true } },
              messages: { orderBy: { createdAt: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!profile) redirect("/client/profile");
  return { session, profile };
}

export function creatorProfileStrength(profile: {
  bio?: string;
  niche?: string;
  priceRange?: string | null;
  sampleVideos: unknown;
  followers: number;
}) {
  const checks = [
    Boolean(profile.bio?.trim()),
    Boolean(profile.niche?.trim()),
    Boolean(profile.priceRange?.trim()),
    Array.isArray(profile.sampleVideos) && (profile.sampleVideos as unknown[]).length > 0,
    profile.followers > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function clientProfileStrength(profile: {
  companyName?: string;
  contactName?: string;
  industry?: string;
  description?: string;
  avatarUrl?: string | null;
}) {
  const checks = [
    Boolean(profile.companyName?.trim()),
    Boolean(profile.contactName?.trim()),
    Boolean(profile.industry?.trim()),
    Boolean(profile.description?.trim()),
    Boolean(profile.avatarUrl?.trim()),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export async function getPublicProfileUrls(username: string) {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "dealereth.com";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const path = `/@${username}`;
  return {
    path,
    display: `${host.replace(/^www\./, "")}${path}`,
    full: `${proto}://${host}${path}`,
  };
}

export function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}
