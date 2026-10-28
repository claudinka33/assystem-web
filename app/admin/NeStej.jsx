"use client";

import { useEffect } from "react";

// Naprava, s katere se je prijavil administrator, se ne šteje v statistiko obiska.
export default function NeStej() {
  useEffect(() => {
    try {
      document.cookie = "as_ne_stej=1; max-age=31536000; path=/; SameSite=Lax; Secure";
    } catch {}
  }, []);
  return null;
}
