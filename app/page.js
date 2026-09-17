import Image from "next/image";
import Link from "next/link";
import { pridobiKategorije } from "@/lib/podatki";
import { pridobiVsebine, v } from "@/lib/vsebine";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata = {
  title: "ASfix — pritrdilna tehnika za vsako podlago",
  description:
    "Jeklena sidra, zidni vložki, udarni vijaki, kemična sidra in vijačno blago ASfix. Dobava iz zaloge, evropski certifikati ETA, cene za trgovce in izvajalce.",
  alternates: { canonical: "/" },
};

const prednosti = [
  ["Dobava iz zaloge", "Osnovni asortiman odpremimo takoj"],
  ["Ocena ETA", "Nosilna sidra z evropsko tehnično oceno"],
  ["Količinski popusti", "Cene glede na pakiranje in odjem"],
  ["Tehnična podpora", "Svetujemo, katero pritrdilo je pravo"],
];

const koraki = [
  ["Poiščite izdelek", "Po šifri, EAN kodi ali nazivu. Pri vsakem izdelku so dimenzije, pakiranja in dokumentacija."],
  ["Pošljite povpraševanje", "V enem koraku pošljete šifre in količine. Odgovorimo v enem delovnem dnevu."],
  ["Prevzem ali dostava", "Odprema iz skladišča v Šmarju ali osebni prevzem. Za večje količine paletna dobava."],
];

const zaKoga = [
  {
    naziv: "Trgovine",
    opis: "Asortiman ASfix v embalaži, ki proda sama — vrečke z izveskom, škatle z jasno šifro, paletne enote.",
    cta: "Program ASfix",
    pot: "/asfix",
  },
  {
    naziv: "Izvajalci",
    opis: "Pravo pritrdilo za vsako podlago, s tehničnimi listi, izjavami o lastnostih in navodili za vgradnjo.",
    cta: "Prodajni program",
    pot: "/program",
  },
  {
    naziv: "Distributerji",
    opis: "Evropski proizvajalec z lastnim razvojem, oceno ETA in stabilnimi dobavnimi roki za vaš trg.",
    cta: "Postanite distributer",
    pot: "/distributerji",
  },
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

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="w">
          <div>
            <span className="kick">
              {v(b, "domov.hero.oznaka", "naslov", "Pritrdilna tehnika ASfix")}
            </span>
            <h1>
              {v(b, "domov.hero.naslov", "naslov", "Vse za pritrjevanje. Iz zaloge.")}
            </h1>
            <p>
              {v(
                b,
                "domov.hero.besedilo",
                "besedilo",
                "Jeklena sidra, zidni vložki, udarni vijaki, kemična sidra in vijačno blago — enajst skupin izdelkov z evropskimi certifikati. Za trgovine, izvajalce in distributerje."
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
              <Link className="b b-o" href="/kontakt?vir=cenik">
                Zahtevaj cenik
              </Link>
            </div>
          </div>

          <div className="hero-im">
            <Image
              src="/hero-izdelki.png"
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

            <Link className="k" href="/private-label">
              <div className="im">
                <Image
                  src="/slike/skatla-private-label.jpg"
                  alt="Private label embalaža"
                  fill
                  sizes="300px"
                  style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                />
              </div>
              <div className="tx">
                <h3>Private label</h3>
                <p>Pritrdila pod vašo blagovno znamko</p>
              </div>
            </Link>
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
                "Spletna trgovina s cenami in košarico je v pripravi. Do takrat naročila oddate prek povpraševanja — odgovorimo v enem delovnem dnevu."
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

      {/* ---------- Za koga ---------- */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Za koga delamo</span>
            <h2>{v(b, "domov.zakoga.naslov", "naslov", "Zanesljiv poslovni partner")}</h2>
            <p>
              {v(
                b,
                "domov.zakoga.besedilo",
                "besedilo",
                "Naši kupci so trgovine z gradbenim, kovinskim in inštalacijskim materialom, veletrgovci, izvajalci na gradbiščih ter distributerji na tujih trgih."
              )}
            </p>
          </div>
          <div className="who">
            {zaKoga.map((z) => (
              <div key={z.naziv}>
                <b>{z.naziv}</b>
                <p>{z.opis}</p>
                <Link href={z.pot}>{z.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Kakovost ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="qua">
            <div className="foto">
              <Image
                src="/slike/skatla-asfix.jpg"
                alt="Škatla ASfix"
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
                    "Nosilna sidra imajo evropsko tehnično oceno ETA in izjavo o lastnostih. Vsa dokumentacija je na voljo za prenos, v slovenščini in angleščini."
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

      {/* ---------- Številke ---------- */}
      <div className="nums">
        <div className="w">
          <div>
            <b>1993</b>
            <span>Leto ustanovitve</span>
          </div>
          <div>
            <b>{site.drzave}</b>
            <span>Držav, kamor dobavljamo</span>
          </div>
          <div>
            <b>{kategorije.length}</b>
            <span>Skupin izdelkov ASfix</span>
          </div>
          <div>
            <b>ETA</b>
            <span>Evropska tehnična ocena</span>
          </div>
        </div>
      </div>

      {/* ---------- Podjetje ---------- */}
      <section className="sec">
        <div className="w">
          <div className="qua">
            <div>
              <div className="st">
                <span>{site.ime}</span>
                <h2>{v(b, "domov.podjetje.naslov", "naslov", "Kupujete neposredno pri proizvajalcu")}</h2>
                <p>
                  {v(
                    b,
                    "domov.podjetje.besedilo",
                    "besedilo",
                    "Sidra, vložke in udarne vijake izdelamo sami, na dveh lokacijah v Sloveniji. Brez vmesnih členov to pomeni boljšo ceno, krajše dobavne roke in možnost prilagoditve dimenzije ali pakiranja po vaših potrebah."
                  )}
                </p>
              </div>
              <Link className="more" href="/proizvodnja">
                Proizvodnja in razvoj →
              </Link>
            </div>
            <div className="foto">
              <Image
                src="/slike/as-system-smarje.jpg"
                alt="AS system Šmarje pri Jelšah"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

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
