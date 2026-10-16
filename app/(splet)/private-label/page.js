import Image from "next/image";
import Link from "next/link";
import KorakiSlike from "@/components/KorakiSlike";
import ObrazecPrivateLabel from "@/components/ObrazecPrivateLabel";
import PotiProdaje from "@/components/PotiProdaje";
import { site } from "@/lib/site";

export const metadata = {
  title: "Private label — pritrdila pod vašo blagovno znamko",
  description:
    "Montaža in pakiranje pod vašo blagovno znamko: v nevtralne bele škatle ali v embalažo z vašo celostno podobo. Private label za trgovske verige, distributerje in blagovne znamke.",
  alternates: { canonical: "/private-label" },
};

const pas = [
  ["30+", "Let izkušenj s pritrdili"],
  ["7", "Avtomatskih montažnih linij"],
  ["1.400", "Paletnih mest v skladišču"],
  ["ETA · CE", "Dokumentacija za vaša sidra"],
];

// Izdelki iz lastne proizvodnje, ki jih ponujamo pod znamko kupca
const izdelki = [
  { naziv: "Jeklena sidra", primer: "TXH7 z evropsko tehnično oceno", slika: "/slike/asfix/txh7.png", pot: "/program/pritrdila-za-beton" },
  { naziv: "Udarni vijaki", primer: "Z najlonskim vložkom", slika: "/slike/o-nas/udarni-vodoravno.png", pot: "/program/klasicna-pritrdila" },
  { naziv: "Zidni vložki", primer: "Za polne in votle materiale", slika: "/slike/asfix/mq.png", pot: "/program/klasicna-pritrdila" },
  { naziv: "Vložki za mavčne plošče", primer: "Kovinski in plastični", slika: "/slike/asfix/gips-kov.png", pot: "/program/pritrdila-za-suhomontazo" },
];

const embalaza = [
  { naziv: "Bela nevtralna škatla", opis: "Najhitrejša pot na trg — vaša nalepka z EAN in šifro.", slika: "/slike/skatla-private-label.jpg" },
  { naziv: "Škatla z vašo podobo", opis: "Vaš logotip, barve in jezik — v enotni družini škatel.", slika: "/slike/asfix/afr41-pl.png" },
  { naziv: "Vrečka z vašo podobo", opis: "Z izveskom za perforirano steno v trgovini.", slika: "/slike/vrecka-your-brand.jpg" },
];

const koraki = [
  ["Izbira izdelkov", "Iz našega programa izberete izdelke in dimenzije. Svetujemo, kaj se na vašem trgu prodaja."],
  ["Vaša embalaža", "Nevtralna bela ali z vašo podobo. Grafično predlogo pripravimo mi ali jo pošljete vi."],
  ["Potrditev vzorca", "Pred serijo potrdite vzorec embalaže in označevanje — EAN, šifre, opozorila, ETA."],
  ["Proizvodnja in pakiranje", "Izdelamo v lastni proizvodnji in avtomatsko zapakiramo v vašo embalažo."],
  ["Paletna dobava", "Odprema iz visokoregalnega skladišča v Šmarju pri Jelšah — doma in v tujino."],
  ["Ponovna naročila", "Embalaža in šifre ostanejo shranjene, zato je vsako naslednje naročilo hitro."],
];

export default function PrivateLabel() {
  return (
    <>
      {/* Glava */}
      <section className="zn-hero antracit">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Private label
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Private label</span>
            <h1>Vaša znamka. Naša proizvodnja.</h1>
            <p>
              Sidra, udarne vijake in vložke iz naše proizvodnje zapakiramo pod vašo blagovno znamko — v nevtralne
              bele škatle ali v embalažo z vašo celostno podobo. Za trgovske verige, distributerje in blagovne znamke.
            </p>
            <ul className="zn-znacke">
              <li>Lastna proizvodnja</li>
              <li>Vaša embalaža</li>
              <li>EAN in ETA</li>
              <li>Doma in v tujino</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#povprasevanje">Pošljite povpraševanje →</a>
              <a className="b b-o" href="#potek">Kako poteka</a>
            </div>
          </div>
          <div className="zn-slika trg-hero-im">
            <Image
              src="/slike/pl-hero.jpg"
              alt="Škatla in vrečka private label z jeklenim sidrom"
              width={1600}
              height={1100}
              priority
              sizes="(max-width: 1000px) 92vw, 640px"
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

      {/* Naš izdelek → vaša znamka */}
      <section className="sec">
        <div className="w">
          <div className="st pl-sredina">
            <span>Kaj to pomeni</span>
            <h2>Isti izdelek, vaša škatla</h2>
            <p>
              Izdelek je preverjen in v redni proizvodnji. Zamenjamo samo embalažo — kakovost, dokumentacija in roki
              ostanejo naši.
            </p>
          </div>
          <div className="pl-pret">
            <div className="pl-pret-k">
              <div className="pl-pret-im">
                <Image src="/slike/asfix/afr41.png" alt="Škatla ASfix" fill sizes="(max-width: 800px) 90vw, 460px" style={{ objectFit: "contain" }} />
              </div>
              <small>Naš izdelek</small>
              <b>Proizveden in preverjen pri nas</b>
            </div>
            <div className="pl-pret-pu" aria-hidden="true">
              <span>→</span>
            </div>
            <div className="pl-pret-k on">
              <div className="pl-pret-im">
                <Image src="/slike/asfix/afr41-pl.png" alt="Škatla private label" fill sizes="(max-width: 800px) 90vw, 460px" style={{ objectFit: "contain" }} />
              </div>
              <small>Vaša znamka</small>
              <b>Na polici pod vašim imenom</b>
            </div>
          </div>
          <p className="pl-opomba">
            Iščete vijak po svoji risbi? To je drug postopek —{" "}
            <Link href="/vijaki-po-narocilu">vijaki po naročilu →</Link>
          </p>
        </div>
      </section>

      {/* Izdelki */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Izdelki</span>
            <h2>Kaj lahko dobite pod svojo znamko</h2>
            <p>Izdelki iz naše proizvodnje. Za celoten seznam nas vprašajte.</p>
          </div>
          <div className="trg-kaj">
            {izdelki.map((x, i) => (
              <Link key={x.naziv} href={x.pot} className="trg-kaj-k" style={{ textDecoration: "none" }}>
                <div className="trg-kaj-im">
                  <Image src={x.slika} alt={x.naziv} fill sizes="(max-width: 700px) 50vw, 340px" style={{ objectFit: "contain" }} />
                  <span>0{i + 1}</span>
                </div>
                <b>{x.naziv}</b>
                <p>{x.primer}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Embalaža */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Embalaža</span>
            <h2>Trije načini, ena kakovost</h2>
            <p>Izberete embalažo, ki ustreza vašemu trgu in prodajnemu mestu.</p>
          </div>
          <div className="pl-emb">
            {embalaza.map((e) => (
              <div key={e.naziv} className="pl-emb-k">
                <div className="pl-emb-im">
                  <Image src={e.slika} alt={e.naziv} fill sizes="(max-width: 900px) 90vw, 420px" style={{ objectFit: "contain" }} />
                </div>
                <b>{e.naziv}</b>
                <p>{e.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Potek */}
      <section className="sec grey" id="potek">
        <div className="w">
          <div className="st">
            <span>Potek</span>
            <h2>Od izbire do police</h2>
          </div>
          <div className="pl-potek">
            <ol className="ot-potek">
              {koraki.map(([n, o]) => (
                <li key={n}>
                  <b>{n}</b>
                  <span>{o}</span>
                </li>
              ))}
            </ol>
            <KorakiSlike
              href="/proizvodnja#foto"
              gumb="Poglejte proizvodnjo →"
              koraki={[
                { naslov: "Kovanje", podnaslov: "Proizvodnja", opis: "Sidra in vijaki iz hladnega kovanja.", slika: "/slike/foto/proizvodnja-13.jpg", alt: "Vijaki iz hladnega kovanja" },
                { naslov: "Brizganje", podnaslov: "Proizvodnja", opis: "Najlonski vložki iz lastne proizvodnje.", slika: "/slike/foto/plastika-03.jpg", alt: "Zidni vložki na tekočem traku" },
                { naslov: "Kontrola", podnaslov: "Kakovost", opis: "Preizkusi in meritve vsake serije.", slika: "/slike/foto/kakovost-04.jpg", alt: "Optično merjenje vijaka" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Povpraševanje */}
      <section id="povprasevanje" className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "start" }}>
            <div className="ot-levo">
              <div className="st">
                <span>Povpraševanje</span>
                <h2>Povejte, kaj bi prodajali</h2>
                <p>Trije kratki koraki — pripravimo predlog asortimana, embalaže in ponudbo.</p>
              </div>
              <div className="ot-kontakt">
                <span>Raje pokličete?</span>
                <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <small>Odgovorimo v enem delovnem dnevu.</small>
              </div>
            </div>
            <ObrazecPrivateLabel />
          </div>
        </div>
      </section>

      <PotiProdaje izpusti="/private-label" />
    </>
  );
}
