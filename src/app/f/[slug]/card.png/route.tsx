import { ImageResponse } from "next/og";
import { getFestival } from "@/lib/data";
import { ShareCard } from "@/lib/og";
import { siteUrl } from "@/lib/format";

/** The festival's 1080×1350 share card as a PNG, ready to post or download. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await getFestival(slug);
  if (!f) return new Response("Not found", { status: 404 });
  const link = `${siteUrl().replace(/^https?:\/\//, "")}/f/${f.slug}`;
  return new ImageResponse(<ShareCard name={f.festival_name} logo={f.logo_url} link={link} />, {
    width: 1080,
    height: 1350,
    headers: { "Cache-Control": "public, max-age=300", "Content-Disposition": `inline; filename="${f.slug}-minflix-events.png"` },
  });
}
