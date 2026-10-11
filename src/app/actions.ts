"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, LOGO_BUCKET } from "@/lib/supabase";
import { countryByCode, FESTIVAL_TYPES, FILMS_PER_EDITION, HEADACHES, nextEditionOptions } from "@/lib/countries";
import { slugify } from "@/lib/format";
import { checkStamp, clientIp, hash24 } from "@/lib/guard";
import { checkFestivalName, cleanWebsite } from "@/lib/moderation";

export type JoinState = { error?: string; field?: string };

const CONSENT_VERSION = "2026-10-11";
const MAX_LOGO_BYTES = 3 * 1024 * 1024;
const LIMIT_PER_HOUR = 5;
const LIMIT_PER_DAY = 15;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const pick = (list: readonly string[], v: FormDataEntryValue | null) => (typeof v === "string" && list.includes(v) ? v : null);
const text = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const tag = (v: FormDataEntryValue | null, max: number) => {
  const t = text(v, max);
  return t ? t.replace(/[^\w .:/@+-]/g, "").slice(0, max) || null : null;
};

const GENERIC_ERROR = "We couldn't save that just now. Please try again in a minute.";

export async function joinWaitlist(_prev: JoinState, form: FormData): Promise<JoinState> {
  // 1. Bot checks: hidden field, and a form submitted faster than a person can fill it
  if (form.get("company")) return { error: GENERIC_ERROR };
  const stamp = checkStamp(form.get("started"));
  if (stamp === "too-fast" || stamp === "invalid") return { error: "Please take a moment to check your details, then tap Done again." };
  if (stamp === "expired") return { error: "This form has been open a long time. Refresh the page and try again." };

  // 2. Field checks
  const email = text(form.get("email"), 200)?.toLowerCase() ?? "";
  const festivalName = (text(form.get("festival_name"), 120) ?? "").replace(/\s+/g, " ");
  const country = countryByCode(text(form.get("country"), 2));
  if (!EMAIL.test(email)) return { error: "Enter a valid email address.", field: "email" };
  if (festivalName.length < 2) return { error: "Enter your festival's name.", field: "festival_name" };
  if (!country) return { error: "Choose your country.", field: "country" };
  if (form.get("consent") !== "yes") return { error: "Please agree to the privacy notice to join.", field: "consent" };
  const nameCheck = checkFestivalName(festivalName);
  if (!nameCheck.ok) return { error: nameCheck.error, field: "festival_name" };

  const client = db();
  if (!client) return { error: "The waitlist isn't connected yet. Add the Supabase keys to go live." };

  // 3. Rate limit: per device/network, hashed (no raw IPs stored)
  const who = hash24("signup", await clientIp());
  const since = (ms: number) => new Date(Date.now() - ms).toISOString();
  const [hour, day] = await Promise.all([
    client.from("signup_attempts").select("id", { count: "exact", head: true }).eq("client", who).gte("created_at", since(3600_000)),
    client.from("signup_attempts").select("id", { count: "exact", head: true }).eq("client", who).gte("created_at", since(86_400_000)),
  ]);
  if ((hour.count ?? 0) >= LIMIT_PER_HOUR || (day.count ?? 0) >= LIMIT_PER_DAY)
    return { error: "Too many signups from this network. Please try again later, or message us on Instagram @minflix." };
  await client.from("signup_attempts").insert({ client: who });
  // Retention promised in the privacy notice: spam-check records are kept 7 days.
  if (Math.random() < 0.05) await client.from("signup_attempts").delete().lt("created_at", since(7 * 86_400_000));

  // 4. Already on the list? Send them back to their card and invite link instead of an error
  const { data: existing } = await client.from("festivals").select("slug, listed").eq("email", email).maybeSingle();
  if (existing) {
    if (existing.listed) redirect(`/join/done?f=${existing.slug}&again=1`);
    return { error: "This email is already on the waitlist. Your listing is still being checked; message us on Instagram @minflix to speed it up.", field: "email" };
  }

  // 5. Optional logo: up to 3 MB, resized on the server to a small PNG
  let logoUrl: string | null = null;
  const logo = form.get("logo");
  if (logo instanceof File && logo.size > 0) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(logo.type)) return { error: "Logo must be a PNG, JPG or WebP image.", field: "logo" };
    if (logo.size > MAX_LOGO_BYTES) return { error: "Logo must be 3 MB or smaller.", field: "logo" };
    try {
      const sharp = (await import("sharp")).default;
      const png = await sharp(Buffer.from(await logo.arrayBuffer()))
        .rotate()
        .resize(600, 600, { fit: "inside", withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();
      const path = `${slugify(festivalName)}-${crypto.randomUUID().slice(0, 8)}.png`;
      const { error } = await client.storage.from(LOGO_BUCKET).upload(path, png, { contentType: "image/png" });
      if (error) throw error;
      logoUrl = client.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl;
    } catch (err) {
      console.error("logo upload failed", err);
      return { error: "We couldn't use that logo. Try another image or skip it.", field: "logo" };
    }
  }

  // 6. Save. Famous festival names are saved but held back from the public site until checked.
  const row = {
    email,
    festival_name: festivalName,
    country_code: country.code,
    logo_url: logoUrl,
    festival_type: pick(FESTIVAL_TYPES, form.get("festival_type")),
    films_per_edition: pick(FILMS_PER_EDITION, form.get("films_per_edition")),
    next_edition: pick(nextEditionOptions(), form.get("next_edition")),
    website: cleanWebsite(text(form.get("website"), 200)),
    referred_by: await validRef(tag(form.get("ref"), 90)?.toLowerCase() ?? null),
    consent_at: new Date().toISOString(),
    consent_version: CONSENT_VERSION,
    listed: nameCheck.hold === null,
    flag_reason: nameCheck.hold,
    utm_source: tag(form.get("utm_source"), 100),
    utm_medium: tag(form.get("utm_medium"), 100),
    utm_campaign: tag(form.get("utm_campaign"), 100),
    referrer_host: tag(form.get("referrer_host"), 200),
    landing_path: tag(form.get("landing_path"), 300),
  };

  const base = slugify(festivalName);
  let created: { slug: string; edit_token: string } | null = null;
  for (let i = 0; i < 6 && !created; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const ref_code = `${base.slice(0, 80)}-${shortCode()}`;
    const { data, error } = await client.from("festivals").insert({ ...row, slug, ref_code }).select("slug, edit_token").single();
    if (!error) created = data;
    else if (error.code === "23505" && error.message.includes("email")) {
      const { data: again } = await client.from("festivals").select("slug, listed").eq("email", email).maybeSingle();
      if (again?.listed) redirect(`/join/done?f=${again.slug}&again=1`);
      return { error: "This email is already on the waitlist.", field: "email" };
    } else if (error.code !== "23505") {
      console.error("join insert failed", error);
      return { error: GENERIC_ERROR };
    }
  }
  if (!created) return { error: GENERIC_ERROR };

  await client.from("signup_attempts").update({ ok: true }).eq("client", who).order("created_at", { ascending: false }).limit(1);
  revalidatePath("/");
  revalidatePath("/network");
  revalidatePath("/directory");
  redirect(`/join/done?f=${created.slug}&t=${created.edit_token}`);
}

/** 4 characters from an unambiguous alphabet (no 0/o, 1/l). */
function shortCode(): string {
  const abc = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return Array.from(bytes, (b) => abc[b % abc.length]).join("");
}

/** Keep a referral only if it is a real festival's invite code. */
async function validRef(ref: string | null): Promise<string | null> {
  const client = db();
  if (!client || !ref || !/^[a-z0-9-]{4,90}$/.test(ref)) return null;
  const { data } = await client.from("festivals").select("ref_code").eq("ref_code", ref).maybeSingle();
  return data?.ref_code ?? null;
}

export async function saveHeadache(form: FormData): Promise<{ ok: boolean }> {
  const slug = text(form.get("f"), 80);
  const token = text(form.get("t"), 40);
  const headache = pick(HEADACHES, form.get("headache"));
  const client = db();
  if (!client || !slug || !token || !headache || !/^[0-9a-f-]{36}$/i.test(token)) return { ok: false };
  const { error } = await client.from("festivals").update({ headache }).eq("slug", slug).eq("edit_token", token);
  return { ok: !error };
}
