import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/query-client";
import { ThemeProvider } from "@/lib/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import HeaderGate from "@/components/layout/HeaderGate";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ThemeProvider>
            <HeaderGate />
            {children}
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
        <GoogleAnalytics gaId="G-7GXNVZNNB1" />
      </body>
    </html>
  );
}
