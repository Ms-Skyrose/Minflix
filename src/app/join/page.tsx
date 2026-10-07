import type { Metadata } from "next";
import { Nav } from "@/components/brand";
import { JoinForm } from "./join-form";

export const metadata: Metadata = { title: "Join the Minflix Events waitlist" };

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (
    <main className="relative min-h-dvh overflow-hidden pb-16">
      <div className="orb -right-32 -top-20 size-[380px] bg-magenta/45" />
      <div className="orb -left-40 top-[640px] size-[360px] bg-blue/40" />
      <Nav links={false} />
      <div className="relative mx-auto mt-6 max-w-[560px] px-4">
        <JoinForm refSlug={ref?.replace(/[^a-z0-9-]/g, "").slice(0, 80)} />
      </div>
    </main>
  );
}
