"use client";

import { useState } from "react";

/** Shows a link and copies it (falls back to the native share sheet, then to selecting the text). */
export function CopyLink({ url, label = "Copy invite link", shareText }: { url: string; label?: string; shareText?: string }) {
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
      <input readOnly value={url.replace(/^https?:\/\//, "")} aria-label="Invite link" onFocus={(e) => e.currentTarget.select()}
        className="glass-soft w-full truncate rounded-[14px] px-3.5 py-3 text-sm text-[#D6E1E5]" />
      <button type="button" onClick={onClick} className="btn-blue text-[15px]">
        {copied ? "Link copied" : label}
      </button>
    </div>
  );
}
