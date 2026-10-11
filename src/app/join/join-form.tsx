"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { joinWaitlist, type JoinState } from "@/app/actions";
import { COUNTRIES, FESTIVAL_TYPES, FILMS_PER_EDITION } from "@/lib/countries";
import { Arrow } from "@/components/brand";
import { readSource } from "@/components/source";

const Opt = () => <span className="font-normal text-fog"> (optional)</span>;
const MAX_LOGO = 3 * 1024 * 1024;

export function JoinForm({ refSlug, stamp, quarters, defaultCountry }: { refSlug?: string; stamp: string; quarters: string[]; defaultCountry?: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinWaitlist, {});
  const [, startTransition] = useTransition();
  const [type, setType] = useState<string>("");
  const [logoName, setLogoName] = useState<string>("");
  const [logoError, setLogoError] = useState<string>("");
  const [src, setSrc] = useState<Record<string, string>>({});
  useEffect(() => setSrc(readSource()), []);
  const bad = (f: string) => (state.field === f ? true : undefined);

  // Submit without React's automatic form reset, so nothing typed is lost if there's an error.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (logoError) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={onSubmit} className="glass relative flex flex-col gap-4.5 rounded-[30px] px-5 py-6 sm:px-7" noValidate>
      <div className="flex flex-col gap-1.5">
        <h1 className="display m-0 text-[clamp(30px,6vw,40px)]">
          Join the Minflix Events <span className="text-magenta-soft">waitlist.</span>
        </h1>
        <p className="m-0 text-base text-mist">For film festival organisers. Get early access when we launch, plus your festival card and a free directory listing today.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" placeholder="you@yourfestival.com" className="field" aria-invalid={bad("email")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="festival_name" className="text-sm font-semibold">Festival name</label>
        <input id="festival_name" name="festival_name" required maxLength={120} placeholder="Lagoon Shorts Festival" className="field" aria-invalid={bad("festival_name")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="country" className="text-sm font-semibold">Country</label>
        <select id="country" name="country" required defaultValue={defaultCountry ?? ""} className="field" aria-invalid={bad("country")}>
          <option value="" disabled>Select your country</option>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Logo<Opt /></span>
        <label htmlFor="logo" className="flex cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] border-dashed border-white/30 bg-white/[0.03] p-3.5" aria-invalid={bad("logo") || !!logoError || undefined}>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-magenta/20">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M6 10l6-6 6 6M4 20h16" fill="none" stroke="#F27BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{logoName || "Upload your festival logo"}</span>
            <span className="text-[13px] text-fog">PNG, JPG or WebP, up to 3 MB. Used on your share card.</span>
          </span>
        </label>
        <input id="logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (file && file.size > MAX_LOGO) {
              setLogoError(`That image is ${(file.size / 1048576).toFixed(1)} MB. Choose one that's 3 MB or smaller.`);
              setLogoName("");
              e.currentTarget.value = "";
              return;
            }
            setLogoError("");
            setLogoName(file?.name ?? "");
          }} />
        {logoError && <p role="alert" className="m-0 text-[13px] text-[#FF8A80]">{logoError}</p>}
      </div>

      <div className="mt-1.5 flex flex-col gap-1.5 border-t border-dashed border-white/20 pt-5">
        <h2 className="display m-0 text-[22px] leading-tight">Get your festival listed where filmmakers can discover it.</h2>
        <p className="m-0 text-sm text-fog">All optional. This fills your 2027 Directory listing.</p>
      </div>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2.5 p-0 text-sm font-semibold">What&apos;s your festival type?<Opt /></legend>
        <input type="hidden" name="festival_type" value={type} />
        <div className="flex flex-wrap gap-2">
          {FESTIVAL_TYPES.map((t) => {
            const on = type === t;
            return (
              <button key={t} type="button" aria-pressed={on} onClick={() => setType(on ? "" : t)}
                className={`min-h-11 rounded-full px-4 text-sm ${on ? "bg-magenta font-semibold text-ink shadow-[0_6px_18px_-6px_rgba(228,0,236,0.8)]" : "border border-white/15 bg-white/[0.06] font-medium text-white"}`}>
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="films_per_edition" className="text-sm font-semibold">Films per edition<Opt /></label>
        <select id="films_per_edition" name="films_per_edition" defaultValue="" className="field">
          <option value="">Select</option>
          {FILMS_PER_EDITION.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="next_edition" className="text-sm font-semibold">When is the next edition?<Opt /></label>
        <select id="next_edition" name="next_edition" defaultValue="" className="field">
          <option value="">Select</option>
          {quarters.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="website" className="text-sm font-semibold">Website or social<Opt /></label>
        <input id="website" name="website" maxLength={200} placeholder="instagram.com/yourfestival" className="field" />
      </div>

      <label className="flex items-start gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] p-3.5 text-[13px] leading-relaxed text-[#D6E1E5]" aria-invalid={bad("consent")}>
        <input type="checkbox" name="consent" value="yes" required className="mt-0.5 size-5 shrink-0 accent-[#E400EC]" />
        <span>
          I agree that Minflix can store these details to contact me about Minflix Events, and show my festival&apos;s name, country,
          type, next edition, website and logo in the public directory. Read the{" "}
          <a href="/privacy" target="_blank" className="text-white underline">privacy notice</a>.
        </span>
      </label>

      <input type="hidden" name="started" value={stamp} />
      <input type="hidden" name="ref" value={refSlug || src.ref || ""} />
      <input type="hidden" name="utm_source" value={src.utm_source ?? ""} />
      <input type="hidden" name="utm_medium" value={src.utm_medium ?? ""} />
      <input type="hidden" name="utm_campaign" value={src.utm_campaign ?? ""} />
      <input type="hidden" name="referrer_host" value={src.referrer_host ?? ""} />
      <input type="hidden" name="landing_path" value={src.landing_path ?? ""} />
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {state.error && <p role="alert" className="m-0 text-sm text-[#FF8A80]">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-blue mt-1 text-[17px]">
        {pending ? "Saving…" : <>Done <Arrow /></>}
      </button>
      <p className="m-0 text-center text-xs text-[#8FA4AD]">
        Made a mistake after joining? <a href="https://www.instagram.com/minflix" target="_blank" rel="noopener" className="underline">Message us on Instagram</a>.
      </p>
    </form>
  );
}
