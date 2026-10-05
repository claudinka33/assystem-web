"use client";

import Link from "next/link";
import { useKosarica } from "@/lib/kosarica";

export default function KosaricaGumb() {
  const p = useKosarica();
  const n = p.reduce((s, x) => s + x.kolicina, 0);
  return (
    <Link href="/kosarica" className="kos-gumb" aria-label={`Košarica (${n})`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 8H6" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      {n > 0 && <span>{n}</span>}
    </Link>
  );
}
