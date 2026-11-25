"use client";

import { useEffect } from "react";
import { poslji } from "@/lib/sledenje";

// Lastna statistika: kaj obiskovalci iščejo na strani in ali kaj najdejo.
export default function BeleziIskanje({ q, zadetki }) {
  useEffect(() => {
    if (q) poslji("iskanje", { podatki: { q: String(q).toLowerCase().slice(0, 80), zadetki } });
  }, [q, zadetki]);
  return null;
}
