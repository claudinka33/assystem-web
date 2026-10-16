import Image from "next/image";
import Link from "next/link";
import ObrazecTrgovci from "@/components/ObrazecTrgovci";
import { site } from "@/lib/site";
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
  { m: "1 m", opis: "Glavne dimenzije za manjše trgovine in pulte.", slika: "/slike/trgovci/asfix-polica-1m-bela.jpg", w: 808, h: 1400 },
  { m: "2 m", opis: "Vse dimenzije — najpogostejša izbira.", slika: "/slike/trgovci/asfix-polica-2m-bela.jpg", w: 1092, h: 1120 },
  { m: "4 m", opis: "Več zaloge vseh dimenzij za gradbene centre.", slika: "/slike/trgovci/asfix-polica-4m-bela.jpg", w: 1400, h: 752 },
  { m: "6 m – 20 m", opis: "Večje postavitve po meri trgovine, tudi kombinacija ASfix in ASco.", slika: null },
];

const KAJ_SLIKE = ["/slike/proizvodnja/hero-izdelki.png", "/slike/trgovci/asfix-polica-2m-bela.jpg", "/slike/znamke/asfix-afr41-sredina.png", "/slike/asfix-paleta-txm2.jpg"];

const embalaza = [
  { znamka: "ASfix", slike: [["/slike/znamke/asfix-afr41-sredina.png", "Škatla ASfix", "6% 8%"], ["/slike/znamke/asfix-vrecka.jpg", "Rdeča vrečka ASfix"], ["/slike/asfix-paleta-txm2.jpg", "Paleta škatel ASfix"]], opis: "Škatle v enotnem dizajnu, vrečke z izveskom za perforirano steno in cele palete za večje trgovine." },
  { znamka: "ASco", slike: [["/slike/znamke/asco-skatla-sredina.png", "Rjava škatla ASco", "12% 22%"], ["/slike/znamke/asco-vrecka-znb.jpg", "Modra vrečka ASco"], ["/slike/znamke/asco-vrecka-inox.jpg", "Zelena vrečka ASco"]], opis: "Modre vrečke za pocinkano (ZnB), zelene za INOX — na polici se ne zamenjata. Rjave škatle za večje količine." },
  { znamka: "Silvermate", slike: [["/slike/silvermate/skatla-silvermate.png", "Škatla Silvermate", "8%"], ["/slike/silvermate/polica-1m.jpg", "Polica Silvermate 1 m", "4%"]], opis: "Lesni vijaki s križno in torx glavo, s celim ali delnim navojem — v profesionalni škatli z okencem in na polici 1 m." },
];

export default function ZaTrgovce() {
  return (
    <>
      <section className="zn-hero antracit">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Za trgovce
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Za trgovce</span>
            <h1>Polica, ki proda sama</h1>
            <p>
              Sestavimo prodajni program in postavitev police za vašo trgovino — ASfix, ASco, Silvermate ali
              kombinacijo, od 1 do 20 metrov. Vi prodajate, mi skrbimo za polico.
            </p>
            <ul className="zn-znacke">
              <li>Police 1 – 20 m</li>
              <li>Planogram po meri</li>
              <li>Zaloga takoj</li>
              <li>Dopolnjevanje</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#povprasevanje">Predlog police →</a>
              <a className="b b-o" href="#dolzine">Dolžine polic</a>
            </div>
          </div>
          <div className="zn-slika trg-hero-im">
            <Image
              src="/slike/trgovci/hero-police.jpg"
              alt="Police ASco, ASfix in Silvermate v trgovini"
              width={1997}
              height={1100}
              priority
              sizes="(max-width: 1000px) 92vw, 640px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Kaj dobite</span>
            <h2>Vse za polico na enem mestu</h2>
          </div>
          <div className="trg-kaj">
            {kajDobite.map(([n, o], i) => (
              <div key={n} className="trg-kaj-k">
                <div className="trg-kaj-im">
                  <Image src={KAJ_SLIKE[i]} alt={n} fill sizes="(max-width: 700px) 50vw, 340px" style={{ objectFit: "contain" }} />
                  <span>0{i + 1}</span>
                </div>
                <b>{n}</b>
                <p>{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey" id="dolzine">
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

      <section className="sec grey">
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
                  <div className={`trg-emb-slike${e.slike.length === 2 ? " dva" : ""}`}>
                    {e.slike.map(([src, alt, pad], i) => (
                      <div key={src} className={`trg-emb-sl${i === 0 && e.slike.length > 2 ? " glavna" : ""}`} title={alt}>
                        <Image src={src} alt={alt} fill sizes={i === 0 ? "(max-width: 900px) 90vw, 420px" : "(max-width: 900px) 45vw, 210px"} style={{ objectFit: "contain", objectPosition: "center", padding: pad ?? (i === 0 ? "14px 18px" : 10), mixBlendMode: "multiply" }} />
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

      <section id="povprasevanje" className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "start" }}>
            <div className="ot-levo">
              <div className="st">
                <span>Povpraševanje</span>
                <h2>Predlog police za vašo trgovino</h2>
                <p>Trije kratki koraki — mi pripravimo predlog programa, postavitev police in pogoje sodelovanja.</p>
              </div>
              <ol className="ot-potek">
                <li><b>Izberete program in prostor</b><span>Brez šifer in tehničnih podatkov.</span></li>
                <li><b>Pripravimo predlog</b><span>Planogram police, izbor izdelkov in cene.</span></li>
                <li><b>Postavimo polico</b><span>Dostava, postavitev in dopolnjevanje po prodaji.</span></li>
              </ol>
              <div className="ot-kontakt">
                <span>Raje pokličete?</span>
                <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <small>Odgovorimo v enem delovnem dnevu.</small>
              </div>
            </div>
            <ObrazecTrgovci />
          </div>
        </div>
      </section>
    </>
  );
}
