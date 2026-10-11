import { ImageResponse } from "next/og";
import { getFestival } from "@/lib/data";
import { ShareCard } from "@/lib/og";
import { logoForCard, ogFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";

const describe = (err: unknown) => (err instanceof Error ? `${err.name}: ${err.message}\n${(err.stack ?? "").split("\n").slice(1, 6).join("\n")}` : String(err));

/**
 * A festival's share card as a PNG.
 *   ?size=story  → 1080×1920 for WhatsApp Status / Instagram Stories (default: 1080×1350 feed post)
 *   ?download=1  → sent as a file download
 *   ?debug=1     → plain-text report of each step and any error, for diagnosing a server
 * The link printed on the card uses the domain the card was requested on.
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const url = new URL(req.url);
  const debug = url.searchParams.has("debug");
  const story = url.searchParams.get("size") === "story";
  const download = url.searchParams.has("download");
  const steps: string[] = [`size: ${story ? "story 1080x1920" : "post 1080x1350"}`];
  try {
    const { slug } = await params;
    const f = await getFestival(slug);
    steps.push(`festival: ${f ? "found" : "missing"}`);
    if (!f) return new Response(debug ? steps.join("\n") : "Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
    const link = `${host}/f/${f.slug}`;
    const [fonts, logo] = await Promise.all([ogFonts(), logoForCard(f.logo_url)]);
    steps.push(`fonts: ${fonts.length}`, `logo: ${f.logo_url ? (logo ? "converted" : "failed → initials") : "none"}`);

    const filename = `${f.slug}-minflix-events${story ? "-status" : ""}.png`;
    const headers = {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
    };
    const render = async (withLogo: string | null) =>
      new ImageResponse(<ShareCard name={f.festival_name} logo={withLogo} link={link} story={story} />, {
        width: 1080,
        height: story ? 1920 : 1350,
        fonts,
      }).arrayBuffer(); // render fully here so errors are caught, not mid-stream

    let body: ArrayBuffer;
    try {
      body = await render(logo);
      steps.push("render: ok");
    } catch (err) {
      steps.push(`render with logo failed: ${describe(err)}`);
      body = await render(null);
      steps.push("render without logo: ok");
    }
    if (debug) return new Response(steps.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    return new Response(body, { headers });
  } catch (err) {
    steps.push(`FAILED: ${describe(err)}`);
    console.error("card.png failed", steps.join(" | "));
    return new Response(debug ? steps.join("\n") : "Card image unavailable", {
      status: debug ? 200 : 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
