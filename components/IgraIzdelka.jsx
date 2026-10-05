"use client";

import IgraSidranje from "@/components/IgraSidranje";
import IgraMontaza from "@/components/igre/IgraMontaza";
import { turbo, uvs, gips, trak, afrkKlima } from "@/components/igre/konfiguracije";

/* Katera igra gre na katero stran izdelka (slug izdelka → igra). */
const IGRE = {
  "jekleno-sidro-txh7": {
    naslov: "Pritrdite ograjo v beton",
    opis: "Šest korakov, kot gredo na gradbišču. Izberite sveder in sidro, izvrtajte, izpihajte luknje, zabijte sidra in jih zategnite.",
    Komponenta: IgraSidranje,
  },
  "turbo-vijak-za-beton": {
    naslov: "Pritrdite okenski okvir v beton",
    opis: "Vrtajte skozi okvir, izpihajte izvrtini in vijaka privijte naravnost v beton — brez vložka.",
    cfg: turbo,
  },
  "udarni-vijak-nylon": {
    naslov: "Pritrdite leseno letev na beton",
    opis: "Izvrtajte skozi letev, vstavite udarna vijaka in ju zabijte s kladivom.",
    cfg: uvs,
  },
  "vlozek-za-gips-plasticni": {
    naslov: "Pritrdite nosilec police na mavčno ploščo",
    opis: "Brez vrtanja: vložka privijte naravnost v ploščo, prislonite nosilec in ga privijte.",
    cfg: gips,
  },
  "perforiran-trak": {
    naslov: "Obesite cev na strop",
    opis: "Izvrtajte luknji v strop, vstavite vložka, cev ovijte s trakom in privijte oba konca.",
    cfg: trak,
  },
  "univerzalni-vijak-z-vlozkom-af-rk": {
    naslov: "Pritrdite konzolo za klimo v zid",
    opis: "Konzolo prislonite na zid, vrtajte skozi njene luknje, izpihajte, vstavite AF-RK in privijte.",
    cfg: afrkKlima,
  },
};

export function imaIgro(slug) {
  return Boolean(IGRE[slug]);
}

export default function IgraIzdelka({ slug }) {
  const igra = IGRE[slug];
  if (!igra) return null;
  const { Komponenta } = igra;
  return (
    <section className="igra-izdelka">
      <div className="st">
        <span>Preizkusite sami</span>
        <h2>{igra.naslov}</h2>
        <p>{igra.opis} Če kaj ni po vrsti, vam vaja pove, zakaj ne gre.</p>
      </div>
      {Komponenta ? <Komponenta /> : <IgraMontaza cfg={igra.cfg} />}
    </section>
  );
}
