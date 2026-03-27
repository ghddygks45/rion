import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/query-client";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "RION",
  description: "한국 주식시장 인텔리전스 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
