import "server-only";
import { db } from "./supabase";
import { codesIn, COUNTRIES, countryByCode, NEXT_EDITION } from "./countries";
import { DEMO, demoOn } from "./demo";

export type Festival = {
  slug: string;
  created_at: string;
  festival_name: string;
  country_code: string;
  logo_url: string | null;
  festival_type: string | null;
  next_edition: string | null;
  website: string | null;
  ref_code: string;
};

// ref_code is public on purpose: it is what goes in a festival's invite link.
const PUBLIC_COLUMNS = "slug, ref_code, created_at, festival_name, country_code, logo_url, festival_type, next_edition, website";

/** No database yet: sample festivals in local preview mode, otherwise nothing. */
const offline = (): Festival[] => (demoOn() ? DEMO : []);

/** Total listed festivals. */
export async function getTotal(): Promise<number> {
  const client = db();
  if (!client) return offline().length;
  const { count, error } = await client.from("festivals").select("id", { count: "exact", head: true }).eq("listed", true);
  if (error) throw error;
  return count ?? 0;
}

/** The most recent signups for the "Joining now" card. */
export async function getRecent(limit = 3): Promise<Festival[]> {
  const client = db();
  if (!client) return [...offline()].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit);
  const { data, error } = await client
    .from("festivals")
    .select(PUBLIC_COLUMNS)
    .eq("listed", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

const FOCUS = ["NG", "GH", "KE", "ZA"];

export type CountryRow ={ code: string; name: string; festivals: number; rank: number | null };

/** Every country with its festival count, most festivals first, then A–Z. */
export async function getLeaderboard(): Promise<CountryRow[]> {
  const counts = new Map<string, number>();
  const client = db();
  if (client) {
    const { data, error } = await client.from("festival_country_counts").select("country_code, festivals");
    if (error) throw error;
    for (const row of data ?? []) counts.set(row.country_code, row.festivals);
  } else {
    for (const f of offline()) counts.set(f.country_code, (counts.get(f.country_code) ?? 0) + 1);
  }
  // Ties (including the empty start) put the launch markets first, then A–Z.
  const focus = (code: string) => {
    const i = FOCUS.indexOf(code);
    return i === -1 ? FOCUS.length : i;
  };
  const rows = COUNTRIES.map((c) => ({ code: c.code, name: c.name, festivals: counts.get(c.code) ?? 0 })).sort(
    (a, b) => b.festivals - a.festivals || focus(a.code) - focus(b.code) || a.name.localeCompare(b.name),
  );
  return rows.map((r, i) => ({ ...r, rank: r.festivals > 0 ? i + 1 : null }));
}

export type DirectoryQuery = { q?: string; continent?: string; type?: string };

export async function getDirectory({ q, continent, type }: DirectoryQuery, limit = 60): Promise<Festival[]> {
  const client = db();
  const inContinent = codesIn(continent);
  const term = (q ?? "").replace(/[%,()]/g, " ").trim();
  const codes = term ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(term.toLowerCase())).map((c) => c.code) : [];

  if (!client) {
    const t = term.toLowerCase();
    return offline()
      .filter((f) => !inContinent || inContinent.includes(f.country_code))
      .filter((f) => !type || f.festival_type === type)
      .filter((f) => !t || f.festival_name.toLowerCase().includes(t) || (f.festival_type ?? "").toLowerCase().includes(t) || codes.includes(f.country_code))
      .sort((a, b) => a.festival_name.localeCompare(b.festival_name))
      .slice(0, limit);
  }

  let query = client.from("festivals").select(PUBLIC_COLUMNS).eq("listed", true);
  if (inContinent) query = query.in("country_code", inContinent);
  if (type) query = query.eq("festival_type", type);
  if (term) {
    const ors = [`festival_name.ilike.%${term}%`, `festival_type.ilike.%${term}%`];
    if (codes.length) ors.push(`country_code.in.(${codes.join(",")})`);
    query = query.or(ors.join(","));
  }
  const { data, error } = await query.order("festival_name").limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getFestival(slug: string): Promise<Festival | null> {
  const client = db();
  if (!client) return offline().find((f) => f.slug === slug) ?? null;
  const { data, error } = await client.from("festivals").select(PUBLIC_COLUMNS).eq("slug", slug).eq("listed", true).maybeSingle();
  if (error) throw error;
  return data;
}

export type Season = { quarter: string; festivals: Festival[]; total: number };

/** Upcoming editions grouped by the quarter each festival gave, in calendar order. */
export async function getSeason(perQuarter = 3): Promise<Season[]> {
  const client = db();
  const quarters = NEXT_EDITION.filter((q) => q.startsWith("Q"));
  let rows: Festival[];
  if (!client) rows = offline().filter((f) => f.next_edition && quarters.some((q) => q === f.next_edition));
  else {
    const { data, error } = await client
      .from("festivals")
      .select(PUBLIC_COLUMNS)
      .eq("listed", true)
      .in("next_edition", quarters)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw error;
    rows = data ?? [];
  }
  return quarters
    .map((quarter) => {
      const all = rows.filter((f) => f.next_edition === quarter);
      return { quarter, festivals: all.slice(0, perQuarter), total: all.length };
    })
    .filter((s) => s.total > 0);
}

export function countryName(code: string): string {
  return countryByCode(code)?.name ?? code;
}
