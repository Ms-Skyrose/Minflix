"use client";

import { useEffect, useState } from "react";

/** The domain the visitor is on right now (Vercel URL, events.minflix.com, localhost…). */
export function useOrigin(): string {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return origin;
}

/** Shows a link on the current domain and copies it (falls back to the share sheet). */
export function CopyLink({ path, label = "Copy invite link", shareText }: { path: string; label?: string; shareText?: string }) {
  const origin = useOrigin();
  const url = `${origin}${path}`;
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (navigator.share) navigator.share({ url, text: shareText }).catch(() => {});
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input readOnly value={origin ? url.replace(/^https?:\/\//, "") : path} aria-label="Invite link" onFocus={(e) => e.currentTarget.select()}
        className="glass-soft w-full truncate rounded-[14px] px-3.5 py-3 text-sm text-[#D6E1E5]" />
      <button type="button" onClick={onClick} className="btn-blue text-[15px]">
        {copied ? "Link copied" : label}
      </button>
    </div>
  );
}
