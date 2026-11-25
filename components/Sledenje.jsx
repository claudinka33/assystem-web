"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ogledStrani, poslji } from "@/lib/sledenje";
import { dogodek } from "@/lib/dogodki";
import { prevedeno } from "@/lib/i18n/odjemalec";

// Lastna statistika obiska (brez piškotkov) — vsak ogled strani gre v administracijo.
// Dodatno šteje prenose PDF (katalogi, letaki, ETA/DoP) in klike na e-pošto/telefon.
function Sledenje() {
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
      } else if (/^https?:\/\//i.test(href)) {
        try {
          const host = new URL(href).hostname.replace(/^www\./, "");
          if (!/(^|\.)(as-system|assystem)\.si$/.test(host)) poslji("klik", { podatki: { vrsta: "zunanja", cilj: host.slice(0, 80) } });
        } catch {}
      }
    }
    document.addEventListener("click", klik, true);
    return () => document.removeEventListener("click", klik, true);
  }, []);

  // Obrazci: kdo začne izpolnjevati, kdo odda in pri katerem polju ljudje odnehajo.
  // Vsebina polj se nikoli ne pošlje, samo ime obrazca in ime polja.
  useEffect(() => {
    const obrazci = new Map(); // form -> { ime, polje, oddan, javljen }

    const imeObrazca = (f) =>
      (f.dataset.obrazec || f.getAttribute("aria-label") || window.location.pathname.replace(/^\/(en|de|hr)(?=\/|$)/, "") || "/").slice(0, 80);
    const imePolja = (el) => {
      const lab = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      const ovoj = el.closest("label");
      const t = (lab?.textContent || ovoj?.childNodes?.[0]?.textContent || el.getAttribute("aria-label") || el.placeholder || el.name || "").trim();
      return t.replace(/\s*\*\s*$/, "").slice(0, 60) || null;
    };
    const jeIskalnik = (f) =>
      f.getAttribute("role") === "search" || /iskanje/.test(f.getAttribute("action") || "") || f.querySelectorAll("input:not([type=hidden]),textarea,select").length < 2;

    function fokus(e) {
      const el = e.target;
      if (!el?.matches?.("input,textarea,select")) return;
      const f = el.closest("form");
      if (!f || jeIskalnik(f)) return;
      let z = obrazci.get(f);
      if (!z) {
        z = { ime: imeObrazca(f), polje: null, oddan: false, javljen: false };
        obrazci.set(f, z);
        poslji("obrazec_zacet", { podatki: { obrazec: z.ime } });
      }
      z.polje = imePolja(el) || z.polje;
    }
    function oddaja(e) {
      const z = obrazci.get(e.target);
      if (!z || z.oddan) return;
      z.oddan = true;
      poslji("obrazec_oddan", { podatki: { obrazec: z.ime } });
    }
    function odhod() {
      for (const z of obrazci.values()) {
        if (z.oddan || z.javljen) continue;
        z.javljen = true;
        poslji("obrazec_opuscen", { podatki: { obrazec: z.ime, polje: z.polje } });
      }
    }
    document.addEventListener("focusin", fokus, true);
    document.addEventListener("submit", oddaja, true);
    window.addEventListener("pagehide", odhod);
    return () => {
      odhod();
      document.removeEventListener("focusin", fokus, true);
      document.removeEventListener("submit", oddaja, true);
      window.removeEventListener("pagehide", odhod);
    };
  }, [pot]);

  return null;
}

export default prevedeno(Sledenje);
