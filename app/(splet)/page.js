import ZemljevidProdaje from "@/components/ZemljevidProdaje";
import Image from "next/image";
import Link from "next/link";
import LokacijiDomov from "@/components/LokacijiDomov";
import { pridobiKategorije } from "@/lib/podatki";
import { pridobiVsebine, v } from "@/lib/vsebine";
import { site } from "@/lib/site";
import Vrata from "@/components/Vrata";
import DveZnamki from "@/components/DveZnamki";
import ResitveObjekt from "@/components/ResitveObjekt";
import { objekt, cone, vsiSlugi } from "@/lib/resitve";
import { pridobiIzdelkePoSlugih } from "@/lib/podatki";
import InstagramObjave from "@/components/InstagramObjave";
import ClankiDomov from "@/components/ClankiDomov";

export const revalidate = 60;

export const metadata = {
  title: "AS system: pritrdilna tehnika in vijačno blago",
  description:
    "Pritrdilna tehnika ASfix, vijačno blago ASco, lesni vijaki Silvermate in žeblji HAMMEX. Dobava iz zaloge, police za trgovce, private label in vijaki po naročilu.",
  alternates: { canonical: "/" },
};

const prednosti = [
  ["Lastna proizvodnja", "Sidra, vložki in vijaki iz Slovenije"],
  ["Dobava iz zaloge", "Osnovni program odpremimo takoj"],
  ["Certifikati ETA in CE", "Za nosilna sidra"],
  ["Tehnična podpora", "Svetujemo pri izbiri pritrdila"],
];

// Izdelki iz lastne proizvodnje (Šmarje pri Jelšah in Bistrica ob Sotli)
const lastniIzdelki = [
  "Jeklena sidra",
  "Zidni vložki",
  "Vložki za mavčne plošče",
  "Udarni vijaki",
  "Turbo vijaki",
  "Perforiran trak",
  "Vijaki po risbi",
];

const koraki = [
  ["Poiščite izdelek", "Po šifri, EAN kodi ali nazivu. Pri izdelku so dimenzije, pakiranja, zaloga in cena."],
  ["Dodajte v košarico", "Izberite pakiranje in količino. Plačate po predračunu ali po povzetju."],
  ["Prevzem ali dostava", "Pošljemo s Pošto Slovenije, nad 100 € brez DDV brezplačno. Lahko tudi prevzamete osebno v Šmarju pri Jelšah."],
];

const certifikati = [
  ["ETA", "Evropska tehnična ocena"],
  ["CE", "Oznaka skladnosti"],
  ["DoP", "Izjava o lastnostih"],
  ["ISO 9001", "Sistem vodenja kakovosti"],
];

export default async function Domov() {
  const { seznam: kategorije } = await pridobiKategorije();
  const b = await pridobiVsebine("domov");
  const izdelkiResitev = await pridobiIzdelkePoSlugih(vsiSlugi());

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="w">
          <div>
            <span className="kick">
              {v(b, "domov.hero.oznaka", "naslov", "Pritrdilna tehnika in vijaki")}
            </span>
            <h1>
              {v(b, "domov.hero.naslov", "naslov", "Vse za pritrjevanje. Iz zaloge.")}
            </h1>
            <p>
              {v(
                b,
                "domov.hero.besedilo",
                "besedilo",
                "Jeklena sidra, zidni vložki, udarni vijaki, kemična sidra in vijačno blago iz zaloge. Za trgovine, izvajalce in distributerje."
              )}
            </p>

            <form action="/iskanje" className="hero-isci">
              <input
                name="q"
                type="search"
                placeholder="Vpišite šifro, EAN ali naziv…"
                aria-label="Iskanje izdelkov"
              />
              <button type="submit">Išči</button>
            </form>

            <div className="acts">
              <Link className="b b-w" href="/program">
                Prodajni program
              </Link>
              <Link className="b b-o" href="/kontakt">
                Kontaktirajte nas
              </Link>
            </div>
          </div>

          <div className="hero-im">
            <Image
              src="/hero-izdelki-2026.png"
              alt="Pritrdila ASfix: jekleno sidro TXH7, zidni vložki, kemično sidro EASF TOP, udarni vijaki, vrečka in škatla"
              width={1100}
              height={1044}
              priority
              sizes="(max-width: 1000px) 100vw, 640px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* ---------- Prednosti ---------- */}
      <div className="adv">
        <div className="w">
          {prednosti.map(([naziv, opis]) => (
            <div key={naziv}>
              <b>
                <i>●</i>
                {naziv}
              </b>
              <span>{opis}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Kaj iščete: pet poti ---------- */}
      <Vrata />

      {/* ---------- Podjetje ---------- */}
      <section className="sec">
        <div className="w">
          <div className="qua lok-qua">
            <div>
              <div className="st">
                <span>Lastna proizvodnja</span>
                <h2>{v(b, "domov.zmogljivosti.naslov", "naslov", "Izdelano v Sloveniji")}</h2>
                <p>
                  {v(
                    b,
                    "domov.zmogljivosti.besedilo",
                    "besedilo",
                    "V Šmarju pri Jelšah in Bistrici ob Sotli s hladnim kovanjem in brizganjem plastike izdelujemo pritrdila, ki jih prodajamo pod znamko ASfix. Montaža in pakiranje potekata pri nas, tudi za druge blagovne znamke. Naši lastni izdelki:"
                  )}
                </p>
              </div>
              <ul className="lastni">
                {lastniIzdelki.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <Link className="more" href="/proizvodnja">
                Proizvodnja in razvoj →
              </Link>
            </div>
            <LokacijiDomov />
          </div>
        </div>
      </section>

      {/* ---------- Naše znamke ---------- */}
      <DveZnamki />

      {/* ---------- Kaj ponujamo ---------- */}
      <section className="sec" id="program">
        <div className="w">
          <div className="st row">
            <div>
              <span>Kaj ponujamo</span>
              <h2>{v(b, "domov.program.naslov", "naslov", "Pritrdila za vsako podlago")}</h2>
              <p>
                {v(
                  b,
                  "domov.program.besedilo",
                  "besedilo",
                  "Beton, opeka, votlaki, mavčne plošče, izolacija, streha in inštalacije, izberite skupino in poglejte dimenzije, pakiranja in dokumentacijo."
                )}
              </p>
            </div>
            <Link className="more" href="/program">
              Vse kategorije →
            </Link>
          </div>

          <div className="kats">
            {kategorije.map((k) => (
              <Link key={k.slug} className="k" href={`/program/${k.slug}`}>
                <div className={k.slika ? "im" : "im prazna"}>
                  {k.slika && (
                    <Image
                      src={k.slika}
                      alt={k.naziv}
                      fill
                      sizes="(max-width: 620px) 100vw, 300px"
                      style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                    />
                  )}
                </div>
                <div className="tx">
                  <h3>{k.naziv}</h3>
                  <p>{k.opis}</p>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* ---------- Rešitve: interaktivni objekt ---------- */}
      <section className="sec grey res-dom" id="resitve">
        <div className="w">
          <ResitveObjekt objekt={objekt} cone={cone} izdelki={izdelkiResitev} kompaktno />
        </div>
      </section>

      {/* ---------- Kako naročite ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Naročanje</span>
            <h2>{v(b, "domov.narocilo.naslov", "naslov", "Do naročila v treh korakih")}</h2>
            <p>
              {v(
                b,
                "domov.narocilo.besedilo",
                "besedilo",
                "Spletna trgovina je odprta za podjetja in posameznike. Za večje količine pripravimo ponudbo s količinskim popustom. Pošljite povpraševanje in odgovorili vam bomo v najkrajšem možnem času."
              )}
            </p>
          </div>

          <div className="koraki">
            {koraki.map(([naslov, opis], i) => (
              <div key={naslov}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <h3>{naslov}</h3>
                <p>{opis}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="b b-r" href="/program">
              Oglejte si program
            </Link>
            <Link className="b b-d" href="/kontakt?vir=cenik">
              Pošljite povpraševanje
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Kakovost ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="qua">
            <div className="foto">
              <Image
                src="/slike/znamke/asfix-afr41.png"
                alt="Škatla ASfix AFR41"
                fill
                sizes="(max-width: 1000px) 100vw, 620px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>
            <div>
              <div className="st">
                <span>Kakovost</span>
                <h2>
                  {v(b, "domov.kakovost.naslov", "naslov", "Kakovost z dokazili")}
                </h2>
                <p>
                  {v(
                    b,
                    "domov.kakovost.besedilo",
                    "besedilo",
                    "Nosilna sidra imajo evropsko tehnično oceno ETA, oznako CE in izjavo o lastnostih. Dokumente za izdelek najdete pri izdelku ali vam jih pošljemo."
                  )}
                </p>
              </div>
              <div className="cert">
                {certifikati.map(([kratica, opis]) => (
                  <div key={kratica}>
                    <b>{kratica}</b>
                    <span>{opis}</span>
                  </div>
                ))}
              </div>
              <Link className="more" href="/kakovost" style={{ display: "inline-block", marginTop: 22 }}>
                Certifikati in prenosi →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Zemljevid: iz Slovenije v svet ---------- */}
      <ZemljevidProdaje />

      {/* ---------- Novosti in nasveti (blog) ---------- */}
      <ClankiDomov />

      {/* ---------- Instagram ---------- */}
      <InstagramObjave />

      {/* ---------- Private label ---------- */}
      <div className="cta">
        <div className="w">
          <div>
            <h2>{v(b, "domov.cta.naslov", "naslov", "Pritrdila pod vašo blagovno znamko")}</h2>
            <p>
              {v(
                b,
                "domov.cta.besedilo",
                "besedilo",
                "Izdelke zapakiramo v vašo embalažo in pod vašo blagovno znamko."
              )}
            </p>
          </div>
          <Link className="b b-w" href="/private-label">
            Kako poteka →
          </Link>
        </div>
      </div>
    </>
  );
}
