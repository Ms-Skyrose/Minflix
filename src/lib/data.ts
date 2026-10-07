import "server-only";
import { db } from "./supabase";
import { codesIn, COUNTRIES, countryByCode } from "./countries";

export type Festival = {
  slug: string;
  created_at: string;
  festival_name: string;
  country_code: string;
  logo_url: string | null;
  festival_type: string | null;
  next_edition: string | null;
  website: string | null;
};

const PUBLIC_COLUMNS = "slug, created_at, festival_name, country_code, logo_url, festival_type, next_edition, website";

/** Total listed festivals. */
export async function getTotal(): Promise<number> {
  const client = db();
  if (!client) return 0;
  const { count, error } = await client.from("festivals").select("id", { count: "exact", head: true }).eq("listed", true);
  if (error) throw error;
  return count ?? 0;
}

/** The three most recent signups for the "Joining now" card. */
export async function getRecent(limit = 3): Promise<Festival[]> {
  const client = db();
  if (!client) return [];
  const { data, error } = await client
    .from("festivals")
    .select(PUBLIC_COLUMNS)
    .eq("listed", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export type CountryRow = { code: string; name: string; festivals: number; rank: number | null };

/** Every country with its festival count, most festivals first, then A–Z. */
export async function getLeaderboard(): Promise<CountryRow[]> {
  const counts = new Map<string, number>();
  const client = db();
  if (client) {
    const { data, error } = await client.from("festival_country_counts").select("country_code, festivals");
    if (error) throw error;
    for (const row of data ?? []) counts.set(row.country_code, row.festivals);
  }
  const rows = COUNTRIES.map((c) => ({ code: c.code, name: c.name, festivals: counts.get(c.code) ?? 0 })).sort(
    (a, b) => b.festivals - a.festivals || a.name.localeCompare(b.name),
  );
  return rows.map((r, i) => ({ ...r, rank: r.festivals > 0 ? i + 1 : null }));
}

export type DirectoryQuery = { q?: string; continent?: string; type?: string };

export async function getDirectory({ q, continent, type }: DirectoryQuery, limit = 60): Promise<Festival[]> {
  const client = db();
  if (!client) return [];
  let query = client.from("festivals").select(PUBLIC_COLUMNS).eq("listed", true);
  const inContinent = codesIn(continent);
  if (inContinent) query = query.in("country_code", inContinent);
  if (type) query = query.eq("festival_type", type);
  if (q) {
    const term = q.replace(/[%,()]/g, " ").trim();
    const codes = COUNTRIES.filter((c) => c.name.toLowerCase().includes(term.toLowerCase())).map((c) => c.code);
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
  if (!client) return null;
  const { data, error } = await client.from("festivals").select(PUBLIC_COLUMNS).eq("slug", slug).eq("listed", true).maybeSingle();
  if (error) throw error;
  return data;
}

export function countryName(code: string): string {
  return countryByCode(code)?.name ?? code;
}
