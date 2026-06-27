import Link from "next/link";

const socialLinks = [
  { label: "TikTok", href: "https://www.tiktok.com/@dealereth" },
  { label: "Instagram", href: "https://www.instagram.com/dealereth" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dealereth" },
];

export function SiteFooter({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  const borderClass = isLight ? "border-black/10" : "border-white/[0.07]";
  const mutedClass = isLight ? "text-black/55" : "text-white/45";
  const brandClass = isLight ? "text-black" : "text-white";
  const linkClass = isLight
    ? "text-black/55 transition hover:text-black"
    : "landing-footer-link";

  return (
    <footer className={`border-t ${borderClass}`}>
      <div className="mx-auto grid max-w-[1240px] gap-6 px-5 py-8 text-sm sm:px-8 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <p className={mutedClass}>
          <span className={`font-black ${brandClass}`}>DealerEth</span> · Creator partnerships, made clearer.
        </p>

        <nav className="flex flex-wrap gap-5" aria-label="Legal links">
          <Link href="/terms" className={linkClass}>
            Terms
          </Link>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
          <Link href="/login" className={linkClass}>
            Sign in
          </Link>
        </nav>

        <nav className="flex flex-wrap gap-5" aria-label="Social links">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
