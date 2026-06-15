import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Builddeck - Discover & Launch Products",
  description:
    "Builddeck is a platform where makers submit products, get discovered, and grow their audience.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const hideGlobalChrome = requestHeaders.get("x-builddeck-public-profile") === "1";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-300`}>
        <div className="flex min-h-screen flex-col">
          {!hideGlobalChrome ? <Header /> : null}
          <main className={cn("flex-1", !hideGlobalChrome && "pt-20")}>{children}</main>
          {!hideGlobalChrome ? <Footer /> : null}
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
