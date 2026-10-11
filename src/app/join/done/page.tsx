import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, InstagramHelp, Nav } from "@/components/brand";
import { CardPanel } from "@/components/card-panel";
import { CopyLink } from "@/components/copy-link";
import { getFestival, getOwnFestival } from "@/lib/data";

export const metadata: Metadata = { title: "You're on the Minflix Events list", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * After joining (?f&t), or coming back with an email that's already on the list (?f&again=1).
 * A listing held for review (famous festival names) shows a note instead of the card until approved.
 */
export default async function DonePage({ searchParams }: { searchParams: Promise<{ f?: string; t?: string; again?: string }> }) {
  const { f = "", t = "", again } = await searchParams;
  const own = f && t ? await getOwnFestival(f, t) : null;
  const festival = own ?? (f ? await getFestival(f) : null);
  const held = own ? !own.listed : false;
  const returning = !!again && !own;

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
            <h1 className="display m-0 text-4xl">{returning ? "You're already on the list" : "You're on the list"}</h1>
            <p className="m-0 text-base text-mist">
              {returning
                ? `Welcome back${festival ? `, ${festival.festival_name}` : ""}. Here's your festival card and invite link again.`
                : "You will get an email once it's launched."}
            </p>
          </div>

          {held && festival && (
            <div className="flex flex-col gap-2 rounded-[18px] border border-white/15 bg-white/[0.05] p-4">
              <span className="font-semibold">Your listing is being checked</span>
              <span className="text-sm text-mist">
                &ldquo;{festival.festival_name}&rdquo; matches a well-known festival, so we confirm it before it appears in the directory. Your card
                will be ready as soon as it&apos;s approved.
              </span>
              <InstagramHelp label="Speed this up: message us on Instagram" />
            </div>
          )}

          {festival && !held && (
            <section aria-labelledby="card-heading" className="flex flex-col gap-3 border-t border-dashed border-white/20 pt-5">
              <div className="flex flex-col gap-0.5">
                <h2 id="card-heading" className="m-0 text-lg font-bold">Your festival card is ready</h2>
                <span className="text-[13px] text-fog">Choose a size, then post it to tell your audience you&apos;re coming to Minflix Events.</span>
              </div>
              <CardPanel slug={festival.slug} name={festival.festival_name} />
            </section>
          )}

          {returning && festival && (
            <div className="flex flex-col gap-2 border-t border-dashed border-white/20 pt-5">
              <span className="font-semibold">Your invite link</span>
              <span className="text-[13px] text-fog">Share it with festivals getting ready for their next edition.</span>
              <CopyLink path={`/join?ref=${festival.ref_code}`} label="Invite to Minflix Festival Network" />
            </div>
          )}

          {festival && own ? (
            <Link href={`/join/need?f=${festival.slug}&t=${t}`} className="glass-soft flex min-h-[52px] items-center justify-center gap-2 rounded-full font-semibold">
              Continue <Arrow />
            </Link>
          ) : (
            <Link href="/directory" className="glass-soft rounded-full py-3.5 text-center font-semibold">See the festival directory</Link>
          )}

          <InstagramHelp label="Need to fix a detail? Message us on Instagram" />
        </div>
      </div>
    </main>
  );
}
