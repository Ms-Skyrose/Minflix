"use client";

import { useState } from "react";
import { useOrigin } from "@/components/copy-link";

/** Download the festival's share card, or share it straight to WhatsApp/Instagram where the phone supports it. */
export function CardActions({ src, filename, title, pagePath }: { src: string; filename: string; title: string; pagePath: string }) {
  const origin = useOrigin();
  const pageUrl = `${origin}${pagePath}`;
  const [busy, setBusy] = useState(false);
  const [canShareFile, setCanShareFile] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);

  async function getFile() {
    const res = await fetch(src);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/png" });
  }

  async function download() {
    setBusy(true);
    setFailed(false);
    try {
      const file = await getFile();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      setFailed(true); // never open a broken page; say what happened instead
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    setBusy(true);
    try {
      const file = await getFile();
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title, text: `${title} ${pageUrl}` });
      } else if (navigator.share) {
        await navigator.share({ title, url: pageUrl });
      } else {
        setCanShareFile(false);
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) setFailed(true); // AbortError = share sheet closed
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={download} disabled={busy} className="btn-blue flex-[1_1_170px] whitespace-nowrap !px-5 text-[15px]">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Download card
        </button>
        <button type="button" onClick={share} disabled={busy}
          className="glass-soft inline-flex min-h-[52px] flex-[1_1_110px] items-center whitespace-nowrap justify-center gap-2 rounded-full px-5 text-[15px] font-semibold">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Share
        </button>
      </div>
      {failed && <p role="alert" className="m-0 text-sm text-[#FF8A80]">We couldn&apos;t prepare your card just now. Please try again in a minute.</p>}
      {canShareFile === false && <p className="m-0 text-xs text-fog">Sharing isn&apos;t available in this browser. Download the card and post it from your gallery.</p>}
    </div>
  );
}
