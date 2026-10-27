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

export const revalidate = 60;

export const metadata = {
  title: "AS system — pritrdilna tehnika in vijačno blago",
  description:
    "Pritrdilna tehnika ASfix, vijačno blago ASco, lesni vijaki Silvermate in žeblji HAMMEX. Dobava iz zaloge, police za trgovce, private label in vijaki po naročilu.",
  alternates: { canonical: "/" },
};

const prednosti = [
  ["Dobava iz zaloge", "Osnovni asortiman odpremimo takoj"],
  ["Ocena ETA", "Nosilna sidra z evropsko tehnično oceno"],
  ["Količinski popusti", "Cene glede na pakiranje in odjem"],
  ["Tehnična podpora", "Svetujemo, katero pritrdilo je pravo"],
];

const koraki = [
  ["Poiščite izdelek", "Po šifri, EAN kodi ali nazivu. Pri vsakem izdelku so dimenzije, pakiranja, zaloga in cena."],
  ["Dodajte v košarico", "Izberite pakiranja in količine ter oddajte naročilo — plačilo po predračunu ali po povzetju."],
  ["Prevzem ali dostava", "Pošljemo s Pošto Slovenije (nad 100 € brezplačno) ali prevzamete osebno v Šmarju."],
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
                "Jeklena sidra, zidni vložki, udarni vijaki, kemična sidra in vijačno blago iz zaloge — nosilna sidra z evropsko tehnično oceno ETA. Za trgovine, izvajalce in distributerje."
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
              <Link className="b b-o" href="/b2b">
                B2B za podjetja
              </Link>
            </div>
          </div>

          <div className="hero-im">
            <Image
              src="/hero-izdelki-2026.png"
              alt="Pritrdila ASfix — jekleno sidro TXH7, zidni vložki, kemično sidro EASF TOP, udarni vijaki, vrečka in škatla"
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

      {/* ---------- Kaj iščete: štiri publike ---------- */}
      <Vrata />

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
                  "Beton, opeka, votlaki, mavčne plošče, izolacija, streha in inštalacije — izberite skupino in poglejte dimenzije, pakiranja in dokumentacijo."
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

      {/* ---------- Za trgovce: police ---------- */}
      <section className="sec trg-sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Za trgovce</span>
                <h2>Polica, ki proda sama</h2>
                <p>
                  Sestavimo prodajni program in postavitev police za vašo trgovino — ASfix, ASco ali kombinacijo
                  obeh. Postavitve od 1, 2, 4 in 6 metrov do 20 metrov.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link className="b b-w" href="/za-trgovce">
                  Police in pogoji →
                </Link>
              </div>
            </div>
            <div className="trg-slika">
              <Image
                src="/slike/trgovci/asfix-polica-2m-bela.jpg"
                alt="Prodajna polica ASfix, 2 m"
                width={1092}
                height={1120}
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Kako naročite ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Naročanje</span>
            <h2>{v(b, "domov.narocilo.naslov", "naslov", "Do izdelka v treh korakih")}</h2>
            <p>
              {v(
                b,
                "domov.narocilo.besedilo",
                "besedilo",
                "Spletna trgovina je odprta za podjetja in posameznike. Za večje količine in posebne cene nam pošljite povpraševanje — odgovorimo v enem delovnem dnevu."
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
              Poglej program
            </Link>
            <Link className="b b-d" href="/kontakt?vir=cenik">
              Zahtevaj cenik
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
                  {v(b, "domov.kakovost.naslov", "naslov", "Je kakovost pomembna? Za nas je najpomembnejša")}
                </h2>
                <p>
                  {v(
                    b,
                    "domov.kakovost.besedilo",
                    "besedilo",
                    "Nosilna sidra imajo evropsko tehnično oceno ETA in izjavo o lastnostih. Dokumentacijo za izbrani izdelek vam pošljemo na zahtevo."
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

      {/* ---------- Podjetje ---------- */}
      <section className="sec">
        <div className="w">
          <div className="qua lok-qua">
            <div>
              <div className="st">
                <span>{site.ime}</span>
                <h2>{v(b, "domov.zmogljivosti.naslov", "naslov", "Proizvodnja in storitve")}</h2>
                <p>
                  {v(
                    b,
                    "domov.zmogljivosti.besedilo",
                    "besedilo",
                    "Na dveh lokacijah v Sloveniji izdelujemo jeklena sidra, brizgamo plastiko za zidne vložke in vložke za mavčne plošče ter proizvajamo udarne vijake, žičnike in vijake po naročilu. Montaža in pakiranje potekata pri nas — tudi za druge blagovne znamke."
                  )}
                </p>
              </div>
              <Link className="more" href="/proizvodnja">
                Proizvodnja in razvoj →
              </Link>
            </div>
            <LokacijiDomov />
          </div>
        </div>
      </section>

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
                "Izdelek razvijemo, proizvedemo in zapakiramo v vašo embalažo. Private label za evropske znamke."
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
