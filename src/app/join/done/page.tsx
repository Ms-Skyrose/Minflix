import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, FestivalTile, Nav } from "@/components/brand";
import { CopyLink } from "@/components/copy-link";
import { getFestival } from "@/lib/data";
import { siteUrl } from "@/lib/format";
import { Headache } from "./headache";

export const metadata: Metadata = { title: "You're on the Minflix Events list", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DonePage({ searchParams }: { searchParams: Promise<{ f?: string; t?: string }> }) {
  const { f = "", t = "" } = await searchParams;
  const festival = f ? await getFestival(f) : null;

  return (
    <main className="relative min-h-dvh overflow-hidden pb-16">
      <div className="orb -left-24 -top-16 size-[380px] bg-magenta/50" />
      <div className="orb -right-36 top-[560px] size-[360px] bg-blue/40" />
      <Nav links={false} />
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
              <Link href={`/f/${festival.slug}`} className="glass-soft flex items-center gap-3.5 rounded-[18px] p-3">
                <FestivalTile name={festival.festival_name} logo={festival.logo_url} size={56} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-semibold">Tell your audience</span>
                  <span className="text-[13px] text-fog">Your share card for {festival.festival_name} is ready to post</span>
                </span>
                <Arrow />
              </Link>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Know another festival getting ready for its next edition?</span>
                <CopyLink url={`${siteUrl()}/join?ref=${festival.ref_code}`} label="Invite to Minflix Festival Network" />
              </div>
            </>
          )}

          {festival && t && <Headache slug={festival.slug} token={t} />}

          <Link href="/directory" className="glass-soft rounded-full py-3.5 text-center font-semibold">See the festival directory</Link>
        </div>
      </div>
    </main>
  );
}
