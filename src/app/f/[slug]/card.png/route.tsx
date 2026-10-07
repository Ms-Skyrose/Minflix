import { ImageResponse } from "next/og";
import { getFestival } from "@/lib/data";
import { ShareCard } from "@/lib/og";
import { ogFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";

/** The festival's 1080×1350 share card as a PNG. The printed link uses the domain the card was requested on. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await getFestival(slug);
  if (!f) return new Response("Not found", { status: 404 });
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  const link = `${host}/f/${f.slug}`;
  return new ImageResponse(<ShareCard name={f.festival_name} logo={f.logo_url} link={link} />, {
    width: 1080,
    height: 1350,
    fonts: await ogFonts(),
    headers: { "Cache-Control": "public, max-age=300", "Content-Disposition": `inline; filename="${f.slug}-minflix-events.png"` },
  });
}
