"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mojStatus, naloziKosarico, shraniKosarico, odjava } from "@/lib/akcije/b2b";
import { zamenjaj, beriKosarico, poslusaj, izprazni } from "@/lib/kosarica";
import { prevedeno } from "@/lib/i18n/odjemalec";

const LASTNIK = "as_kosarica_lastnik";
const lsBeri = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const lsPisi = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

// Košarica B2B uporabnika se hrani na strežniku (3 dni) — enaka na vseh napravah, ločena po uporabnikih.
function useB2BKosarica(id) {
  useEffect(() => {
    if (!id) return;
    let pripravljen = false;
    let t;
    naloziKosarico()
      .then((r) => {
        if (!r) return;
        const lastnik = lsBeri(LASTNIK);
        const lokalno = beriKosarico();
        if (lastnik && lastnik !== r.id) zamenjaj(r.postavke); // drug uporabnik na isti napravi
        else if (r.poteklo && lastnik === r.id) izprazni(); // po 3 dneh se košarica izprazni
        else if (!lokalno.length && r.postavke.length) zamenjaj(r.postavke);
        else if (lokalno.length) shraniKosarico(lokalno).catch(() => {});
        lsPisi(LASTNIK, r.id);
        pripravljen = true;
      })
      .catch(() => {});
    const odjava = poslusaj(() => {
      if (!pripravljen) return;
      clearTimeout(t);
      t = setTimeout(() => shraniKosarico(beriKosarico()).catch(() => {}), 1200);
    });
    return () => {
      clearTimeout(t);
      odjava();
    };
  }, [id]);
}
import { imaSejo } from "@/lib/b2b-klient";

// V zgornjem pasu: "B2B prijava" ali ime podjetja prijavljenega kupca.
function B2BPovezava() {
  const [s, setS] = useState(null);
  useEffect(() => {
    if (!imaSejo()) return;
    mojStatus().then(setS).catch(() => {});
  }, []);
  useB2BKosarica(s?.id);
  if (!s)
    return (
      <Link href="/b2b" className="b2b-link">
        B2B prijava za podjetja →
      </Link>
    );
  return (
    <span className="b2b-prijavljen">
      <span className="b2b-pik" aria-hidden="true" />
      <span className="b2b-kdo">
        Prijavljeni: <b translate="no">{s.podjetje}</b>
      </span>
      <Link href="/b2b/racun" className="b2b-profil">
        Moj profil
      </Link>
      <form action={odjava} className="util-odjava">
        <button type="submit">Odjava</button>
      </form>
    </span>
  );
}

export default prevedeno(B2BPovezava);
