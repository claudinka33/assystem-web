"use client";

import { useEffect } from "react";
import { dogodekKoJePripravljeno } from "@/lib/dogodki";
import { prevedeno } from "@/lib/i18n/odjemalec";

// Nakup v GA4 (purchase) in Meta Pixlu (Purchase) — samo enkrat na naročilo.
function Konverzija({ stevilka, znesek }) {
  useEffect(() => {
    const kljuc = `as_nakup_${stevilka}`;
    try {
      if (window.localStorage.getItem(kljuc)) return;
      window.localStorage.setItem(kljuc, "1");
    } catch {}
    dogodekKoJePripravljeno("purchase", { transaction_id: stevilka, value: znesek, currency: "EUR" });
  }, [stevilka, znesek]);
  return null;
}

export default prevedeno(Konverzija);
