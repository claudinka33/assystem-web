import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import PotiProdaje from "@/components/PotiProdaje";

export const metadata = {
  title: "ASco — standardno vijačno blago po DIN in ISO",
  description:
    "Vijaki, matice in podložke po DIN in ISO pod znamko ASco: pocinkano, črno in nerjavno jeklo A2/A4, v škatlah za podjetja in vrečkah za trgovine.",
  alternates: { canonical: "/asco" },
};

const skupine = [
  ["Vijaki", "šestrobi, imbus, ugrezni, lečasti, samorezni in lesni vijaki", "/program/vijacno-blago"],
  ["Matice", "šestrobe, samovarovalne, kapne, krilne in druge", "/program/vijacno-blago"],
  ["Podložke", "ravne, velike, vzmetne in zobate", "/program/vijacno-blago"],
  ["Navojne palice in zatiči", "navojne palice, zatiči, varovala in kovice", "/program/vijacno-blago"],
];

const pakiranja = [
  { naziv: "Škatla ASco", opis: "Za podjetja, servisno in industrijsko porabo.", slika: "/slike/embalaza/ASco_skatla.png" },
  { naziv: "Vrečka ASco", opis: "Za trgovine — z eurolukno za obešanje na stojalo.", slika: "/slike/embalaza/ASco_vrecka_modra.png" },
];

export default function ASco() {
  return (
    <>
      <NaslovStrani
        oznaka="Blagovna znamka"
        naslov="ASco"
        opis="Standardno vijačno blago po DIN in ISO — vijaki, matice in podložke iz zaloge."
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj je ASco</span>
                <h2>Vijačno blago, ki je vedno na zalogi</h2>
                <p>
                  ASco je naša znamka za standardno vijačno blago po normah DIN in ISO. Pokriva vijake, matice,
                  podložke, navojne palice in lesne vijake v pocinkani, črni in nerjavni izvedbi (A2, A4).
                </p>
                <p style={{ marginTop: 12 }}>
                  Asortiman dopolnjuje pritrdilno tehniko ASfix, tako da trgovec ali izvajalec vse dobi na enem
                  mestu, z enim dobavnim rokom.
                </p>
              </div>
              <Link className="b b-r" href="/program/vijacno-blago">
                Vijačno blago v katalogu
              </Link>
            </div>
            <div className="foto">
              <Image src="/slike/embalaza/ASco_skatla.png" alt="Škatla ASco" fill sizes="(max-width: 1000px) 100vw, 560px" style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Asortiman</span>
            <h2>Kaj je v programu ASco</h2>
          </div>
          <div className="kats">
            {skupine.map(([n, o, p]) => (
              <Link key={n} href={p} className="k" style={{ padding: "22px" }}>
                <h3>{n}</h3>
                <p style={{ marginTop: 8 }}>{o}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Pakiranje</span>
            <h2>Za podjetja in za trgovine</h2>
          </div>
          <div className="kats c3">
            {pakiranja.map((x) => (
              <div key={x.naziv} className="k">
                <div className="im">
                  <Image src={x.slika} alt={x.naziv} fill sizes="300px" style={{ objectFit: "contain", padding: 16 }} />
                </div>
                <div className="tx">
                  <h3>{x.naziv}</h3>
                  <p>{x.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PotiProdaje izpusti="/asco" />
    </>
  );
}
