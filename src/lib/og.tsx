// Image templates rendered with next/og: the site link preview and each festival's share card.
import { initials } from "./format";

const MAGENTA = "#E400EC";
const INK = "#000C14";

function Wave({ w = 58 }: { w?: number }) {
  return (
    <svg width={w} height={(w * 30) / 44} viewBox="0 0 44 30">
      <path d="M4 20 L11 11 L19 27 L28 3 L39 18" fill="none" stroke={MAGENTA} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wordmark({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Wave w={size * 1.8} />
        <span style={{ fontSize: size, fontWeight: 800, color: MAGENTA }}>IN</span>
        <span style={{ fontSize: size, fontWeight: 800, color: "#fff" }}>FLIX</span>
      </div>
      <span style={{ fontSize: size * 0.5, fontWeight: 700, letterSpacing: 2, color: INK, background: "#fff", padding: "6px 14px", borderRadius: 999 }}>EVENTS</span>
    </div>
  );
}

/** 1200×630 link preview for the landing page. `total` is hidden under the public threshold. */
export function LinkPreview({ total }: { total: number | null }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: INK, color: "#fff", padding: "64px 72px", position: "relative" }}>
      <div style={{ position: "absolute", right: -160, top: -160, width: 560, height: 560, borderRadius: 999, background: "rgba(228,0,236,0.35)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", left: 300, bottom: -260, width: 520, height: 520, borderRadius: 999, background: "rgba(10,122,232,0.35)", filter: "blur(80px)" }} />
      <Wordmark />
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 960 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          {total !== null && <span style={{ fontSize: 150, fontWeight: 800, fontStyle: "italic", lineHeight: 0.85, color: MAGENTA }}>{total}</span>}
          <span style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.25, maxWidth: 560 }}>Festivals are getting ready to prepare their next edition on Minflix.</span>
        </div>
        <span style={{ fontSize: 46, fontWeight: 800, fontStyle: "italic", lineHeight: 1.1 }}>Want your festival listed in the 2027 Minflix Events Directory?</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ background: "#0A7AE8", fontSize: 26, fontWeight: 600, padding: "16px 34px", borderRadius: 999 }}>Join waitlist →</span>
        <span style={{ fontSize: 22, color: "#A9BCC4" }}>minflix.com/events</span>
      </div>
    </div>
  );
}

/** 1080×1350 share card a festival posts after joining. */
export function ShareCard({ name, logo, link }: { name: string; logo: string | null; link: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: INK, color: "#fff", position: "relative" }}>
      <div style={{ position: "absolute", right: -200, top: -200, width: 700, height: 700, borderRadius: 999, background: "rgba(228,0,236,0.35)", filter: "blur(90px)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 56, padding: "96px 96px 0", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={148} height={148} style={{ borderRadius: 36, objectFit: "cover", background: "#fff" }} alt="" />
          ) : (
            <div style={{ width: 148, height: 148, borderRadius: 36, background: "#fff", color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 800 }}>{initials(name)}</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 24, fontWeight: 600, letterSpacing: 3, color: "#A9BCC4" }}>
            <span>NEXT EDITION</span><span>ON MINFLIX EVENTS</span>
          </div>
        </div>
        <span style={{ fontSize: name.length > 28 ? 84 : 104, fontWeight: 800, fontStyle: "italic", lineHeight: 0.98 }}>{name}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 58, fontWeight: 800, fontStyle: "italic", lineHeight: 1.08 }}>
            <span>Our next edition is coming to&nbsp;</span><span style={{ color: MAGENTA }}>Minflix Events.</span>
          </div>
          <span style={{ fontSize: 38, color: "#C9D6DB" }}>A new home for our festival.</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28, background: "#fff", color: INK, borderRadius: "120px 120px 0 0", padding: "72px 96px 80px" }}>
        <span style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.3, maxWidth: 760 }}>Join Minflix to be notified when we&apos;re live on Minflix →</span>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", background: INK, borderRadius: 999, padding: "18px 30px" }}><Wordmark size={28} /></div>
          <span style={{ fontSize: 28, fontWeight: 600, color: "#0A5FB8" }}>{link}</span>
        </div>
      </div>
    </div>
  );
}
