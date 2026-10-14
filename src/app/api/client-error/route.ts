import { headers } from "next/headers";
import { db } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : null);
const BOT = /bot|crawl|spider|headless|curl|wget|python/i;

/**
 * Anonymous error reports from the browser (e.g. a join that failed to send), so problems on festivals'
 * phones can be diagnosed. Stores only the error text, the step and the browser name; no form contents, no IP.
 */
export async function POST(req: Request) {
  try {
    const ua = (await headers()).get("user-agent") ?? "";
    const client = db();
    if (!client || BOT.test(ua)) return new Response(null, { status: 204 });
    const body = await req.json().catch(() => ({}));
    await client.from("client_errors").insert({
      stage: clip(body.stage, 40),
      message: clip(body.message, 500),
      name: clip(body.name, 60),
      path: clip(body.path, 200),
      user_agent: ua.slice(0, 300),
    });
    // Keep reports for 30 days.
    if (Math.random() < 0.02) await client.from("client_errors").delete().lt("created_at", new Date(Date.now() - 30 * 86_400_000).toISOString());
  } catch (err) {
    console.error("client-error report failed", err);
  }
  return new Response(null, { status: 204 });
}
