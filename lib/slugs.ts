const RESERVED_PATHS = new Set([
  "api",
  "brand",
  "brands",
  "client",
  "dashboard",
  "login",
  "logout",
  "signup",
  "profile",
  "privacy",
  "terms",
  "uploads",
  "admin",
  "health",
  "favicon.ico",
]);

export function isReservedPathSegment(value: string) {
  return RESERVED_PATHS.has(value.trim().toLowerCase());
}

export function slugifyBrandName(companyName: string) {
  const base = companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return base || "brand";
}

export function normalizeCreatorUsername(username: string) {
  return username.trim().toLowerCase().replace(/^@+/, "").replace(/\s+/g, "_");
}

export function formatTikTokHandle(username?: string | null) {
  if (!username?.trim()) return "";
  const clean = username.trim().replace(/^@+/, "");
  return clean ? `@${clean}` : "";
}
