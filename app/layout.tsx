import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DealerEth",
  description: "Creator profile links and brand deal requests for Ethiopian TikTok creators.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full text-black antialiased">
        <main className="min-h-screen w-full">{children}</main>
      </body>
    </html>
  );
}
