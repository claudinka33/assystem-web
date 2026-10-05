"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Med čakanjem na sinhronizacijo stran osveži vsakih 10 sekund.
export default function Osvezi({ aktivno }) {
  const router = useRouter();
  useEffect(() => {
    if (!aktivno) return;
    const t = setInterval(() => router.refresh(), 10000);
    return () => clearInterval(t);
  }, [aktivno, router]);
  return null;
}
