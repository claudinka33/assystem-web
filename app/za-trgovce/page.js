import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import PolicaAsfix from "@/components/PolicaAsfix";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";
import { ZNAMKE_INFO } from "@/lib/znamke";

export const metadata = {
  title: "Za trgovce — prodajni program in police",
  description:
    "Sestava prodajnega programa in postavitev polic ASfix in ASco za trgovine: 1, 2, 4 in 6 metrov ter večje postavitve do 20 metrov.",
  alternates: { canonical: "/za-trgovce" },
};

const kajDobite = [
  ["Sestava programa", "Izberemo izdelke in dimenzije, ki se pri vas prodajajo — glede na kupce in velikost trgovine."],
  ["Postavitev police", "Planogram za vašo širino police, s cenovnimi letvicami in tablo, ki kupcu pove, kaj je za kaj."],
  ["Embalaža za polico", "Vrečke z izveskom za perforirano steno in škatle z jasno šifro in dimenzijo na čelu."],
  ["Dopolnjevanje", "Osnovni asortiman je na zalogi. Polico dopolnjujemo po vaši prodaji."],
];

const dolzine = [
  { m: "1 m", opis: "Glavne dimenzije za manjše trgovine in pulte.", slika: "/slike/trgovci/asfix-polica-1m.jpg", w: 808, h: 1400 },
  { m: "2 m", opis: "Vse dimenzije — najpogostejša izbira.", slika: "/slike/trgovci/asfix-polica-2m.jpg", w: 1092, h: 1120 },
  { m: "4 m", opis: "Več zaloge vseh dimenzij za gradbene centre.", slika: "/slike/trgovci/asfix-polica-4m.jpg", w: 1400, h: 752 },
  { m: "6 m – 20 m", opis: "Večje postavitve po meri trgovine, tudi kombinacija ASfix in ASco.", slika: null },
];

const embalaza = [
  { znamka: "ASfix", slike: [["/slike/znamke/asfix-afr41.png", "Škatla ASfix"], ["/slike/znamke/asfix-vrecka.jpg", "Rdeča vrečka ASfix"]], opis: "Škatle v enotnem dizajnu in vrečke z izveskom za perforirano steno." },
  { znamka: "ASco", slike: [["/slike/znamke/asco-vrecka-znb.jpg", "Modra vrečka ASco"], ["/slike/znamke/asco-vrecka-inox.jpg", "Zelena vrečka ASco"]], opis: "Modre vrečke za pocinkano (ZnB), zelene za INOX — na polici se ne zamenjata. Škatle za večje količine." },
  { znamka: "Silvermate", slike: [["/slike/silvermate/silvermate-vijaka.jpg", "Lesni vijaki Silvermate"]], opis: "Lesni vijaki s križno in torx glavo, s celim ali delnim navojem." },
];

export default function ZaTrgovce() {
  return (
    <>
      <NaslovStrani
        oznaka="Za trgovce"
        naslov="Program in police za trgovino"
        opis="Sestavimo prodajni program in postavitev police — ASfix, ASco ali kombinacijo obeh, od 1 do 20 metrov."
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Kaj dobite</span>
            <h2>Polica, ki proda sama</h2>
          </div>
          <div className="who c4">
            {kajDobite.map(([n, o]) => (
              <div key={n}>
                <b>{n}</b>
                <p>{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Dolžine postavitev</span>
            <h2>Od enega do dvajset metrov</h2>
            <p>Postavitev prilagodimo trgovini. Spodaj so primeri police ASfix; ASco in kombinirane postavitve pripravimo enako.</p>
          </div>
          <div className="kats">
            {dolzine.map((d) => (
              <div key={d.m} className="k">
                <div className="im" style={{ height: 240, background: d.slika ? "#fff" : undefined }}>
                  {d.slika ? (
                    <Image src={d.slika} alt={`Polica ASfix ${d.m}`} fill sizes="(max-width: 700px) 50vw, 320px" style={{ objectFit: "contain", padding: 10 }} />
                  ) : (
                    <div className="trg-vec">
                      <b>do 20 m</b>
                      <span>po meri</span>
                    </div>
                  )}
                </div>
                <div className="tx">
                  <h3>{d.m}</h3>
                  <p>{d.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Polica ASfix</span>
            <h2>Poglejte, kako izgleda pri vas</h2>
            <p>Izberite širino. Polica je visoka 2 m: zgoraj tabla, na perforirani steni vrečke, spodaj škatle s cenovnimi letvicami.</p>
          </div>
          <PolicaAsfix />
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="stojalo">
            <div className="stojalo-im">
              <Image
                src="/slike/znamke/asco-stojalo.jpg"
                alt="Stojalo ASco z modrimi in zelenimi vrečkami"
                width={672}
                height={1568}
                sizes="(max-width: 900px) 360px, 420px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div>
              <div className="st" style={{ marginBottom: 0 }}>
                <span>ASco</span>
                <h2>Polica in stojalo za vijake</h2>
                <p>
                  Kovinski in lesni vijaki v modrih (ZnB) in zelenih (INOX) vrečkah. Police 1, 2, 4 in 6 m — pocinkano
                  in nerjavno sta vedno na ločenih modulih — ali samostoječe stojalo s tremi stranicami.
                </p>
              </div>
              <div className="zn-gumbi">
                <Link className="b b-r" href="/asco">
                  Program ASco
                </Link>
                <Link className="b b-d" href="#povprasevanje">
                  Želim stojalo ali polico
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Embalaža</span>
            <h2>Kako so znamke predstavljene na polici</h2>
          </div>
          <div className="trg-emb">
            {embalaza.map((e) => {
              const z = ZNAMKE_INFO[e.znamka];
              return (
                <div key={e.znamka} className="trg-emb-k">
                  <Image src={z.logo} alt={z.ime} width={z.w} height={z.h} className="trg-emb-logo" />
                  <div className="trg-emb-slike">
                    {e.slike.map(([src, alt]) => (
                      <div key={src} className="trg-emb-sl">
                        <Image src={src} alt={alt} fill sizes="200px" style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
                      </div>
                    ))}
                  </div>
                  <p>{e.opis}</p>
                  <Link className="more" href={z.pot}>
                    Več o znamki {z.ime} →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="povprasevanje" className="sec grey">
        <div className="w">
          <div className="qua" style={{ alignItems: "start" }}>
            <div className="st">
              <span>Povpraševanje</span>
              <h2>Predlog police za vašo trgovino</h2>
              <p>
                Napišite, koliko prostora imate in kaj prodajate. Pripravimo predlog programa, postavitev police in
                pogoje sodelovanja.
              </p>
            </div>
            <ObrazecPovprasevanje
              vir="za-trgovce"
              naslov="Povpraševanje za trgovce"
              dodatnaPolja={[
                { oznaka: "Program", moznosti: ["ASfix", "ASco", "ASfix in ASco", "še ne vem"] },
                { oznaka: "Dolžina police", moznosti: ["1 m", "2 m", "4 m", "6 m", "več kot 6 m", "stojalo", "še ne vem"] },
                { oznaka: "Trgovina in kraj", namig: "npr. Gradbeni center, Celje" },
              ]}
              namig="Kaj še moramo vedeti — kupci, obstoječa polica, rok …"
            />
          </div>
        </div>
      </section>
    </>
  );
}
