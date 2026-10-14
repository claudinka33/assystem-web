import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";
import PotiProdaje from "@/components/PotiProdaje";
import KorakiSlike from "@/components/KorakiSlike";
import FotoGalerija from "@/components/FotoGalerija";
import { FOTO_VPN, FOTO_KOVANJE, FOTO_KAKOVOST } from "@/lib/foto";

export const metadata = {
  title: "Vijaki po naročilu — po vaši risbi",
  description:
    "Posebni vijaki po risbi ali tehnični dokumentaciji, od M3 do M16, za elektro, lesno, gradbeno in splošno industrijo. Lastna proizvodnja od leta 2015.",
  alternates: { canonical: "/vijaki-po-narocilu" },
};

const dejstva = [
  ["od 2015", "lastna proizvodnja vijakov po naročilu"],
  ["M3×4 – M16×180", "razpon dimenzij"],
  ["18", "strojev za valjanje navoja"],
  ["C10C, 20MnB4", "jekla za hladno preoblikovanje in borova jekla"],
];

const koraki = [
  ["Risba ali vzorec", "Pošljete risbo, tehnično dokumentacijo ali vzorec vijaka ter letno količino."],
  ["Pregled in ponudba", "Tehnolog preveri izvedljivost, material in površinsko zaščito. Pripravimo ponudbo z rokom."],
  ["Orodje in vzorci", "Sledita izdelava orodja in potrditev vzorcev. Vzorce preverite pri sebi."],
  ["Serijska proizvodnja", "Po potrditvi vzorcev izdelamo serijo — hladno preoblikovanje in valjanje navoja."],
  ["Kontrola kakovosti", "Dimenzijska kontrola med proizvodnjo in na koncu, z zapisom za vsako serijo."],
  ["Dobava", "Pakiranje po dogovoru in dobava na vaš naslov ali po dogovorjeni dinamiki odpoklicev."],
];

const panoge = [
  ["Elektro industrija", "vijaki za ohišja, priključke in sestave"],
  ["Lesna industrija", "vijaki za pohištvo in okovje"],
  ["Gradbeništvo", "posebni vijaki za sisteme in montažo"],
  ["Splošna industrija", "sestavni deli po risbi naročnika"],
];

export default function VijakiPoNarocilu() {
  return (
    <>
      <NaslovStrani
        oznaka="Po vaši risbi"
        naslov="Vijaki po naročilu"
        opis="Posebni vijaki po risbi ali tehnični dokumentaciji, v serijah za industrijo."
      />

      <section className="sec">
        <div className="w">
          <div className="pr-vpn">
            <div>
          <div className="st">
            <span>Kaj izdelujemo</span>
            <h2>Vijak, ki ga ni v katalogu</h2>
            <p>
              Kadar standardni vijak ne ustreza, ga izdelamo po vaši risbi: posebna glava, dolžina, navoj,
              material ali zaščita. Vijaki po naročilu niso standardni DIN vijaki — vsak je narejen za
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

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="st">
                <span>Povpraševanje</span>
                <h2>Pošljite risbo</h2>
                <p>
                  Priložite risbo ali tehnično dokumentacijo in napišite letno količino. Tehnolog jo pregleda in
                  pripravimo ponudbo. Če risbe nimate, opišite vijak ali nam pošljite vzorec.
                </p>
              </div>
            </div>
            <ObrazecPovprasevanje
              vir="vijaki-po-narocilu"
              naslov="Povpraševanje — vijak po risbi"
              dodatnaPolja={[
                { oznaka: "Letna količina", namig: "npr. 100.000 kosov" },
                { oznaka: "Material", moznosti: ["jeklo za hladno preoblikovanje", "borovo jeklo (kaljeno)", "nerjavno jeklo", "po risbi / ne vem"] },
                { oznaka: "Površinska zaščita", namig: "npr. pocinkano, črno, brez" },
                { oznaka: "Želeni rok", namig: "npr. prva serija v 8 tednih" },
              ]}
              priloga="Risba ali tehnična dokumentacija"
              namig="Namen uporabe, posebne zahteve, standard …"
            />
          </div>
        </div>
      </section>

      <PotiProdaje izpusti="/vijaki-po-narocilu" />
    </>
  );
}
