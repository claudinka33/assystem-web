import Image from "next/image";
import Link from "next/link";
import VideoOzadje from "@/components/VideoOzadje";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";
import PotiProdaje from "@/components/PotiProdaje";
import KorakiSlike from "@/components/KorakiSlike";
import FotoGalerija from "@/components/FotoGalerija";
import { FOTO_VPN, FOTO_KOVANJE, FOTO_KAKOVOST } from "@/lib/foto";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = {
  title: "Bespoke: izdelava po meri",
  description:
    "Izdelava po meri v lastni proizvodnji: vijaki po vaši skici ali risbi (M3 do M16) ter sidra, udarni vijaki, zidni vložki in perforiran trak v vaši izvedbi. Pošljite skico.",
  alternates: { canonical: "/bespoke" },
};

// Kaj izdelamo po meri
const kaj = [
  {
    naziv: "Vijaki po vaši risbi",
    opis: "Posebna glava, dolžina, navoj, material ali zaščita. Vijak, ki ga ni v katalogu, izdelan za vaš izdelek.",
    slika: "/slike/poti/vijaki-po-narocilu.jpg",
  },
  {
    naziv: "Naši izdelki v vaši izvedbi",
    opis: "Jeklena sidra, udarni vijaki, zidni vložki in perforiran trak v dimenziji, materialu ali pakiranju, ki ga potrebujete.",
    slika: "/slike/proizvodnja/hero-izdelki.png",
  },
  {
    naziv: "V vaši embalaži",
    opis: "Pakiranje v nevtralne bele škatle z vašo nalepko ali v embalažo z vašim logotipom (private label).",
    slika: "/slike/znamke/asfix-afr41-private-label.png",
  },
];

const dejstva = [
  ["od 2015", "lastna proizvodnja vijakov po naročilu"],
  ["M3×4 – M16×180", "razpon dimenzij"],
  ["18", "strojev za valjanje navoja"],
  ["C10C, 20MnB4", "jekla za hladno preoblikovanje in borova jekla"],
];

const koraki = [
  ["Skica, risba ali vzorec", "Pošljete skico, risbo, tehnično dokumentacijo ali vzorec ter letno količino."],
  ["Pregled in ponudba", "Tehnolog preveri izvedljivost, material in površinsko zaščito. Pripravimo ponudbo z rokom."],
  ["Orodje in vzorci", "Sledita izdelava orodja in potrditev vzorcev. Vzorce preverite pri sebi."],
  ["Serijska proizvodnja", "Po potrditvi vzorcev izdelamo serijo, hladno preoblikovanje in valjanje navoja."],
  ["Kontrola kakovosti", "Dimenzijska kontrola med proizvodnjo in na koncu, z zapisom za vsako serijo."],
  ["Dobava", "Pakiranje po dogovoru in dobava na vaš naslov ali po dogovorjeni dinamiki odpoklicev."],
];

const panoge = [
  ["Elektro industrija", "vijaki za ohišja, priključke in sestave"],
  ["Lesna industrija", "vijaki za pohištvo in okovje"],
  ["Gradbeništvo", "posebni vijaki za sisteme in montažo"],
  ["Splošna industrija", "sestavni deli po risbi naročnika"],
];

function Bespoke() {
  return (
    <>
      <section className="zn-hero antracit zn-video">
        <VideoOzadje src="/videi/proizvodnja-hero.mp4" poster="/slike/proizvodnja/hero-video-poster.jpg" />
        <div className="vid-tema" aria-hidden="true" />
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Bespoke
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Bespoke manufacturing</span>
            <h1>Izdelava po meri</h1>
            <p>
              Prinesite skico ali risbo, mi izdelamo. Vijake po vaši risbi ter sidra, udarne vijake, zidne
              vložke in perforiran trak v vaši izvedbi izdelamo v lastni proizvodnji v Sloveniji, od vzorca do serije.
            </p>
            <ul className="zn-znacke">
              <li>Po vaši skici ali risbi</li>
              <li>Lastna proizvodnja</li>
              <li>Od vzorca do serije</li>
              <li>Vaša embalaža</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#povprasevanje">Pošljite skico</a>
              <Link className="b b-o" href="/proizvodnja">Naša proizvodnja</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Kaj izdelamo po meri</span>
            <h2>Vse na enem mestu</h2>
            <p>Standardno iz zaloge ali po vaših merah: en dobavitelj za serijo, vzorce in embalažo.</p>
          </div>
          <div className="bs-kaj">
            {kaj.map((x) => (
              <div key={x.naziv} className="bs-k">
                <div className="bs-im">
                  <Image src={x.slika} alt={x.naziv} fill sizes="(max-width: 900px) 100vw, 400px" style={{ objectFit: "contain" }} />
                </div>
                <h3>{x.naziv}</h3>
                <p>{x.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="pr-vpn">
            <div>
          <div className="st">
            <span>Vijaki po risbi</span>
            <h2>Vijak, ki ga ni v katalogu</h2>
            <p>
              Kadar standardni vijak ne ustreza, ga izdelamo po vaši risbi: posebna glava, dolžina, navoj,
              material ali zaščita. Vijaki po naročilu niso standardni DIN vijaki, vsak je narejen za
              konkreten izdelek naročnika.
            </p>
          </div>
          <div className="dejstva">
            {dejstva.map(([b, s]) => (
              <div key={b}>
                <b>{b}</b>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 18, fontSize: 14, color: "var(--color-muted)" }}>
            Iščete standardne vijake po DIN? Ti so v programu{" "}
            <Link href="/asco" style={{ color: "var(--color-red)", fontWeight: 700 }}>ASco →</Link>
          </p>
            </div>
            <KorakiSlike
              koraki={[
                { naslov: "Risba", podnaslov: "Korak 1", opis: "Vaša risba ali tehnična dokumentacija.", slika: "/slike/foto/vpn-risba.jpg", alt: "Tehnična risba vijaka" },
                { naslov: "Vzorci", podnaslov: "Korak 2", opis: "Izdelava orodja in potrditev vzorcev.", slika: "/slike/foto/proizvodnja-09.jpg", alt: "Prvi kosi iz novega orodja" },
                { naslov: "Serija", podnaslov: "Korak 3", opis: "Hladno preoblikovanje in valjanje navoja.", slika: "/slike/foto/proizvodnja-06.jpg", alt: "Valjanje navoja" },
                { naslov: "Kontrola", podnaslov: "Korak 4", opis: "Dimenzijska kontrola z zapisom za vsako serijo.", slika: "/slike/foto/kakovost-04.jpg", alt: "Optično merjenje vijaka" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Potek</span>
            <h2>Od risbe do serije</h2>
          </div>
          <div className="koraki-st">
            {koraki.map(([naziv, opis], i) => (
              <div key={naziv}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <h3>{naziv}</h3>
                <p>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Iz proizvodnje</span>
            <h2>Primeri in proizvodnja</h2>
            <p>Nekaj vijakov, ki smo jih izdelali po risbah naročnikov, in pogled v proizvodnjo. Kliknite sliko za povečavo.</p>
          </div>
          <FotoGalerija
            skupine={[
              { naziv: "Primeri vijakov", slike: FOTO_VPN },
              { naziv: "Proizvodnja", slike: FOTO_KOVANJE.slice(0, 9) },
              { naziv: "Kontrola", slike: FOTO_KAKOVOST.filter((x) => !/sidr/i.test(x.alt)) },
            ]}
          />
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Za koga</span>
            <h2>Panoge, za katere delamo</h2>
          </div>
          <div className="kats">
            {panoge.map(([n, o]) => (
              <div key={n} className="k" style={{ padding: "22px 22px" }}>
                <h3>{n}</h3>
                <p style={{ marginTop: 8 }}>{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="povprasevanje">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="st">
                <span>Povpraševanje</span>
                <h2>Pošljite skico</h2>
                <p>
                  Priložite skico, risbo ali tehnično dokumentacijo in napišite letno količino. Tehnolog jo pregleda in
                  pripravimo ponudbo. Če risbe nimate, opišite izdelek ali nam pošljite vzorec.
                </p>
              </div>
            </div>
            <ObrazecPovprasevanje
              vir="bespoke"
              naslov="Povpraševanje: izdelava po meri"
              dodatnaPolja={[
                { oznaka: "Izdelek", moznosti: ["vijak po risbi", "jekleno sidro", "udarni vijak", "zidni vložek", "perforiran trak", "drugo"] },
                { oznaka: "Letna količina", namig: "npr. 100.000 kosov" },
                { oznaka: "Material", moznosti: ["jeklo za hladno preoblikovanje", "borovo jeklo (kaljeno)", "nerjavno jeklo", "po risbi / ne vem"] },
                { oznaka: "Površinska zaščita", namig: "npr. pocinkano, črno, brez" },
                { oznaka: "Želeni rok", namig: "npr. prva serija v 8 tednih" },
              ]}
              priloga="Skica, risba ali tehnična dokumentacija"
              namig="Namen uporabe, posebne zahteve, standard …"
            />
          </div>
        </div>
      </section>

      <PotiProdaje izpusti="/bespoke" />
    </>
  );
}

export default prevedenaStran(Bespoke);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
