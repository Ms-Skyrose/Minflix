"use client";

import { useEffect } from "react";
import Link from "next/link";

const RELOAD_KEY = "mf_error_reloaded";

/**
 * Shown instead of the blank "Application error" screen if anything on a page fails.
 * If the page is simply out of date after a redeploy, it reloads itself once.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    const stale = /server action|failed-to-find|ChunkLoadError|Loading chunk|dynamically imported module/i.test(error?.message ?? "");
    try {
      if (stale && !sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
        return;
      }
      sessionStorage.removeItem(RELOAD_KEY);
    } catch {
      /* storage blocked */
    }
  }, [error]);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div className="orb -right-32 -top-20 size-[380px] bg-magenta/40" />
      <div className="glass relative flex w-full max-w-[460px] flex-col gap-4 rounded-[30px] px-6 py-8">
        <h1 className="display m-0 text-3xl">Something went wrong</h1>
        <p className="m-0 text-mist">
          This page hit a problem loading. Please try again. If you were joining the waitlist, your details may already be saved: try joining
          again with the same email and we&apos;ll show your festival card.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" onClick={() => { reset(); window.location.reload(); }} className="btn-blue flex-1">Try again</button>
          <Link href="/" className="glass-soft inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full px-5 font-semibold">Go home</Link>
        </div>
        <a href="https://www.instagram.com/minflix" target="_blank" rel="noopener" className="text-[13px] text-mist underline">Still stuck? Message us on Instagram</a>
        {error?.digest && <p className="m-0 text-xs text-[#8FA4AD]">Reference: {error.digest}</p>}
      </div>
    </main>
  );
}
