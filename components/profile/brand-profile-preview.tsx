import { AvatarImage } from "@/components/ui/avatar-image";

export function BrandProfilePreview({
  companyName,
  avatarUrl,
  contactName,
  industry,
  description,
  website,
}: {
  companyName: string;
  avatarUrl: string;
  contactName: string;
  industry: string;
  description: string;
  website: string;
}) {
  const avatar = avatarUrl || "/next.svg";
  const initials = companyName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="border-b border-white/5 bg-gradient-to-r from-[#FE2C55]/15 via-transparent to-[#25F4EE]/15 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Live preview</p>
        <p className="text-xs text-white/60">How creators see your brand on campaigns</p>
      </div>
      <div className="p-5">
        <div className="flex gap-3">
          {avatarUrl ? (
            <AvatarImage src={avatar} className="h-14 w-14 rounded-2xl border border-white/10 object-cover" size={56} />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FE2C55]/30 to-[#25F4EE]/30 text-sm font-black">
              {initials || "BR"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-white">{companyName || "Company name"}</p>
            <p className="text-sm text-white/60">{contactName || "Contact name"}</p>
            {industry && <p className="mt-0.5 text-xs text-[#FE2C55]">{industry}</p>}
          </div>
        </div>
        <p className="mt-4 line-clamp-5 text-sm leading-6 text-white/75">{description || "Brand description…"}</p>
        {website.trim() && (
          <p className="mt-3 truncate text-xs font-semibold text-[#25F4EE] underline underline-offset-2">{website}</p>
        )}
      </div>
    </div>
  );
}
