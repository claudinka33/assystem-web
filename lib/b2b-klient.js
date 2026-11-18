"use client";

// Brskalnik: B2B cene za prijavljenega kupca (server action b2bCene). Brez prijave vrne null.
import { useEffect, useState } from "react";
import { b2bCene } from "@/lib/akcije/b2b";

const imaSejo = () => typeof document !== "undefined" && /(^|;\s*)sb-b2b-auth-token/.test(document.cookie);

export function useB2BCene(ids) {
  const kljuc = (ids ?? []).join(",");
  const [stanje, setStanje] = useState(null);
  useEffect(() => {
    // brez piškotka seje (neprijavljen obiskovalec) strežnika sploh ne vprašamo
    let zivo = true;
    // null = še ne vemo, false = ni B2B dostopa (cene in zaloga skrite)
    if (!imaSejo()) {
      setStanje(false);
      return;
    }
    if (!kljuc) return;
    b2bCene(kljuc.split(",").map(Number))
      .then((r) => zivo && setStanje(r || false))
      .catch(() => zivo && setStanje(false));
    return () => {
      zivo = false;
    };
  }, [kljuc]);
  return stanje;
}

export { imaSejo };
