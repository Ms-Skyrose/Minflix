/**
 * Name checks for new festivals. Listings go public instantly, so:
 *  - BLOCKED words are refused outright (the person is asked to use their festival's real name);
 *  - RESERVED names (well-known festivals, and Minflix itself) are saved but held back from the
 *    public site until the team sets `listed = true` in Supabase.
 * Edit these lists freely; matching ignores case, accents and punctuation, on whole words.
 */

const BLOCKED = [
  // profanity and slurs (English)
  "fuck", "fucking", "fucker", "shit", "bitch", "bastard", "cunt", "dick", "pussy", "asshole", "motherfucker",
  "nigger", "nigga", "faggot", "retard", "whore", "slut",
  // Nigerian Pidgin / common local insults
  "ashawo", "olodo", "mumu", "werey", "oloshi", "onye ara",
  // spam and adult
  "porn", "porno", "xxx", "nude", "nudes", "onlyfans", "escort", "casino", "betting", "sportybet", "bet9ja",
  "giveaway", "airdrop", "forex", "loan", "viagra", "hookup",
];

/** Matched anywhere, even inside other words ("Shitpost" → blocked). Keep this list to words with no innocent uses. */
const BLOCKED_ANYWHERE = ["fuck", "shit", "cunt", "nigger", "nigga", "faggot", "porn", "motherfuck", "bitch", "whore"];

const RESERVED = [
  // African festivals people may impersonate
  "afriff", "africa international film festival", "fespaco", "durban international film festival", "diff",
  "zanzibar international film festival", "ziff", "encounters south african international documentary film festival", "carthage film festival", "jcc",
  "luxor african film festival", "amvca", "amaa", "nollywood week", "lagos international film festival",
  "kenya international film festival", "joburg film festival", "silicon valley african film festival",
  // major international festivals
  "cannes", "berlinale", "venice film festival", "sundance", "tiff", "toronto international film festival",
  "sxsw", "tribeca", "locarno", "rotterdam", "iffr", "idfa", "hot docs", "clermont ferrand", "annecy",
  "busan", "bfi london film festival", "telluride", "karlovy vary",
  // the brand itself
  "minflix",
];

const norm = (s: string) =>
  ` ${s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;

const has = (hay: string, needle: string) => hay.includes(` ${norm(needle).trim()} `);

export type NameCheck = { ok: true; hold: string | null } | { ok: false; error: string };

export function checkFestivalName(name: string): NameCheck {
  const n = norm(name);
  if (!/[a-z]/.test(n)) return { ok: false, error: "Enter your festival's name using letters." };
  if (/https?:|www\.|\.(com|net|org|ng|xyz)\b/i.test(name)) return { ok: false, error: "Enter just your festival's name. Add your website in the website field." };
  if (/(.)\1{5,}/.test(n)) return { ok: false, error: "Enter your festival's real name." };
  const squashed = n.replace(/ /g, "");
  if (BLOCKED.some((w) => has(n, w)) || BLOCKED_ANYWHERE.some((w) => squashed.includes(w)))
    return { ok: false, error: "Please use your festival's real name." };
  if (RESERVED.some((w) => has(n, w))) return { ok: true, hold: "reserved-name" };
  return { ok: true, hold: null };
}

/** Light check for the website field: blocked words or obvious spam hosts are dropped. */
export function cleanWebsite(url: string | null): string | null {
  if (!url) return null;
  const n = norm(url);
  if (BLOCKED.some((w) => has(n, w)) || BLOCKED_ANYWHERE.some((w) => n.replace(/ /g, "").includes(w))) return null;
  return url.replace(/\s+/g, "").slice(0, 200);
}
