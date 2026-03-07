import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invisible Ink",
  description: "Invisible Ink — 隱形字元注入器，注入零寬字元，產出視覺相同、編碼不同的字串",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/30 text-slate-900 bg-pattern">
        {children}
      </body>
    </html>
  );
}
