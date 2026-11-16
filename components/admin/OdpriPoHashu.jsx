"use client";

import { useEffect } from "react";

// Če povezava kaže na zaprto vrstico (#p-12), jo odpre in pomakne do nje.
export default function OdpriPoHashu() {
  useEffect(() => {
    const el = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
    if (el?.tagName === "DETAILS") {
      el.open = true;
      el.scrollIntoView({ block: "start" });
    }
  }, []);
  return null;
}
