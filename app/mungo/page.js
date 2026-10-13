import Image from "next/image";
import Link from "next/link";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";

export const metadata = {
  title: "Mungo — vložki, sidra in kemične mase",
  description:
    "Mungo v prodajnem programu AS system: najlonski vložki, okvirni vložki, kovinska sidra in kemične mase za beton, opeko in votle stene.",
  alternates: { canonical: "/mungo" },
};

// Izdelki iz kataloga Mungo — iskanje po oznaki pokaže artikle v katalogu.
const skupine = [
  { naziv: "Najlonski vložek Quattro", oznaka: "MQ", opis: "Štirismerno razpiranje za polne in votle podlage.", slika: "/slike/Mungo_MQ.jpeg" },
  { naziv: "Najlonski vložek", oznaka: "MN", opis: "Klasični vložek za beton in polno opeko.", slika: "/slike/Mungo_MN.jpeg" },
  { naziv: "Univerzalni vložek Multi", oznaka: "MU", opis: "Za skoraj vse podlage, z vijakom za les ali iverico.", slika: "/slike/Mungo_MU.jpeg" },
  { naziv: "Vložek za votlo opeko", oznaka: "ML", opis: "Dolg vložek za votle in luknjaste zidake.", slika: "/slike/Mungo_ML.jpeg" },
  { naziv: "Okvirni vložek", oznaka: "MB · MBR · MQL", opis: "Za okvirje oken, vrat in podkonstrukcije.", slika: "/slike/Mungo_MBR.jpeg" },
  { naziv: "Vložek za skele", oznaka: "MGD", opis: "Za sidranje fasadnih odrov.", slika: "/slike/Mungo_MGD.jpeg" },
  { naziv: "Sidro za strop", oznaka: "MAN", opis: "Za obešanje na betonske strope.", slika: "/slike/Mungo_MAN.jpeg" },
  { naziv: "Sidro s pušo", oznaka: "MHA", opis: "Kovinsko sidro za srednje in večje obremenitve.", slika: "/slike/Mungo_MHA.jpeg" },
];

export default function Mungo() {
  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="Mungo"
        logo="/slike/znamke/mungo-logo-2026.png"
        oznaka="Blagovna znamka · pritrdilna tehnika"
        naslov="Vložki, sidra in kemične mase Mungo"
        opis="Najlonski in okvirni vložki, kovinska sidra in kemične mase za beton, opeko in votle stene — v našem prodajnem programu."
        znacke={["Najlonski vložki", "Kovinska sidra", "Kemične mase"]}
        slika="/slike/stojala/mungo-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        slikaAlt="Prodajna polica Mungo"
        gumbi={[
          { href: "/iskanje?q=Mungo", naziv: "Izdelki Mungo", cls: "b-r" },
          { href: "/kontakt?vir=mungo", naziv: "Povpraševanje →", cls: "b-o" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Kaj pokriva znamka Mungo</h2>
            <p>
              Mungo dopolnjuje program ASfix z vložki in sidri za posebne podlage in obremenitve. Pri vsakem izdelku
              v katalogu je označeno, kateri znamki pripada.
            </p>
          </div>
          <div className="kats">
            {skupine.map((x) => (
              <Link key={x.oznaka} href={`/iskanje?q=${encodeURIComponent(x.oznaka.split(" ")[0])}`} className="k">
                <div className="im">
                  <Image src={x.slika} alt={x.naziv} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 14, mixBlendMode: "multiply" }} />
                </div>
                <div className="tx">
                  <h3>{x.naziv}</h3>
                  <p style={{ color: "var(--color-red)", fontWeight: 700 }}>{x.oznaka}</p>
                  <p>{x.opis}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div className="st" style={{ marginBottom: 0 }}>
              <span>Kemične mase</span>
              <h2>Za največje obremenitve</h2>
              <p>
                Vinilestrske, epoksidne in hibridne mase Mungo za sidranje v beton in zidove, tudi z mrežico za
                votle podlage. Pri izdelku najdete tehnične podatke in dokumentacijo.
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

      <DveZnamki trenutna="MUNGO" siv={false} />

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
