import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealerEth",
  description: "Creator profile links and brand deal requests for Ethiopian TikTok creators.",
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
