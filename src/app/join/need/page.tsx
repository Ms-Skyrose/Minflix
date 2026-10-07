import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/brand";
import { getFestival } from "@/lib/data";
import { siteUrl } from "@/lib/format";
import { Headache } from "../done/headache";

export const metadata: Metadata = { title: "Help us know your biggest need · Minflix Events", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Second screen after joining: one question, then the invite link and directory. */
export default async function NeedPage({ searchParams }: { searchParams: Promise<{ f?: string; t?: string }> }) {
  const { f = "", t = "" } = await searchParams;
  const festival = f ? await getFestival(f) : null;
  if (!festival || !t) notFound();

  return (
    <main className="relative min-h-dvh overflow-hidden pb-16">
      <div className="orb -right-24 -top-16 size-[380px] bg-magenta/45" />
      <div className="orb -left-36 top-[480px] size-[360px] bg-blue/40" />
      <Nav links={false} cta={false} />
      <div className="relative mx-auto mt-6 max-w-[560px] px-4">
        <div className="glass flex flex-col gap-5 rounded-[30px] px-5 py-7 sm:px-7">
          <Headache slug={festival.slug} token={t} inviteUrl={`${siteUrl()}/join?ref=${festival.ref_code}`} />
        </div>
      </div>
    </main>
  );
}
