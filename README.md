# Minflix Events · festival waitlist

Waitlist site for **Minflix Events**, the everything-for-your-festival product from Minflix. Festivals join the waitlist, get listed in the public **2027 Minflix Events Directory**, and get a share card to post.

Built with Next.js (App Router) + Tailwind CSS, with Supabase for data.

## What's in it

| Route | What it does |
| --- | --- |
| `/` | Landing page: live festival count, "Joining now" (last 3 signups), festival network leaderboard (every country, top 5 visible, scroll for the rest), directory preview, the nine-tools problem, the Minflix workflow loop, CTA |
| `/join` | Waitlist form: email, festival name, country, logo (optional), festival type, films per edition, next edition, website/social. `?ref=<slug>` credits the inviting festival |
| `/join/done` | "You're on the list", share card link, personal invite link, and the "biggest headache" question |
| `/directory` | Public, searchable directory (name, country, type), filterable by continent, with a detail panel per festival |
| `/f/<slug>` | A festival's public card page, with its share image as the link preview |
| `/f/<slug>/card.png` | The 1080×1350 share card image |
| `/opengraph-image` | Link preview for the site, with the live count |

### Rules built in

- **Counts only show from 12 up.** The hero, CTA, directory and link preview hide the number until there are at least 12 festivals (`MIN_PUBLIC_COUNT` in `src/lib/format.ts`), so a small or empty list never looks like a placeholder.
- **The count animates** from 0 to the real total when it scrolls into view.
- **"Joining now"** lists the 3 most recent signups. A relative time ("9m ago") shows only if they joined within the last 5 days.
- **Privacy:** emails are never sent to the browser. All reads and writes go through the server with the service-role key; the table has row-level security on and no public policies.

## Setup

1. **Create a Supabase project** (free tier is fine).
2. **Run the schema**: open SQL Editor, paste `supabase/migrations/0001_festival_waitlist.sql`, run it. This creates the `festivals` table, the country-count view and the public `festival-logos` storage bucket.
3. **Environment**: copy `.env.example` to `.env.local` and fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Project settings → API) and `NEXT_PUBLIC_SITE_URL`.
4. **Run it**
   ```bash
   npm install
   npm run dev
   ```
5. **Deploy**: import the repo on Vercel and add the same three environment variables.

Without the Supabase variables the site still renders (with no festivals yet), and the form explains that the waitlist isn't connected.

## Viewing signups

Supabase → Table Editor → `festivals` (export to CSV from there). Useful columns: `festival_name`, `country_code`, `email`, `festival_type`, `next_edition`, `headache`, `referred_by`. Set `listed = false` to hide a festival from the public directory.

## Brand

Navy-black `#000C14`, magenta `#E400EC`, electric blue `#0A7AE8`, Poppins, dashed curve motifs and frosted-glass panels. Tokens live in `src/app/globals.css`. The hero image (`public/hero-festival.jpg`) is a rendered festival-night illustration; replace it with a real festival photo when you have one (same file name, roughly 16:10). the logo is drawn in `src/components/brand.tsx` and can be swapped for the official file.
