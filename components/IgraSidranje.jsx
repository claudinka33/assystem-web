"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { dogodek } from "@/lib/dogodki";

/* --------------------------------------------------------------
   Vaja sidranja — orodje vzameš v roko in ga držiš nad luknjo.
   Vrtanje, izpih in zategovanje tečejo, dokler držiš miško.
   Kladivo dela na udarce.
   -------------------------------------------------------------- */

const LUKNJE = [41.5, 46.5, 53.5, 58.5];

const SVEDRI = [8, 10, 12];

const SIDRA = [
  { id: "8x75", naziv: "TXH7 M8×75", premer: 8, opis: "Nadstreški, lažje konzole" },
  { id: "10x90", naziv: "TXH7 M10×90", premer: 10, opis: "Ograje, konzole, strojne noge", top: true },
  { id: "12x120", naziv: "TXH7 M12×120", premer: 12, opis: "Nosilci, težke obremenitve" },
];

const zacetne = LUKNJE.map((x, id) => ({
  id,
  x,
  globina: 0,      // 0–100 vrtanje
  prah: 100,       // 100 = polna prahu, 0 = izpihana
  sidro: null,
  zabitost: 0,     // 0–100
  zategnjenost: 0, // 0–100
}));

export default function IgraSidranje() {
  const [luknje, setLuknje] = useState(zacetne);
  const [ograja, setOgraja] = useState(false);
  const [orodje, setOrodje] = useState(null); // {tip, premer?, id?}
  const [misk, setMisk] = useState({ x: 50, y: 50 });
  const [vRoki, setVRoki] = useState(false);
  const [delci, setDelci] = useState([]);
  const [sporocilo, setSporocilo] = useState(null);
  const [napaka, setNapaka] = useState(false);
  const [koncano, setKoncano] = useState(false);

  const prizor = useRef(null);
  const tik = useRef(null);
  const stevec = useRef(0);

  const vseIzvrtane = luknje.every((l) => l.globina >= 100);
  const vseIzpihane = luknje.every((l) => l.prah <= 0);
  const vseSidra = luknje.every((l) => l.sidro);
  const vseZabite = luknje.every((l) => l.zabitost >= 100);
  const vseZategnjene = luknje.every((l) => l.zategnjenost >= 100);

  const korak = !ograja
    ? 0
    : !vseIzvrtane
    ? 1
    : !vseIzpihane
    ? 2
    : !vseSidra
    ? 3
    : !vseZabite
    ? 4
    : !vseZategnjene
    ? 5
    : 6;

  const KORAKI = [
    ["Postavi ograjo", "Klikni na betonsko škarpo."],
    ["Izvrtaj luknje", orodje?.tip === "sveder" ? "Sveder je v roki. Postavi ga nad oznako in drži miško, dokler ni luknja izvrtana." : "Vzemi sveder iz orodjarne — premer mora ustrezati sidru."],
    ["Izpihaj luknje", orodje?.tip === "pihalka" ? "Drži miško nad luknjo, dokler ves prah ne izgine." : "Vzemi pihalko iz orodjarne."],
    ["Vstavi sidra", orodje?.tip === "sidro" ? "Klikni v vsako izpihano luknjo." : "Izberi sidro TXH7 iz orodjarne."],
    ["Zabij sidra", orodje?.tip === "kladivo" ? "Vsak klik je en udarec. Štirje udarci na sidro." : "Vzemi kladivo iz orodjarne."],
    ["Zategni matice", orodje?.tip === "kljuc" ? "Drži miško nad matico, dokler ni zategnjena." : "Vzemi viličasti ključ iz orodjarne."],
    ["Končano", "Ograja je pritrjena."],
  ];

  function povej(besedilo, jeNapaka = false) {
    setSporocilo(besedilo);
    setNapaka(jeNapaka);
  }

  const posodobi = useCallback((id, f) => {
    setLuknje((prej) => prej.map((l) => (l.id === id ? { ...l, ...f(l) } : l)));
  }, []);

  function vrziDelce(id, koliko = 3) {
    const novi = Array.from({ length: koliko }, () => ({
      k: stevec.current++,
      id,
      dx: (Math.random() - 0.5) * 90,
      dy: -18 - Math.random() * 46,
      r: 2 + Math.random() * 4,
    }));
    setDelci((p) => [...p, ...novi]);
    setTimeout(() => setDelci((p) => p.filter((d) => !novi.includes(d))), 650);
  }

  function ustavi() {
    if (tik.current) clearInterval(tik.current);
    tik.current = null;
  }

  useEffect(() => ustavi, []);

  useEffect(() => {
    if (korak === 6 && !koncano) {
      setKoncano(true);
      dogodek("igra_sidranje_koncana");
    }
  }, [korak, koncano]);

  function premik(e) {
    const r = prizor.current?.getBoundingClientRect();
    if (!r) return;
    setMisk({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  // ---------------- dejanja nad luknjo ----------------
  function zacniDejanje(l) {
    if (!orodje) {
      povej("Najprej vzemi orodje iz orodjarne.", true);
      return;
    }

    if (orodje.tip === "sveder") {
      if (l.globina >= 100) return;
      setVRoki(true);
      tik.current = setInterval(() => {
        vrziDelce(l.id, 3);
        posodobi(l.id, (x) => {
          const nova = Math.min(100, x.globina + 7);
          if (nova >= 100) ustavi();
          return { globina: nova };
        });
      }, 70);
      return;
    }

    if (orodje.tip === "pihalka") {
      if (l.globina < 100) {
        povej("Ta luknja še ni izvrtana.", true);
        return;
      }
      if (l.prah <= 0) return;
      setVRoki(true);
      tik.current = setInterval(() => {
        posodobi(l.id, (x) => {
          const nov = Math.max(0, x.prah - 9);
          if (nov <= 0) ustavi();
          return { prah: nov };
        });
      }, 70);
      return;
    }

    if (orodje.tip === "sidro") {
      if (l.globina < 100) {
        povej("V neizvrtano luknjo sidra ni mogoče vstaviti.", true);
        return;
      }
      if (l.prah > 0) {
        povej("Luknja je še polna prahu. Prah zniža nosilnost — najprej izpihaj.", true);
        return;
      }
      if (l.sidro) return;
      posodobi(l.id, () => ({ sidro: orodje.id }));
      return;
    }

    if (orodje.tip === "kladivo") {
      if (!l.sidro || l.zabitost >= 100) return;
      posodobi(l.id, (x) => ({ zabitost: Math.min(100, x.zabitost + 25) }));
      vrziDelce(l.id, 2);
      return;
    }

    if (orodje.tip === "kljuc") {
      if (l.zabitost < 100) {
        povej("Sidro mora biti najprej zabito do plošče.", true);
        return;
      }
      if (l.zategnjenost >= 100) return;
      setVRoki(true);
      tik.current = setInterval(() => {
        posodobi(l.id, (x) => {
          const nov = Math.min(100, x.zategnjenost + 8);
          if (nov >= 100) ustavi();
          return { zategnjenost: nov };
        });
      }, 70);
    }
  }

  function koncajDejanje() {
    setVRoki(false);
    ustavi();
  }

  // ---------------- izbira orodja ----------------
  function vzemiSveder(premer) {
    setOrodje({ tip: "sveder", premer });
    povej(`V vrtalnik je vpet sveder Ø${premer}. Drži miško nad oznako, da vrtaš.`);
  }

  function vzemiSidro(s) {
    const uporabljen = SVEDRI.find(() => false);
    const premerIzvrtine = orodjePremerIzvrtine();
    if (premerIzvrtine && s.premer !== premerIzvrtine) {
      povej(
        `Sidro ${s.naziv} zahteva izvrtino Ø${s.premer}, ti pa si vrtal z Ø${premerIzvrtine}. ` +
          (s.premer > premerIzvrtine
            ? "V premajhno izvrtino sidra ni mogoče vstaviti."
            : "V preveliki izvrtini se tulec ne razpre in sidro ne zagrabi betona."),
        true
      );
      return;
    }
    setOrodje({ tip: "sidro", id: s.id, premer: s.premer });
    povej(`${s.naziv} je v roki. Klikni v izpihano luknjo.`);
  }

  const premerRef = useRef(null);
  function orodjePremerIzvrtine() {
    return premerRef.current;
  }
  useEffect(() => {
    if (orodje?.tip === "sveder") premerRef.current = orodje.premer;
  }, [orodje]);

  function ponovi() {
    ustavi();
    setLuknje(zacetne);
    setOgraja(false);
    setOrodje(null);
    setDelci([]);
    setSporocilo(null);
    setNapaka(false);
    setKoncano(false);
    premerRef.current = null;
  }

  const izbranoSidro = SIDRA.find((s) => s.id === luknje.find((l) => l.sidro)?.sidro);

  return (
    <div className="igra">
      <ol className="igra-koraki">
        {KORAKI.slice(0, 6).map(([naziv], i) => (
          <li key={naziv} className={i < korak ? "koncan" : i === korak ? "aktiven" : undefined}>
            <b>{String(i + 1).padStart(2, "0")}</b>
            <span>{naziv}</span>
          </li>
        ))}
      </ol>

      <div className="igra-navodilo">
        <b>{KORAKI[korak][0]}</b>
        <span>{KORAKI[korak][1]}</span>
      </div>

      {sporocilo && <p className={napaka ? "igra-napaka" : "igra-uspeh"}>{sporocilo}</p>}

      {/* ---------------- prizor ---------------- */}
      <div
        ref={prizor}
        className={`prizor${orodje ? " z-orodjem" : ""}`}
        onPointerMove={premik}
        onPointerUp={koncajDejanje}
        onPointerLeave={koncajDejanje}
      >
        <div className="prizor-nebo" />
        <div
          className="prizor-beton"
          data-klik={!ograja ? "da" : undefined}
          onPointerDown={() => {
            if (!ograja) {
              setOgraja(true);
              povej("Steber stoji na škarpi. Vzemi sveder iz orodjarne.");
            }
          }}
        >
          {!ograja && <span className="prizor-namig">klikni za postavitev ograje</span>}
        </div>

        {ograja && (
          <>
            <div className="ograja-senca" />
            <svg className="ograja" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMax meet">
              <defs>
                <linearGradient id="jeklo" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6f767c" />
                  <stop offset="18%" stopColor="#c9ced2" />
                  <stop offset="40%" stopColor="#f0f2f3" />
                  <stop offset="62%" stopColor="#b7bdc2" />
                  <stop offset="100%" stopColor="#70777d" />
                </linearGradient>
                <linearGradient id="jekloV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eef0f1" />
                  <stop offset="35%" stopColor="#bcc2c7" />
                  <stop offset="100%" stopColor="#7d8489" />
                </linearGradient>
                <filter id="mehkaSenca" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="6" dy="8" stdDeviation="6" floodColor="#2d3033" floodOpacity="0.35" />
                </filter>
              </defs>
              <g filter="url(#mehkaSenca)">
                <rect x="60" y="180" width="880" height="16" fill="url(#jeklo)" />
                <rect x="60" y="330" width="880" height="16" fill="url(#jeklo)" />
                {[105, 175, 245, 315, 690, 760, 830, 900].map((x) => (
                  <g key={x}>
                    <rect x={x} y="120" width="13" height="300" rx="2" fill="url(#jeklo)" />
                    <polygon points={`${x - 4},122 ${x + 17},122 ${x + 6.5},96`} fill="#9aa1a7" />
                  </g>
                ))}
                <rect x="470" y="70" width="46" height="350" rx="3" fill="url(#jeklo)" />
                <rect x="470" y="70" width="46" height="12" rx="2" fill="#dfe3e5" />
                <polygon points="470,360 430,420 470,420" fill="#9aa1a7" />
                <polygon points="516,360 556,420 516,420" fill="#8e959b" />
                <rect x="380" y="420" width="226" height="26" rx="2" fill="url(#jekloV)" />
                <rect x="380" y="420" width="226" height="5" fill="#eff1f2" />
                <rect x="380" y="441" width="226" height="6" fill="#6f767c" />
              </g>
            </svg>
          </>
        )}

        {/* luknje */}
        {ograja &&
          luknje.map((l) => (
            <div
              key={l.id}
              className="tocka"
              style={{ left: `${l.x}%` }}
              onPointerDown={(e) => {
                e.stopPropagation();
                zacniDejanje(l);
              }}
            >
              {l.globina === 0 && <span className="oznaka" />}

              {l.globina > 0 && !l.sidro && (
                <span className="luknja" style={{ height: `${8 + l.globina * 0.34}%` }}>
                  {l.globina >= 100 && l.prah > 0 && (
                    <span className="prah" style={{ opacity: l.prah / 100 }} />
                  )}
                </span>
              )}

              {l.sidro && (
                <span
                  className={`sidro${l.zategnjenost >= 100 ? " zategnjeno" : ""}`}
                  style={{ bottom: `${20 - l.zabitost * 0.08}%` }}
                >
                  <Image src="/igra/sidro.png" alt="Jekleno sidro TXH7" width={84} height={520} />
                  {l.zategnjenost > 0 && (
                    <span className="matica" style={{ transform: `rotate(${l.zategnjenost * 3.6}deg)` }} />
                  )}
                </span>
              )}

              {/* delci betona */}
              {delci
                .filter((d) => d.id === l.id)
                .map((d) => (
                  <span
                    key={d.k}
                    className="delec"
                    style={{
                      "--dx": `${d.dx}px`,
                      "--dy": `${d.dy}px`,
                      width: d.r,
                      height: d.r,
                    }}
                  />
                ))}
            </div>
          ))}

        {/* orodje v roki */}
        {orodje && (
          <div
            className={`vroki ${orodje.tip}${vRoki ? " dela" : ""}`}
            style={{ left: `${misk.x}%`, top: `${misk.y}%` }}
          >
            {orodje.tip === "sveder" && (
              <>
                <span className="vpenjalo" />
                <span className="steblo" />
                <span className="oznaka-premer">Ø{orodje.premer}</span>
              </>
            )}
            {orodje.tip === "pihalka" && <span className="bucka" />}
            {orodje.tip === "sidro" && (
              <Image src="/igra/sidro.png" alt="" width={84} height={520} />
            )}
            {orodje.tip === "kladivo" && (
              <>
                <span className="glava" />
                <span className="rocaj" />
              </>
            )}
            {orodje.tip === "kljuc" && <span className="vilice" />}
          </div>
        )}

        {korak === 6 && (
          <div className="prizor-konec">
            <b>Ograja drži</b>
            <span>4 × {izbranoSidro?.naziv ?? "TXH7"}</span>
          </div>
        )}
      </div>

      {/* ---------------- orodjarna ---------------- */}
      <div className="orodjarna">
        <div className="orodjarna-skupina">
          <h4>Svedri</h4>
          <div className="orodjarna-gumbi">
            {SVEDRI.map((p) => (
              <button
                key={p}
                type="button"
                className={orodje?.tip === "sveder" && orodje.premer === p ? "izbran" : undefined}
                onClick={() => vzemiSveder(p)}
              >
                <i className="ik-sveder" />
                Ø{p}
              </button>
            ))}
          </div>
        </div>

        <div className="orodjarna-skupina">
          <h4>Orodje</h4>
          <div className="orodjarna-gumbi">
            <button
              type="button"
              className={orodje?.tip === "pihalka" ? "izbran" : undefined}
              onClick={() => {
                setOrodje({ tip: "pihalka" });
                povej("Pihalka je v roki. Drži miško nad luknjo.");
              }}
            >
              <i className="ik-pihalka" />
              Pihalka
            </button>
            <button
              type="button"
              className={orodje?.tip === "kladivo" ? "izbran" : undefined}
              onClick={() => {
                setOrodje({ tip: "kladivo" });
                povej("Kladivo je v roki. Vsak klik je en udarec.");
              }}
            >
              <i className="ik-kladivo" />
              Kladivo
            </button>
            <button
              type="button"
              className={orodje?.tip === "kljuc" ? "izbran" : undefined}
              onClick={() => {
                setOrodje({ tip: "kljuc" });
                povej("Ključ je v roki. Drži miško nad matico.");
              }}
            >
              <i className="ik-kljuc" />
              Ključ
            </button>
          </div>
        </div>

        <div className="orodjarna-skupina sidra">
          <h4>Sidra TXH7</h4>
          <div className="orodjarna-gumbi">
            {SIDRA.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sidro-gumb${orodje?.tip === "sidro" && orodje.id === s.id ? " izbran" : ""}`}
                onClick={() => vzemiSidro(s)}
              >
                <b>{s.naziv}</b>
                {s.top && <em>top izbor</em>}
                <span>{s.opis}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {korak === 6 && (
        <div className="igra-konec">
          <h3>Ograja je pritrjena</h3>
          <p>
            Vsa štiri sidra so izvrtana s pravim svedrom, izpihana, zabita do
            plošče in zategnjena. Prav izpih izvrtine je korak, ki ga na gradbišču
            največkrat izpustijo — in prav ta najbolj zniža nosilnost pritrditve.
          </p>
          <div className="igra-konec-gumbi">
            <Link className="b b-r" href="/program/pritrdila-za-beton">
              Poglej sidra TXH7
            </Link>
            <Link className="b b-d" href="/kontakt?vir=igra">
              Zahtevaj ponudbo
            </Link>
            <button type="button" className="b b-d" onClick={ponovi}>
              Poskusi znova
            </button>
          </div>
        </div>
      )}

      {korak !== 6 && (
        <button type="button" className="igra-ponovi" onClick={ponovi}>
          Začni znova
        </button>
      )}
    </div>
  );
}
