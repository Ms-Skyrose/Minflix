# Minflix Events · festival waitlist

Waitlist site for **Minflix Events**, the everything-for-your-festival product from Minflix. Festival organisers join the waitlist, get a festival card to post on Instagram and WhatsApp Status, and get listed in the public **2027 Minflix Events Directory**.

Built with Next.js 15 (App Router) and Tailwind CSS, with Supabase for data. It runs on any Node.js server; nothing depends on Vercel.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Short landing page for newcomers: what Minflix Events is, who it's for, "today vs with Minflix Events", 3-step how it works, Joining now |
| `/network` | Festival network: every country's festival count (top 5 visible, scroll for the rest), invite link, directory preview, festival season by quarter, the full workflow |
| `/directory` | Public, searchable directory (name, country, type), filter by continent. Clicking a festival shows its details, its card (both sizes) and its invite link |
| `/join` | Waitlist form: email, festival name, country, logo (optional, up to 3 MB), festival type, films per edition, next edition, website/social, privacy consent. `?ref=<code>` credits the inviting festival |
| `/join/done` | "You're on the list" with the festival card (Post and Status sizes), then Continue |
| `/join/need` | "Help us know your biggest need" question, then the invite link and directory |
| `/f/<slug>` | A festival's public page with its card and invite link; its card is the link preview |
| `/f/<slug>/card.png` | Card image. `?size=story` for 1080×1920 (WhatsApp Status / Stories), default 1080×1350 (feed post). `?download=1` downloads it. `?debug=1` shows a step-by-step report if a card fails |
| `/privacy` | Privacy notice (Nigeria Data Protection Act 2023, EU/UK GDPR) |
| `/api/track` | Cookie-free visit counter used by every page |

## How it behaves

- **Already joined?** Signing up again with the same email shows that festival's card and invite link instead of an error. Festivals can also find their card and invite link by searching their name in the directory.
- **Corrections** go through Instagram DMs ([@minflix](https://www.instagram.com/minflix)); links to it appear on the form, done screen, card page and directory.
- **Saving cards works everywhere:** normal browsers download the file; iPhones open the share sheet so "Save Image" puts it in Photos; inside Instagram, TikTok and Facebook's built-in browsers (which block downloads) the card opens full-size with "press and hold to save" instructions.
- **Counts show from 12 up** (`MIN_PUBLIC_COUNT` in `src/lib/format.ts`) and count up from 0 when they scroll into view.
- **Fresh within 10 seconds**, and immediately after a signup.
- **A slow or failing database never breaks a page.** Every read times out after 4 seconds and the page renders without that data; the error is logged.
- **Next-edition quarters roll forward on their own** (this quarter plus the next five).

## Spam and fake listings

Listings go public instantly, with these checks (no third-party services):

1. **Hidden field** that only bots fill.
2. **Timing check:** the form carries a signed timestamp; submissions under 3 seconds or over 12 hours old are refused.
3. **Rate limit:** 5 signups per hour and 15 per day from the same network (stored as a one-way hash, deleted after 7 days).
4. **Name filter** (`src/lib/moderation.ts`): blocked words (profanity, slurs, adult and gambling spam) are refused. Famous festival names (AFRIFF, FESPACO, Cannes, Sundance… and "Minflix") are saved but **held back** from the public site with `flag_reason = 'reserved-name'`.

To approve a held festival: Supabase → Table Editor → `festivals` → find it (`flag_reason` is set) → set `listed` to `true`. To hide any festival, set `listed` to `false`. Edit the word lists in `src/lib/moderation.ts`.

## Counting visitors and signups

Every page view is recorded in `page_views` without cookies. The visitor id is a one-way hash of network address + browser + date, so it rotates daily and can't be traced back. Browsers sending Do Not Track or Global Privacy Control are not counted, and bots are skipped. Each signup also stores where it came from (UTM tags, invite code, referring site).

Read the numbers in Supabase → SQL Editor:

```sql
select * from daily_stats limit 30;     -- visitors, page views, signups, conversion % per day (Lagos time)
select * from signup_sources;           -- signups by source: utm_source, "festival invite", referring site, or direct
select * from top_referrers;            -- festivals that brought in other festivals
```

To track a campaign, add UTM tags to the link you post, e.g. `https://events.minflix.com/?utm_source=instagram&utm_campaign=launch`.

## Running it

Needs **Node.js 20 or newer** and the Supabase project.

```bash
git clone https://github.com/Ms-Skyrose/Minflix.git
cd Minflix
npm ci
cp .env.example .env.local     # then fill in the values below
npm run build
npm start                      # serves on port 3000 (PORT=8080 npm start for another port)
```

For development with live reload: `npm run dev`.

### Environment variables

| Variable | Required | What it is |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase → Project settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase → Project settings → API keys → `service_role` / secret key. Server only; never commit it |
| `HASH_SALT` | Recommended | Any long random string (`openssl rand -hex 32`). Used for visitor and spam-check hashes |
| `PRIVACY_EMAIL` | Optional | Shown on the privacy page as a contact address, next to Instagram |

There is no site-URL setting: links, cards and link previews use the domain the site is opened on.

### Database

Run both files in Supabase → SQL Editor, in order (already applied on the `minflix-events` project):

1. `supabase/migrations/0001_festival_waitlist.sql`: festivals table, country counts, logo bucket
2. `supabase/migrations/0002_safety_privacy_analytics.sql`: consent, review flags, signup sources, visit counting, rate limits, stats views

### On a server (Nginx in front of Node)

Run the app with a process manager so it restarts on crashes and reboots:

```bash
npm i -g pm2
pm2 start npm --name minflix-events -- start
pm2 save && pm2 startup
```

Nginx site (adjust the domain). The forwarded headers matter: they give the app the real domain (for links and cards) and the visitor's address (for spam limits):

```nginx
server {
  server_name events.minflix.com;
  client_max_body_size 5m;          # logos up to 3 MB; the default 1 MB would reject them

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

Then add HTTPS (e.g. `certbot --nginx -d events.minflix.com`).

Optional: if a CDN or proxy in front sets a country header (`cf-ipcountry` or `x-country-code`), the join form pre-selects the visitor's country.

### With Docker

```bash
docker build -t minflix-events .
docker run -d --restart unless-stopped -p 3000:3000 --env-file .env.local --name minflix-events minflix-events
```

### After deploying, check

- `https://<domain>/f/<any-festival-slug>/card.png?debug=1` should list `fonts: 4` and `render: ok`.
- Join with a test email, check the card saves on a phone, then delete the test row in Supabase.

## Layout preview without a database

`DEMO_DATA=1 npm run build && DEMO_DATA=1 npm start` fills the pages with sample festivals. It only works when `SUPABASE_URL` is not set, so it can never show sample data in production.

## Brand

Navy-black `#000C14`, magenta `#E400EC`, electric blue `#0A7AE8`, Poppins (bundled, no Google Fonts call), frosted-glass panels. Tokens live in `src/app/globals.css`. The hero image (`public/hero-festival.jpg`) is a rendered festival-night illustration; replace it with a real festival photo (same name, about 16:10). The logo mark is drawn in `src/components/brand.tsx` until the official files are added.
