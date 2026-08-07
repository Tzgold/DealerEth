import { AvatarImage } from "@/components/ui/avatar-image";

export function CreatorProfilePreview({
  name,
  avatarUrl,
  tiktokHandle,
  bio,
  niche,
  followers,
  priceRange,
  username,
}: {
  name: string;
  avatarUrl: string;
  tiktokHandle: string;
  bio: string;
  niche: string;
  followers: string;
  priceRange: string;
  username: string;
}) {
  const avatar = avatarUrl || "/next.svg";
  const followerNum = Number(followers) || 0;
  const handle = username.trim().replace(/^@+/, "").toLowerCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="de-eyebrow">Live preview</p>
      </div>
      <div className="p-5">
        <div className="flex gap-3">
          <AvatarImage src={avatar} className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 object-cover" size={56} />
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-white">{name || "Your name"}</p>
            <p className="text-sm text-white/60">{tiktokHandle || "@tiktok"}</p>
            {handle ? <p className="mt-0.5 font-mono text-xs text-white/70">/{handle}</p> : null}
          </div>
        </div>
        <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/70">{bio || "Your bio will appear here…"}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {niche ? <span className="de-chip">{niche}</span> : null}
          {followerNum > 0 ? <span className="de-chip">{followerNum.toLocaleString()} followers</span> : null}
          {priceRange ? <span className="de-chip">{priceRange}</span> : null}
        </div>
      </div>
    </div>
  );
}
