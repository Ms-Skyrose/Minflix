import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Tracker } from "@/components/source";
// Self-hosted Poppins (no build-time call to Google Fonts)
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/700-italic.css";
import "@fontsource/poppins/800-italic.css";
import "./globals.css";

/** Link previews use the domain the page was opened on, so the same build works on any host or domain. */
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return {
    metadataBase: new URL(`${proto}://${host}`),
    title: "Minflix Events · Everything for your festival in one link",
    description:
      "Run your whole film festival from one link: submissions, registration, payments and your programme. Join the waitlist for early access and a free spot in the 2027 Festival Directory.",
    openGraph: { siteName: "Minflix Events", type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#000C14", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh overflow-x-hidden">
        {children}
        <Tracker />
      </body>
    </html>
  );
}
