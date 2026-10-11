import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";

/** Secret for hashing and signing. Set HASH_SALT on the server; falls back to a value derived from the service key. */
function secret(): string {
  return process.env.HASH_SALT || createHash("sha256").update(`mf:${process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev"}`).digest("hex");
}

/** The visitor's IP as forwarded by the reverse proxy (Nginx: proxy_set_header X-Forwarded-For …). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** A 24-character one-way hash. `scope` keeps different uses (rate limit, daily visitor id) unlinkable. */
export function hash24(...parts: string[]): string {
  return createHash("sha256").update([secret(), ...parts].join("|")).digest("base64url").slice(0, 24);
}

// ---- Form timing: a signed "form shown at" stamp; submissions faster than a human are rejected ----

export function formStamp(now = Date.now()): string {
  const ts = String(now);
  const sig = createHmac("sha256", secret()).update(ts).digest("base64url").slice(0, 22);
  return `${ts}.${sig}`;
}

export type StampCheck = "ok" | "too-fast" | "expired" | "invalid";

export function checkStamp(stamp: unknown, minMs = 3000, maxMs = 12 * 3600_000): StampCheck {
  if (typeof stamp !== "string" || !/^\d{13}\.[\w-]{22}$/.test(stamp)) return "invalid";
  const [ts, sig] = stamp.split(".");
  const want = createHmac("sha256", secret()).update(ts).digest("base64url").slice(0, 22);
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return "invalid";
  const age = Date.now() - Number(ts);
  if (age < minMs) return "too-fast";
  if (age > maxMs) return "expired";
  return "ok";
}
