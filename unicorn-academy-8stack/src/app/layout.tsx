import type { Metadata } from "next";
import { Prompt, Sarabun } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Unicorn Academy | Smart Business Platform",
  description: "ยกระดับธุรกิจด้วย AI และ Gamification สำหรับ UBC ทุกระดับ",
  openGraph: {
    title: "Unicorn Academy",
    description: "Smart Business Platform for Unicorn Biz Coach",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${prompt.variable} ${sarabun.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
