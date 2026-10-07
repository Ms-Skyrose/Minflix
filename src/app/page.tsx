import Image from "next/image";
import Link from "next/link";
import { Arrow, FestivalTile, Footer, Nav } from "@/components/brand";
import { CountUp } from "@/components/count-up";
import { CopyLink } from "@/components/copy-link";
import { ToolWindows, WorkflowLoop } from "@/components/sections";
import { countryName, getDirectory, getLeaderboard, getRecent, getTotal } from "@/lib/data";
import { MIN_PUBLIC_COUNT, siteUrl, timeAgo } from "@/lib/format";

export const revalidate = 60;

export default async function Home() {
  const [total, recent, board, featured] = await Promise.all([getTotal(), getRecent(3), getLeaderboard(), getDirectory({}, 3)]);
  const showCount = total >= MIN_PUBLIC_COUNT;
  const withFestivals = board.filter((c) => c.festivals > 0).length;
  const top = board[0]?.festivals || 1;

  return (
    <main className="relative overflow-hidden">
      <div className="orb -right-40 -top-40 size-[560px] bg-magenta/35" />
      <div className="orb -left-60 top-[700px] size-[520px] bg-blue/35" />
      <div className="orb -right-52 top-[1500px] size-[480px] bg-magenta/25" />

      <Nav />

      {/* HERO */}
      <section className="relative mx-auto max-w-[1240px] px-4 pb-[clamp(56px,7vw,88px)] pt-[clamp(28px,5vw,56px)]">
        <div className="flex flex-wrap-reverse items-center gap-[clamp(28px,4vw,56px)]">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
            <span className="glass-soft self-start rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#D6E1E5]">
              Minflix Events · for film festivals
            </span>
            <div className="flex flex-col gap-1">
              {showCount && (
                <CountUp value={total}
                  className="text-[clamp(72px,11vw,128px)] font-extrabold italic leading-[0.9] tracking-[-0.04em] text-magenta tabular-nums [text-shadow:0_0_60px_rgba(228,0,236,0.45)]" />
              )}
              <span className="max-w-[26ch] text-[clamp(17px,2vw,22px)] font-medium leading-snug">
                Festivals are getting ready to prepare their next edition on Minflix.
              </span>
            </div>
            <h1 className="display m-0 text-[clamp(32px,4.4vw,56px)]">
              Want your festival listed in the <span className="text-magenta">2027 Minflix Events Directory?</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/join" className="btn-blue text-[17px]">Join waitlist <Arrow /></Link>
              <Link href="/directory" className="glass-soft inline-flex min-h-[52px] items-center rounded-full px-6 font-medium">Browse the directory</Link>
            </div>
          </div>

          <div className="flex min-w-0 flex-[1_1_440px] flex-col">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
              <Image src="/hero-filmset.jpg" alt="Filmmakers in Minflix director's chairs watching a crew set up a shot" fill priority
                sizes="(max-width: 900px) 100vw, 600px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-ink/75" />
              <span className="glass absolute left-3.5 top-3.5 rounded-full px-3 py-1.5 text-xs font-semibold">Festival season starts on set</span>
            </div>
            {recent.length > 0 && (
              <div className="glass relative mx-3.5 -mt-14 flex flex-col gap-2.5 rounded-3xl p-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#D6E1E5]">
                  <span className="size-2 rounded-full bg-[#3BE08A] shadow-[0_0_10px_#3BE08A]" /> Joining now
                </span>
                {recent.map((f) => {
                  const meta = [f.festival_type, countryName(f.country_code), timeAgo(f.created_at)].filter(Boolean).join(" · ");
                  return (
                    <Link key={f.slug} href={`/directory?f=${f.slug}`} className="flex items-center gap-3">
                      <FestivalTile name={f.festival_name} logo={f.logo_url} size={40} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold">{f.festival_name}</span>
                        <span className="block text-xs text-fog">{meta}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FESTIVAL NETWORK */}
      <section id="network" className="relative mx-auto flex max-w-[1240px] scroll-mt-6 flex-col gap-6 px-4 pb-[clamp(56px,7vw,88px)] pt-4">
        <div className="flex max-w-[760px] flex-col gap-2.5">
          <p className="eyebrow m-0">Festival network</p>
          <h2 className="display m-0 text-[clamp(28px,3.6vw,46px)]">Festivals getting ready for Minflix Events</h2>
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
            <CopyLink url={`${siteUrl()}/join`} label="Invite to Minflix Festival Network" shareText="Get your festival listed in the 2027 Minflix Events Directory" />
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

      {/* THE PROBLEM */}
      <section className="relative border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-9 px-4 py-[clamp(64px,8vw,96px)]">
          <div className="flex max-w-[760px] flex-col gap-3">
            <p className="eyebrow m-0">How festivals run today</p>
            <h2 className="display m-0 text-[clamp(30px,4vw,52px)]">Running a film festival means stitching together a bunch of unrelated tools.</h2>
            <p className="m-0 text-[17px] text-mist">Nine tabs, nine logins, and a team copying the same filmmaker&apos;s details from one to the next.</p>
          </div>
          <ToolWindows />
          <div className="flex flex-col items-center gap-1.5 text-center text-sm text-fog">
            <svg width="24" height="44" viewBox="0 0 24 44" aria-hidden="true"><path d="M12 2v36M5 31l7 8 7-8" fill="none" stroke="#E400EC" strokeWidth="2.4" strokeDasharray="4 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Now put all of it in one place
          </div>
        </div>
      </section>

      {/* THE SOLUTION + WORKFLOW */}
      <section className="relative rounded-t-[clamp(28px,4vw,48px)] bg-paper text-ink">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-10 px-4 pb-10 pt-[clamp(64px,8vw,96px)]">
          <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-4">
            <p className="eyebrow m-0 !text-magenta-deep">Minflix Events</p>
            <h2 className="display m-0 text-[clamp(32px,4.4vw,56px)]">Everything your festival needs, <span className="text-[#C000C8]">in one place.</span></h2>
            <p className="m-0 max-w-[52ch] text-[17px] text-[#3A4B55]">
              Create your festival&apos;s home on Minflix, manage registrations and submissions, collect fees, build your programme,
              connect with filmmakers, and run your festival from one place.
            </p>
          </div>
          <div className="relative min-w-0 flex-[1_1_400px] overflow-hidden rounded-[28px] bg-ink p-4.5">
            <div className="orb -right-16 -top-20 size-[300px] bg-magenta/50 blur-[50px]" />
            <div className="orb -bottom-24 -left-16 size-[260px] bg-blue/45 blur-[50px]" />
            <div className="glass relative flex flex-col gap-3 rounded-[22px] p-4.5 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D6E1E5]">Everything for your festival in one link</span>
              <div className="glass-soft overflow-x-auto whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-medium">
                minflix.com/events/<span className="text-magenta-soft">your-festival</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[["Submissions", "Open · 212 films"], ["Registration", "Passes on sale"], ["Fees", "Collected in-app"], ["Programme", "4 days · 9 blocks"]].map(([a, b]) => (
                  <div key={a} className="glass-soft flex min-w-0 flex-col rounded-[14px] p-3">
                    <span className="text-[15px] font-semibold">{a}</span>
                    <span className="text-xs text-mist">{b}</span>
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-fog">Example festival page</span>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-7 px-4 pb-[clamp(72px,9vw,112px)] pt-10">
          <div className="flex max-w-[640px] flex-col items-center gap-2.5 text-center">
            <p className="eyebrow m-0 !text-magenta-deep">Your festival, start to finish</p>
            <h2 className="display m-0 text-[clamp(28px,3.6vw,44px)]">One flow instead of nine tools.</h2>
          </div>
          <WorkflowLoop />
          <Link href="/join" className="btn-blue">Join waitlist</Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative mx-auto max-w-[900px] px-4 pb-[clamp(72px,9vw,112px)] pt-[clamp(64px,8vw,96px)]">
        <div className="glass flex flex-col items-center gap-4 rounded-[32px] px-5 py-[clamp(36px,6vw,56px)] text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D6E1E5]">2027 Minflix Events Directory</span>
          {showCount && (
            <CountUp value={total} className="text-[clamp(56px,8vw,72px)] font-extrabold italic leading-none text-magenta tabular-nums [text-shadow:0_0_50px_rgba(228,0,236,0.5)]" />
          )}
          <h2 className="display m-0 text-[clamp(26px,4vw,46px)]">
            {showCount ? "Festivals are getting ready. Is yours one of them?" : "Festivals are getting ready for 2027. Is yours one of them?"}
          </h2>
          <Link href="/join" className="btn-blue mt-1 text-[17px]">Join waitlist</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
