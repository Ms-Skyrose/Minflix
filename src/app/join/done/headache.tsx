"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { saveHeadache } from "@/app/actions";
import { HEADACHES } from "@/lib/countries";
import { CopyLink } from "@/components/copy-link";

/** The biggest-need question on its own screen; the invite link and directory come only after it. */
export function Headache({ slug, token, invitePath }: { slug: string; token: string; invitePath: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [pending, start] = useTransition();

  function choose(h: string) {
    setPicked(h);
    const fd = new FormData();
    fd.set("f", slug);
    fd.set("t", token);
    fd.set("headache", h);
    start(() => void saveHeadache(fd));
  }

  if (!picked && !skipped)
    return (
      <div className="flex flex-col gap-4">
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-magenta-soft">Help us know your biggest need</span>
        <h1 className="display m-0 text-[clamp(26px,6vw,34px)]">What&apos;s the biggest headache you have running your festival?</h1>
        <span className="text-sm text-fog">Choose one</span>
        <div className="flex flex-wrap gap-2">
          {HEADACHES.map((h) => (
            <button key={h} type="button" disabled={pending} onClick={() => choose(h)}
              className="min-h-11 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[15px] font-medium hover:border-magenta-soft">
              {h}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setSkipped(true)} className="self-start text-sm text-fog underline">Skip for now</button>
      </div>
    );

  return (
    <div className="flex flex-col gap-5" aria-live="polite">
      {picked ? (
        <div className="flex flex-col gap-2.5">
          <span className="glass-soft inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-[13px] font-semibold">
            <span className="size-2 rounded-full bg-magenta" /> Noted: {picked}
          </span>
          <h1 className="display m-0 text-[clamp(26px,6vw,32px)]">Thanks. We&apos;re building for exactly that.</h1>
          <p className="m-0 text-mist">Wait for Minflix Events launch to get your festival page, activate submissions, registration and payments.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <h1 className="display m-0 text-[clamp(26px,6vw,32px)]">You&apos;re all set.</h1>
          <p className="m-0 text-mist">Wait for Minflix Events launch to get your festival page, activate submissions, registration and payments.</p>
        </div>
      )}
      <div className="flex flex-col gap-2 border-t border-dashed border-white/20 pt-5">
        <span className="font-semibold">Know another festival getting ready for its next edition?</span>
        <CopyLink path={invitePath} label="Invite to Minflix Festival Network" />
      </div>
      <Link href="/directory" className="glass-soft rounded-full py-3.5 text-center font-semibold">See the festival directory</Link>
    </div>
  );
}
