import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "BuildDeck | Build faster. Distribute smarter.",
  description:
    "BuildDeck helps founders launch products, grow audiences, and build online businesses with modern workflows.",
  openGraph: {
    title: "BuildDeck | Build faster. Distribute smarter.",
    description:
      "Join the BuildDeck waitlist for founder workflows, AI-assisted systems, and launch strategies.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildDeck | Build faster. Distribute smarter.",
    description:
      "Join the BuildDeck waitlist for founder workflows, AI-assisted systems, and launch strategies.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
