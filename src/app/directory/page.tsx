import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, FestivalTile, Footer, Nav } from "@/components/brand";
import { CountUp } from "@/components/count-up";
import { CONTINENTS, FESTIVAL_TYPES } from "@/lib/countries";
import { countryName, getDirectory, getTotal, type Festival } from "@/lib/data";
import { displayUrl, hrefFor, MIN_PUBLIC_COUNT } from "@/lib/format";

export const metadata: Metadata = {
  title: "2027 Minflix Events Directory",
  description: "Film festivals getting ready for their next edition on Minflix. Search by name, country or type.",
};
export const revalidate = 60;

type Params = { q?: string; continent?: string; type?: string; f?: string };

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const continent = CONTINENTS.find((c) => c === p.continent);
  const [festivals, total] = await Promise.all([getDirectory({ q: p.q, continent, type: p.type }), getTotal()]);
  const selected: Festival | undefined = festivals.find((f) => f.slug === p.f) ?? festivals[0];
  const href = (extra: Record<string, string | undefined>) => {
    const all = { q: p.q, continent, type: p.type, ...extra };
    const qs = new URLSearchParams(Object.entries(all).filter((e): e is [string, string] => !!e[1]));
    return `/directory${qs.size ? `?${qs}` : ""}`;
  };
  const link = (f: Festival) => `${href({ f: f.slug })}#details`;

  return (
    <main className="relative overflow-hidden">
      <div className="orb -right-36 -top-40 size-[540px] bg-magenta/35" />
      <div className="orb -left-52 top-[620px] size-[500px] bg-blue/35" />
      <Nav />

      <section className="relative mx-auto flex max-w-[1240px] flex-col gap-5 px-4 pb-8 pt-6">
        <div className="glass flex flex-wrap items-center justify-between gap-5 rounded-3xl px-6 py-5">
          <div className="flex min-w-0 flex-wrap items-baseline gap-3.5">
            {total >= MIN_PUBLIC_COUNT && (
              <CountUp value={total} className="text-[56px] font-extrabold italic leading-none text-magenta tabular-nums" />
            )}
            <span className="flex min-w-0 flex-col">
              <span className="text-lg font-semibold">Festivals are getting ready to prepare their next edition on Minflix.</span>
              <span className="text-mist">Want your festival listed in the 2027 Minflix Events Directory?</span>
            </span>
          </div>
          <Link href="/join" className="btn-blue whitespace-nowrap">Join waitlist <Arrow /></Link>
        </div>

        <h1 className="display m-0 mt-3 text-[clamp(30px,4vw,48px)]">2027 Minflix Events Directory</h1>

        <form className="flex flex-wrap items-center gap-2.5" role="search">
          <label className="glass flex min-w-0 flex-[1_1_320px] items-center gap-3 rounded-full px-5 py-1">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0"><circle cx="11" cy="11" r="7" fill="none" stroke="#C2D1D7" strokeWidth="2" /><path d="M20 20l-4-4" stroke="#C2D1D7" strokeWidth="2" strokeLinecap="round" /></svg>
            <span className="sr-only">Search festivals</span>
            <input name="q" type="search" defaultValue={p.q} placeholder="Search festivals, cities or types" className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none" />
          </label>
          {continent && <input type="hidden" name="continent" value={continent} />}
          <select name="type" defaultValue={p.type ?? ""} aria-label="Festival type" className="field !w-auto !rounded-full">
            <option value="">All types</option>
            {FESTIVAL_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <button type="submit" className="btn-blue">Search</button>
        </form>
        <nav aria-label="Filter by continent" className="flex flex-wrap gap-2">
          {[undefined, ...CONTINENTS].map((c) => {
            const on = c === continent;
            return (
              <Link key={c ?? "all"} href={href({ continent: c, f: undefined })} aria-current={on ? "page" : undefined} scroll={false}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm ${on ? "bg-magenta font-semibold text-ink" : "border border-white/15 bg-white/[0.06] font-medium"}`}>
                {c ?? "All"}
              </Link>
            );
          })}
        </nav>
        {festivals.length >= MIN_PUBLIC_COUNT && <p className="m-0 text-[13px] text-[#8FA4AD]">{festivals.length} Festivals</p>}
      </section>

      <section className="relative mx-auto flex max-w-[1240px] flex-wrap items-start gap-6 px-4 pb-20">
        <div className="grid min-w-0 flex-[999_1_560px] grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3.5">
          {festivals.map((f) => {
            const on = f.slug === selected?.slug;
            return (
              <Link key={f.slug} href={link(f)} scroll={false} aria-current={on ? "true" : undefined}
                className={`glass flex min-h-[120px] flex-col gap-3 rounded-[20px] p-4.5 ${on ? "!border-magenta" : ""}`}>
                <span className="flex items-center gap-3">
                  <FestivalTile name={f.festival_name} logo={f.logo_url} size={46} />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-bold leading-snug">{f.festival_name}</span>
                    <span className="text-[13px] text-fog">{[countryName(f.country_code), f.festival_type].filter(Boolean).join(" · ")}</span>
                  </span>
                </span>
                {f.next_edition && <span className="text-[13px] text-[#D6E1E5]">Next edition: {f.next_edition}</span>}
              </Link>
            );
          })}
          {festivals.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2.5 rounded-[20px] border-[1.5px] border-dashed border-white/30 p-8 text-center">
              <span className="text-lg font-bold">No festivals match yet.</span>
              <span className="text-mist">Know one that should be here?</span>
              <Link href="/join" className="btn-blue">Invite to Minflix Festival Network</Link>
            </div>
          )}
        </div>

        {selected && (
          <aside id="details" aria-label="Festival details" className="flex min-w-0 flex-[1_1_340px] scroll-mt-6 flex-col gap-4.5 rounded-3xl bg-white p-6.5 text-ink">
            <FestivalTile name={selected.festival_name} logo={selected.logo_url} size={72} />
            <h2 className="display m-0 text-[28px]">{selected.festival_name}</h2>
            <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-3 text-[15px]">
              <dt className="text-slate">Country</dt><dd className="m-0 font-semibold">{countryName(selected.country_code)}</dd>
              <dt className="text-slate">Festival type</dt><dd className="m-0 font-semibold">{selected.festival_type ?? "Not given"}</dd>
              <dt className="text-slate">Next edition</dt><dd className="m-0 font-semibold">{selected.next_edition ?? "Not set yet"}</dd>
              <dt className="text-slate">Website/social</dt>
              <dd className="m-0 break-words font-semibold">
                {selected.website ? <a href={hrefFor(selected.website)} target="_blank" rel="noopener nofollow" className="text-[#0A5FB8] underline">{displayUrl(selected.website)}</a> : "Not given"}
              </dd>
            </dl>
            <div className="flex flex-col gap-2.5 border-t border-dashed border-[#C3CDD2] pt-4">
              <span className="text-[13px] text-slate">Getting ready for Minflix Events</span>
              <Link href={`/f/${selected.slug}`} className="rounded-full bg-ink py-3 text-center font-semibold text-white">View festival card</Link>
            </div>
          </aside>
        )}
      </section>
      <Footer />
    </main>
  );
}
