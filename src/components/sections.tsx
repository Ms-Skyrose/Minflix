// Illustrated sections of the landing page: the nine-tools mess and the Minflix workflow loop.
import { MinflixMark } from "./brand";

// Generic pictures of each tool's job (not brand logos).
const TOOLS = [
  { name: "Instagram", job: "promotion", tint: "#E400EC", tilt: -2, fill: "M8 8h44v34H8z M58 8h44v34H58z M108 8h44v34h-44z M8 48h44v34H8z M58 48h44v34H58z M108 48h44v34h-44z", line: "M24 25l6 6 10-12 M74 62h12 M124 25h12" },
  { name: "Google Forms", job: "registration", tint: "#7B61FF", tilt: 1.5, fill: "M8 6h144v14H8z", line: "M18 34a5 5 0 1 0 0.1 0 M30 34h80 M18 52a5 5 0 1 0 0.1 0 M30 52h96 M18 70a5 5 0 1 0 0.1 0 M30 70h60 M120 74h28" },
  { name: "Paystack", job: "fees", tint: "#0A7AE8", tilt: -1, fill: "M20 14h120v62H20z", line: "M20 30h120 M32 50h40 M32 62h24 M112 58l8 8 14-16" },
  { name: "Excel", job: "submissions", tint: "#2FA36B", tilt: 2, fill: "M8 8h144v14H8z M44 40h36v14H44z", line: "M8 8h144v74H8z M8 22h144 M8 40h144 M8 58h144 M44 8v74 M80 8v74 M116 8v74" },
  { name: "Google Drive", job: "films", tint: "#FFB020", tilt: -2.5, fill: "M10 22h26l6 6h30v40H10z M88 22h26l6 6h30v40H88z", line: "M41 48a8 8 0 1 0 0.1 0 M119 48a8 8 0 1 0 0.1 0" },
  { name: "WhatsApp", job: "filmmakers", tint: "#3BE08A", tilt: 1, fill: "M10 10h90v20H10z M60 38h90v20H60z M10 66h70v18H10z", line: "M20 20h60 M70 48h70 M20 75h44" },
  { name: "Canva", job: "programme", tint: "#00C4CC", tilt: -1.5, fill: "M44 6h72v24H44z", line: "M44 6h72v78H44z M54 42h52 M54 54h40 M54 66h46 M54 76h30" },
  { name: "Website", job: "information", tint: "#F27BF5", tilt: 2, fill: "M8 22h144v30H8z", line: "M8 8h144v74H8z M8 18h144 M20 64h40 M20 74h60 M100 64h40" },
  { name: "Email", job: "communication", tint: "#FF6B6B", tilt: -2, fill: "M30 18h100v56H30z", line: "M30 18l50 34 50-34 M30 74l36-26 M130 74l-36-26" },
];

export function ToolWindows() {
  return (
    <div className="relative px-1 py-3">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <path
          d="M60 80 C 340 520, 460 -60, 700 300 S 1040 620, 1160 120 M100 540 C 360 200, 640 640, 880 160 S 1120 420, 1170 560 M300 30 C 380 300, 760 360, 820 590"
          fill="none" stroke="rgba(242,123,245,0.35)" strokeWidth="2.5" strokeDasharray="7 9" strokeLinecap="round"
        />
      </svg>
      <div className="relative grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {TOOLS.map((t) => (
          <figure key={t.name} className="glass m-0 flex flex-col overflow-hidden rounded-2xl" style={{ transform: `rotate(${t.tilt}deg)` }}>
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.08] px-2.5 py-2">
              <span className="size-[7px] rounded-full bg-[#FF6B6B]" />
              <span className="size-[7px] rounded-full bg-[#FFC24B]" />
              <span className="size-[7px] rounded-full bg-[#3BE08A]" />
              <span className="ml-1.5 truncate text-xs font-semibold">{t.name}</span>
            </div>
            <div className="bg-ink/35 p-2.5">
              <svg viewBox="0 0 160 90" className="block w-full" aria-hidden="true">
                <path d={t.fill} fill={t.tint} opacity="0.9" />
                <path d={t.line} fill="none" stroke="#E6EEF1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              </svg>
            </div>
            <figcaption className="px-3 pb-3 pt-2 text-[13px] text-[#D6E1E5]">→ {t.job}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  { title: "Create festival", body: "Your festival's home and link on Minflix", icon: "M12 3l9 5v8l-9 5-9-5V8z M12 8v8 M8 12h8" },
  { title: "Open registration & submissions", body: "One call for entries, one form", icon: "M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5" },
  { title: "Receive & manage films", body: "Screeners stored with each entry", icon: "M3 7h18v12H3z M3 7l3-4h12l3 4 M10 11l5 3-5 3z" },
  { title: "Select & programme", body: "Shortlist, schedule and publish the lineup", icon: "M4 6h16 M4 12h10 M4 18h7 M17 15l2 2 4-4" },
  { title: "Collect fees", body: "Entry fees and passes, paid in-app", icon: "M3 6h18v12H3z M3 10h18 M7 15h4" },
  { title: "Run festival", body: "Screenings, online and in the room", icon: "M2 6h20v12H2z M8 18l-2 3 M16 18l2 3 M10 9l5 3-5 3z" },
  { title: "Engage filmmakers & audience", body: "Updates, Q&As and audience votes", icon: "M4 5h16v10H9l-5 4z M8 9h8 M8 12h5" },
  { title: "Keep your festival alive on Minflix", body: "Films stay watchable and your audience stays connected", icon: "M20 12a8 8 0 1 1-2.3-5.7 M20 4v5h-5" },
];

const R = 38; // ring radius, % of the square

function Icon({ d, color }: { d: string; color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WorkflowLoop() {
  return (
    <>
      {/* Tablet and up: the loop */}
      <div className="relative hidden aspect-square w-full max-w-[820px] md:block" role="img" aria-label="The Minflix Events festival loop, steps 1 to 8">
        <div className="absolute inset-[12%] rounded-full border-[2.5px] border-dashed border-[#C3CDD2]" />
        {Array.from({ length: 8 }, (_, k) => {
          const deg = -67.5 + k * 45;
          const a = (deg * Math.PI) / 180;
          return (
            <svg key={k} width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="absolute"
              style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%`, transform: `translate(-50%,-50%) rotate(${deg + 90}deg)` }}>
              <circle cx="11" cy="11" r="10" fill="#F4F6F8" />
              <path d="M8 5l6 6-6 6" fill="none" stroke="#B000BA" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        })}
        <div className="absolute left-1/2 top-1/2 flex aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-ink text-center text-white shadow-[0_30px_60px_-24px_rgba(176,0,186,0.6)]">
          <div className="orb right-[-10%] top-[-10%] size-[70%] bg-magenta/55 blur-[30px]" />
          <span className="relative"><MinflixMark size={17} /></span>
          <span className="relative text-[15px] font-bold">Events</span>
          <span className="relative max-w-[16ch] text-xs text-mist">Your whole festival, one loop</span>
        </div>
        {STEPS.map((s, i) => {
          const a = ((-90 + i * 45) * Math.PI) / 180;
          const last = i === STEPS.length - 1;
          return (
            <div key={s.title}
              className={`absolute flex w-[22%] min-w-[132px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-[18px] border p-3 text-center shadow-[0_16px_32px_-20px_rgba(0,12,20,0.45)] ${last ? "border-ink bg-ink text-white" : "border-[#DCE3E6] bg-white text-ink"}`}
              style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%` }}>
              <span className={`grid size-10 place-items-center rounded-xl ${last ? "bg-magenta" : "bg-[#F7E9FB]"}`}>
                <Icon d={s.icon} color={last ? "#000C14" : "#B000BA"} />
              </span>
              <span className={`text-[11px] font-bold ${last ? "text-magenta-soft" : "text-magenta-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[13px] font-semibold leading-snug">{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* Phones: the same flow, top to bottom */}
      <ol className="flex w-full max-w-[460px] flex-col md:hidden">
        {STEPS.map((s, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li key={s.title} className="flex flex-col">
              {i > 0 && (
                <div aria-hidden="true" className="flex h-[30px] w-[72px] flex-col items-center justify-center">
                  <span className="h-4 border-l-2 border-dashed border-[#B6C2C8]" />
                  <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" fill="none" stroke="#B000BA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
              <div className={`flex items-center gap-3.5 rounded-[18px] border py-3.5 pl-3 pr-4 shadow-[0_10px_24px_-18px_rgba(0,12,20,0.4)] ${last ? "border-ink bg-ink text-white" : "border-[#DCE3E6] bg-white text-ink"}`}>
                <span className={`grid size-12 shrink-0 place-items-center rounded-[14px] ${last ? "bg-magenta" : "bg-[#F7E9FB]"}`}>
                  <Icon d={s.icon} color={last ? "#000C14" : "#B000BA"} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-baseline gap-2">
                    <span className={`text-xs font-bold ${last ? "text-magenta-soft" : "text-magenta-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-base font-bold leading-snug">{s.title}</span>
                  </span>
                  <span className={`text-[13px] leading-snug ${last ? "text-mist" : "text-slate"}`}>{s.body}</span>
                </div>
              </div>
            </li>
          );
        })}
        <li className="flex justify-center pt-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DCE3E6] bg-white px-4 py-2 text-[13px] font-semibold text-ink">
            <Icon d="M20 12a8 8 0 1 1-2.3-5.7 M20 4v5h-5" color="#B000BA" /> Next edition starts again at 01
          </span>
        </li>
      </ol>
    </>
  );
}
