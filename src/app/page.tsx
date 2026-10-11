import Image from "next/image";
import Link from "next/link";
import { Arrow, FestivalTile, Footer, Nav } from "@/components/brand";
import { CountUp } from "@/components/count-up";
import { countryName, getRecent, getTotal } from "@/lib/data";
import { MIN_PUBLIC_COUNT, timeAgo } from "@/lib/format";

// New festivals show up within 10 seconds (and immediately after a join, via revalidatePath).
export const revalidate = 10;

const TOOLS = [
  ["Instagram", "promotion"],
  ["Google Forms", "registration"],
  ["Paystack", "fees"],
  ["Excel", "submissions"],
  ["Google Drive", "films"],
  ["WhatsApp", "filmmakers"],
  ["Canva", "programme"],
  ["Website", "information"],
  ["Email", "updates"],
];

const STEPS = [
  { title: "Join the waitlist", body: "Two minutes, free. Tell us about your festival." },
  { title: "Share your festival card", body: "Get a card for Instagram and WhatsApp Status, and a free listing in the 2027 Festival Directory." },
  { title: "Run your festival on Minflix", body: "When we launch, open submissions, registration and payments from your festival page." },
];

/**
 * The first page a newcomer sees: what Minflix Events is, who it's for and what they get, in one screen.
 * The network leaderboard, festival season and full workflow live on /network.
 */
export default async function Home() {
  const [total, recent] = await Promise.all([getTotal(), getRecent(3)]);
  const showCount = total >= MIN_PUBLIC_COUNT;

  return (
    <main className="relative overflow-hidden">
      <div className="orb -right-40 -top-40 size-[560px] bg-magenta/35" />
      <div className="orb -left-60 top-[760px] size-[520px] bg-blue/30" />

      <Nav />

      {/* HERO: what it is, who it's for, what you get */}
      <section className="relative mx-auto max-w-[1240px] px-4 pb-[clamp(56px,7vw,88px)] pt-[clamp(28px,5vw,56px)]">
        <div className="flex flex-wrap items-center gap-[clamp(28px,4vw,56px)]">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
            <span className="glass-soft self-start rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#D6E1E5]">
              For film festival organisers
            </span>
            <h1 className="display m-0 text-[clamp(36px,5.2vw,64px)]">
              Everything for your festival, <span className="text-magenta">in one link.</span>
            </h1>
            <p className="m-0 max-w-[48ch] text-[clamp(17px,1.6vw,19px)] leading-relaxed text-[#D6E1E5]">
              Minflix Events is a new way to run a film festival. Take film submissions, register attendees, collect fees and publish your
              programme from one festival page on Minflix.
            </p>
            <p className="m-0 max-w-[48ch] text-[15px] text-fog">
              Launching soon. Join the waitlist for early access and a free spot in the 2027 Festival Directory.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/join" className="btn-blue text-[17px]">Join the waitlist <Arrow /></Link>
              <a href="#how" className="glass-soft inline-flex min-h-[52px] items-center rounded-full px-6 font-medium">How it works</a>
            </div>
            {showCount && (
              <p className="m-0 flex flex-wrap items-baseline gap-x-2 text-[15px] text-[#D6E1E5]">
                <CountUp value={total} className="text-3xl font-extrabold italic text-magenta tabular-nums" />
                Festivals are getting ready to prepare their next edition on Minflix.
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-[1_1_420px] flex-col">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
              <Image src="/hero-festival.jpg" alt="A festival audience watching an open-air screening under string lights" fill priority
                sizes="(max-width: 900px) 100vw, 600px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-ink/75" />
            </div>
            {recent.length > 0 && (
              <div className="glass relative mx-3.5 -mt-12 flex flex-col gap-2.5 rounded-3xl p-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#D6E1E5]">
                  <span className="size-2 rounded-full bg-[#3BE08A] shadow-[0_0_10px_#3BE08A]" /> Joining now
                </span>
                {recent.map((f) => (
                  <Link key={f.slug} href={`/directory?f=${f.slug}#details`} className="flex items-center gap-3">
                    <FestivalTile name={f.festival_name} logo={f.logo_url} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold">{f.festival_name}</span>
                      <span className="block text-xs text-fog">{[f.festival_type, countryName(f.country_code), timeAgo(f.created_at)].filter(Boolean).join(" · ")}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* THE PROBLEM → THE PRODUCT, in one view */}
      <section className="relative border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-[clamp(56px,7vw,88px)]">
          <div className="flex max-w-[720px] flex-col gap-2.5">
            <p className="eyebrow m-0">Why Minflix Events</p>
            <h2 className="display m-0 text-[clamp(28px,3.6vw,44px)]">Running a festival today means juggling nine different tools.</h2>
          </div>
          <div className="flex flex-wrap items-stretch gap-4">
            <div className="glass flex min-w-0 flex-[1_1_380px] flex-col gap-3 rounded-[24px] p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-fog">Today</span>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {TOOLS.map(([tool, job]) => (
                  <li key={tool} className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[13px]">
                    <span className="font-semibold">{tool}</span> <span className="text-fog">for {job}</span>
                  </li>
                ))}
              </ul>
              <span className="text-sm text-mist">Nine logins, and the same filmmaker&apos;s details copied from one to the next.</span>
            </div>
            <div aria-hidden="true" className="flex flex-[0_0_auto] items-center justify-center self-center text-magenta">
              <svg width="40" height="40" viewBox="0 0 24 24" className="rotate-90 sm:rotate-0"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="glass flex min-w-0 flex-[1_1_380px] flex-col gap-3 rounded-[24px] border-magenta/40 p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-magenta-soft">With Minflix Events</span>
              <div className="glass-soft overflow-x-auto whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-medium">
                minflix.com/events/<span className="text-magenta-soft">your-festival</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[["Submissions", "Films come in here"], ["Registration", "Passes and tickets"], ["Payments", "Fees collected in-app"], ["Programme", "Your lineup, published"]].map(([a, b]) => (
                  <div key={a} className="glass-soft flex min-w-0 flex-col rounded-[14px] p-3">
                    <span className="text-[15px] font-semibold">{a}</span>
                    <span className="text-xs text-mist">{b}</span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-mist">One festival page, one link to share.</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 3 steps, in order */}
      <section id="how" className="relative scroll-mt-6 rounded-t-[clamp(28px,4vw,48px)] bg-paper text-ink">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-[clamp(56px,7vw,88px)]">
          <div className="flex max-w-[640px] flex-col gap-2.5">
            <p className="eyebrow m-0 !text-magenta-deep">How it works</p>
            <h2 className="display m-0 text-[clamp(28px,3.6vw,44px)]">Three steps to your festival&apos;s new home.</h2>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 p-0">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2.5 rounded-[22px] border border-[#DCE3E6] bg-white p-5">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                <span className="text-lg font-bold leading-snug">{s.title}</span>
                <span className="text-[15px] text-slate">{s.body}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/join" className="btn-blue text-[17px]">Join the waitlist <Arrow /></Link>
            <Link href="/network" className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[#C3CDD2] px-6 font-semibold">
              See the Festival network <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
