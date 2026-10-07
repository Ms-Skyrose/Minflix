import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, FestivalTile, Footer, Nav } from "@/components/brand";
import { CopyLink } from "@/components/copy-link";
import { countryName, getFestival } from "@/lib/data";
import { siteUrl } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 10;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = await getFestival(slug);
  if (!f) return {};
  const title = `${f.festival_name}: our next edition is coming to Minflix Events`;
  return {
    title,
    description: "A new home for our festival. Join Minflix to be notified when we're live.",
    openGraph: { title, images: [{ url: `/f/${f.slug}/card.png`, width: 1080, height: 1350 }] },
  };
}

export default async function FestivalCardPage({ params }: Props) {
  const { slug } = await params;
  const f = await getFestival(slug);
  if (!f) notFound();
  const shareUrl = `${siteUrl()}/f/${f.slug}`;

  return (
    <main className="relative overflow-hidden">
      <div className="orb -right-32 -top-24 size-[460px] bg-magenta/40" />
      <div className="orb -left-40 top-[600px] size-[420px] bg-blue/35" />
      <Nav />
      <section className="relative mx-auto flex max-w-[1100px] flex-wrap items-start gap-10 px-4 pb-20 pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/f/${f.slug}/card.png`} alt={`${f.festival_name}: our next edition is coming to Minflix Events`} width={1080} height={1350}
          className="w-full max-w-[460px] flex-[1_1_320px] rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]" />
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
          <span className="flex items-center gap-3.5">
            <FestivalTile name={f.festival_name} logo={f.logo_url} size={56} />
            <span className="flex flex-col">
              <span className="text-xl font-bold">{f.festival_name}</span>
              <span className="text-sm text-fog">{[countryName(f.country_code), f.festival_type, f.next_edition].filter(Boolean).join(" · ")}</span>
            </span>
          </span>
          <h1 className="display m-0 text-[clamp(30px,4vw,46px)]">Our next edition is coming to <span className="text-magenta">Minflix Events.</span></h1>
          <p className="m-0 text-lg text-mist">A new home for our festival.</p>
          <Link href={`/join?ref=${f.ref_code}`} className="btn-blue self-start">Join Minflix to be notified <Arrow /></Link>
          <div className="glass mt-4 flex flex-col gap-3 rounded-3xl p-5">
            <span className="font-semibold">Share this card</span>
            <CopyLink url={shareUrl} label="Copy card link" shareText={`${f.festival_name}: our next edition is coming to Minflix Events`} />
            <a href={`/f/${f.slug}/card.png`} download className="text-center text-sm font-semibold underline">Download image</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
