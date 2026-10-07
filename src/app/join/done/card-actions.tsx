"use client";

import { useState } from "react";

/** Download the festival's share card, or share it straight to WhatsApp/Instagram where the phone supports it. */
export function CardActions({ src, filename, title, pageUrl }: { src: string; filename: string; title: string; pageUrl: string }) {
  const [busy, setBusy] = useState(false);
  const [canShareFile, setCanShareFile] = useState<boolean | null>(null);

  async function getFile() {
    const res = await fetch(src);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/png" });
  }

  async function download() {
    setBusy(true);
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
      window.open(src, "_blank"); // fallback: open the image; long-press to save
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
    } catch {
      /* the person closed the share sheet */
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
      {canShareFile === false && <p className="m-0 text-xs text-fog">Sharing isn&apos;t available in this browser. Download the card and post it from your gallery.</p>}
    </div>
  );
}
