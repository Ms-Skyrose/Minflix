import { headers } from "next/headers";
import { db } from "@/lib/supabase";
import { clientIp, hash24 } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|headless|lighthouse/i;
const clip = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().replace(/[^\w .:/@+-]/g, "").slice(0, max) || null : null);

/** One page view. Stores a daily-rotating visitor hash (IP + browser + date, one-way); no cookies, no raw IP. */
export async function POST(req: Request) {
  try {
    const h = await headers();
    const ua = h.get("user-agent") ?? "";
    const client = db();
    if (!client || BOT.test(ua)) return new Response(null, { status: 204 });

    const body = await req.json().catch(() => ({}));
    const path = clip(body.path, 300);
    if (!path || !path.startsWith("/") || path.startsWith("/api")) return new Response(null, { status: 204 });

    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
    const country = (h.get("cf-ipcountry") || h.get("x-country-code") || h.get("x-vercel-ip-country") || "").slice(0, 2).toUpperCase() || null;

    await client.from("page_views").insert({
      path,
      day,
      visitor: hash24("visit", day, await clientIp(), ua),
      referrer_host: clip(body.referrer_host, 200),
      utm_source: clip(body.utm_source, 100),
      utm_medium: clip(body.utm_medium, 100),
      utm_campaign: clip(body.utm_campaign, 100),
      ref_code: clip(body.ref, 90)?.toLowerCase() ?? null,
      country,
    });
    // Retention promised in the privacy notice: visit records are kept up to 13 months.
    if (Math.random() < 0.002) {
      const cutoff = new Date(Date.now() - 395 * 86_400_000).toISOString().slice(0, 10);
      await client.from("page_views").delete().lt("day", cutoff);
    }
  } catch (err) {
    console.error("track failed", err);
  }
  return new Response(null, { status: 204 });
}
