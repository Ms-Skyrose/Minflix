"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, LOGO_BUCKET } from "@/lib/supabase";
import { countryByCode, FESTIVAL_TYPES, FILMS_PER_EDITION, HEADACHES, NEXT_EDITION } from "@/lib/countries";
import { slugify } from "@/lib/format";

export type JoinState = { error?: string; field?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pick = <T extends readonly string[]>(list: T, v: FormDataEntryValue | null) =>
  typeof v === "string" && (list as readonly string[]).includes(v) ? v : null;
const text = (v: FormDataEntryValue | null, max: number) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

export async function joinWaitlist(_prev: JoinState, form: FormData): Promise<JoinState> {
  if (form.get("company")) return {}; // honeypot: bots fill hidden fields

  const email = text(form.get("email"), 200)?.toLowerCase() ?? "";
  const festivalName = text(form.get("festival_name"), 120) ?? "";
  const country = countryByCode(text(form.get("country"), 2));

  if (!EMAIL.test(email)) return { error: "Enter a valid email address.", field: "email" };
  if (festivalName.length < 2) return { error: "Enter your festival's name.", field: "festival_name" };
  if (!country) return { error: "Choose your country.", field: "country" };

  const client = db();
  if (!client) return { error: "The waitlist isn't connected yet. Add the Supabase keys to go live." };

  // Optional logo upload
  let logoUrl: string | null = null;
  const logo = form.get("logo");
  if (logo instanceof File && logo.size > 0) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(logo.type))
      return { error: "Logo must be a PNG, JPG or WebP.", field: "logo" };
    if (logo.size > 2 * 1024 * 1024) return { error: "Logo must be under 2 MB.", field: "logo" };
    const ext = logo.type.split("/")[1].replace("jpeg", "jpg");
    const path = `${slugify(festivalName)}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { error } = await client.storage.from(LOGO_BUCKET).upload(path, logo, { contentType: logo.type });
    if (error) return { error: "We couldn't upload that logo. Try another file or skip it.", field: "logo" };
    logoUrl = client.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const row = {
    email,
    festival_name: festivalName,
    country_code: country.code,
    logo_url: logoUrl,
    festival_type: pick(FESTIVAL_TYPES, form.get("festival_type")),
    films_per_edition: pick(FILMS_PER_EDITION, form.get("films_per_edition")),
    next_edition: pick(NEXT_EDITION, form.get("next_edition")),
    website: text(form.get("website"), 200),
    referred_by: text(form.get("ref"), 80),
  };

  // Insert with a unique slug (lagoon-shorts, lagoon-shorts-2, …)
  const base = slugify(festivalName);
  let created: { slug: string; edit_token: string } | null = null;
  for (let i = 0; i < 6 && !created; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const { data, error } = await client.from("festivals").insert({ ...row, slug }).select("slug, edit_token").single();
    if (!error) created = data;
    else if (error.code === "23505" && error.message.includes("email"))
      return { error: "This email is already on the waitlist. We'll be in touch at launch.", field: "email" };
    else if (error.code !== "23505") return { error: "We couldn't save that just now. Please try again." };
  }
  if (!created) return { error: "We couldn't save that just now. Please try again." };

  revalidatePath("/");
  revalidatePath("/directory");
  redirect(`/join/done?f=${created.slug}&t=${created.edit_token}`);
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
