"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Sprotno iskanje: ob vsaki spremembi (tudi brisanju) po kratkem premoru osveži seznam.
export default function IskalnikBaze({ q }) {
  const router = useRouter();
  const pot = usePathname();
  const sp = useSearchParams();
  const [v, setV] = useState(q);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  function isci(novo, takoj = false) {
    clearTimeout(t.current);
    const zazeni = () => {
      const o = new URLSearchParams(sp.toString());
      if (novo.trim()) o.set("q", novo.trim()); else o.delete("q");
      o.delete("stran");
      const s = o.toString();
      router.replace(s ? `${pot}?${s}` : pot, { scroll: false });
    };
    if (takoj) zazeni(); else t.current = setTimeout(zazeni, 300);
  }

  return (
    <form className="bz-isk" onSubmit={(e) => { e.preventDefault(); isci(v, true); }}>
      <input
        type="search"
        name="q"
        value={v}
        autoComplete="off"
        onChange={(e) => { setV(e.target.value); isci(e.target.value); }}
        placeholder="Išči po e-naslovu, imenu, podjetju, poslovalnici, kraju, davčni, telefonu …"
      />
      {v && <button type="button" className="gumb siv" onClick={() => { setV(""); isci("", true); }}>✕</button>}
    </form>
  );
}
