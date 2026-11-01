"use client";

import IgraSidranje from "@/components/IgraSidranje";
import IgraMontaza from "@/components/igre/IgraMontaza";
import { turbo, uvs, gips, trak, afrkKlima } from "@/components/igre/konfiguracije";
import { afrs, mq, kemijaBeton, kemijaVotla, kemija975, wc, bojler, umivalnik, cevnoStena, cevnoStrop, stiropor, din7504, kniping, din603, din571, maticniSpoj } from "@/components/igre/konfiguracije2";

/* Katera igra gre na katero stran izdelka (slug izdelka → igra). */
const IGRE = {
  "jekleno-sidro-txh7": {
    naslov: "Pritrdite ograjo v beton",
    opis: "Šest korakov, kot gredo na gradbišču. Izberite sveder in sidro, izvrtajte, izpihajte luknje, zabijte sidra in jih zategnite.",
    Komponenta: IgraSidranje,
  },
  "turbo-vijak-za-beton": {
    naslov: "Pritrdite okenski okvir v beton",
    opis: "Izberite pravi sveder, vrtajte skozi okvir in vijaka privijte naravnost v beton — brez vložka in brez čiščenja luknje.",
    cfg: turbo,
  },
  "udarni-vijak-nylon": {
    naslov: "Pritrdite profil za mavčne plošče na beton",
    opis: "Izvrtajte skozi kovinski profil, vstavite udarna vijaka in ju zabijte s kladivom — brez privijanja.",
    cfg: uvs,
  },
  "vlozek-za-gips-plasticni": {
    naslov: "Pritrdite nosilec police na mavčno ploščo",
    opis: "Brez vrtanja: vložka privijte naravnost v ploščo, prislonite nosilec in ga privijte.",
    cfg: gips,
  },
  "perforiran-trak": {
    naslov: "Pritrdite kable na beton",
    opis: "Kable prekrijte s perforiranim trakom, vrtajte skozi trak in ga pritrdite z udarnima vijakoma UVS.",
    cfg: trak,
  },
  "univerzalni-vijak-z-vlozkom-af-rk": {
    naslov: "Pritrdite nosilec klime v zid",
    opis: "Nosilec prislonite na zid, vrtajte skozi njegove luknje, izpihajte, vložek AF-RK potisnite skozi nosilec in privijte.",
    cfg: afrkKlima,
  },
  "univerzalni-vijak-z-vlozkom-af-rs": { naslov: "Pritrdite okvir skozi element v zid", opis: "Okvir prislonite, vrtajte skozi okvir, očistite luknjo, vložek AF-RS potisnite skozi okvir in privijte.", cfg: afrs },
  "zidni-vlozek-mq": { naslov: "Pritrdite nosilec na opečni zid", opis: "Izberite sveder, izvrtajte in očistite luknji, vstavite vložka MQ, prislonite nosilec in privijte vijaka.", cfg: mq },
  "kemicno-sidro-easf-top": { naslov: "Vgradite palico v beton s kemično maso", opis: "Izvrtajte in očistite luknji, napolnite ju z maso, vstavite navojni palici, nato namestite nosilec in zategnite matici.", cfg: kemijaBeton },
  "kemicno-sidro-pesf-top": { naslov: "Vgradite palico v beton s kemično maso", opis: "Izvrtajte in očistite luknji, napolnite ju z maso, vstavite navojni palici, nato namestite nosilec in zategnite matici.", cfg: kemijaBeton },
  "perforiran-vlozek-kovinski-1m": { naslov: "Kemična masa v votlo opeko", opis: "Izvrtajte luknji, vstavite kovinsko mrežico, napolnite jo z maso in vstavite palici — v votli steni luknje ne čistite.", cfg: kemijaVotla },
  "komplet-za-wc-skoljko": { naslov: "Pritrdite WC školjko", opis: "Izvrtajte in izpihajte luknji, vstavite vložka, postavite školjko in vijaka privijte s ključem.", cfg: wc },
  "komplet-za-bojler": { naslov: "Obesite bojler", opis: "Vstavite vložka, privijte hanger vijaka, bojler nadenite od strani, nato podložki in matici.", cfg: bojler },
  "komplet-za-umivalnik": { naslov: "Pritrdite umivalnik", opis: "Vstavite vložka, privijte hanger vijaka, nadenite umivalnik ter privijte podložki in matici.", cfg: umivalnik },
  "cevno-drzalo": { naslov: "Pritrdite cev na steno", opis: "Vložek MQ, hanger vijak, cevno držalo in na koncu cev.", cfg: cevnoStena },
  "vijak-hanger": { naslov: "Obesite cev pod strop", opis: "V strop vstavite vložek MQ, privijte hanger vijak, nanj cevno držalo in vstavite cev.", cfg: cevnoStrop },
  "vlozek-za-stiropor": { naslov: "Pritrdite svetilo na fasado", opis: "Vložka privijte v stiropor, prislonite svetilo in privijte lesna vijaka 4 × 40.", cfg: stiropor },
  "vijak-din-7504": { naslov: "Pritrdite pločevino na jekleno lego", opis: "Samovrtalni vijak v enem koraku izvrta, izreže navoj in privije — brez predvrtanja.", cfg: din7504 },
  "vijak-din-7504k": { naslov: "Pritrdite pločevino na jekleno lego", opis: "Samovrtalni vijak v enem koraku izvrta, izreže navoj in privije — brez predvrtanja.", cfg: din7504 },
  "vijak-din-7504n": { naslov: "Pritrdite pločevino na jekleno lego", opis: "Samovrtalni vijak v enem koraku izvrta, izreže navoj in privije — brez predvrtanja.", cfg: din7504 },
  "vijak-din-7504p": { naslov: "Pritrdite pločevino na jekleno lego", opis: "Samovrtalni vijak v enem koraku izvrta, izreže navoj in privije — brez predvrtanja.", cfg: din7504 },
  "vijak-din-7981c": { naslov: "Spojite prezračevalni kanal", opis: "Izvrtajte skozi spojni del in kanal, nato privijte kniping vijaka.", cfg: kniping },
  "vijak-din-7982c": { naslov: "Spojite prezračevalni kanal", opis: "Izvrtajte skozi spojni del in kanal, nato privijte kniping vijaka.", cfg: kniping },
  "vijak-din-7983": { naslov: "Spojite prezračevalni kanal", opis: "Izvrtajte skozi spojni del in kanal, nato privijte kniping vijaka.", cfg: kniping },
  "vijak-din-603": { naslov: "Pritrdite stranico prikolice", opis: "Izvrtajte skozi desko in jeklen steber, zabijte sponska vijaka do glave, nato podložki in matici.", cfg: din603 },
  "lesni-vijak-din-571": { naslov: "Pritrdite kotnik na lesen steber", opis: "Prislonite kotnik, predvrtajte les in vijaka DIN 571 privijte s ključem.", cfg: din571 },
  "navojna-palica-din-975": { naslov: "Pritrdite nosilec z navojnima palicama", opis: "Palici vgradite v beton s kemično maso, namestite nosilec ter zategnite podložki in matici.", cfg: kemija975 },
  "vijak-din-933": { naslov: "Sestavite spoj po DIN", opis: "Vijak s podložko skozi oba dela, spodaj podložka, vzmetna podložka in matica.", cfg: maticniSpoj },
  "vijak-din-931": { naslov: "Sestavite spoj po DIN", opis: "Vijak s podložko skozi oba dela, spodaj podložka, vzmetna podložka in matica.", cfg: maticniSpoj },
  "matica-din-934": { naslov: "Sestavite spoj po DIN", opis: "Vijak s podložko skozi oba dela, spodaj podložka, vzmetna podložka in matica.", cfg: maticniSpoj },
  "podlozka-din-125": { naslov: "Sestavite spoj po DIN", opis: "Vijak s podložko skozi oba dela, spodaj podložka, vzmetna podložka in matica.", cfg: maticniSpoj },
  "podlozka-din-127b": { naslov: "Sestavite spoj po DIN", opis: "Vijak s podložko skozi oba dela, spodaj podložka, vzmetna podložka in matica.", cfg: maticniSpoj },
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
