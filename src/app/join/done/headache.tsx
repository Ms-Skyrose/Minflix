"use client";

import { useState, useTransition } from "react";
import { saveHeadache } from "@/app/actions";
import { HEADACHES } from "@/lib/countries";

export function Headache({ slug, token }: { slug: string; token: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function choose(h: string) {
    setPicked(h);
    const fd = new FormData();
    fd.set("f", slug);
    fd.set("t", token);
    fd.set("headache", h);
    start(() => void saveHeadache(fd));
  }

  if (picked)
    return (
      <div className="flex flex-col gap-3 border-t border-dashed border-white/20 pt-5" aria-live="polite">
        <span className="glass-soft inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-[13px] font-semibold">
          <span className="size-2 rounded-full bg-magenta" /> Noted: {picked}
        </span>
        <span className="text-xl font-bold leading-snug">Thanks. We&apos;re building for exactly that.</span>
        <span className="text-mist">Wait for Minflix Events launch to get your festival page, activate submissions, registration and payments.</span>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 border-t border-dashed border-white/20 pt-5">
      <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-magenta-soft">Help shape Minflix Events</span>
      <span className="text-[19px] font-bold leading-snug">What&apos;s the biggest headache you have running your festival?</span>
      <span className="text-[13px] text-fog">Choose one</span>
      <div className="flex flex-wrap gap-2">
        {HEADACHES.map((h) => (
          <button key={h} type="button" disabled={pending} onClick={() => choose(h)}
            className="min-h-11 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-medium hover:border-magenta-soft">
            {h}
          </button>
        ))}
      </div>
    </div>
  );
}
