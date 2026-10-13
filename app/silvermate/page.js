import Image from "next/image";
import Link from "next/link";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";
import SilvermateVsebina from "@/components/SilvermateVsebina";
import { pridobiIzdelkePoSlugih } from "@/lib/podatki";
import { SILVERMATE_KATEGORIJA, SILVERMATE_IZDELKI } from "@/lib/silvermate";

export const revalidate = 300;

export const metadata = {
  title: "Silvermate — lesni vijaki",
  description:
    "Lesni vijaki Silvermate z oceno ETA-18/0284: Pozi ali Torx, cel ali delni navoj, od 3,0 × 16 do 6,0 × 200 mm. AS811, AS812, AS814 in AS816.",
  alternates: { canonical: "/silvermate" },
};

const vijaki = [
  { sifra: "AS811", naziv: "Lesni vijak, Pozi", navoj: "cel navoj", glava: "pozi", slika: "/slike/silvermate/AS811.jpg" },
  { sifra: "AS812", naziv: "Lesni vijak, Pozi", navoj: "delni navoj", glava: "pozi", slika: "/slike/silvermate/AS812.jpg" },
  { sifra: "AS814", naziv: "Lesni vijak, Torx", navoj: "cel navoj", glava: "torx", slika: "/slike/silvermate/AS814.jpg" },
  { sifra: "AS816", naziv: "Lesni vijak, Torx", navoj: "delni navoj", glava: "torx", slika: "/slike/silvermate/AS816.jpg" },
];

export default async function Silvermate() {
  const izBaze = await pridobiIzdelkePoSlugih(Object.values(SILVERMATE_IZDELKI).map((x) => x.slug));
  const vKatalogu = Object.values(izBaze).some((x) => x.href);
  const katalog = vKatalogu ? `/program/${SILVERMATE_KATEGORIJA.slug}` : "/iskanje?q=AS81";
  const povezava = (x) => izBaze[SILVERMATE_IZDELKI[x.glava].slug]?.href ?? `/iskanje?q=${x.sifra}`;
  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="Silvermate"
        logo="/slike/znamke/silvermate-logo-negativ.png"
        oznaka="Blagovna znamka · lesni vijaki"
        naslov="Lesni vijaki Silvermate"
        opis="Vijaki za les in iverne plošče z evropsko tehnično oceno — Pozi ali Torx, s celim ali delnim navojem, od 3,0 × 16 do 6,0 × 200 mm."
        znacke={["ETA-18/0284", "CE", "Pozi · Torx", "Cel · delni navoj"]}
        slika="/slike/stojala/silvermate-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        slikaAlt="Prodajna polica Silvermate"
        gumbi={[
          { href: katalog, naziv: "Lesni vijaki v katalogu", cls: "b-r" },
          { href: "/kontakt?vir=silvermate", naziv: "Povpraševanje →", cls: "b-o" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Štiri izvedbe lesnih vijakov</h2>
            <p>Kliknite izvedbo za vse dimenzije, zalogo in cene. Pozi in Torx imata vsak svojo stran — v tabeli izberete cel ali delni navoj.</p>
          </div>
          <div className="kats">
            {vijaki.map((x) => (
              <Link key={x.sifra} href={povezava(x)} className="k">
                <div className="im">
                  <Image src={x.slika} alt={`Silvermate ${x.sifra} — ${x.naziv}, ${x.navoj}`} fill sizes="(max-width: 700px) 50vw, 340px" style={{ objectFit: "contain", padding: 8 }} />
                </div>
                <div className="tx">
                  <p style={{ color: "var(--color-red)", fontWeight: 800 }}>{x.sifra}</p>
                  <h3>{x.naziv}</h3>
                  <p>{x.navoj}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="zn-gumbi" style={{ marginTop: 24 }}>
            <Link className="b b-r" href={izBaze[SILVERMATE_IZDELKI.pozi.slug]?.href ?? "/iskanje?q=AS811"}>
              Vsi vijaki Pozi →
            </Link>
            <Link className="b b-r" href={izBaze[SILVERMATE_IZDELKI.torx.slug]?.href ?? "/iskanje?q=AS814"}>
              Vsi vijaki Torx →
            </Link>
          </div>
        </div>
      </section>

      <SilvermateVsebina tabela />

      <DveZnamki trenutna="Silvermate" siv={false} />

      <div className="cta">
        <div className="w">
          <div>
            <h2>Lesni vijaki Silvermate za vašo trgovino?</h2>
            <p>Pripravimo predlog asortimana, pakiranja in pogoje.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=silvermate">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}
