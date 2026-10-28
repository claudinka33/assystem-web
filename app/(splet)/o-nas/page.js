import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import FotoGalerija from "@/components/FotoGalerija";
import { FOTO_EKIPA, FOTO_SKLADISCE, FOTO_VIJAKI, FOTO_SIDRA, FOTO_MONTAZA, FOTO_ZEBLJI } from "@/lib/foto";
import { KogaPoklicem, TerenKomercialisti, KontaktiOddelki, Lokacije } from "@/components/KontaktBloki";

export const metadata = {
  title: "O nas",
  description:
    "AS system d.o.o. — slovensko družinsko podjetje s področja pritrdilne tehnike od leta 1993. Lastna proizvodnja sider, zidnih vložkov in udarnih vijakov, dve lokaciji, kontakti po oddelkih.",
  alternates: { canonical: "/o-nas" },
};

const stevilke = [
  ["1993", "Leto ustanovitve"],
  ["2", "Lokaciji v Sloveniji"],
  [`${site.drzave}`, "Držav, kamor dobavljamo"],
  ["4", "Skupine izdelkov iz lastne proizvodnje"],
];

const izdelki = [
  {
    naziv: "Jeklena sidra",
    oznaka: "TXH7 · TX1 · ZnB in A4",
    opis: "Nosilna sidra za beton z evropsko tehnično oceno ETA in oznako CE.",
    slika: "/slike/asfix/txh7.png",
    pot: "/program/pritrdila-za-beton",
  },
  {
    naziv: "Udarni vijaki",
    oznaka: "PA6 · PE",
    opis: "Vložek in vijak v enem — hitro pritrjevanje brez dodatnega orodja.",
    slika: "/slike/o-nas/udarni-vodoravno.png",
    pot: "/program/klasicna-pritrdila",
  },
  {
    naziv: "Zidni vložki",
    oznaka: "PA6 · PE",
    opis: "Najlonski vložki za polne in luknjaste podlage — od lažjih do zahtevnejših vgradenj.",
    slika: "/slike/asfix/mq.png",
    pot: "/program/klasicna-pritrdila",
  },
  {
    naziv: "Perforiran trak",
    oznaka: "12 mm · 17 mm",
    opis: "Pocinkan montažni trak za inštalacije in prezračevanje, v škatli po 10 m.",
    slika: "/slike/asfix/trak.png",
    pot: "/program/pritrdila-za-instalacije",
  },
];

const stroji = [
  {
    naziv: "Proizvodnja vijakov",
    kraj: "Bistrica ob Sotli · hladno kovanje in obdelava",
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
    kraj: "Šmarje pri Jelšah · sestavljanje in priprava za polico",
    vrstice: [
      [7, "avtomatskih montažnih linij"],
      [9, "polavtomatskih linij za pakiranje"],
      [3, "linije za polnjenje vrečk"],
      [3, "linije za varjenje in pakiranje žebljev"],
      [2, "avtomatski liniji za pakiranje"],
    ],
  },
];

const zaloga = [
  ["2.300 m²", "Skladišča na dveh lokacijah"],
  ["1.400", "Paletnih mest v visokoregalnem skladišču"],
  ["1.200 t", "Zaloge, razpoložljive takoj"],
  ["ISO 9001", "Bureau Veritas"],
];

const certifikati = [
  ["ETA", "Evropska tehnična ocena", "Tehnično ovrednotenje nosilnih pritrdilnih elementov."],
  ["CE", "Oznaka skladnosti", "Skladnost z evropskimi direktivami in izjave o lastnostih (DoP)."],
  ["ISO", "ISO 9001:2015", "Certificiran sistem vodenja kakovosti — Bureau Veritas."],
  ["F120", "Ognjevarnost", "120 minut — za zahtevne konstrukcijske vgradnje."],
];

const trgi = [
  {
    naziv: "Slovenija in Hrvaška",
    opis: "Celotno vijačno blago in pritrdilna tehnika — kot proizvajalec in kot veletrgovec. Trgovine, specializirane trgovine in izvajalci.",
  },
  {
    naziv: "Trgi bivše Jugoslavije",
    opis: "Srbija, Bosna in Hercegovina, Severna Makedonija, Črna gora in Kosovo — lastne znamke prek lokalnih distributerjev.",
  },
  {
    naziv: "Evropska unija in svet",
    opis: "Izključno lasten program: distributerji, private label in OEM. Naši izdelki so danes v 19 državah.",
  },
];

const zakaj = [
  ["Dobava z zaloge", "Kratek dobavni rok iz Evrope — posel dobi tisti, ki dobavi jutri."],
  ["ETA in CE", "Brez tega se v igro ne pride. Pri nas so papirji za nosilna sidra urejeni."],
  ["Fleksibilno pakiranje", "Poljubna velikost pakiranja in embalaža kupca — česar uvozniki ne zmorejo."],
  ["Prava cena", "Med azijskim uvozom in premium sistemi — natanko tam, kjer želimo biti."],
];

const pravila = [
  ["Kakovost pred hitrostjo", "Naši izdelki držijo strehe in konstrukcije. Če nekaj ni v redu, se ustavi in pove."],
  ["Dogovor je dogovor", "Rok, ki ga obljubimo kupcu, je zaveza. Če ga ne bomo zmogli, to povemo takoj."],
  ["Problem se pove takoj", "Napako je najceneje popraviti v prvi uri."],
  ["Red in varnost", "Urejeno delovno mesto je pogoj za kakovost — v proizvodnji, skladišču in pisarni."],
  ["Kupec je razlog, da smo tu", "Vsako delovno mesto pri nas je plačano iz naročila kupca."],
];



// Ena mešana galerija: ljudje, proizvodnja in skladišče prepleteni.
const prepleti = (...l) => Array.from({ length: Math.max(...l.map((x) => x.length)) }, (_, i) => l.map((x) => x[i])).flat().filter(Boolean);
const vel = (x) => ({ ...x, vel: true });
const FOTO_O_NAS = prepleti(
  FOTO_EKIPA.map((x, i) => ([2, 4, 8].includes(i) ? vel(x) : x)),
  [...FOTO_SIDRA.slice(1, 4), ...FOTO_VIJAKI.slice(0, 3), FOTO_MONTAZA[0]],
  FOTO_SKLADISCE.filter((_, i) => i % 2 === 0),
  [FOTO_ZEBLJI[0], FOTO_ZEBLJI[8], FOTO_MONTAZA[5], FOTO_VIJAKI[7]],
);

export default function ONas() {
  return (
    <>
      {/* Glava */}
      <section className="zn-hero antracit">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / O nas
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Podjetje</span>
            <h1>Pritrdilna tehnika iz Slovenije — od leta 1993</h1>
            <p>
              AS system je slovensko družinsko podjetje z lastno proizvodnjo.
              Jeklena sidra, zidne vložke in udarne vijake razvijamo, izdelamo in
              zapakiramo sami — v Šmarju pri Jelšah in Bistrici ob Sotli.
            </p>
            <ul className="zn-znacke">
              <li>Od 1993</li>
              <li>Lastna proizvodnja</li>
              <li>ETA · CE</li>
              <li>ISO 9001</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#kontakti">Kontakti</a>
              <a className="b b-o" href="#lokacije">Kje smo</a>
            </div>
          </div>
          <div className="zn-slika">
            <Image
              src="/slike/o-nas/asfix-skatla.webp"
              alt="Škatla ASfix iz lastne proizvodnje AS system"
              width={1400}
              height={1047}
              priority
              sizes="(max-width: 1000px) 90vw, 620px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* Na kratko */}
      <section className="sec">
        <div className="w">
          <div className="on-kratko">
            <div className="st" style={{ marginBottom: 0 }}>
              <span>Kdo smo</span>
              <h2>Družinsko podjetje z lastno proizvodnjo</h2>
              <p>
                AS system sta leta 1993 ustanovila Aleš in Cvetka Seidl. Ime
                združuje priimek ustanovitelja in besedo »system« — sistematičen
                pristop k pritrjevanju je od prvega dne jedro tega, kar delamo.
                Danes v podjetju delajo tudi njuni otroci, vsak na svojem
                področju.
              </p>
              <p style={{ marginTop: 12 }}>
                Smo proizvajalec in hkrati veletrgovec. Jeklena sidra, udarne
                vijake, zidne vložke in perforiran trak izdelamo sami — ne uvažamo jih. Na
                slovenskem trgu kupcu pokrijemo celoten program: od DIN vijakov,
                matic in podložk do sider, vložkov in žebljev, pri enem
                dobavitelju.
              </p>
              <p style={{ marginTop: 12 }}>
                Ker so odločitve pri nas sprejete hitro in na enem mestu, odgovornost
                pa ni anonimna, smo lahko hitrejši in prilagodljivejši od velikih
                koncernov.
              </p>
            </div>
            <dl className="on-nums">
              {stevilke.map(([v, k]) => (
                <div key={k}>
                  <dt>{v}</dt>
                  <dd>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Kaj izdelamo sami */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Lastna proizvodnja</span>
            <h2>Kaj izdelamo sami</h2>
            <p>
              Štiri skupine izdelkov so v celoti naše — od razvoja in postopka do
              proizvodnje in pakiranja. Vse so na voljo tudi pod vašo blagovno
              znamko.
            </p>
          </div>
          <div className="on-izd stiri">
            {izdelki.map((i) => (
              <Link key={i.naziv} href={i.pot} className="on-izd-k">
                <div className="on-izd-im">
                  <Image src={i.slika} alt={i.naziv} width={600} height={160} sizes="400px" />
                </div>
                <b>{i.naziv}</b>
                <em>{i.oznaka}</em>
                <p>{i.opis}</p>
              </Link>
            ))}
          </div>
          <div className="on-dodatno">
            <div>
              <b>Vijaki po naročilu</b>
              <p>Od leta 2015 izdelujemo vijake po risbi kupca — dimenzije od M3×4 do M16×180.</p>
              <Link className="more" href="/vijaki-po-narocilu">Več →</Link>
            </div>
            <div>
              <b>Private label</b>
              <p>Naše izdelke zapakiramo v vašo embalažo, s vašo etiketo in EAN kodo.</p>
              <Link className="more" href="/private-label">Več →</Link>
            </div>
            <div>
              <b>Veletrgovina</b>
              <p>DIN vijaki, matice, podložke in navojne palice — pocinkano ter inox A2 in A4.</p>
              <Link className="more" href="/asco">Program ASco →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Strojni park */}
      <section className="on-stroji">
        <div className="w">
          <div className="st">
            <span>Strojni park</span>
            <h2>Proizvodno podjetje, ne trgovina s skladiščem</h2>
            <p>
              Stroji, orodja in ljudje, ki jih znajo voditi. Lastno pakiranje
              pomeni, da kupcu ponudimo poljubno velikost pakiranja — tudi v
              njegovi embalaži.
            </p>
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

      <section className="sec grey" id="foto">
        <div className="w">
          <div className="st">
            <span>Spoznajte nas</span>
            <h2>Ljudje in prostori za našimi izdelki</h2>
            <p>Ekipa, ki odgovori na vaš klic, nastavi stroj in pripravi vaše naročilo. Tako je videti dan v AS systemu — kliknite sliko za povečavo.</p>
          </div>
          <FotoGalerija
            max={20}
            kolaz
            skupine={[
              { naziv: "Spoznajte nas", slike: FOTO_O_NAS },
            ]}
          />
        </div>
      </section>

      {/* Zaloga in kakovost */}
      <section className="sec">
        <div className="w">
          <div className="on-kratko" style={{ alignItems: "start" }}>
            <div>
              <div className="st">
                <span>Zaloga in kakovost</span>
                <h2>Na zalogi in s papirji</h2>
                <p>
                  Dve stvari odločata, ali nas kupec izbere: ali imamo izdelek na
                  zalogi in ali zanj obstajajo papirji. Oboje imamo. Osnovni
                  asortiment je v visokoregalnem skladišču v Šmarju pri Jelšah in
                  ga odpremimo takoj.
                </p>
              </div>
              <dl className="on-nums">
                {zaloga.map(([v, k]) => (
                  <div key={k}>
                    <dt>{v}</dt>
                    <dd>{k}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="on-cert">
              {certifikati.map(([oz, naziv, opis]) => (
                <div key={oz}>
                  <b>{oz}</b>
                  <div>
                    <strong>{naziv}</strong>
                    <p>{opis}</p>
                  </div>
                </div>
              ))}
              <Link className="more" href="/kakovost" style={{ marginTop: 8 }}>
                Več o kakovosti →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trgi */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Kje prodajamo</span>
            <h2>Trije krogi trga</h2>
            <p>Doma smo proizvajalec in veletrgovec, v tujini proizvajalec. Vsak trg dobi ponudbo, s katero na njem lahko zmagamo.</p>
          </div>
          <div className="on-trgi">
            {trgi.map((t, i) => (
              <div key={t.naziv}>
                <i>{i + 1}</i>
                <b>{t.naziv}</b>
                <p>{t.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zakaj mi */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Zakaj AS system</span>
            <h2>Zanesljiva evropska alternativa</h2>
            <p>
              Ne posnemamo velikih koncernov. Smo hitrejši,
              prilagodljivejši in dostopnejši — za kupce, ki iščejo izhod iz
              odvisnosti od azijskih dobaviteljev.
            </p>
          </div>
          <div className="on-zakaj">
            {zakaj.map(([n, o]) => (
              <div key={n}>
                <b>{n}</b>
                <p>{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pravila hiše */}
      <section className="on-pravila">
        <div className="w">
          <div className="st">
            <span>Kako delamo</span>
            <h2>Pet pravil hiše</h2>
            <p>Veljajo za vse — od direktorja navzdol.</p>
          </div>
          <ol>
            {pravila.map(([n, o]) => (
              <li key={n}>
                <b>{n}</b>
                <p>{o}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <KogaPoklicem />
      <TerenKomercialisti />
      <KontaktiOddelki />
      <Lokacije />

      <div className="cta">
        <div className="w">
          <div>
            <h2>Pišite nam</h2>
            <p>Pošljite povpraševanje — odgovorimo v enem delovnem dnevu.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=o-nas">
            Povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}
