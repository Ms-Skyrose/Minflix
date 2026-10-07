import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Nav } from "@/components/brand";
import { getFestival } from "@/lib/data";
import { siteUrl } from "@/lib/format";
import { CardActions } from "./card-actions";

export const metadata: Metadata = { title: "You're on the Minflix Events list", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DonePage({ searchParams }: { searchParams: Promise<{ f?: string; t?: string }> }) {
  const { f = "", t = "" } = await searchParams;
  const festival = f ? await getFestival(f) : null;

  return (
    <main className="relative min-h-dvh overflow-hidden pb-16">
      <div className="orb -left-24 -top-16 size-[380px] bg-magenta/50" />
      <div className="orb -right-36 top-[560px] size-[360px] bg-blue/40" />
      <Nav links={false} cta={false} />
      <div className="relative mx-auto mt-6 max-w-[560px] px-4">
        <div className="glass flex flex-col gap-5.5 rounded-[30px] px-5 py-7 sm:px-7">
          <div className="flex flex-col gap-2.5">
            <span className="grid size-16 place-items-center rounded-[20px] bg-magenta shadow-[0_12px_30px_-8px_rgba(228,0,236,0.8)]">
              <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18v10H3z M3 10l2-6 16 2-1 4 M8 4.6l1.8 4.6 M13 5.3l1.8 4.5" fill="none" stroke="#000C14" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" /></svg>
            </span>
            <h1 className="display m-0 text-4xl">You&apos;re on the list</h1>
            <p className="m-0 text-base text-mist">You will get an email once it&apos;s launched.</p>
          </div>

          {festival && (
            <>
              <section aria-labelledby="card-heading" className="flex flex-col gap-3 border-t border-dashed border-white/20 pt-5">
                <div className="flex flex-col gap-0.5">
                  <h2 id="card-heading" className="m-0 text-lg font-bold">Your festival card is ready</h2>
                  <span className="text-[13px] text-fog">Post it on your socials to tell your audience you&apos;re coming to Minflix Events.</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/f/${festival.slug}/card.png`} alt={`${festival.festival_name}: our next edition is coming to Minflix Events`}
                  width={1080} height={1350} className="mx-auto w-full max-w-[340px] rounded-[20px] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.9)]" />
                <CardActions
                  src={`/f/${festival.slug}/card.png`}
                  filename={`${festival.slug}-minflix-events.png`}
                  title={`${festival.festival_name}: our next edition is coming to Minflix Events`}
                  pageUrl={`${siteUrl()}/f/${festival.slug}`}
                />
                <Link href={`/f/${festival.slug}`} className="inline-flex items-center gap-1.5 self-start text-[13px] text-mist underline">
                  Open your festival&apos;s card page <Arrow />
                </Link>
              </section>
            </>
          )}

          {/* One job per screen: the biggest-need question comes next */}
          {festival && t ? (
            <Link href={`/join/need?f=${festival.slug}&t=${t}`} className="glass-soft flex min-h-[52px] items-center justify-center gap-2 rounded-full font-semibold">
              Continue <Arrow />
            </Link>
          ) : (
            <Link href="/directory" className="glass-soft rounded-full py-3.5 text-center font-semibold">See the festival directory</Link>
          )}
        </div>
      </div>
    </main>
  );
}
