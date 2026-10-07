/** Hide public counts until a list has at least this many entries, so small numbers never look like placeholders. */
export const MIN_PUBLIC_COUNT = 12;

const DAY = 86_400_000;

/** "just now", "9m ago", "3h ago", "2d ago" — or "" when it was more than 5 days ago. */
export function timeAgo(iso: string, now = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  if (!Number.isFinite(diff) || diff < 0 || diff > 5 * DAY) return "";
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function initials(name: string): string {
  const words = name.split(/\s+/).filter((w) => /^[A-Za-z0-9]/.test(w));
  const caps = words.filter((w) => /^[A-Z0-9]/.test(w));
  return (caps.length ? caps : words)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "F";
}

export function slugify(name: string): string {
  return (
    name
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "festival"
  );
}

/** Rotating brand tiles for festivals without a logo. */
const TILES = [
  { bg: "#E400EC", fg: "#000C14" },
  { bg: "#0A7AE8", fg: "#FFFFFF" },
  { bg: "#FFFFFF", fg: "#000C14" },
];
export function tileFor(key: string) {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TILES[h % TILES.length];
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://events.minflix.com").replace(/\/$/, "");
}

export function displayUrl(u: string | null | undefined): string {
  return (u || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function hrefFor(u: string): string {
  return /^https?:\/\//.test(u) ? u : `https://${u}`;
}
