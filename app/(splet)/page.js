import ZemljevidProdaje from "@/components/ZemljevidProdaje";
import Image from "next/image";
import Link from "next/link";
import VideoPredstavitev from "@/components/VideoPredstavitev";
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
import HeroBannerji from "@/components/HeroBannerji";
import { prevedenaStran, prevediMetadata, jezik } from "@/lib/i18n/streznik";

// Predstavitveni video podjetja (cel, z zvokom)
const VIDEO_SL = "https://www.youtube.com/watch?v=vmdeYdyWzGE";
const VIDEO_EN = "https://www.youtube.com/watch?v=uiRXMJviMv8";

export const revalidate = 60;

const metadataSl = {
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
  { naziv: "Jekleno sidro TXH7", opis: "Z oceno ETA", slika: "/slike/asfix/txh7.png", pot: "/program/pritrdila-za-beton/jekleno-sidro-txh7" },
  { naziv: "Jekleno sidro TX1", opis: "Z oceno ETA", slika: "/slike/asfix/tx1.png", pot: "/program/pritrdila-za-beton/jekleno-sidro-tx1-siroka-podlozka" },
  { naziv: "TX1 s široko podložko DIN 9021", opis: "Z oceno ETA", slika: "/slike/AF_TX1_9021_dolgo.jpeg", pot: "/program/pritrdila-za-beton/jekleno-sidro-tx1-siroka-podlozka" },
  { naziv: "Udarni vijak UVS", opis: "Vložek in vijak v enem", slika: "/slike/AF_UVS_Nylon_png.jpeg", pot: "/program/pritrdila-za-suhomontazo/udarni-vijak-nylon" },
  { naziv: "Zidni vložek AS.MQ", opis: "Najlon PA6", slika: "/slike/asfix/mq.png", pot: "/program/zidni-vlozki/zidni-vlozek-mq" },
  { naziv: "Perforiran trak", opis: "12 mm in 17 mm", slika: "/slike/asfix/trak.png", pot: "/program/pritrdila-za-suhomontazo/perforiran-trak" },
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

async function Domov() {
  const { seznam: kategorije } = await pridobiKategorije();
  const b = await pridobiVsebine("domov");
  const jezikStrani = await jezik();
  const izdelkiResitev = await pridobiIzdelkePoSlugih(vsiSlugi());

  return (
    <>
      {/* ---------- Glava: trije bannerji, menjava na 5 s ---------- */}
      <HeroBannerji
        bannerji={[
          {
            tip: "video",
            video: "/videi/proizvodnja-hero.mp4",
            poster: "/slike/proizvodnja/hero-video-poster.jpg",
            oznaka: "Bespoke manufacturing",
            naslov: "Iz zaloge ali po vaši meri.",
            besedilo:
              "Prinesite skico ali risbo. Sidra, udarni vijaki, vložki in vijaki iz lastne proizvodnje: standardno ali izdelano po vaših merah.",
            gumbi: [
              { naziv: "Pošljite skico", pot: "/bespoke#povprasevanje", slog: "bel" },
              { naziv: "Lastna proizvodnja", pot: "/proizvodnja", slog: "obroba" },
              { naziv: "Poglej predstavitveni video", pot: jezikStrani === "sl" ? VIDEO_SL : VIDEO_EN, slog: "video" },
            ],
            opomba: "Lastna proizvodnja · Šmarje pri Jelšah in Bistrica ob Sotli",
          },
          {
            tip: "slika",
            slika: "/slike/znamke/asfix-afr41-sredina.png",
            sirina: 1001,
            visina: 662,
            alt: "Škatla ASfix",
            oznaka: "Za podjetja · B2B",
            naslov: "Vaše cene. Naročilo v nekaj klikih.",
            besedilo:
              "Registrirajte podjetje in naročajte po svojem ceniku: pregled naročil in računov, plačilo na račun z dogovorjenim rokom plačila.",
            gumbi: [
              { naziv: "B2B registracija", pot: "/b2b/registracija", slog: "bel" },
              { naziv: "Prijava", pot: "/b2b", slog: "obroba" },
            ],
          },
          {
            tip: "slika",
            slika: "/hero-izdelki-2026.png",
            sirina: 1100,
            visina: 1044,
            alt: "Pritrdila ASfix: jekleno sidro TXH7, zidni vložki, kemično sidro EASF TOP, udarni vijaki, vrečka in škatla",
            oznaka: v(b, "domov.hero.oznaka", "naslov", "Pritrdilna tehnika in vijaki"),
            naslov: v(b, "domov.hero.naslov", "naslov", "Vse za pritrjevanje. Iz zaloge."),
            besedilo: v(
              b,
              "domov.hero.besedilo",
              "besedilo",
              "Jeklena sidra, zidni vložki, udarni vijaki, kemična sidra in vijačno blago iz zaloge. Za trgovine, izvajalce in distributerje."
            ),
            gumbi: [
              { naziv: "Prodajni program", pot: "/program", slog: "bel" },
              { naziv: "Kontaktirajte nas", pot: "/kontakt", slog: "obroba" },
            ],
          },
        ]}
      />

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
                <span>Izdelano v Sloveniji · EU</span>
                <h2>Lastna proizvodnja</h2>
                <p>
                  {v(
                    b,
                    "domov.zmogljivosti.besedilo",
                    "besedilo",
                    "V Šmarju pri Jelšah in Bistrici ob Sotli s hladnim kovanjem in brizganjem plastike izdelujemo pritrdila, ki jih prodajamo pod znamko ASfix. Montaža in pakiranje potekata pri nas, tudi za druge blagovne znamke."
                  ).replace(/\s*Naši lastni izdelki:?\s*$/, "")}
                </p>
              </div>
              <p className="lastni-nasl">Naši lastni izdelki:</p>
              <div className="lastni-izd">
                {lastniIzdelki.map((x) => (
                  <Link key={x.naziv} href={x.pot} className="lastni-k">
                    <span className="lastni-im">
                      <Image src={x.slika} alt={x.naziv} fill sizes="(max-width: 620px) 45vw, 180px" style={{ objectFit: "contain" }} />
                    </span>
                    <b>{x.naziv}</b>
                    <small>{x.opis}</small>
                  </Link>
                ))}
              </div>
              <Link className="more" href="/proizvodnja">
                Proizvodnja in razvoj →
              </Link>
            </div>
            <VideoPredstavitev
              src={jezikStrani === "sl" ? "/videi/predstavitev-sl.mp4" : "/videi/predstavitev-en.mp4"}
              poster="/slike/proizvodnja/hero-video-poster.jpg"
              naslov="Predstavitveni video AS system"
            />
          </div>
        </div>
      </section>

      {/* ---------- Naše znamke ---------- */}
      <DveZnamki />

      {/* ---------- Iskanje izdelkov ---------- */}
      <section className="isci-pas">
        <div className="w">
          <div>
            <span>Iskanje</span>
            <h2>Poiščite izdelek</h2>
          </div>
          <form action="/iskanje" className="hero-isci">
            <input
              name="q"
              type="search"
              placeholder="Vpišite šifro, EAN ali naziv…"
              aria-label="Iskanje izdelkov"
            />
            <button type="submit">Išči</button>
          </form>
        </div>
      </section>

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

export default prevedenaStran(Domov);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
