import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";
import PotiProdaje from "@/components/PotiProdaje";

export const metadata = {
  title: "Private label — pritrdila pod vašo blagovno znamko",
  description:
    "Sidra, vložke in udarne vijake iz lastne proizvodnje zapakiramo v vrečke in škatle z vašim logotipom. Private label za trgovske verige, distributerje in blagovne znamke.",
  alternates: { canonical: "/private-label" },
};

// Izdelki iz lastne proizvodnje, ki jih ponujamo pod znamko kupca
const izdelki = [
  { naziv: "Jeklena sidra", primer: "npr. TXH7 z oceno ETA", slika: "/slike/AF_TXH7.jpeg", pot: "/program/pritrdila-za-beton" },
  { naziv: "Udarni vijaki", primer: "z najlonskim vložkom", slika: "/slike/Udarni_vijak_AS.jpeg", pot: "/program/klasicna-pritrdila" },
  { naziv: "Zidni vložki", primer: "za polne in votle materiale", slika: "/slike/Vlozek_za_zid_AS.jpeg", pot: "/program/klasicna-pritrdila" },
  { naziv: "Vložki za mavčne plošče", primer: "kovinski in plastični", slika: "/slike/Vlozek_GIPS_kovinski.jpeg", pot: "/program/pritrdila-za-suhomontazo" },
];

const koraki = [
  ["Izbira izdelkov", "Iz našega programa izberete izdelke in dimenzije. Svetujemo, kaj se na vašem trgu prodaja."],
  ["Vaša embalaža", "Vrečke z izveskom ali škatle z vašim logotipom in celostno podobo. Grafično predlogo pripravimo mi ali jo pošljete vi."],
  ["Potrditev vzorca", "Pred serijo potrdite vzorec embalaže in označevanje — EAN, šifre, opozorila, ETA."],
  ["Proizvodnja in pakiranje", "Izdelke izdelamo v lastni proizvodnji in jih avtomatsko zapakiramo v vašo embalažo."],
  ["Paletna dobava", "Odprema iz visokoregalnega skladišča v Šmarju pri Jelšah, za trg v Sloveniji ali v tujini."],
  ["Ponovna naročila", "Embalaža in šifre ostanejo shranjene, zato je vsako naslednje naročilo hitro."],
];

export default function PrivateLabel() {
  return (
    <>
      <NaslovStrani
        oznaka="Pod vašo znamko"
        naslov="Private label"
        opis="Naši izdelki iz lastne proizvodnje, zapakirani v vašo embalažo."
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj to pomeni</span>
                <h2>Naš izdelek, vaša blagovna znamka</h2>
                <p>
                  Trgovskim verigam, distributerjem in blagovnim znamkam ponujamo pritrdila iz naše proizvodnje
                  pod njihovim imenom. Izdelek je preverjen in v redni proizvodnji, vi pa ga prodajate v svoji
                  embalaži.
                </p>
                <p style={{ marginTop: 12 }}>
                  Proizvodnja, pakiranje in skladišče so pri nas, zato so roki kratki, kakovost pa pod nadzorom
                  od surovine do palete.
                </p>
              </div>
              <p style={{ fontSize: 14, color: "var(--color-muted)" }}>
                Iščete vijak po svoji risbi? To je drug postopek —{" "}
                <Link href="/vijaki-po-narocilu" style={{ color: "var(--color-red)", fontWeight: 700 }}>
                  vijaki po naročilu →
                </Link>
              </p>
            </div>
            <div className="foto">
              <Image
                src="/slike/AF_TXH7_PrivateLabel_BOX.jpeg"
                alt="Škatla s sidri v embalaži naročnika"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Izdelki</span>
            <h2>Kaj lahko dobite pod svojo znamko</h2>
            <p>Izdelki iz naše proizvodnje, ki jih ponujamo kot private label. Za celoten seznam nas vprašajte.</p>
          </div>
          <div className="pl-izdelki">
            {izdelki.map((x) => (
              <Link key={x.naziv} href={x.pot} className="k">
                <div className="im">
                  <Image src={x.slika} alt={x.naziv} fill sizes="(max-width: 900px) 50vw, 300px" style={{ objectFit: "contain", padding: 16, mixBlendMode: "multiply" }} />
                </div>
                <div className="tx">
                  <h3>{x.naziv}</h3>
                  <p>{x.primer}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Potek</span>
            <h2>Od izbire do police</h2>
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

      <section className="sec grey">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="st">
                <span>Povpraševanje</span>
                <h2>Povejte, kaj bi prodajali</h2>
                <p>
                  Napišite, katere izdelke in kakšne letne količine predvidevate ter kakšno embalažo želite.
                  Pripravimo predlog asortimana, embalaže in ponudbo.
                </p>
              </div>
              <div style={{ position: "relative", aspectRatio: "1 / 1", maxWidth: 320 }}>
                <Image src="/slike/vrecka-your-brand.jpg" alt="Vrečka z znamko naročnika" fill sizes="320px" style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
              </div>
            </div>
            <ObrazecPovprasevanje
              vir="private-label"
              naslov="Povpraševanje private label"
              dodatnaPolja={[
                { oznaka: "Izdelki", namig: "npr. TXH7, udarni vijaki 6x40" },
                { oznaka: "Letne količine", namig: "npr. 20.000 kosov" },
                { oznaka: "Embalaža", moznosti: ["vrečke", "škatle", "vrečke in škatle", "še ne vem"] },
                { oznaka: "Trg", namig: "npr. Slovenija, Hrvaška, DACH" },
              ]}
              priloga="Logotip ali celostna podoba (neobvezno)"
              namig="Kaj še moramo vedeti — certifikati, jezik embalaže, rok …"
            />
          </div>
        </div>
      </section>

      <PotiProdaje izpusti="/private-label" />
    </>
  );
}
