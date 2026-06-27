import type { Metadata } from "next";
import { getAppUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "DealerEth",
    template: "%s | DealerEth",
  },
  description: "A creator-brand collaboration workspace for Ethiopian TikTok creators and local businesses.",
  openGraph: {
    title: "DealerEth",
    description: "Discover creators, manage campaign applications, and keep brand collaborations organized.",
    type: "website",
    url: getAppUrl(),
    siteName: "DealerEth",
  },
  twitter: {
    card: "summary_large_image",
    title: "DealerEth",
    description: "A professional collaboration workspace for creators and brands.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full text-black antialiased">
        <main className="min-h-screen w-full">{children}</main>
      </body>
    </html>
  );
}
