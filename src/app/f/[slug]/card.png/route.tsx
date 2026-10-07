import { ImageResponse } from "next/og";
import { getFestival } from "@/lib/data";
import { ShareCard } from "@/lib/og";
import { logoForCard, ogFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";

const describe = (err: unknown) => (err instanceof Error ? `${err.name}: ${err.message}\n${(err.stack ?? "").split("\n").slice(1, 6).join("\n")}` : String(err));

/**
 * The festival's 1080×1350 share card as a PNG. The printed link uses the domain the card was requested on.
 * `?debug=1` returns the error text instead of a 500 page, so failures can be diagnosed from a phone.
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const debug = new URL(req.url).searchParams.has("debug");
  const steps: string[] = [];
  try {
    const { slug } = await params;
    const f = await getFestival(slug);
    steps.push(`festival: ${f ? "found" : "missing"}`);
    if (!f) return new Response("Not found", { status: 404 });

    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
    const link = `${host}/f/${f.slug}`;
    const [fonts, logo] = await Promise.all([ogFonts(), logoForCard(f.logo_url)]);
    steps.push(`fonts: ${fonts.length}`, `logo: ${f.logo_url ? (logo ? "converted" : "failed → initials") : "none"}`);
    const headers = { "Cache-Control": "public, max-age=300", "Content-Type": "image/png", "Content-Disposition": `inline; filename="${f.slug}-minflix-events.png"` };

    const render = async (withLogo: string | null) => {
      const img = new ImageResponse(<ShareCard name={f.festival_name} logo={withLogo} link={link} />, { width: 1080, height: 1350, fonts });
      return img.arrayBuffer(); // render fully here so errors are caught, not mid-stream
    };

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
