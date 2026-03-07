import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zero-Width Injector",
  description: "隱形字元注入器 — 注入零寬字元，產出視覺相同、編碼不同的字串",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
