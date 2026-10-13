import Image from "next/image";
import Link from "next/link";

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
  ["Razvoj in tehnologija", "Postopek, material in tolerance določimo sami. Pripravimo tehnično dokumentacijo — ETA, CE in izjave o lastnostih (DoP)."],
  ["Hladno kovanje", "Iz jeklene žice na večstopenjskih stiskalnicah nastanejo telesa sider in vijakov. Material ohrani strukturo, nosilnost je ponovljiva."],
  ["Valjanje navojev", "Navoj se valja, ne reže — vlakna materiala ostanejo nepretrgana, navoj je trdnejši."],
  ["Brizganje plastike", "Najlonski vložki in tulci iz poliamida (PA6) in polietilena (PE)."],
  ["Kontrola kakovosti", "Vhodna, medfazna in končna kontrola. Vsaka serija je sledljiva od materiala do palete."],
  ["Montaža in pakiranje", "Avtomatsko sestavljanje kompletov in pakiranje v vrečke ali škatle — tudi v embalažo kupca."],
  ["Skladišče in odprema", "Visokoregalno skladišče v Šmarju pri Jelšah. Osnovni asortiment odpremimo takoj."],
];

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
  },
  {
    st: "Lokacija 02",
    naziv: "Šmarje pri Jelšah",
    naslov: "Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
    opis: "Sedež podjetja z upravo in prodajo. Avtomatska montaža, pakiranje in visokoregalno skladišče, iz katerega odpremljamo doma in v izvoz.",
    znacke: ["Avtomatska montaža", "Pakiranje", "1.400 paletnih mest", "Odprema"],
  },
];

const pakiranje = [
  ["Vrečke z izveskom", "Za police trgovin — od malih do velikih vrečk."],
  ["Škatle", "Družina škatel ASfix za avtomatsko in ročno pakiranje."],
  ["Embalaža kupca", "Vaša znamka, vaša etiketa, vaša EAN koda."],
  ["Poljubna količina", "Velikost pakiranja prilagodimo kupcu in prodajnemu mestu."],
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
          <div className="zn-slika pr-hero-im">
            <Image
              src="/slike/asfix/txh7.png"
              alt="Jekleno sidro TXH7 iz lastne proizvodnje"
              width={1200}
              height={264}
              priority
              sizes="(max-width: 1000px) 90vw, 640px"
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
            {koraki.map(([n, o]) => (
              <li key={n}>
                <b>{n}</b>
                <p>{o}</p>
              </li>
            ))}
          </ol>
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
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Dve lokaciji</span>
            <h2>Kje nastane izdelek</h2>
          </div>
          <div className="pr-lok">
            {lokacije.map((l) => (
              <div key={l.naziv}>
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
            <div className="pr-pak-im">
              <Image
                src="/slike/znamke/asfix-afr41.png"
                alt="Škatla ASfix iz lastne montaže in pakiranja"
                width={1100}
                height={654}
                sizes="(max-width: 1000px) 90vw, 560px"
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
          <div className="on-zakaj">
            {kakovost.map(([n, o]) => (
              <div key={n}>
                <b>{n}</b>
                <p>{o}</p>
              </div>
            ))}
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
