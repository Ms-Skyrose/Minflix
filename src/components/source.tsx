"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const KEY = "mf_src";
const FIELDS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/** Where this visitor came from (first page of the visit), kept for the signup form. */
export function readSource(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function captureSource() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const url = new URL(window.location.href);
    const src: Record<string, string> = { landing_path: url.pathname };
    for (const f of FIELDS) {
      const v = url.searchParams.get(f);
      if (v) src[f] = v.slice(0, 100);
    }
    const ref = url.searchParams.get("ref");
    if (ref) src.ref = ref.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 90);
    if (document.referrer) {
      const host = new URL(document.referrer).host;
      if (host && host !== url.host) src.referrer_host = host.slice(0, 200);
    }
    sessionStorage.setItem(KEY, JSON.stringify(src));
  } catch {
    /* private mode or blocked storage: nothing to keep */
  }
}

/**
 * Counts page views without cookies. Each view is sent to /api/track; the server stores only a
 * daily-rotating hash (never the IP). Skipped when the browser asks not to be tracked.
 */
export function Tracker() {
  const path = usePathname();
  useEffect(() => {
    captureSource();
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.globalPrivacyControl || nav.doNotTrack === "1") return;
    const src = readSource();
    const url = new URL(window.location.href);
    const body = JSON.stringify({
      path,
      ref: url.searchParams.get("ref") || src.ref || "",
      utm_source: url.searchParams.get("utm_source") || src.utm_source || "",
      utm_medium: url.searchParams.get("utm_medium") || src.utm_medium || "",
      utm_campaign: url.searchParams.get("utm_campaign") || src.utm_campaign || "",
      referrer_host: src.referrer_host || "",
    });
    try {
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" })))
        fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
    } catch {
      /* never let counting break the page */
    }
  }, [path]);
  return null;
}
