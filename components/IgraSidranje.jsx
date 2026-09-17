"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { dogodek } from "@/lib/dogodki";

/* --------------------------------------------------------------
   Interaktivna vaja: pritrditev ograje v betonsko škarpo.
   Vrstni red je enak kot na gradbišču — sveder, izpih, sidro,
   kladivo, ključ. Napačen korak vrne pojasnilo, zakaj ne gre.
   -------------------------------------------------------------- */

const LUKNJE = [
  { id: 0, x: 41.5 },
  { id: 1, x: 46 },
  { id: 2, x: 54 },
  { id: 3, x: 58.5 },
];

const SVEDRI = [
  { id: 8, naziv: "Ø8 × 110" },
  { id: 10, naziv: "Ø10 × 120" },
  { id: 12, naziv: "Ø12 × 160" },
];

const SIDRA = [
  { id: "8x75", naziv: "TXH7 M8×75", premer: 8, opis: "Lažje konstrukcije, nadstreški" },
  { id: "10x90", naziv: "TXH7 M10×90", premer: 10, opis: "Ograje, konzole, strojne noge", top: true },
  { id: "12x120", naziv: "TXH7 M12×120", premer: 12, opis: "Težke obremenitve, nosilci" },
];

const KORAKI = [
  { kljuc: "ograja", naziv: "Postavi ograjo", navodilo: "Klikni na betonsko škarpo in postavi steber ograje." },
  { kljuc: "sveder", naziv: "Izberi sveder", navodilo: "Premer svedra mora ustrezati premeru sidra. Za M10 je to Ø10." },
  { kljuc: "vrtanje", naziv: "Izvrtaj luknje", navodilo: "Klikni vse štiri oznake na podložni plošči." },
  { kljuc: "pihanje", naziv: "Izpihaj luknje", navodilo: "Prah v luknji zniža nosilnost. Izpihaj vse štiri." },
  { kljuc: "sidro", naziv: "Vstavi sidra", navodilo: "Izberi sidro TXH7 in ga vstavi v vse štiri luknje." },
  { kljuc: "kladivo", naziv: "Zabij sidra", navodilo: "Sidro zabij, dokler se ne usede do podložne plošče." },
  { kljuc: "kljuc", naziv: "Zategni matice", navodilo: "Zategni matice — stožec se povleče navzgor in razpre tulec." },
  { kljuc: "konec", naziv: "Končano", navodilo: "Ograja je pritrjena." },
];

const zacetneLuknje = LUKNJE.map((l) => ({
  ...l,
  izvrtana: false,
  izpihana: false,
  sidro: false,
  zabito: false,
  zategnjeno: false,
}));

export default function IgraSidranje() {
  const [korak, setKorak] = useState(0);
  const [luknje, setLuknje] = useState(zacetneLuknje);
  const [ograja, setOgraja] = useState(false);
  const [sveder, setSveder] = useState(null);
  const [sidro, setSidro] = useState(null);
  const [sporocilo, setSporocilo] = useState(null);
  const [napaka, setNapaka] = useState(false);
  const [animacija, setAnimacija] = useState(null); // { tip, id }

  const trenutni = KORAKI[korak];

  function povej(besedilo, jeNapaka = false) {
    setSporocilo(besedilo);
    setNapaka(jeNapaka);
  }

  function animiraj(tip, id, trajanje = 700) {
    setAnimacija({ tip, id });
    setTimeout(() => setAnimacija(null), trajanje);
  }

  function naprej(nov) {
    setKorak(nov);
    if (KORAKI[nov].kljuc === "konec") dogodek("igra_sidranje_koncana");
  }

  function posodobi(id, spremembe) {
    setLuknje((prej) => prej.map((l) => (l.id === id ? { ...l, ...spremembe } : l)));
  }

  function klikBeton() {
    if (trenutni.kljuc !== "ograja") return;
    setOgraja(true);
    povej("Steber stoji na škarpi. Zdaj potrebuješ pravi sveder.");
    naprej(1);
  }

  function izberiSveder(s) {
    if (trenutni.kljuc !== "sveder") return;
    setSveder(s.id);
    povej(`Vpet je sveder ${s.naziv}. Izvrtaj štiri luknje skozi podložno ploščo.`);
    naprej(2);
  }

  function izberiSidro(s) {
    if (trenutni.kljuc !== "sidro") return;
    if (s.premer !== sveder) {
      povej(
        `Sidro ${s.naziv} zahteva izvrtino Ø${s.premer}, ti pa si vrtal z Ø${sveder}. ` +
          (s.premer > sveder
            ? "V premajhno luknjo sidra ni mogoče vstaviti."
            : "V preveliki luknji se tulec ne razpre in sidro ne zagrabi betona."),
        true
      );
      return;
    }
    setSidro(s.id);
    povej(`Izbrano ${s.naziv}. Vstavi ga v vse štiri luknje.`);
  }

  function klikLuknja(l) {
    switch (trenutni.kljuc) {
      case "ograja":
        povej("Najprej postavi steber — klikni na betonsko škarpo.", true);
        break;

      case "sveder":
        povej("Najprej vpni sveder v vrtalnik.", true);
        break;

      case "vrtanje": {
        if (l.izvrtana) return;
        animiraj("vrtanje", l.id, 800);
        posodobi(l.id, { izvrtana: true });
        if (luknje.every((x) => (x.id === l.id ? true : x.izvrtana))) {
          povej("Vse štiri luknje so izvrtane. Zdaj jih izpihaj.");
          naprej(3);
        }
        break;
      }

      case "pihanje": {
        if (!l.izvrtana || l.izpihana) return;
        animiraj("pihanje", l.id, 700);
        posodobi(l.id, { izpihana: true });
        if (luknje.every((x) => (x.id === l.id ? true : x.izpihana))) {
          povej("Luknje so čiste. Izberi sidro.");
          naprej(4);
        }
        break;
      }

      case "sidro": {
        if (!sidro) {
          povej("Najprej izberi sidro iz orodjarne.", true);
          return;
        }
        if (!l.izpihana) {
          povej("Ta luknja še ni izpihana. Prah zniža nosilnost sidra.", true);
          return;
        }
        if (l.sidro) return;
        posodobi(l.id, { sidro: true });
        if (luknje.every((x) => (x.id === l.id ? true : x.sidro))) {
          povej("Sidra so vstavljena. Zabij jih s kladivom.");
          naprej(5);
        }
        break;
      }

      case "kladivo": {
        if (!l.sidro || l.zabito) return;
        animiraj("kladivo", l.id, 600);
        posodobi(l.id, { zabito: true });
        if (luknje.every((x) => (x.id === l.id ? true : x.zabito))) {
          povej("Sidra sedijo. Ostane še zategovanje.");
          naprej(6);
        }
        break;
      }

      case "kljuc": {
        if (!l.zabito || l.zategnjeno) return;
        animiraj("kljuc", l.id, 700);
        posodobi(l.id, { zategnjeno: true });
        if (luknje.every((x) => (x.id === l.id ? true : x.zategnjeno))) {
          povej("Vsa štiri sidra so zategnjena.");
          naprej(7);
        }
        break;
      }

      default:
        break;
    }
  }

  function ponovi() {
    setKorak(0);
    setLuknje(zacetneLuknje);
    setOgraja(false);
    setSveder(null);
    setSidro(null);
    setSporocilo(null);
    setNapaka(false);
    setAnimacija(null);
  }

  const izbranoSidro = SIDRA.find((s) => s.id === sidro);
  const konec = trenutni.kljuc === "konec";

  return (
    <div className="igra">
      <ol className="igra-koraki">
        {KORAKI.slice(0, 7).map((k, i) => (
          <li key={k.kljuc} className={i < korak ? "koncan" : i === korak ? "aktiven" : undefined}>
            <b>{String(i + 1).padStart(2, "0")}</b>
            <span>{k.naziv}</span>
          </li>
        ))}
      </ol>

      <div className="igra-navodilo">
        <b>{trenutni.naziv}</b>
        <span>{trenutni.navodilo}</span>
      </div>

      {sporocilo && <p className={napaka ? "igra-napaka" : "igra-uspeh"}>{sporocilo}</p>}

      {/* ---------------- prizor ---------------- */}
      <div className="prizor">
        <div className="prizor-nebo" />
        <div className="prizor-beton" onClick={klikBeton} data-klik={trenutni.kljuc === "ograja" ? "da" : undefined}>
          {trenutni.kljuc === "ograja" && <span className="prizor-namig">klikni za postavitev ograje</span>}
        </div>

        {ograja && (
          <>
            {/* senca ograje na steni */}
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
                {/* stranske precke in polnila */}
                <rect x="60" y="180" width="880" height="16" fill="url(#jeklo)" />
                <rect x="60" y="330" width="880" height="16" fill="url(#jeklo)" />
                {[105, 175, 245, 315, 690, 760, 830, 900].map((x) => (
                  <g key={x}>
                    <rect x={x} y="120" width="13" height="300" rx="2" fill="url(#jeklo)" />
                    <polygon points={`${x - 4},122 ${x + 17},122 ${x + 6.5},96`} fill="#9aa1a7" />
                  </g>
                ))}

                {/* glavni steber */}
                <rect x="470" y="70" width="46" height="350" rx="3" fill="url(#jeklo)" />
                <rect x="470" y="70" width="46" height="12" rx="2" fill="#dfe3e5" />
                {/* ojacitvena rebra */}
                <polygon points="470,360 430,420 470,420" fill="#9aa1a7" />
                <polygon points="516,360 556,420 516,420" fill="#8e959b" />

                {/* podlozna plosca */}
                <rect x="380" y="420" width="226" height="26" rx="2" fill="url(#jekloV)" />
                <rect x="380" y="420" width="226" height="5" fill="#eff1f2" />
                <rect x="380" y="441" width="226" height="6" fill="#6f767c" />
              </g>
            </svg>
          </>
        )}

        {/* luknje, sidra in orodje */}
        {ograja &&
          luknje.map((l) => (
            <div
              key={l.id}
              className="tocka"
              style={{ left: `${l.x}%` }}
              onClick={() => klikLuknja(l)}
            >
              {!l.izvrtana && <span className="oznaka" />}

              {l.izvrtana && !l.sidro && (
                <span className="luknja">
                  {!l.izpihana && <span className="prah" />}
                </span>
              )}

              {l.sidro && (
                <span className={`sidro${l.zabito ? " zabito" : ""}${l.zategnjeno ? " zategnjeno" : ""}`}>
                  <Image src="/igra/sidro.png" alt="Jekleno sidro TXH7" width={84} height={520} />
                </span>
              )}

              {animacija?.id === l.id && <span className={`orodje ${animacija.tip}`} />}
              {animacija?.id === l.id && animacija.tip === "vrtanje" && <span className="prah-oblak" />}
              {animacija?.id === l.id && animacija.tip === "pihanje" && <span className="pih" />}
            </div>
          ))}

        {konec && (
          <div className="prizor-konec">
            <b>Ograja drži</b>
            <span>4 × TXH7 {izbranoSidro?.naziv.replace("TXH7 ", "")}</span>
          </div>
        )}
      </div>

      {/* ---------------- orodjarna ---------------- */}
      <div className="igra-orodja">
        <div>
          <h4>Sveder</h4>
          <div className="igra-gumbi">
            {SVEDRI.map((s) => (
              <button
                key={s.id}
                type="button"
                className={sveder === s.id ? "izbran" : undefined}
                onClick={() => izberiSveder(s)}
                disabled={trenutni.kljuc !== "sveder"}
              >
                {s.naziv}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4>Sidro TXH7</h4>
          <div className="igra-gumbi">
            {SIDRA.map((s) => (
              <button
                key={s.id}
                type="button"
                className={sidro === s.id ? "izbran" : undefined}
                onClick={() => izberiSidro(s)}
                disabled={trenutni.kljuc !== "sidro"}
              >
                {s.naziv}
                {s.top && <em>top izbor</em>}
                <span>{s.opis}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {konec && (
        <div className="igra-konec">
          <h3>Ograja je pritrjena</h3>
          <p>
            Uporabil si {izbranoSidro?.naziv} in sveder Ø{sveder}. Vsa štiri sidra
            so izpihana, zabita in zategnjena. Prav izpih izvrtine je korak, ki ga
            na gradbišču največkrat izpustijo — in prav ta najbolj zniža nosilnost
            pritrditve.
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

      {!konec && (
        <button type="button" className="igra-ponovi" onClick={ponovi}>
          Začni znova
        </button>
      )}
    </div>
  );
}
