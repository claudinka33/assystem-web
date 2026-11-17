"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { prevedeno } from "@/lib/i18n/odjemalec";

// Slika na vrhu strani izdelka; filter v tabeli (npr. metrični navoj) jo lahko zamenja.
function SlikaVrh({ slika, naziv }) {
  const [druga, setDruga] = useState(null);
  useEffect(() => {
    const f = (e) => setDruga(e.detail || null);
    window.addEventListener("izdelek-slika", f);
    return () => window.removeEventListener("izdelek-slika", f);
  }, []);
  const url = druga ?? slika;
  if (!url) return null;
  return <Image key={url} src={url} alt={naziv} fill priority sizes="(max-width: 760px) 100vw, 300px" style={{ objectFit: "contain", padding: 10 }} />;
}

export default prevedeno(SlikaVrh);
