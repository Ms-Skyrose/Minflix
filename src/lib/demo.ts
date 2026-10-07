// Sample festivals for local layout previews only. Used when DEMO_DATA=1 and Supabase is not configured.
// Never active in production: the real data source always takes over once SUPABASE_URL is set.
import type { Festival } from "./data";

export const demoOn = () => process.env.DEMO_DATA === "1" && !process.env.SUPABASE_URL;

const now = Date.now();
const ago = (min: number) => new Date(now - min * 60_000).toISOString();

export const DEMO: Festival[] = [
  ["Lagoon Shorts Festival", "NG", "Short film festival", "Q1 2027", "instagram.com/lagoonshorts", 2],
  ["Accra Doc Days", "GH", "Documentary festival", "Q2 2027", "accradocdays.com", 9],
  ["Nairobi Animation Week", "KE", "Animation festival", "Q3 2027", null, 60 * 24 * 6],
  ["Cape Genre Nights", "ZA", "Genre festival", "Q4 2027", "capegenrenights.co.za", 60 * 24 * 8],
  ["Ibadan Student Film Fest", "NG", "Student festival", "Q2 2027", "instagram.com/isff", 60 * 24 * 9],
  ["Abuja Indie Screen", "NG", "Film festival", "Q4 2026", null, 60 * 24 * 10],
  ["Kumasi Shorts Weekend", "GH", "Short film festival", "Q3 2027", null, 60 * 24 * 11],
  ["Kigali Frames", "RW", "Film festival", "Q1 2027", "kigaliframes.rw", 60 * 24 * 12],
  ["Diaspora Shorts London", "GB", "Short film festival", "Q2 2027", null, 60 * 24 * 13],
].map(([name, cc, type, next, web, min], i) => ({
  slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  ref_code: `${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-k${i}x2`,
  created_at: ago(Number(min)),
  festival_name: String(name),
  country_code: String(cc),
  logo_url: null,
  festival_type: String(type),
  next_edition: String(next),
  website: web ? String(web) : null,
}));
