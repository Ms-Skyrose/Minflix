import "server-only";
import { db } from "./supabase";
import { codesIn, COUNTRIES, countryByCode, upcomingQuarters } from "./countries";
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

/**
 * Every public read goes through `guarded`: if the database is slow (over 4 s) or errors, the page still
 * renders with an empty fallback instead of an error screen. Failures are logged on the server.
 */
function guarded<A extends unknown[], R>(name: string, fn: (...a: A) => Promise<R>, fallback: () => R) {
  return async (...args: A): Promise<R> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        fn(...args),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("timed out after 4s")), 4000);
        }),
      ]);
    } catch (err) {
      console.error(`[data] ${name} failed, showing fallback:`, err instanceof Error ? err.message : err);
      return fallback();
    } finally {
      clearTimeout(timer);
    }
  };
}

/** No database yet: sample festivals in local preview mode, otherwise nothing. */
const offline = (): Festival[] => (demoOn() ? DEMO : []);

/** Total listed festivals. */
async function _getTotal(): Promise<number> {
  const client = db();
  if (!client) return offline().length;
  const { count, error } = await client.from("festivals").select("id", { count: "exact", head: true }).eq("listed", true);
  if (error) throw error;
  return count ?? 0;
}

/** The most recent signups for the "Joining now" card. */
async function _getRecent(limit = 3): Promise<Festival[]> {
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

// The biggest film-entertainment country on each continent leads any tie (including the empty start):
// Africa: Nigeria (Nollywood) · North America: United States · Asia: India · Europe: France
// South America: Brazil · Oceania: Australia
const FOCUS = ["NG", "US", "IN", "FR", "BR", "AU"];
const focusRank = (code: string) => {
  const i = FOCUS.indexOf(code);
  return i === -1 ? FOCUS.length : i;
};

export type CountryRow ={ code: string; name: string; festivals: number; rank: number | null };

/** Every country with its festival count, most festivals first, then A–Z. */
async function _getLeaderboard(): Promise<CountryRow[]> {
  const counts = new Map<string, number>();
  const client = db();
  if (client) {
    const { data, error } = await client.from("festival_country_counts").select("country_code, festivals");
    if (error) throw error;
    for (const row of data ?? []) counts.set(row.country_code, row.festivals);
  } else {
    for (const f of offline()) counts.set(f.country_code, (counts.get(f.country_code) ?? 0) + 1);
  }
  // Most festivals first; ties go to each continent's leading film market, then A–Z.
  const focus = focusRank;
  const rows = COUNTRIES.map((c) => ({ code: c.code, name: c.name, festivals: counts.get(c.code) ?? 0 })).sort(
    (a, b) => b.festivals - a.festivals || focus(a.code) - focus(b.code) || a.name.localeCompare(b.name),
  );
  return rows.map((r, i) => ({ ...r, rank: r.festivals > 0 ? i + 1 : null }));
}

export type DirectoryQuery = { q?: string; continent?: string; type?: string };

async function _getDirectory({ q, continent, type }: DirectoryQuery, limit = 60): Promise<Festival[]> {
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

async function _getFestival(slug: string): Promise<Festival | null> {
  const client = db();
  if (!client) return offline().find((f) => f.slug === slug) ?? null;
  const { data, error } = await client.from("festivals").select(PUBLIC_COLUMNS).eq("slug", slug).eq("listed", true).maybeSingle();
  if (error) throw error;
  return data;
}

export type Season = { quarter: string; festivals: Festival[]; total: number };

/** Upcoming editions grouped by the quarter each festival gave, in calendar order. */
async function _getSeason(perQuarter = 3): Promise<Season[]> {
  const client = db();
  const quarters = upcomingQuarters();
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

export const getTotal = guarded("getTotal", _getTotal, () => 0);
export const getRecent = guarded("getRecent", _getRecent, () => []);
export const getLeaderboard = guarded("getLeaderboard", _getLeaderboard, (): CountryRow[] =>
  COUNTRIES.map((c) => ({ code: c.code, name: c.name, festivals: 0, rank: null })).sort(
    (a, b) => focusRank(a.code) - focusRank(b.code) || a.name.localeCompare(b.name),
  ),
);
export const getDirectory = guarded("getDirectory", _getDirectory, () => []);
export const getFestival = guarded("getFestival", _getFestival, () => null);
export const getSeason = guarded("getSeason", _getSeason, () => []);

/**
 * A festival seen by the person who just joined: works even if the listing is held back for review,
 * but only with the private edit token from their own signup.
 */
export const getOwnFestival = guarded(
  "getOwnFestival",
  async (slug: string, token: string): Promise<(Festival & { listed: boolean; flag_reason: string | null }) | null> => {
    const client = db();
    if (!client) {
      const f = offline().find((x) => x.slug === slug);
      return f ? { ...f, listed: true, flag_reason: null } : null;
    }
    if (!/^[0-9a-f-]{36}$/i.test(token)) return null;
    const { data, error } = await client
      .from("festivals")
      .select(`${PUBLIC_COLUMNS}, listed, flag_reason`)
      .eq("slug", slug)
      .eq("edit_token", token)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  () => null,
);
