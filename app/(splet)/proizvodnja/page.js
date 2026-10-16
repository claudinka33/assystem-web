import Image from "next/image";
import Link from "next/link";
import KorakiSlike from "@/components/KorakiSlike";
import FotoGalerija from "@/components/FotoGalerija";
import { FOTO_KOVANJE, FOTO_PLASTIKA, FOTO_ORODJARNA, FOTO_KAKOVOST, FOTO_VPN } from "@/lib/foto";

export const metadata = {
  title: "Proizvodnja in razvoj",
  description:
    "Lastna proizvodnja AS system: jeklena sidra, udarni vijaki, zidni vložki in perforiran trak. Hladno kovanje, valjanje navojev, brizganje plastike, avtomatska montaža in pakiranje na dveh lokacijah v Sloveniji.",
  alternates: { canonical: "/proizvodnja" },
};

const pas = [
  ["22", "Dvostopenjskih stiskalnic"],
  ["18", "Strojev za valjanje navojev"],
  ["7", "Avtomatskih montažnih linij"],
  ["1.200 t", "Zaloge, razpoložljive takoj"],
];

const izdelki = [
  {
    naziv: "Jeklena sidra",
    oznaka: "TXH7 · TX1 · ZnB in A4",
    opis: "Nosilna sidra za beton, hladno kovana iz žice. Z evropsko tehnično oceno ETA in oznako CE.",
    slika: "/slike/asfix/txh7.png",
    pot: "/program/pritrdila-za-beton",
  },
  {
    naziv: "Udarni vijaki",
    oznaka: "PA6 · PE",
    opis: "Vijak in vložek, sestavljena na naših montažnih linijah — pripravljena za hitro vgradnjo.",
    slika: "/slike/o-nas/udarni-vodoravno.png",
    pot: "/program/klasicna-pritrdila",
  },
  {
    naziv: "Zidni vložki",
    oznaka: "PA6 · PE",
    opis: "Najlonski vložki, brizgani v lastni proizvodnji, za polne in luknjaste podlage.",
    slika: "/slike/asfix/mq.png",
    pot: "/program/klasicna-pritrdila",
  },
  {
    naziv: "Perforiran trak",
    oznaka: "12 mm · 17 mm",
    opis: "Pocinkan montažni trak za inštalacije in prezračevanje, v praktični škatli po 10 m.",
    slika: "/slike/asfix/trak.png",
    pot: "/program/pritrdila-za-instalacije",
  },
];

const koraki = [
  ["Razvoj in tehnologija", "Postopek, material in tolerance določimo sami. Pripravimo tehnično dokumentacijo — ETA, CE in izjave o lastnostih (DoP).", "razvoj"],
  ["Hladno kovanje", "Iz jeklene žice na večstopenjskih stiskalnicah nastanejo telesa sider in vijakov. Material ohrani strukturo, nosilnost je ponovljiva.", "kovanje"],
  ["Valjanje navojev", "Navoj se valja, ne reže — vlakna materiala ostanejo nepretrgana, navoj je trdnejši.", "navoj"],
  ["Brizganje plastike", "Najlonski vložki in tulci iz poliamida (PA6) in polietilena (PE).", "brizganje"],
  ["Kontrola kakovosti", "Vhodna, medfazna in končna kontrola. Vsaka serija je sledljiva od materiala do palete.", "kontrola"],
  ["Montaža in pakiranje", "Avtomatsko sestavljanje kompletov in pakiranje v vrečke ali škatle — tudi v embalažo kupca.", "montaza"],
  ["Skladišče in odprema", "Visokoregalno skladišče v Šmarju pri Jelšah. Osnovni asortiment odpremimo takoj.", "odprema"],
];

// Črtne ikone korakov (24 × 24, barva iz CSS)
const ikone = {
  razvoj: (
    <>
      <path d="M4 3h11l5 5v13H4z" />
      <path d="M15 3v5h5" />
      <path d="M8 13h8M8 17h5" />
      <circle cx="9" cy="9" r="1.5" />
    </>
  ),
  kovanje: (
    <>
      <path d="M3 20h18" />
      <path d="M6 20v-3h12v3" />
      <path d="M8 17v-3h8v3" />
      <path d="M12 14V4" />
      <path d="M8 4h8" />
      <path d="M10 8l2 2 2-2" />
    </>
  ),
  navoj: (
    <>
      <path d="M9 3h6v3H9z" />
      <path d="M10 6v12l2 3 2-3V6" />
      <path d="M10 9l4 1.5M10 12l4 1.5M10 15l4 1.5" />
    </>
  ),
  brizganje: (
    <>
      <path d="M3 9h9v6H3z" />
      <path d="M12 10.5h3v3h-3" />
      <path d="M15 12h2" />
      <path d="M18 9.5l3 1v3l-3 1z" />
      <path d="M6 9V5h3v4" />
    </>
  ),
  kontrola: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
      <path d="M7.5 10.5l2 2 4-4" />
    </>
  ),
  montaza: (
    <>
      <path d="M3 8l9-4 9 4-9 4z" />
      <path d="M3 8v9l9 4 9-4V8" />
      <path d="M12 12v9" />
    </>
  ),
  odprema: (
    <>
      <path d="M2 6h12v10H2z" />
      <path d="M14 9h4l3 3v4h-7" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
};

const stroji = [
  {
    naziv: "Proizvodnja",
    kraj: "Hladno kovanje, obdelava in brizganje",
    vrstice: [
      [22, "dvostopenjskih stiskalnic"],
      [18, "strojev za valjanje navojev"],
      [3, "ekscentrične stiskalnice"],
      [2, "CNC stružnici"],
      [2, "stroja za brizganje plastike"],
      [1, "petstopenjska stiskalnica"],
      [1, "štiristopenjska stiskalnica"],
    ],
  },
  {
    naziv: "Montaža in pakiranje",
    kraj: "Sestavljanje in priprava za polico",
    vrstice: [
      [7, "avtomatskih montažnih linij"],
      [9, "polavtomatskih linij za pakiranje"],
      [3, "linije za polnjenje vrečk"],
      [3, "linije za varjenje in pakiranje žebljev"],
      [2, "avtomatski liniji za pakiranje"],
    ],
  },
];

const lokacije = [
  {
    st: "Lokacija 01",
    naziv: "Bistrica ob Sotli",
    naslov: "Hrastje ob Bistrici 2a, 3256 Bistrica ob Sotli",
    opis: "Težki strojni park. Tu nastanejo jeklena sidra in vijaki: hladno kovanje, valjanje navojev, obdelava in brizganje plastike.",
    znacke: ["Hladno kovanje", "Valjanje navojev", "Brizganje plastike", "Vijaki po naročilu"],
    slika: "/slike/proizvodnja/bistrica-ob-sotli.jpg",
    alt: "Proizvodni obrat AS system v Bistrici ob Sotli",
  },
  {
    st: "Lokacija 02",
    naziv: "Šmarje pri Jelšah",
    naslov: "Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
    opis: "Sedež podjetja z upravo in prodajo. Avtomatska montaža, pakiranje in visokoregalno skladišče, iz katerega odpremljamo doma in v izvoz.",
    znacke: ["Avtomatska montaža", "Pakiranje", "1.400 paletnih mest", "Odprema"],
    slika: "/slike/proizvodnja/smarje-pri-jelsah.jpg",
    alt: "Sedež AS system v Šmarju pri Jelšah",
  },
];

const pakiranje = [
  ["Vrečke z izveskom", "Za police trgovin — od malih do velikih vrečk."],
  ["Škatle", "Družina škatel ASfix za avtomatsko in ročno pakiranje."],
  ["Embalaža kupca", "Vaša znamka, vaša etiketa, vaša EAN koda."],
  ["Poljubna količina", "Velikost pakiranja prilagodimo kupcu in prodajnemu mestu."],
];

const galerija = [
  ["/slike/embalaza/ASfix_vrecka_TXH7.png", "Vrečka z izveskom"],
  ["/slike/embalaza/AFR41.png", "Škatla ASfix"],
  ["/slike/embalaza/AFR81.png", "Dolga škatla za sidra"],
  ["/slike/skatla-private-label.jpg", "Škatla pod vašo znamko"],
  ["/slike/embalaza/ASco_vrecka_modra.png", "Vrečka ASco — ZnB"],
  ["/slike/embalaza/ASco_vrecka_zelena.png", "Vrečka ASco — INOX"],
  ["/slike/proizvodnja/transportna-skatla.webp", "Transportna škatla"],
  ["/slike/proizvodnja/paleta-asfix.jpg", "Paletna enota"],
];

const kakovost = [
  ["ISO 9001:2015", "Certificiran sistem vodenja kakovosti (Bureau Veritas)."],
  ["ETA · CE · DoP", "Evropska tehnična ocena in izjave o lastnostih za nosilna sidra."],
  ["F120", "Ognjevarnost 120 minut za zahtevne konstrukcijske vgradnje."],
  ["Sledljivost", "Vsaka serija ima LOT — od materiala do palete."],
];

export default function Proizvodnja() {
  return (
    <>
      {/* Glava */}
      <section className="zn-hero antracit">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Proizvodnja
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Proizvodnja in razvoj</span>
            <h1>Od žice do police — pod eno streho</h1>
            <p>
              Jeklena sidra, udarne vijake, zidne vložke in perforiran trak
              izdelamo sami — na dveh lokacijah v Sloveniji. Ne uvažamo jih in
              ne kupujemo polizdelkov, zato lahko dimenzijo, material ali
              pakiranje prilagodimo brez čakanja na dobavno verigo.
            </p>
            <ul className="zn-znacke">
              <li>Narejeno v Sloveniji</li>
              <li>Hladno kovanje</li>
              <li>Brizganje plastike</li>
              <li>Avtomatska montaža</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#izdelki">Kaj izdelamo</a>
              <Link className="b b-o" href="/kontakt?vir=proizvodnja">Povpraševanje</Link>
            </div>
          </div>
          <div className="zn-slika pr-hero-im" style={{ maxWidth: 640, justifySelf: "center" }}>
            <Image
              src="/slike/proizvodnja/hero-izdelki.png"
              alt="Jekleno sidro, zidni vložek, udarni vijak in perforiran trak iz lastne proizvodnje"
              width={1416}
              height={941}
              priority
              sizes="(max-width: 1000px) 90vw, 560px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* Številke */}
      <div className="pr-pas">
        <div className="w">
          {pas.map(([v, k]) => (
            <div key={k}>
              <b>{v}</b>
              <span>{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Izdelki */}
      <section className="sec grey" id="izdelki">
        <div className="w">
          <div className="st">
            <span>Lastna proizvodnja</span>
            <h2>Kaj izdelamo sami</h2>
            <p>
              Štiri skupine izdelkov so v celoti naše — od postopka do pakiranja.
              Vse so na voljo pod znamko ASfix ali pod vašo blagovno znamko.
            </p>
          </div>
          <div className="on-izd stiri">
            {izdelki.map((i) => (
              <Link key={i.naziv} href={i.pot} className="on-izd-k">
                <div className="on-izd-im">
                  <Image src={i.slika} alt={i.naziv} width={600} height={300} sizes="360px" />
                </div>
                <b>{i.naziv}</b>
                <em>{i.oznaka}</em>
                <p>{i.opis}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Proces */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Proces</span>
            <h2>Pot izdelka</h2>
            <p>Vsak korak je v naših rokah — zato vemo, kaj je v vsaki škatli.</p>
          </div>
          <ol className="pr-koraki">
            {koraki.map(([n, o, ik]) => (
              <li key={n}>
                <div className="pr-korak-ik">
                  <svg viewBox="0 0 24 24" aria-hidden="true">{ikone[ik]}</svg>
                </div>
                <b>{n}</b>
                <p>{o}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fotografije iz proizvodnje */}
      <section className="sec grey" id="foto">
        <div className="w">
          <div className="st">
            <span>Pogled v proizvodnjo</span>
            <h2>Tako nastajajo naši izdelki</h2>
            <p>Fotografije iz naših obratov — kliknite sliko za povečavo.</p>
          </div>
          <FotoGalerija
            skupine={[
              { naziv: "Hladno kovanje in navoji", slike: FOTO_KOVANJE },
              { naziv: "Brizganje plastike", slike: FOTO_PLASTIKA },
              { naziv: "Orodjarna", slike: FOTO_ORODJARNA },
              { naziv: "Kontrola kakovosti", slike: FOTO_KAKOVOST },
              { naziv: "Vijaki po naročilu", slike: FOTO_VPN },
            ]}
          />
        </div>
      </section>

      {/* Strojni park */}
      <section className="on-stroji">
        <div className="w">
          <div className="st">
            <span>Strojni park</span>
            <h2>Proizvodno podjetje, ne trgovina s skladiščem</h2>
            <p>Trenutno stanje strojnega parka — stroji in ljudje, ki jih znajo voditi.</p>
          </div>
          <div className="on-stroji-g">
            {stroji.map((g) => (
              <div key={g.naziv}>
                <h3>{g.naziv}</h3>
                <small>{g.kraj}</small>
                <ul>
                  {g.vrstice.map(([n, t]) => (
                    <li key={t}>
                      <b>{n}×</b>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lokaciji */}
      <section className="sec" id="lokacije">
        <div className="w">
          <div className="st">
            <span>Dve lokaciji</span>
            <h2>Kje nastane izdelek</h2>
          </div>
          <div className="pr-lok">
            {lokacije.map((l) => (
              <div key={l.naziv}>
                <div className="pr-lok-im">
                  <Image src={l.slika} alt={l.alt} fill sizes="(max-width: 1000px) 100vw, 50vw" quality={90} />
                </div>
                <small>{l.st}</small>
                <h3>{l.naziv}</h3>
                <p>{l.opis}</p>
                <ul>
                  {l.znacke.map((z) => (
                    <li key={z}>{z}</li>
                  ))}
                </ul>
                <span className="pr-naslov">{l.naslov}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pakiranje */}
      <section className="sec grey">
        <div className="w">
          <div className="on-kratko">
            <div>
              <div className="st">
                <span>Montaža in pakiranje</span>
                <h2>Pakiranje po meri kupca</h2>
                <p>
                  Lastno pakiranje je eden naših najmočnejših argumentov. Kupcu
                  ponudimo poljubno velikost pakiranja in pakiranje v njegovo
                  embalažo — česar uvozniki ne zmorejo.
                </p>
              </div>
              <div className="on-zakaj" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                {pakiranje.map(([n, o]) => (
                  <div key={n}>
                    <b>{n}</b>
                    <p>{o}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22 }}>
                <Link className="more" href="/private-label">Private label — pakiranje pod vašo znamko →</Link>
              </div>
            </div>
            <div className="pr-gal">
              {galerija.map(([src, opis]) => (
                <figure key={src}>
                  <div>
                    <Image src={src} alt={opis} fill sizes="(max-width: 1000px) 45vw, 260px" />
                  </div>
                  <figcaption>{opis}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Na polici */}
      <section className="pr-polica-sec">
        <div className="w">
          <div className="pr-polica">
            <div>
              <div className="st">
                <span>Zadnji korak</span>
                <h2>Na polici trgovca</h2>
                <p>
                  Iz montaže gre blago naravnost na polico — pripravljeno za
                  prodajo, brez prepakiranja. Trgovcem pripravimo police od 1
                  do 4 metrov.
                </p>
              </div>
              <ul className="pr-polica-tocke">
                <li>
                  <b>Prodajna tabla »V kaj pritrjuješ?«</b>
                  <span>Kupec najprej izbere podlago, nato pritrdilo — manj vprašanj na blagajni.</span>
                </li>
                <li>
                  <b>Vrečke z izveskom</b>
                  <span>Vložki, udarni vijaki in sidra v manjših količinah, na kavljih.</span>
                </li>
                <li>
                  <b>Škatle z jasno šifro</b>
                  <span>Dimenzija in količina sta vidni s prednje strani škatle.</span>
                </li>
              </ul>
              <Link className="b b-r" href="/za-trgovce" style={{ marginTop: 26 }}>
                Ponudba za trgovce →
              </Link>
            </div>
            <div className="pr-polica-im">
              <Image
                src="/slike/proizvodnja/polica-asfix-1m.jpg"
                alt="Prodajna polica ASfix z vrečkami, škatlami in prodajno tablo"
                width={1100}
                height={1970}
                sizes="(max-width: 1000px) 80vw, 460px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vijaki po naročilu */}
      <section className="sec">
        <div className="w">
          <div className="pr-vpn">
            <div className="st" style={{ marginBottom: 0 }}>
              <span>Od leta 2015</span>
              <h2>Vijaki po naročilu</h2>
              <p>
                Po vaši risbi ali tehnični dokumentaciji izdelamo vijake, ki niso
                del standardnega kataloga — za elektro, lesno, gradbeno in
                splošno industrijo. Poskrbimo za izdelavo orodja in potrditev
                vzorcev, nato za serijsko proizvodnjo.
              </p>
              <Link className="b b-r" href="/vijaki-po-narocilu" style={{ marginTop: 22 }}>
                Vijaki po naročilu →
              </Link>
            </div>
            <div>
            <KorakiSlike
              href="/vijaki-po-narocilu"
              gumb="Vijaki po naročilu →"
              koraki={[
                { naslov: "Risba", podnaslov: "Korak 1", opis: "Vaša risba ali tehnična dokumentacija — preverimo izvedljivost in material.", slika: "/slike/foto/vpn-risba.jpg", alt: "Tehnična risba vijaka" },
                { naslov: "Orodje in vzorci", podnaslov: "Korak 2", opis: "Izdelava orodja in potrditev vzorcev pred serijo.", slika: "/slike/foto/proizvodnja-09.jpg", alt: "Prvi kosi iz novega orodja" },
                { naslov: "Serija", podnaslov: "Korak 3", opis: "Serijska proizvodnja s hladnim kovanjem in valjanjem navojev.", slika: "/slike/foto/proizvodnja-13.jpg", alt: "Serijsko izdelani vijaki" },
                { naslov: "Kontrola in dostava", podnaslov: "Korak 4", opis: "Kontrola mer in navojev, pakiranje in dostava.", slika: "/slike/foto/kakovost-04.jpg", alt: "Optična kontrola mer vijaka" },
              ]}
            />
            <dl className="on-nums">
              <div>
                <dt>M3×4</dt>
                <dd>Najmanjša dimenzija</dd>
              </div>
              <div>
                <dt>M16×180</dt>
                <dd>Največja dimenzija</dd>
              </div>
              <div>
                <dt>C10C</dt>
                <dd>Jekla za hladno kovanje</dd>
              </div>
              <div>
                <dt>20MnB4</dt>
                <dd>Borova jekla (tudi 19MnB4)</dd>
              </div>
            </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Kakovost */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Kakovost</span>
            <h2>Iz hiše ne gre nič, kar ni skladno</h2>
            <p>
              Naši izdelki držijo strehe in konstrukcije. Kontrola ima pravico
              ustaviti proizvodnjo ali odpremo, če izdelek ni skladen.
            </p>
          </div>
          <div className="pr-kak">
            <KorakiSlike
              href="/kakovost"
              gumb="Več o kakovosti →"
              koraki={[
                { naslov: "Nosilnost", podnaslov: "Preizkus", opis: "Preizkus izvlečne sile sider v betonu.", slika: "/slike/foto/kakovost-03.jpg", alt: "Sidro med preizkusom nosilnosti" },
                { naslov: "Mere", podnaslov: "Optična kontrola", opis: "Optično merjenje profila in navoja — brez dotika.", slika: "/slike/foto/kakovost-04.jpg", alt: "Optično merjenje vijaka" },
                { naslov: "Ob stroju", podnaslov: "Medfazna kontrola", opis: "Kontrola mer med serijo, neposredno ob stroju.", slika: "/slike/foto/proizvodnja-11.jpg", alt: "Kontrola mer s kljunastim merilom ob stroju" },
              ]}
            />
            <div className="on-zakaj">
              {kakovost.map(([n, o]) => (
                <div key={n}>
                  <b>{n}</b>
                  <p>{o}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 22 }}>
            <Link className="more" href="/kakovost">Več o kakovosti →</Link>
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Potrebujete izdelek po meri?</h2>
            <p>Pošljite risbo ali vzorec in pripravimo predlog izvedbe.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=proizvodnja">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}
