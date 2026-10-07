import Link from "next/link";
import { initials, tileFor } from "@/lib/format";

/** The Minflix "M" wave, drawn to match the official Logo Icon (swap for the original SVG when available). */
export const WAVE_PATH = "M5 30 L12.8 13.5 L26.2 42 L37.7 5 L49.7 29.2";
export function WaveMark({ height = 24 }: { height?: number }) {
  return (
    <svg height={height} width={(height * 55) / 47} viewBox="0 0 55 47" aria-hidden="true">
      <path d={WAVE_PATH} fill="none" stroke="#E400EC" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MinflixMark({ size = 19 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-px" style={{ fontSize: size }}>
      <WaveMark height={size * 1.25} />
      <span className="font-extrabold leading-none tracking-[0.02em] text-magenta">IN</span>
      <span className="font-extrabold leading-none tracking-[0.02em] text-white">FLIX</span>
    </span>
  );
}

export function Logo({ size = 19 }: { size?: number }) {
  return (
    <Link href="/" aria-label="Minflix Events home" className="inline-flex min-w-0 items-center gap-2 no-underline">
      <MinflixMark size={size} />
      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">Events</span>
    </Link>
  );
}

export function Nav({ links = true, cta = true }: { links?: boolean; cta?: boolean }) {
  return (
    <header className="relative z-10 mx-auto max-w-[1240px] px-4 pt-4">
      <div className={`glass flex min-h-[60px] items-center justify-between gap-3 rounded-full py-2 pl-4 ${cta ? "pr-2" : "pr-4"}`}>
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-5 text-[15px]">
          {links && (
            <>
              <Link href="/#network" className="hidden text-[#D6E1E5] hover:text-white sm:inline">Network</Link>
              <Link href="/directory" className="hidden text-[#D6E1E5] hover:text-white sm:inline">Directory</Link>
            </>
          )}
          {cta && <Link href="/join" className="btn-blue !min-h-0 whitespace-nowrap !px-4 !py-2.5 text-sm">Join waitlist</Link>}
        </nav>
      </div>
    </header>
  );
}

export function FestivalTile({ name, logo, size = 44 }: { name: string; logo?: string | null; size?: number }) {
  const t = tileFor(name);
  if (logo)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="" width={size} height={size} className="shrink-0 rounded-xl bg-white object-cover" style={{ width: size, height: size }} />;
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-xl font-extrabold"
      style={{ width: size, height: size, background: t.bg, color: t.fg, fontSize: size * 0.32 }}
    >
      {initials(name)}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="rounded-t-[clamp(28px,4vw,48px)] bg-paper text-ink">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 py-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-white">
          <span className="text-magenta">@</span>Minflix
        </span>
        <span className="text-[13px] text-slate">Minflix Events · for film festivals · minflix.com</span>
      </div>
    </footer>
  );
}

export function Arrow({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
