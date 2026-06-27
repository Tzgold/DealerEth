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

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="border-b border-white/5 bg-gradient-to-r from-[#25F4EE]/15 via-transparent to-[#FE2C55]/15 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Live preview</p>
        <p className="text-xs text-white/60">How brands see your public page</p>
      </div>
      <div className="p-5">
        <div className="flex gap-3">
          <AvatarImage src={avatar} className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 object-cover" size={56} />
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-white">{name || "Your name"}</p>
            <p className="text-sm text-white/60">{tiktokHandle || "@tiktok"}</p>
            {username.trim() && (
              <p className="mt-0.5 font-mono text-xs text-[#25F4EE]">/{username.replace(/^@+/, "").toLowerCase()}</p>
            )}
          </div>
        </div>
        <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/75">{bio || "Your bio will appear here…"}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {niche && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {niche}
            </span>
          )}
          {followerNum > 0 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {followerNum.toLocaleString()} followers
            </span>
          )}
          {priceRange && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {priceRange}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
