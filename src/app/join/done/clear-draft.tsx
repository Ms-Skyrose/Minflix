"use client";

import { useEffect } from "react";

/** Once someone has joined, forget the saved form draft. */
export function ClearDraft() {
  useEffect(() => {
    try {
      sessionStorage.removeItem("mf_join_draft");
      sessionStorage.removeItem("mf_join_reloaded");
    } catch {
      /* storage blocked */
    }
  }, []);
  return null;
}
