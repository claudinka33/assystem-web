import Image from "next/image";
import Link from "next/link";

// Štiri poti za kupce, ki ne kupujejo samo iz kataloga.
export const POTI = [
  {
    pot: "/asfix",
    oznaka: "Blagovna znamka",
    naziv: "ASfix",
    opis: "Pritrdilna tehnika v embalaži za polico — sidra, vložki, udarni vijaki in kemična sidra.",
    slika: "/slike/skatla-asfix.jpg",
  },
  {
    pot: "/asco",
    oznaka: "Blagovna znamka",
    naziv: "ASco",
    opis: "Standardno vijačno blago po DIN in ISO — vijaki, matice in podložke, pocinkano in inox.",
    slika: "/slike/embalaza/ASco_skatla.png",
  },
  {
    pot: "/private-label",
    oznaka: "Pod vašo znamko",
    naziv: "Private label",
    opis: "Naše izdelke iz lastne proizvodnje zapakiramo v vrečke in škatle z vašim logotipom.",
    slika: "/slike/AF_TXH7_PrivateLabel_BOX.jpeg",
  },
  {
    pot: "/vijaki-po-narocilu",
    oznaka: "Po vaši risbi",
    naziv: "Vijaki po naročilu",
    opis: "Posebni vijaki po risbi ali tehnični dokumentaciji, v serijah za industrijo.",
    slika: null,
  },
];

export default function PotiProdaje({ izpusti }) {
  return (
    <section className="sec poti-sec">
      <div className="w">
        <div className="st">
          <span>Sodelovanje</span>
          <h2>Kaj še lahko naredimo za vas</h2>
          <p>Poleg prodaje iz kataloga ponujamo dve lastni blagovni znamki, izdelke pod vašo znamko in vijake po vaši risbi.</p>
        </div>
        <div className="poti">
          {POTI.filter((p) => p.pot !== izpusti).map((p) => (
            <Link key={p.pot} href={p.pot} className={`pot${p.slika ? "" : " pot-vzorec"}`}>
              <div className="pot-im">
                {p.slika ? (
                  <Image src={p.slika} alt={p.naziv} fill sizes="(max-width: 700px) 100vw, 360px" style={{ objectFit: "contain", padding: 14, mixBlendMode: "multiply" }} />
                ) : (
                  <b>Ø M3 – M16</b>
                )}
              </div>
              <div className="pot-tx">
                <em>{p.oznaka}</em>
                <h3>{p.naziv}</h3>
                <p>{p.opis}</p>
                <span>Več →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
