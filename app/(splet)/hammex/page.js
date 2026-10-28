import Image from "next/image";
import Link from "next/link";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";
import PotiProdaje from "@/components/PotiProdaje";
import FotoGalerija from "@/components/FotoGalerija";
import { FOTO_ZEBLJI } from "@/lib/foto";
import { pridobiIzdelkePoSlugih } from "@/lib/podatki";

export const metadata = {
  title: "HAMMEX — žeblji in žičniki",
  description:
    "Žeblji pod znamko HAMMEX: gradbeni žičniki, lepenkarji (cinkani, aluminij, baker), strojni žičniki v traku za pnevmatske žebljalnike in kolarniki.",
  alternates: { canonical: "/hammex" },
};

export const revalidate = 300;

const KAT = "/program/zicniki";

const program = [
  {
    naziv: "Gradbeni žičniki",
    opis: "Gladki gradbeni žičniki za opaže, tesarska in gradbena dela.",
    slika: "/slike/zicniki/en-zicniki-gradbeni.jpg",
    pot: `${KAT}/zicniki-gradbeni`,
  },
  {
    naziv: "Lepenkarji",
    opis: "Z veliko glavo za lepenko, strešne trakove in izolacijo.",
    slika: "/slike/zicniki/en-lepenkar-cinkani.jpg",
    pot: `${KAT}/zicniki-lepenkarji`,
  },
  {
    naziv: "Strojni žičniki",
    opis: "V traku za pnevmatske žebljalnike — za hitro in serijsko delo.",
    slika: "/slike/zicniki/en-zicniki-strojni.jpg",
    pot: `${KAT}/zicniki-strojni`,
  },
  {
    naziv: "Kolarniki",
    opis: "Cinkani kolarski žičniki za les in lesene konstrukcije.",
    slika: "/slike/zicniki/en-zicniki-kolarski.jpg",
    pot: `${KAT}/zicniki-kolarniki`,
  },
];

const aduti = [
  {
    naziv: "Za roko in za stroj",
    opis: "Žičniki za ročno zabijanje in strojni žičniki v traku za pnevmatske žebljalnike.",
    slika: "/slike/zicniki/en-zicniki-strojni.jpg",
  },
  {
    naziv: "Pravi material za podlago",
    opis: "Lepenkarji v treh izvedbah — cinkani, aluminijasti in bakreni — za vsako kritino in trak.",
    slika: "/slike/zicniki/lepenkar-baker.jpg",
  },
  {
    naziv: "Pakirano pri nas",
    opis: "Varjenje v trak in pakiranje na lastnih linijah.",
    slika: "/slike/zicniki/zicniki-gradbeni.jpg",
  },
  {
    naziv: "Skupaj z ASfix in ASco",
    opis: "Žeblji, pritrdilna tehnika in vijačno blago z enim naročilom in eno dobavo.",
    slika: "/slike/znamke/asfix-afr41.png",
  },
];

const materiali = [
  { b: "Cinkani", s: "lepenkarji", p: "Osnovna izvedba za strešno lepenko in bitumenske trakove.", slika: "/slike/zicniki/en-lepenkar-cinkani.jpg" },
  { b: "Aluminij", s: "lepenkarji", p: "Ne rjavi — za aluminijaste obrobe in izpostavljena mesta.", slika: "/slike/zicniki/en-lepenkar-aluminij.jpg" },
  { b: "Baker", s: "lepenkarji", p: "Za bakrene kritine in obrobe — brez galvanske korozije.", slika: "/slike/zicniki/en-lepenkar-baker.jpg" },
];

export default async function Hammer() {
  const izBaze = await pridobiIzdelkePoSlugih(program.map((x) => x.pot.split("/").pop()));
  return (
    <>
      <ZnamkaHero
        podlaga="svetla"
        ime="HAMMEX"
        logo="/slike/znamke/hammex-logo.png"
        oznaka="Blagovna znamka · žeblji"
        naslov="Žeblji HAMMEX"
        opis="Gradbeni žičniki, lepenkarji, strojni žičniki v traku in kolarniki — za ročno zabijanje in pnevmatske žebljalnike."
        znacke={["Professional nails", "Gradbeni · lepenkarji", "Strojni v traku", "Kolarniki"]}
        slika="/slike/zicniki/zicniki-skupna.jpg"
        slikaW={1376}
        slikaH={768}
        slikaAlt="Žeblji HAMMEX — strojni žičniki v traku, gradbeni žičniki in lepenkarji"
        gumbi={[
          { href: KAT, naziv: "Žeblji v katalogu", cls: "b-r" },
          { href: "/kontakt?vir=hammex", naziv: "Povpraševanje →", cls: "b-d" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj je HAMMEX</span>
                <h2>Naša znamka za žeblje</h2>
                <p>
                  HAMMEX je blagovna znamka AS system za žeblje. Pod njo so gradbeni žičniki, lepenkarji,
                  strojni žičniki v traku in kolarniki — za tesarje, krovce, gradbince in trgovine.
                </p>
                <p style={{ marginTop: 12 }}>
                  Kjer ASfix pritrdi v beton in zid, ASco poveže kovino s kovino, HAMMEX poveže les z lesom
                  in pritrdi kritino. Skupaj pokrijejo celotno polico pritrdilnega materiala.
                </p>
              </div>
              <Link className="b b-r" href={KAT}>
                Žeblji v katalogu
              </Link>
            </div>
            <div style={{ display: "grid", placeItems: "center", padding: "20px 0" }}>
              <Image
                src="/slike/znamke/hammex-logo.png"
                alt="HAMMEX professional nails"
                width={800}
                height={393}
                sizes="(max-width: 1000px) 80vw, 480px"
                style={{ width: "min(100%, 480px)", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Kaj pokriva znamka HAMMEX</h2>
            <p>Kliknite skupino za vse dimenzije, zalogo in cene.</p>
          </div>
          <div className="kats">
            {program.map((x) => (
              <Link key={x.naziv} href={x.pot} className="k">
                <div className="im" style={{ background: "#fff" }}>
                  <Image src={izBaze[x.pot.split("/").pop()]?.slika || x.slika} alt={`HAMMEX — ${x.naziv}`} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 12 }} />
                </div>
                <div className="tx">
                  <h3>{x.naziv}</h3>
                  <p>{x.opis}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Aduti</span>
            <h2>Zakaj HAMMEX</h2>
          </div>
          <div className="kats">
            {aduti.map((a) => (
              <div key={a.naziv} className="k adut">
                <div className="im" style={{ background: "#fff" }}>
                  <Image src={a.slika} alt={a.naziv} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 12, mixBlendMode: "multiply" }} />
                </div>
                <div className="tx">
                  <h3>{a.naziv}</h3>
                  <p>{a.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey" id="foto">
        <div className="w">
          <div className="st">
            <span>Pakirano pri nas</span>
            <h2>Tako nastajajo koluti HAMMEX</h2>
            <p>Žeblje za pnevmatske žebljalnike povezujemo z bakreno žico, navijamo v kolute in pakiramo na lastni liniji.</p>
          </div>
          <FotoGalerija
            kolaz
            skupine={[
              { naziv: "Žeblji v kolutih", slike: FOTO_ZEBLJI.map((x) => (["zeblji-01", "zeblji-09"].some((n) => x.src.includes(n)) ? { ...x, vel: true } : x)) },
            ]}
          />
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Lepenkarji</span>
            <h2>Material izberete po kritini</h2>
            <p>Isti lepenkar v treh materialih — za vsako streho in obrobo.</p>
          </div>
          <div className="kats">
            {materiali.map((x) => (
              <Link key={x.b} href={`${KAT}/zicniki-lepenkarji`} className="k">
                <div className="im" style={{ background: "#fff" }}>
                  <Image src={x.slika} alt={`Lepenkar ${x.b}`} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 12 }} />
                </div>
                <div className="tx">
                  <p style={{ color: "var(--color-red)", fontWeight: 800 }}>{x.s}</p>
                  <h3>{x.b}</h3>
                  <p>{x.p}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DveZnamki trenutna="HAMMEX" />

      <div className="cta">
        <div className="w">
          <div>
            <h2>Žeblji HAMMEX za vašo trgovino ali gradbišče?</h2>
            <p>Pošljite povpraševanje in pripravimo predlog asortimana ter pogoje.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=hammex">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
      <PotiProdaje izpusti="/hammex" />
    </>
  );
}
