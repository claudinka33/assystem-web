"use client";

import { useEffect, useRef, useState } from "react";

// Povratna informacija za VSE gumbe v administraciji, ki nekaj shranijo.
// Vsako shranjevanje (Next.js server action) gre skozi fetch z glavo "next-action":
// med čakanjem pokažemo "Shranjujem…", nato uspeh ali napako.
function jeAkcija(init) {
  const h = init?.headers;
  if (!h) return false;
  if (typeof Headers !== "undefined" && h instanceof Headers) return h.has("next-action");
  return Object.keys(h).some((k) => k.toLowerCase() === "next-action");
}

export default function Obvestila() {
  const [obvestilo, setObvestilo] = useState(null); // { tip: "caka" | "ok" | "napaka", besedilo }
  const caka = useRef(0);
  const timer = useRef(null);
  const gumbi = useRef(new Set());

  useEffect(() => {
    const pokazi = (tip, besedilo, cas) => {
      clearTimeout(timer.current);
      setObvestilo({ tip, besedilo });
      if (cas) timer.current = setTimeout(() => setObvestilo(null), cas);
    };
    const sprostiGumbe = () => {
      gumbi.current.forEach((g) => {
        g.disabled = false;
        g.style.opacity = "";
        g.style.cursor = "";
      });
      gumbi.current.clear();
    };

    // gumb, s katerim je bil obrazec poslan, med shranjevanjem zatemnimo
    const obOddaji = (e) => {
      const g = e.submitter;
      if (!g || !e.target.closest(".adm")) return;
      setTimeout(() => {
        if (e.defaultPrevented) return;
        gumbi.current.add(g);
        g.disabled = true;
        g.style.opacity = "0.6";
        g.style.cursor = "wait";
      }, 0);
    };
    document.addEventListener("submit", obOddaji, true);

    const izvirni = window.fetch;
    window.fetch = async (input, init) => {
      if (!jeAkcija(init)) return izvirni(input, init);
      caka.current += 1;
      pokazi("caka", "Shranjujem …");
      try {
        const res = await izvirni(input, init);
        caka.current -= 1;
        if (caka.current === 0) {
          sprostiGumbe();
          if (res.ok || (res.status >= 300 && res.status < 400)) pokazi("ok", "✓ Spremembe uspešno shranjene", 3500);
          else pokazi("napaka", "✗ Shranjevanje ni uspelo — poskusi znova ali osveži stran.", 8000);
        }
        return res;
      } catch (err) {
        caka.current -= 1;
        sprostiGumbe();
        pokazi("napaka", "✗ Shranjevanje ni uspelo — ni povezave s strežnikom.", 8000);
        throw err;
      }
    };

    return () => {
      window.fetch = izvirni;
      document.removeEventListener("submit", obOddaji, true);
      clearTimeout(timer.current);
    };
  }, []);

  if (!obvestilo) return null;
  const barve = {
    caka: { bg: "#2b2b2b", fg: "#fff" },
    ok: { bg: "#1f7a3f", fg: "#fff" },
    napaka: { bg: "#C8102E", fg: "#fff" },
  }[obvestilo.tip];

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={() => obvestilo.tip !== "caka" && setObvestilo(null)}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 9999,
        maxWidth: "calc(100vw - 40px)",
        background: barve.bg,
        color: barve.fg,
        padding: "14px 20px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 15,
        boxShadow: "0 8px 28px rgba(0,0,0,.25)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: obvestilo.tip === "caka" ? "default" : "pointer",
      }}
    >
      {obvestilo.tip === "caka" && (
        <span
          style={{
            width: 16,
            height: 16,
            border: "2px solid rgba(255,255,255,.35)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            display: "inline-block",
            animation: "adm-vrti .8s linear infinite",
          }}
        />
      )}
      {obvestilo.besedilo}
      <style>{`@keyframes adm-vrti{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
