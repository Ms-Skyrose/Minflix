import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, FestivalTile, Footer, Nav } from "@/components/brand";
import { CopyLink } from "@/components/copy-link";
import { WorkflowLoop } from "@/components/sections";
import { countryName, getDirectory, getLeaderboard, getSeason, getTotal } from "@/lib/data";
import { MIN_PUBLIC_COUNT } from "@/lib/format";

export const metadata: Metadata = {
  title: "Festival network · Minflix Events",
  description: "Film festivals getting ready for Minflix Events, by country and by quarter. Invite another festival or browse the directory.",
};
export const revalidate = 10;

/** Everything beyond the first explanation: the network leaderboard, directory preview, festival season and the full workflow. */
export default async function NetworkPage() {
  const [total, board, featured, season] = await Promise.all([getTotal(), getLeaderboard(), getDirectory({}, 3), getSeason(3)]);
  const showCount = total >= MIN_PUBLIC_COUNT;
  const withFestivals = board.filter((c) => c.festivals > 0).length;
  const top = board[0]?.festivals || 1;

  return (
    <main className="relative overflow-hidden">
      <div className="orb -right-40 -top-40 size-[560px] bg-magenta/35" />
      <div className="orb -left-60 top-[700px] size-[520px] bg-blue/35" />
      <Nav />
      <div className="h-[clamp(24px,4vw,48px)]" />

      {/* FESTIVAL NETWORK */}
      <section id="network" className="relative mx-auto flex max-w-[1240px] scroll-mt-6 flex-col gap-6 px-4 pb-[clamp(56px,7vw,88px)] pt-4">
        <div className="flex max-w-[760px] flex-col gap-2.5">
          <p className="eyebrow m-0">Festival network</p>
          <h1 className="display m-0 text-[clamp(30px,4vw,50px)]">Festivals getting ready for Minflix Events</h1>
          <p className="m-0 text-[17px] text-mist">Is your country&apos;s festival community represented?</p>
        </div>
        <div className="flex flex-wrap items-stretch gap-5">
          <div className="glass flex min-w-0 flex-[999_1_480px] flex-col gap-2.5 rounded-[26px] p-3.5">
            <div className="flex justify-between gap-3 px-1.5 pt-1 text-xs text-fog">
              <span>All {board.length} countries · scroll</span>
              {showCount && <span>{withFestivals} with festivals</span>}
            </div>
            <ol className="scrollbox m-0 flex max-h-[420px] list-none flex-col gap-2 overflow-y-auto p-0 pr-1" tabIndex={0} aria-label="Festivals per country">
              {board.map((c) => (
                <li key={c.code} className="glass-soft flex shrink-0 flex-col gap-2 rounded-2xl px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 text-xs font-semibold tabular-nums text-[#8FA4AD]">{c.rank ?? "–"}</span>
                    <span className="min-w-[30px] rounded-md bg-white px-1.5 py-0.5 text-center text-[11px] font-bold text-ink">{c.code}</span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{c.name}</span>
                    {c.festivals > 0 ? (
                      <span className="text-xl font-extrabold tabular-nums">{c.festivals}</span>
                    ) : (
                      <Link href="/join" className="whitespace-nowrap text-xs font-semibold text-[#F7A8FA]">Be the first</Link>
                    )}
                  </div>
                  <div className="h-[7px] rounded-full bg-white/[0.08]">
                    <div className="h-[7px] rounded-full bg-magenta shadow-[0_0_12px_rgba(228,0,236,0.6)]"
                      style={{ width: c.festivals ? `${Math.max(2, (c.festivals / top) * 100)}%` : 0 }} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="glass flex min-w-0 flex-[1_1_320px] flex-col justify-center gap-3 rounded-[26px] p-6">
            <span className="text-xl font-bold leading-snug">Know another festival getting ready for its next edition?</span>
            <span className="text-[15px] text-mist">Every festival that joins moves your country up the list.</span>
            <CopyLink path="/join" label="Invite to Minflix Festival Network" shareText="Get your festival listed in the 2027 Minflix Events Directory" />
          </div>
        </div>
      </section>

      {/* DIRECTORY */}
      <section id="directory" className="relative mx-auto flex max-w-[1240px] flex-col gap-5 px-4 pb-[clamp(64px,8vw,96px)] pt-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[640px] flex-col gap-2.5">
            <p className="eyebrow m-0">2027 Minflix Events Directory</p>
            <h2 className="display m-0 text-[clamp(28px,3.6vw,44px)]">Get your festival listed where filmmakers can discover it.</h2>
          </div>
          <Link href="/directory" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-ink">
            Browse all Festivals <Arrow />
          </Link>
        </div>
        <form action="/directory" className="glass flex items-center gap-2.5 rounded-full py-1.5 pl-4 pr-1.5">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0"><circle cx="11" cy="11" r="7" fill="none" stroke="#C2D1D7" strokeWidth="2" /><path d="M20 20l-4-4" stroke="#C2D1D7" strokeWidth="2" strokeLinecap="round" /></svg>
          <label htmlFor="home-search" className="sr-only">Search festivals</label>
          <input id="home-search" name="q" type="search" placeholder="Search festivals" className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none" />
          <button type="submit" className="btn-blue !min-h-0 !px-5 !py-2.5 text-sm">Search</button>
        </form>
        {featured.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3">
            {featured.map((f) => (
              <Link key={f.slug} href={`/directory?f=${f.slug}`} className="glass flex items-center gap-3.5 rounded-[20px] p-4">
                <FestivalTile name={f.festival_name} logo={f.logo_url} size={46} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-bold">{f.festival_name}</span>
                  <span className="text-[13px] text-mist">{[countryName(f.country_code), f.festival_type, f.next_edition].filter(Boolean).join(" · ")}</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <Link href="/join" className="rounded-[20px] border-[1.5px] border-dashed border-white/30 p-6 text-center">
            <span className="block text-lg font-bold">Be one of the first festivals listed</span>
            <span className="text-mist">Join the waitlist to claim your spot in the 2027 Directory →</span>
          </Link>
        )}
      </section>

      {/* CATALYST: festival season, built from the quarters festivals give when they join */}
      <section className="relative mx-auto flex max-w-[1240px] flex-col gap-7 px-4 pt-[clamp(64px,8vw,104px)]">
        <div className="flex max-w-[720px] flex-col gap-2.5">
          <p className="eyebrow m-0">Festival season</p>
          <h2 className="display m-0 text-[clamp(28px,3.6vw,44px)]">The festival calendar doesn&apos;t wait. Get listed before your next call for entries.</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
          {season.map((s) => (
            <div key={s.quarter} className="glass flex flex-col gap-2.5 rounded-[20px] p-5">
              <span className="text-xs font-semibold tracking-[0.06em] text-magenta-soft">{s.quarter.toUpperCase()}</span>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {s.festivals.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/directory?f=${f.slug}#details`} className="flex items-center gap-2.5">
                      <FestivalTile name={f.festival_name} logo={f.logo_url} size={30} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold">{f.festival_name}</span>
                        <span className="block text-xs text-fog">{countryName(f.country_code)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {s.total > s.festivals.length && (
                <Link href="/directory" className="text-[13px] text-mist underline">+{s.total - s.festivals.length} more next edition{s.total - s.festivals.length > 1 ? "s" : ""}</Link>
              )}
            </div>
          ))}
          <Link href="/join" className="flex flex-col gap-1.5 rounded-[20px] border-[1.5px] border-dashed border-white/30 p-5">
            <span className="text-xs font-semibold tracking-[0.06em] text-fog">YOUR NEXT EDITION</span>
            <span className="text-lg font-bold">Your festival here</span>
            <span className="text-sm">Tell us your quarter and join the waitlist →</span>
          </Link>
        </div>
      </section>

      {/* WHAT YOU'LL RUN */}
      <section className="relative mt-[clamp(64px,8vw,104px)] rounded-t-[clamp(28px,4vw,48px)] bg-paper text-ink">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-7 px-4 pb-[clamp(72px,9vw,112px)] pt-10">
          <div className="flex max-w-[640px] flex-col items-center gap-2.5 text-center">
            <p className="eyebrow m-0 !text-magenta-deep">Your festival, start to finish</p>
            <h2 className="display m-0 text-[clamp(28px,3.6vw,44px)]">One flow instead of nine tools.</h2>
          </div>
          <WorkflowLoop />
          <Link href="/join" className="btn-blue">Join waitlist</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
