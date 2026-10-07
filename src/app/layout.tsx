import type { Metadata, Viewport } from "next";
import { deploymentOrigin } from "@/lib/format";
// Self-hosted Poppins (no build-time call to Google Fonts)
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/700-italic.css";
import "@fontsource/poppins/800-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(deploymentOrigin()),
  title: "Minflix Events · Everything for your festival in one link",
  description:
    "Run your entire festival from one place. Join the waitlist and get your festival listed in the 2027 Minflix Events Directory.",
  openGraph: { siteName: "Minflix Events", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#000C14", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}
