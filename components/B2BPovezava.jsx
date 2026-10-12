"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mojStatus } from "@/lib/akcije/b2b";
import { imaSejo } from "@/lib/b2b-klient";

// V zgornjem pasu: "B2B prijava" ali ime podjetja prijavljenega kupca.
export default function B2BPovezava() {
  const [s, setS] = useState(null);
  useEffect(() => {
    if (!imaSejo()) return;
    mojStatus().then(setS).catch(() => {});
  }, []);
  return (
    <Link href={s ? "/b2b/racun" : "/b2b"} className="b2b-link">
      {s ? `B2B: ${s.podjetje}` : "B2B prijava"}
    </Link>
  );
}
