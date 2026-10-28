"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ogledStrani } from "@/lib/sledenje";
import { dogodek } from "@/lib/dogodki";

// Lastna statistika obiska (brez piškotkov) — vsak ogled strani gre v administracijo.
// Dodatno šteje prenose PDF (katalogi, letaki, ETA/DoP) in klike na e-pošto/telefon.
export default function Sledenje() {
  const pot = usePathname();

  useEffect(() => {
    if (pot) ogledStrani(pot);
  }, [pot]);

  useEffect(() => {
    function klik(e) {
      const a = e.target?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/^mailto:/i.test(href)) dogodek("klik_email", { naslov: href.slice(7, 80) });
      else if (/^tel:/i.test(href)) dogodek("klik_telefon");
      else if (/\.pdf(\?|#|$)/i.test(href)) {
        const datoteka = decodeURIComponent(href.split("?")[0].split("/").pop() || "").slice(0, 120);
        dogodek("katalog_prenos", { datoteka });
      }
    }
    document.addEventListener("click", klik, true);
    return () => document.removeEventListener("click", klik, true);
  }, []);

  return null;
}
