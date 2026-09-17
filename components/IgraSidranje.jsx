"use client";

import Link from "next/link";
import { useState } from "react";
import { dogodek } from "@/lib/dogodki";

/* --------------------------------------------------------------
   Interaktivna vaja: pritrditev ograje v betonsko škarpo.
   Vrstni red je enak kot na gradbišču — sveder, izpih, sidro,
   kladivo, ključ. Napačen korak vrne pojasnilo, zakaj ne gre.
   -------------------------------------------------------------- */

const LUKNJE = [
  { id: 0, x: 392 },
  { id: 1, x: 437 },
  { id: 2, x: 482 },
  { id: 3, x: 527 },
];

const SVEDRI = [
  { id: 8, naziv: "Sveder Ø8" },
  { id: 10, naziv: "Sveder Ø10" },
  { id: 12, naziv: "Sveder Ø12" },
];

const SIDRA = [
  { id: "8x75", naziv: "TXH7 M8×75", premer: 8, opis: "Za lažje konstrukcije" },
  { id: "10x90", naziv: "TXH7 M10×90", premer: 10, opis: "Najpogostejša izbira", top: true },
  { id: "12x120", naziv: "TXH7 M12×120", premer: 12, opis: "Za težke obremenitve" },
];

const KORAKI = [
  { kljuc: "ograja", naziv: "Postavi ograjo", navodilo: "Klikni na betonsko škarpo in postavi steber ograje." },
  { kljuc: "sveder", naziv: "Izberi sveder", navodilo: "Premer svedra mora ustrezati premeru sidra. Za M10 je to Ø10." },
  { kljuc: "vrtanje", naziv: "Izvrtaj luknje", navodilo: "Klikni vse štiri oznake na podložni plošči." },
  { kljuc: "pihanje", naziv: "Izpihaj luknje", navodilo: "Prah v luknji zmanjša nosilnost. Izpihaj vse štiri." },
  { kljuc: "sidro", naziv: "Izberi sidro", navodilo: "Izberi sidro TXH7 in ga vstavi v vse štiri luknje." },
  { kljuc: "kladivo", naziv: "Zabij sidra", navodilo: "Sidro zabij, dokler se ne usede v luknjo." },
  { kljuc: "kljuc", naziv: "Zategni matice", navodilo: "Zategni vse štiri matice — sidro se razpre in zagrabi beton." },
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

  const trenutni = KORAKI[korak];

  function povej(besedilo, jeNapaka = false) {
    setSporocilo(besedilo);
    setNapaka(jeNapaka);
  }

  function naprej(nov) {
    setKorak(nov);
    setSporocilo(null);
    setNapaka(false);
    if (KORAKI[nov].kljuc === "konec") dogodek("igra_sidranje_koncana");
  }

  function posodobi(id, spremembe) {
    setLuknje((prej) => prej.map((l) => (l.id === id ? { ...l, ...spremembe } : l)));
  }

  function klikBeton() {
    if (trenutni.kljuc !== "ograja") return;
    setOgraja(true);
    povej("Steber stoji. Zdaj potrebuješ pravi sveder.");
    naprej(1);
  }

  function izberiSveder(s) {
    if (trenutni.kljuc !== "sveder") return;
    setSveder(s.id);
    povej(`Izbran ${s.naziv}. Izvrtaj štiri luknje skozi podložno ploščo.`);
    naprej(2);
  }

  function izberiSidro(s) {
    if (trenutni.kljuc !== "sidro") return;
    if (s.premer !== sveder) {
      povej(
        `Sidro ${s.naziv} potrebuje sveder Ø${s.premer}, ti pa si vrtal z Ø${sveder}. ` +
          (s.premer > sveder
            ? "V premajhno luknjo sidra ni mogoče vstaviti."
            : "V preveliki luknji sidro ne zagrabi betona."),
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
        povej("Najprej izberi sveder.", true);
        break;

      case "vrtanje": {
        posodobi(l.id, { izvrtana: true });
        const vse = luknje.every((x) => (x.id === l.id ? true : x.izvrtana));
        if (vse) {
          povej("Vse štiri luknje so izvrtane. Zdaj jih izpihaj.");
          naprej(3);
        }
        break;
      }

      case "pihanje": {
        if (!l.izvrtana) return;
        posodobi(l.id, { izpihana: true });
        const vse = luknje.every((x) => (x.id === l.id ? true : x.izpihana));
        if (vse) {
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
        posodobi(l.id, { sidro: true });
        const vse = luknje.every((x) => (x.id === l.id ? true : x.sidro));
        if (vse) {
          povej("Sidra so vstavljena. Zabij jih s kladivom.");
          naprej(5);
        }
        break;
      }

      case "kladivo": {
        if (!l.sidro) return;
        posodobi(l.id, { zabito: true });
        const vse = luknje.every((x) => (x.id === l.id ? true : x.zabito));
        if (vse) {
          povej("Sidra sedijo. Ostane še zategovanje.");
          naprej(6);
        }
        break;
      }

      case "kljuc": {
        if (!l.zabito) return;
        posodobi(l.id, { zategnjeno: true });
        const vse = luknje.every((x) => (x.id === l.id ? true : x.zategnjeno));
        if (vse) {
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
  }

  const izbranoSidro = SIDRA.find((s) => s.id === sidro);

  return (
    <div className="igra">
      {/* koraki */}
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

      {/* prizor */}
      <div className="igra-prizor">
        <svg viewBox="0 0 900 470" role="img" aria-label="Pritrditev ograje v beton">
          <defs>
            <linearGradient id="kovina" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8eaec" />
              <stop offset="45%" stopColor="#b9bec3" />
              <stop offset="100%" stopColor="#8d9399" />
            </linearGradient>
            <pattern id="beton" width="26" height="26" patternUnits="userSpaceOnUse">
              <rect width="26" height="26" fill="#c3c6c8" />
              <circle cx="6" cy="8" r="1.6" fill="#b2b6b8" />
              <circle cx="18" cy="17" r="2.1" fill="#b8bbbd" />
              <circle cx="12" cy="22" r="1.2" fill="#aeb2b4" />
            </pattern>
          </defs>

          {/* betonska skarpa */}
          <g onClick={klikBeton} style={{ cursor: trenutni.kljuc === "ograja" ? "pointer" : "default" }}>
            <rect x="40" y="340" width="820" height="110" fill="url(#beton)" />
            <rect x="40" y="340" width="820" height="8" fill="#d6d8da" />
            <rect x="40" y="442" width="820" height="8" fill="#a9adaf" />
            {trenutni.kljuc === "ograja" && (
              <>
                <rect x="330" y="344" width="250" height="100" fill="#cb2026" opacity="0.16" />
                <text x="455" y="400" textAnchor="middle" fill="#8a2126" fontSize="15" fontWeight="700">
                  klikni sem
                </text>
              </>
            )}
          </g>

          {/* ograja */}
          {ograja && (
            <g>
              {/* precke */}
              <rect x="120" y="150" width="670" height="12" fill="url(#kovina)" />
              <rect x="120" y="250" width="670" height="12" fill="url(#kovina)" />
              {[150, 210, 270, 600, 660, 720, 780].map((x) => (
                <g key={x}>
                  <rect x={x} y="110" width="9" height="220" fill="url(#kovina)" />
                  <polygon points={`${x - 3},110 ${x + 12},110 ${x + 4.5},96`} fill="#9aa0a5" />
                </g>
              ))}
              {/* glavni steber */}
              <rect x="440" y="90" width="34" height="230" fill="url(#kovina)" />
              <rect x="440" y="90" width="34" height="10" fill="#d9dcde" />
              {/* podlozna plosca */}
              <rect x="370" y="320" width="175" height="22" fill="url(#kovina)" />
              <rect x="370" y="338" width="175" height="5" fill="#7f8589" />
            </g>
          )}

          {/* luknje in sidra */}
          {ograja &&
            luknje.map((l) => (
              <g
                key={l.id}
                onClick={() => klikLuknja(l)}
                style={{ cursor: "pointer" }}
              >
                {/* oznaka */}
                {!l.izvrtana && (
                  <g>
                    <circle cx={l.x} cy={331} r="9" fill="#cb2026" opacity="0.2" />
                    <circle cx={l.x} cy={331} r="4" fill="#cb2026" />
                  </g>
                )}

                {/* izvrtana luknja */}
                {l.izvrtana && !l.sidro && (
                  <>
                    <rect x={l.x - 6} y={330} width="12" height="70" fill="#4c4f4e" />
                    {!l.izpihana && (
                      <>
                        <ellipse cx={l.x} cy={398} rx="9" ry="5" fill="#a49a86" />
                        <circle cx={l.x - 12} cy={392} r="3" fill="#b6ad9a" />
                        <circle cx={l.x + 13} cy={396} r="2.4" fill="#b6ad9a" />
                      </>
                    )}
                  </>
                )}

                {/* sidro */}
                {l.sidro && (
                  <g>
                    <rect x={l.x - 6} y={l.zabito ? 330 : 318} width="12" height="72" fill="#c9ced2" />
                    <rect x={l.x - 6} y={l.zabito ? 372 : 360} width="12" height="18" fill="#9aa0a5" />
                    <rect
                      x={l.x - 11}
                      y={l.zategnjeno ? 308 : l.zabito ? 314 : 302}
                      width="22"
                      height="12"
                      fill="#aeb4b9"
                    />
                    <rect
                      x={l.x - 8}
                      y={l.zategnjeno ? 298 : l.zabito ? 304 : 292}
                      width="16"
                      height="11"
                      fill="#8d9399"
                    />
                    {l.zategnjeno && <circle cx={l.x} cy={303} r="15" fill="#1a7f3c" opacity="0.14" />}
                  </g>
                )}
              </g>
            ))}

          {/* zakljucek */}
          {trenutni.kljuc === "konec" && (
            <g>
              <rect x="300" y="30" width="300" height="46" fill="#1a7f3c" />
              <text x="450" y="60" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">
                OGRAJA DRŽI
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* orodjarna */}
      <div className="igra-orodja">
        <div>
          <h4>Svedri</h4>
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
          <h4>Sidra TXH7</h4>
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

      {/* zakljucek */}
      {trenutni.kljuc === "konec" && (
        <div className="igra-konec">
          <h3>Ograja je pritrjena</h3>
          <p>
            Uporabil si {izbranoSidro?.naziv} in sveder Ø{sveder}. Vsa štiri sidra so
            izpihana, zabita in zategnjena — tako kot zahteva evropska tehnična
            ocena. Prav izpih luknje je korak, ki ga na gradbišču največkrat
            izpustijo, in prav ta najbolj zniža nosilnost.
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

      {trenutni.kljuc !== "konec" && (
        <button type="button" className="igra-ponovi" onClick={ponovi}>
          Začni znova
        </button>
      )}
    </div>
  );
}
