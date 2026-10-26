import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";
import KarticeIzdelkov from "@/components/KarticeIzdelkov";
import YouTubeVideo from "@/components/YouTubeVideo";
import { pridobiIzdelkeZnamke, skriteZnamke } from "@/lib/podatki";
import { MUNGO_VIDEI } from "@/lib/videi";

export const revalidate = 300;

export const metadata = {
  title: "Mungo — vložki, sidra in kemične mase",
  description:
    "Mungo v prodajnem programu AS system: najlonski vložki iz poliamida PA 6, okvirni vložki, kovinska sidra z evropsko tehnično oceno in kemične mase za beton, opeko in votle stene.",
  alternates: { canonical: "/mungo" },
};

// Rezerva, če baza ni dosegljiva — iskanje po oznaki pokaže artikle v katalogu.
const rezerva = [
  { naziv: "Najlonski vložek Quattro", oznaka: "MQ", opis: "Štirismerno razpiranje za polne in votle podlage.", slika: "/slike/Mungo_MQ.jpeg" },
  { naziv: "Najlonski vložek", oznaka: "MN", opis: "Klasični vložek za beton in polno opeko.", slika: "/slike/Mungo_MN.jpeg" },
  { naziv: "Univerzalni vložek Multi", oznaka: "MU", opis: "Za skoraj vse podlage, tudi votle stene.", slika: "/slike/Mungo_MU.jpeg" },
  { naziv: "Vložek za votlo opeko", oznaka: "ML", opis: "Dolg vložek za votle in luknjaste zidake.", slika: "/slike/Mungo_ML.jpeg" },
];

// Lastnosti — po katalogu Mungo
const zakaj = [
  {
    naziv: "Najlon PA 6",
    opis: "Vložki so iz kakovostnega poliamida PA 6: od −40 °C do +100 °C, žilavi, se ne deformirajo, samougasljivi in brez halogenov.",
  },
  {
    naziv: "Evropske tehnične ocene",
    opis: "Kovinska sidra, okvirni vložki in kemične mase z evropsko tehnično oceno (ETA) — tudi za razpokan beton, požar in potresne obremenitve.",
  },
  {
    naziv: "Za vsako podlago",
    opis: "Beton, polna in votla opeka, porobeton, mavčne plošče in votle stene — za vsako podlago pravi vložek ali sidro.",
  },
  {
    naziv: "Preverjena kakovost",
    opis: "Več kot 55 let razvoja pritrdilne tehnike in sistem vodenja kakovosti po ISO 9001:2015.",
  },
];

const druzine = [
  { naziv: "Najlonski vložki", opis: "MN, MNK, MQ Quattro, MU Multi, ML/MLK za votlo opeko, SD za zvočno izolacijo.", slika: "/slike/Mungo_MQ.jpeg", href: "/program/zidni-vlozki" },
  { naziv: "Okvirni vložki in udarni vijaki", opis: "MQL, MB, MBR za okvirje oken, vrat in fasade; udarni vijaki MNA; MGD za skele.", slika: "/slike/Mungo_MQL.jpeg", href: "/program/zidni-vlozki" },
  { naziv: "Kovinska sidra", opis: "Jeklena sidra m1 in m2, sidra s pušo MHA, stropna sidra MAN, sidra za votle stropove MHDA.", slika: "/slike/Mungo_MHA.jpeg", href: "/program/pritrdila-za-beton" },
  { naziv: "Kemične mase", opis: "Vinilestrske, epoksidne in hibridne mase za največje obremenitve, z mrežico za votle podlage.", slika: "/slike/Mungo_MAN.jpeg", href: "/program/kemicna-pritrditev" },
];

export default async function Mungo() {
  // Znamka izklopljena v Admin → Znamke → stran ne obstaja (404).
  if ((await skriteZnamke()).includes("MUNGO")) notFound();
  const izdelki = await pridobiIzdelkeZnamke("MUNGO");
  const poSkupinah = {};
  for (const i of izdelki) (poSkupinah[i.skupina] ??= []).push(i);
  const skupine = Object.entries(poSkupinah).sort((a, b) => b[1].length - a[1].length);
  const povezava = Object.fromEntries(izdelki.map((i) => [i.slug, i.href]));

  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="Mungo"
        logo="/slike/znamke/mungo-logo-2026.png"
        oznaka="Blagovna znamka · pritrdilna tehnika"
        naslov="Vložki, sidra in kemične mase Mungo"
        opis="Najlonski vložki iz poliamida PA 6, okvirni vložki, kovinska sidra z evropsko tehnično oceno in kemične mase — za beton, opeko, porobeton in votle stene."
        znacke={["Najlon PA 6", "ETA", "Kovinska sidra", "Kemične mase"]}
        slika="/slike/stojala/mungo-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        slikaAlt="Prodajna polica Mungo"
        gumbi={[
          { href: "#program", naziv: "Izdelki Mungo", cls: "b-r" },
          { href: "/kontakt?vir=mungo", naziv: "Povpraševanje →", cls: "b-o" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Kaj pokriva znamka Mungo</h2>
            <p>Štiri skupine izdelkov — od lahkih vložkov do nosilnih sidranj v beton.</p>
          </div>
          <div className="kats">
            {druzine.map((d) => (
              <Link key={d.naziv} href={d.href} className="k">
                <div className="im" style={{ background: "#fff" }}>
                  <Image src={d.slika} alt={d.naziv} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 14, mixBlendMode: "multiply" }} />
                </div>
                <div className="tx">
                  <h3>{d.naziv}</h3>
                  <p>{d.opis}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Video navodila</span>
            <h2>Mungo v praksi</h2>
            <p>Kratki videi vgradnje — kliknite video za predvajanje, pod njim je povezava na izdelek z vsemi dimenzijami.</p>
          </div>
          <div className="mungo-videi">
            {MUNGO_VIDEI.map((v) => (
              <div key={v.id} className="medij">
                <span className="medij-oz">Video</span>
                <YouTubeVideo id={v.id} naslov={v.naslov} samodejno />
                <b>{v.naslov}</b>
                {(povezava[v.slug] ?? v.href) && (
                  <Link href={povezava[v.slug] ?? v.href} style={{ fontWeight: 700, fontSize: 13, color: "var(--color-red)" }}>
                    Na izdelek →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Lastnosti</span>
            <h2>Zakaj Mungo</h2>
          </div>
          <div className="who c4">
            {zakaj.map((x) => (
              <div key={x.naziv}>
                <b>{x.naziv}</b>
                <p>{x.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="program" className="sec grey">
        <div className="w">
          <div className="st">
            <span>Katalog</span>
            <h2>Vsi izdelki Mungo</h2>
            <p>Kliknite izdelek za dimenzije, zalogo in cene.</p>
          </div>
          {skupine.length > 0 ? (
            skupine.map(([skupina, seznam]) => (
              <KarticeIzdelkov key={skupina} oznaka="Mungo" naslov={skupina} izdelki={seznam} />
            ))
          ) : (
            <div className="kats">
              {rezerva.map((x) => (
                <Link key={x.oznaka} href={`/iskanje?q=${x.oznaka}`} className="k">
                  <div className="im">
                    <Image src={x.slika} alt={x.naziv} fill sizes="300px" style={{ objectFit: "contain", padding: 14, mixBlendMode: "multiply" }} />
                  </div>
                  <div className="tx">
                    <h3>{x.naziv}</h3>
                    <p>{x.opis}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div className="st" style={{ marginBottom: 0 }}>
              <span>Kemične mase</span>
              <h2>Za največje obremenitve</h2>
              <p>
                Vinilestrske, epoksidne in hibridne mase Mungo za sidranje v beton in zidove, tudi z mrežico za votle
                podlage — z evropsko tehnično oceno za razpokan in nerazpokan beton ter naknadno vgrajeno armaturo.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="b b-r" href="/program/kemicna-pritrditev">
                Kemična pritrditev
              </Link>
              <Link className="b b-d" href="/kontakt?vir=mungo">
                Vprašajte za ustrezno maso
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DveZnamki trenutna="MUNGO" />

      <div className="cta">
        <div className="w">
          <div>
            <h2>Iščete pravi vložek ali sidro?</h2>
            <p>Opišite podlago in obremenitev — svetujemo, kateri izdelek je pravi.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=mungo">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}
