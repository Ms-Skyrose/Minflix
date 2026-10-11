"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useOrigin } from "@/components/copy-link";

type Size = "post" | "story";
type Env = { inApp: string | null; ios: boolean; canShareFiles: boolean };

const SIZES: Record<Size, { label: string; hint: string; w: number; h: number }> = {
  post: { label: "Post", hint: "Instagram & Facebook feed", w: 1080, h: 1350 },
  story: { label: "Status", hint: "WhatsApp Status & Stories", w: 1080, h: 1920 },
};

/** Browsers built into social apps block downloads; name the app so the instructions make sense. */
function detectInApp(ua: string): string | null {
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS|Messenger/i.test(ua)) return "Facebook";
  if (/TikTok|musical_ly|Bytedance|BytedanceWebview|trill/i.test(ua)) return "TikTok";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  if (/Twitter|XWebView/i.test(ua)) return "X";
  if (/LinkedInApp/i.test(ua)) return "LinkedIn";
  if (/\bwv\b|; wv\)/.test(ua) && /Android/i.test(ua)) return "this app";
  return null;
}

/**
 * The festival's share card in both sizes, with saving that works everywhere:
 *  - normal browsers: a real file download from the server;
 *  - iPhone/iPad: the share sheet with the image, so "Save Image" puts it in Photos;
 *  - Instagram/TikTok/Facebook in-app browsers (downloads blocked): the full-size image with
 *    "press and hold to save" instructions.
 */
export function CardPanel({ slug, name }: { slug: string; name: string }) {
  const origin = useOrigin();
  const [size, setSize] = useState<Size>("post");
  const [env, setEnv] = useState<Env>({ inApp: null, ios: false, canShareFiles: false });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [viewer, setViewer] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let canShareFiles = false;
    try {
      canShareFiles = !!navigator.canShare?.({ files: [new File([new Blob([""], { type: "image/png" })], "x.png", { type: "image/png" })] });
    } catch {
      canShareFiles = false;
    }
    setEnv({ inApp: detectInApp(ua), ios, canShareFiles });
  }, []);

  const src = `/f/${slug}/card.png${size === "story" ? "?size=story" : ""}`;
  const downloadHref = `/f/${slug}/card.png?${size === "story" ? "size=story&" : ""}download=1`;
  const filename = `${slug}-minflix-events${size === "story" ? "-status" : ""}.png`;
  const pageUrl = `${origin}/f/${slug}`;
  const title = `${name}: our next edition is coming to Minflix Events`;

  async function cardFile() {
    const res = await fetch(src);
    if (!res.ok) throw new Error(String(res.status));
    return new File([await res.blob()], filename, { type: "image/png" });
  }

  async function shareImage(): Promise<boolean> {
    try {
      const file = await cardFile();
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title, text: `${title} ${pageUrl}` });
        return true;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return true; // closed the share sheet
      setMsg("We couldn't prepare your card just now. Please try again in a minute.");
      return true;
    }
    return false;
  }

  async function onSave(e: React.MouseEvent) {
    setMsg("");
    if (env.inApp) {
      e.preventDefault();
      setViewer(true);
      return;
    }
    if (env.ios && env.canShareFiles) {
      e.preventDefault();
      setBusy(true);
      await shareImage();
      setBusy(false);
    }
    // otherwise the link downloads the file directly
  }

  async function onShare() {
    setMsg("");
    setBusy(true);
    const done = env.canShareFiles && (await shareImage());
    if (!done) {
      try {
        if (navigator.share) await navigator.share({ title, url: pageUrl });
        else {
          await navigator.clipboard.writeText(pageUrl);
          setMsg("Link copied. Paste it anywhere to share your card.");
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) setMsg("Download the card, then post it from your gallery.");
      }
    }
    setBusy(false);
  }

  const saveLabel = env.inApp ? "Save card" : env.ios && env.canShareFiles ? "Save to Photos" : "Download card";

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Card size" className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.06] p-1">
        {(Object.keys(SIZES) as Size[]).map((k) => (
          <button key={k} role="tab" type="button" aria-selected={size === k} onClick={() => setSize(k)}
            className={`flex min-h-11 flex-col items-center justify-center rounded-full px-3 py-1 leading-tight ${size === k ? "bg-white text-ink" : "text-[#D6E1E5]"}`}>
            <span className="text-sm font-semibold">{SIZES[k].label}</span>
            <span className={`text-[11px] ${size === k ? "text-slate" : "text-fog"}`}>{SIZES[k].hint}</span>
          </button>
        ))}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={src} src={src} alt={title} width={SIZES[size].w} height={SIZES[size].h}
        className={`mx-auto w-full rounded-[20px] bg-white/[0.04] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.9)] ${size === "story" ? "max-w-[240px]" : "max-w-[340px]"}`} />

      {env.inApp && (
        <p className="m-0 rounded-[14px] border border-white/10 bg-white/[0.04] p-3 text-[13px] text-[#D6E1E5]">
          You&apos;re in {env.inApp}&apos;s browser, which can&apos;t download files. Tap <b>Save card</b>, then press and hold the image and choose
          <b> Save image</b>. Or open this page in Chrome or Safari from the <b>⋯</b> menu.
        </p>
      )}

      <div className="flex flex-wrap gap-2.5">
        <a href={downloadHref} download={filename} onClick={onSave} aria-disabled={busy}
          className="btn-blue flex-[1_1_170px] whitespace-nowrap !px-5 text-[15px]">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {saveLabel}
        </a>
        <button type="button" onClick={onShare} disabled={busy}
          className="glass-soft inline-flex min-h-[52px] flex-[1_1_110px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[15px] font-semibold">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Share
        </button>
      </div>
      {msg && <p role="status" className="m-0 text-sm text-mist">{msg}</p>}

      {viewer && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Save your card" className="fixed inset-0 z-[100] flex flex-col items-center gap-4 overflow-y-auto bg-ink p-4 pt-[max(16px,env(safe-area-inset-top))]">
          <div className="flex w-full max-w-[420px] items-center justify-between gap-3">
            <span className="text-sm font-semibold">Press and hold the card, then tap <b>Save image</b></span>
            <button type="button" onClick={() => setViewer(false)} className="glass-soft min-h-11 rounded-full px-4 text-sm font-semibold">Close</button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={title} width={SIZES[size].w} height={SIZES[size].h} className="w-full max-w-[420px] rounded-[16px]" />
        </div>,
        document.body,
      )}
    </div>
  );
}
