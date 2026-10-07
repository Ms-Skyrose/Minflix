import { ImageResponse } from "next/og";
import { getFestival } from "@/lib/data";
import { ShareCard } from "@/lib/og";
import { logoForCard, ogFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";

/** The festival's 1080×1350 share card as a PNG. The printed link uses the domain the card was requested on. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await getFestival(slug);
  if (!f) return new Response("Not found", { status: 404 });

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  const link = `${host}/f/${f.slug}`;
  const [fonts, logo] = await Promise.all([ogFonts(), logoForCard(f.logo_url)]);
  const headers = { "Cache-Control": "public, max-age=300", "Content-Disposition": `inline; filename="${f.slug}-minflix-events.png"` };

  const render = (withLogo: string | null) =>
    new ImageResponse(<ShareCard name={f.festival_name} logo={withLogo} link={link} />, { width: 1080, height: 1350, fonts, headers });

  try {
    const img = render(logo);
    // Render now so a bad logo is caught here, not mid-stream.
    const body = await img.arrayBuffer();
    return new Response(body, { headers: { ...headers, "Content-Type": "image/png" } });
  } catch (err) {
    console.error("card.png: retrying without the logo", err);
    const body = await render(null).arrayBuffer();
    return new Response(body, { headers: { ...headers, "Content-Type": "image/png" } });
  }
}
