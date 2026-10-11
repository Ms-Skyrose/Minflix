import type { Metadata } from "next";
import { headers } from "next/headers";
import { Nav } from "@/components/brand";
import { countryByCode, nextEditionOptions } from "@/lib/countries";
import { formStamp } from "@/lib/guard";
import { JoinForm } from "./join-form";

export const metadata: Metadata = { title: "Join the Minflix Events waitlist" };
export const dynamic = "force-dynamic";

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const h = await headers();
  // Pre-select the country when the server or CDN tells us where the visitor is (Cloudflare, Vercel or a custom proxy header).
  const geo = h.get("cf-ipcountry") || h.get("x-country-code") || h.get("x-vercel-ip-country");
  const defaultCountry = countryByCode(geo)?.code;

  return (
    <main className="relative min-h-dvh overflow-hidden pb-16">
      <div className="orb -right-32 -top-20 size-[380px] bg-magenta/45" />
      <div className="orb -left-40 top-[640px] size-[360px] bg-blue/40" />
      <Nav links={false} cta={false} />
      <div className="relative mx-auto mt-6 max-w-[560px] px-4">
        <JoinForm
          refSlug={ref?.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 90)}
          stamp={formStamp()}
          quarters={nextEditionOptions()}
          defaultCountry={defaultCountry}
        />
      </div>
    </main>
  );
}
