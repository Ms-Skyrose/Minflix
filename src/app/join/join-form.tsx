"use client";

import { useActionState, useState } from "react";
import { joinWaitlist, type JoinState } from "@/app/actions";
import { COUNTRIES, FESTIVAL_TYPES, FILMS_PER_EDITION, NEXT_EDITION } from "@/lib/countries";
import { Arrow } from "@/components/brand";

const Opt = () => <span className="font-normal text-fog"> (optional)</span>;

export function JoinForm({ refSlug }: { refSlug?: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinWaitlist, {});
  const [type, setType] = useState<string>("");
  const [logoName, setLogoName] = useState<string>("");
  const bad = (f: string) => (state.field === f ? true : undefined);

  return (
    <form action={action} className="glass relative flex flex-col gap-4.5 rounded-[30px] px-5 py-6 sm:px-7" noValidate>
      <div className="flex flex-col gap-1.5">
        <h1 className="display m-0 text-[clamp(30px,6vw,40px)]">
          Minflix Events for <span className="text-magenta-soft">film festivals.</span>
        </h1>
        <p className="m-0 text-base text-mist">Want to be notified when it&apos;s ready?</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@yourfestival.com" className="field" aria-invalid={bad("email")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="festival_name" className="text-sm font-semibold">Festival name</label>
        <input id="festival_name" name="festival_name" required placeholder="Lagoon Shorts Festival" className="field" aria-invalid={bad("festival_name")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="country" className="text-sm font-semibold">Country</label>
        <select id="country" name="country" required defaultValue="" className="field" aria-invalid={bad("country")}>
          <option value="" disabled>Select your country</option>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Logo<Opt /></span>
        <label htmlFor="logo" className="flex cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] border-dashed border-white/30 bg-white/[0.03] p-3.5" aria-invalid={bad("logo")}>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-magenta/20">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M6 10l6-6 6 6M4 20h16" fill="none" stroke="#F27BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{logoName || "Upload your festival logo"}</span>
            <span className="text-[13px] text-fog">PNG, JPG or WebP, up to 2 MB. Used on your share card.</span>
          </span>
        </label>
        <input id="logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
          onChange={(e) => setLogoName(e.currentTarget.files?.[0]?.name ?? "")} />
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
          {NEXT_EDITION.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="website" className="text-sm font-semibold">Website or social<Opt /></label>
        <input id="website" name="website" placeholder="instagram.com/yourfestival" className="field" />
      </div>

      <input type="hidden" name="ref" value={refSlug ?? ""} />
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {state.error && <p role="alert" className="m-0 text-sm text-[#FF8A80]">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-blue mt-2 text-[17px]">
        {pending ? "Saving…" : <>Done <Arrow /></>}
      </button>
      <p className="m-0 text-center text-xs text-[#8FA4AD]">We&apos;ll only email you about Minflix Events.</p>
    </form>
  );
}
