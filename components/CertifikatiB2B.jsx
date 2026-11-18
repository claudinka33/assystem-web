"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { b2bCertifikati } from "@/lib/akcije/b2b";
import { imaSejo } from "@/lib/b2b-klient";
import { prevedeno } from "@/lib/i18n/odjemalec";

const OZNAKE = { eta: "ETA", dop: "DoP", certifikat: "Certifikat" };

// Certifikati izdelka so vidni samo prijavljenim B2B uporabnikom; drugi vidijo povabilo k registraciji.
function CertifikatiB2B({ izdelekId }) {
  const [dok, setDok] = useState(null); // null = nalaga, false = zaklenjeno, [] = seznam
  useEffect(() => {
    if (!imaSejo()) return setDok(false);
    let zivo = true;
    b2bCertifikati(izdelekId)
      .then((r) => zivo && setDok(Array.isArray(r) ? r : false))
      .catch(() => zivo && setDok(false));
    return () => {
      zivo = false;
    };
  }, [izdelekId]);
  if (dok === null) return null;
  if (dok === false)
    return (
      <Link className="izd-dok-zak" href="/b2b/registracija">
        <b>🔒 Certifikati</b>
        <span>ETA in izjave o lastnostih so na voljo B2B kupcem</span>
        <em>Postanite B2B kupec →</em>
      </Link>
    );
  return dok.map((d) => (
    <a key={d.id} href={d.datoteka_url} target="_blank" rel="noreferrer">
      <b>{OZNAKE[d.tip] ?? d.tip}</b>
      <span>{d.naziv}</span>
      <em>PDF · {d.jezik?.toUpperCase()}</em>
    </a>
  ));
}

export default prevedeno(CertifikatiB2B);
