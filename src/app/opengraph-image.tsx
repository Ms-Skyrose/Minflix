import { ImageResponse } from "next/og";
import { getTotal } from "@/lib/data";
import { MIN_PUBLIC_COUNT } from "@/lib/format";
import { LinkPreview } from "@/lib/og";
import { ogFonts } from "@/lib/og-fonts";

export const alt = "Festivals are getting ready to prepare their next edition on Minflix. Join the waitlist.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 300;

export default async function Image() {
  const total = await getTotal().catch(() => 0);
  return new ImageResponse(<LinkPreview total={total >= MIN_PUBLIC_COUNT ? total : null} />, { ...size, fonts: await ogFonts() });
}
