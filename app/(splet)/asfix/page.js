import Image from "next/image";
import Link from "next/link";
import IgraSidranje from "@/components/IgraSidranje";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";
import PotiProdaje from "@/components/PotiProdaje";
import FotoGalerija from "@/components/FotoGalerija";
import { FOTO_SIDRA, FOTO_MONTAZA, FOTO_PAKIRANJE, FOTO_SKLADISCE } from "@/lib/foto";
import { pridobiIzdelkePoSlugih } from "@/lib/podatki";

export const revalidate = 300;

export const metadata = {
  title: "ASfix — blagovna znamka",
  description:
    "ASfix je blagovna znamka pritrdilne tehnike podjetja AS system: jeklena sidra, zidni vložki, udarni in Turbo vijaki, vložki za mavčne plošče in kemična sidra.",
  alternates: { canonical: "/asfix" },
};

const aduti = [
  ["Znan izvor", "ASfix je slovenska znamka podjetja AS system. Za vsak izdelek pod to znamko odgovarjamo mi — od kakovosti do dokumentacije."],
  ["Evropska dokazila", "Nosilna sidra imajo oceno ETA in izjavo o lastnostih. Trgovec lahko izdelek zagovarja pred zahtevnim kupcem."],
  ["Embalaža, ki proda", "Vrečka z izveskom, škatla z jasno šifro in dimenzijo, paletna enota za centre. V treh sekundah je jasno, kaj je notri."],
  ["Dobava iz zaloge", "Osnovni asortiman je v visokoregalnem skladišču v Šmarju. Brez čakanja na uvoz."],
];

// Izdelki ASfix — kartica vodi na stran izdelka (če je v katalogu), sicer na kategorijo.
const IZDELKI = {
  txh7: { naziv: "Jekleno sidro TXH7", opis: "Nosilno sidro za beton, z oceno ETA.", slika: "/slike/asfix/txh7.png", slug: "jekleno-sidro-txh7", skupina: "pritrdila-za-beton" },
  tx1: { naziv: "Jekleno sidro TX1", opis: "S široko podložko za les in pločevino.", slika: "/slike/asfix/tx1.png", slug: "jekleno-sidro-tx1-siroka-podlozka", skupina: "pritrdila-za-beton" },
  turbo: { naziv: "Turbo vijak za beton", opis: "Privijete neposredno v beton — brez vložka.", slika: "/slike/asfix/turbo.png", slug: "turbo-vijak-za-beton", skupina: "pritrdila-za-beton" },
  mq: { naziv: "Najlonski zidni vložek", opis: "Za beton, polno in votlo opeko.", slika: "/slike/asfix/mq.png", slug: null, skupina: "klasicna-pritrdila" },
  udarni: { naziv: "Udarni vijak", opis: "Hitra montaža brez privijanja.", slika: "/slike/asfix/udarni.png", slug: "udarni-vijak-nylon", skupina: "klasicna-pritrdila" },
  afrk: { naziv: "Univerzalni vijak z vložkom", opis: "Dolg vložek z vijakom za okvirje in late.", slika: "/slike/asfix/afrk.png", slug: "univerzalni-vijak-z-vlozkom-af-rk", skupina: "pritrdila-za-v-votle-stene" },
  gips: { naziv: "Vložek za mavčne plošče", opis: "Samorezni vložek za suhomontažo.", slika: "/slike/asfix/gips.png", slug: null, skupina: "pritrdila-za-suhomontazo" },
  gipsKov: { naziv: "Kovinski vložek za gips", opis: "Se za ploščo razpre — za težje predmete.", slika: "/slike/asfix/gips-kov.png", slug: "vlozek-za-gips-kovinski", skupina: "pritrdila-za-suhomontazo" },
  stiropor: { naziv: "Vložek za stiropor", opis: "Za pritrjevanje v toplotno izolacijo.", slika: "/slike/asfix/stiropor.png", slug: "vlozek-za-stiropor", skupina: "pritrdila-za-v-izolacijo" },
  easf: { naziv: "Kemično sidro EASF", opis: "Za največje obremenitve v betonu.", slika: "/slike/asfix/easf.png", slug: "kemicno-sidro-easf-top", skupina: "kemicna-pritrditev" },
  pesf: { naziv: "Kemično sidro PESF", opis: "Za opeko in votle podlage, z mrežico.", slika: "/slike/asfix/pesf.png", slug: "kemicno-sidro-pesf-top", skupina: "kemicna-pritrditev" },
  trak: { naziv: "Perforiran trak", opis: "Za obešanje cevi in inštalacij.", slika: "/slike/asfix/trak.png", slug: "perforiran-trak", skupina: "pritrdila-za-instalacije" },
};

const podlage = [
  { naziv: "Beton", opis: "Nosilna jeklena sidra, Turbo vijaki in kemična sidra za največje obremenitve.", slika: "/slike/asfix/podlaga-beton.jpg", izdelki: ["txh7", "turbo", "easf"] },
  { naziv: "Opeka in votlaki", opis: "Vložki z veliko oprijemno površino in kemična masa z mrežico.", slika: "/slike/asfix/podlaga-opeka.jpg", izdelki: ["mq", "udarni", "pesf"] },
  { naziv: "Mavčne plošče", opis: "Vložki za suhomontažo, ki se za ploščo razprejo.", slika: "/slike/asfix/podlaga-gips.jpg", izdelki: ["gips", "gipsKov"] },
  { naziv: "Fasada in izolacija", opis: "Vložki za pritrjevanje v toplotno izolacijo.", slika: "/slike/asfix/podlaga-izolacija.jpg", izdelki: ["stiropor"] },
];

const embalaza = [
  { naziv: "Vrečka z izveskom", opis: "Za perforirano steno — manjše količine za končnega kupca.", slika: "/slike/asfix/vrecka-rdeca.png" },
  { naziv: "Stoječa vrečka", opis: "Večje pakiranje udarnih vijakov in vložkov za mojstre.", slika: "/slike/asfix/vrecka-hammer.png" },
  { naziv: "Škatla ASfix", opis: "Jasna šifra in dimenzija na čelu, enoten dizajn na polici.", slika: "/slike/asfix/afr41.png" },
  { naziv: "Private label", opis: "Ista škatla v nevtralni beli izvedbi ali z vašo znamko.", slika: "/slike/asfix/afr41-pl.png", href: "/private-label" },
];

const police = [
  { m: "1 m", opis: "Glavne dimenzije za manjše trgovine in pulte.", slika: "/slike/trgovci/asfix-polica-1m-bela.jpg" },
  { m: "2 m", opis: "Vse dimenzije — najpogostejša izbira.", slika: "/slike/trgovci/asfix-polica-2m-bela.jpg" },
  { m: "4 m", opis: "Več zaloge vseh dimenzij za gradbene centre.", slika: "/slike/trgovci/asfix-polica-4m-bela.jpg" },
];

export default async function ASfix() {
  const izBaze = await pridobiIzdelkePoSlugih(Object.values(IZDELKI).map((x) => x.slug).filter(Boolean));
  const povezava = (k) => {
    const x = IZDELKI[k];
    return (x.slug && izBaze[x.slug]?.href) || `/program/${x.skupina}`;
  };

  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="ASfix"
        logo="/slike/znamke/asfix-logo-negativ.png"
        oznaka="Blagovna znamka · pritrdilna tehnika"
        naslov="Pritrdila, ki jih trgovec lahko zagovarja"
        opis="Jeklena sidra, zidni vložki, vložki za mavčne plošče, udarni in Turbo vijaki, kemične mase in pritrdila za inštalacije — v embalaži, pripravljeni za polico."
        znacke={["Slovenska znamka", "ETA", "Iz zaloge"]}
        slika="/slike/stojala/asfix-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        slikaAlt="Prodajna polica ASfix"
        gumbi={[
          { href: "/program", naziv: "Prodajni program", cls: "b-w" },
          { href: "/kontakt?vir=asfix", naziv: "Povpraševanje →", cls: "b-o" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj je ASfix</span>
                <h2>Znamka, ki jo trgovec lahko zagovarja</h2>
                <p>
                  ASfix je produktna znamka podjetja AS system. Nastopa na embalaži, letakih in v katalogih, medtem
                  ko AS system ostaja znamka podjetja in razvojnega partnerja.
                </p>
                <p style={{ marginTop: 12 }}>
                  Program pokriva pritrdila za beton, opeko, votlake, mavčne plošče, izolacijo in inštalacije — od
                  enega vijaka do paletne enote.
                </p>
              </div>
              <Link className="b b-r" href="/program">
                Prodajni program
              </Link>
            </div>
            <div>
              <Image
                src="/hero-izdelki-2026.png"
                alt="Program ASfix — jeklena sidra, zidni vložki, kemično sidro, udarni vijaki"
                width={1100}
                height={1044}
                sizes="(max-width: 1000px) 100vw, 620px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Aduti</span>
            <h2>Zakaj ASfix na polici</h2>
          </div>
          <div className="who c4">
            {aduti.map(([naziv, opis]) => (
              <div key={naziv}>
                <b>{naziv}</b>
                <p>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Program znamke ---------- */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Izdelki ASfix</h2>
            <p>Kliknite izdelek za dimenzije, pakiranja in cene.</p>
          </div>
          <div className="kats">
            {Object.entries(IZDELKI).map(([k, x]) => (
              <Link key={k} href={povezava(k)} className="k">
                <div className="im" style={{ background: "#fff" }}>
                  <Image src={x.slika} alt={`ASfix — ${x.naziv}`} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 14 }} />
                </div>
                <div className="tx">
                  <h3>{x.naziv}</h3>
                  <p>{x.opis}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Jeklena sidra ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kakovost in dokazila</span>
                <h2>Jeklena sidra z oceno ETA</h2>
                <p>
                  Jeklena sidra ASfix so na voljo v pocinkani izvedbi ZnB in v nerjavečem jeklu A4, z evropsko
                  tehnično oceno in izjavo o lastnostih.
                </p>
              </div>
              <dl className="cert" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 0 }}>
                <div>
                  <b>ETA</b>
                  <span>Evropska tehnična ocena za nosilna sidra</span>
                </div>
                <div>
                  <b>ZnB · A4</b>
                  <span>Pocinkana in nerjaveča izvedba</span>
                </div>
                <div>
                  <b>1.200 t</b>
                  <span>Zaloge, razpoložljive takoj</span>
                </div>
                <div>
                  <b>ISO 9001</b>
                  <span>Sistem vodenja kakovosti</span>
                </div>
              </dl>
            </div>
            <div className="sidra-sl">
              {["txh7", "tx1"].map((k) => (
                <Link key={k} href={povezava(k)} className="sidra-k">
                  <div className="sidra-im">
                    <Image src={IZDELKI[k].slika} alt={IZDELKI[k].naziv} fill sizes="(max-width: 900px) 50vw, 300px" style={{ objectFit: "contain", padding: 16 }} />
                  </div>
                  <b>{IZDELKI[k].naziv}</b>
                  <span>{IZDELKI[k].opis}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Kje se vgrajuje ---------- */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Uporaba</span>
            <h2>Kam gre katero pritrdilo</h2>
            <p>Podlaga določa izbiro. Izberite podlago in poglejte, kateri izdelki gredo vanjo.</p>
          </div>
          <div className="podlage">
            {podlage.map((p) => (
              <div key={p.naziv} className="podlaga">
                <div className="podlaga-sl">
                  <Image src={p.slika} alt={p.naziv} fill sizes="(max-width: 700px) 100vw, 320px" style={{ objectFit: "cover" }} />
                  <b>{p.naziv}</b>
                </div>
                <p>{p.opis}</p>
                <div className="podlaga-izd">
                  {p.izdelki.map((k) => (
                    <Link key={k} href={povezava(k)} title={IZDELKI[k].naziv}>
                      <div className="podlaga-izd-sl">
                        <Image src={IZDELKI[k].slika} alt={IZDELKI[k].naziv} fill sizes="90px" style={{ objectFit: "contain", padding: 6 }} />
                      </div>
                      <span>{IZDELKI[k].naziv}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Embalaža ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Embalaža</span>
            <h2>Ena znamka, več pakiranj</h2>
            <p>
              Isti izdelek pakiramo v različne formate, ker ima vsaka prodajna pot svoje zahteve — od nekaj kosov
              do palete.
            </p>
          </div>
          <div className="kats">
            {embalaza.map((e) => {
              const vsebina = (
                <>
                  <div className="im" style={{ background: "#fff", height: 260 }}>
                    <Image src={e.slika} alt={e.naziv} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 14 }} />
                  </div>
                  <div className="tx">
                    <h3>{e.naziv}</h3>
                    <p>{e.opis}</p>
                  </div>
                </>
              );
              return e.href ? (
                <Link key={e.naziv} href={e.href} className="k">
                  {vsebina}
                </Link>
              ) : (
                <div key={e.naziv} className="k">
                  {vsebina}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec" id="foto">
        <div className="w">
          <div className="st">
            <span>Od stroja do police</span>
            <h2>Kako nastane ASfix</h2>
            <p>Sidra kujemo in sestavljamo sami, vložke brizgamo, nato vse pakiramo in odpremimo iz našega skladišča.</p>
          </div>
          <FotoGalerija
            skupine={[
              { naziv: "Kovanje sider", slike: FOTO_SIDRA },
              { naziv: "Montaža sider", slike: FOTO_MONTAZA },
              { naziv: "Pakiranje", slike: FOTO_PAKIRANJE.slice(0, 6) },
              { naziv: "Skladišče", slike: FOTO_SKLADISCE },
            ]}
          />
        </div>
      </section>

      {/* ---------- Police ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Za trgovce</span>
            <h2>Polica ASfix — 1, 2 ali 4 metre</h2>
            <p>Polico prilagodimo trgovini. Večje postavitve do 20 m pripravimo po meri.</p>
          </div>
          <div className="kats c3">
            {police.map((d) => (
              <div key={d.m} className="k">
                <div className="im" style={{ height: 300, background: "#fff" }}>
                  <Image src={d.slika} alt={`Polica ASfix ${d.m}`} fill sizes="(max-width: 700px) 100vw, 400px" style={{ objectFit: "contain", padding: 10 }} />
                </div>
                <div className="tx">
                  <h3>{d.m}</h3>
                  <p>{d.opis}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="zn-gumbi" style={{ marginTop: 24 }}>
            <Link className="b b-r" href="/za-trgovce#povprasevanje">
              Želim polico ASfix →
            </Link>
            <Link className="b b-d" href="/za-trgovce">
              Vse za trgovce
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Interaktivna vaja ---------- */}
      <section id="igra" className="sec">
        <div className="w">
          <div className="st">
            <span>Preizkusite sami</span>
            <h2>Pritrdite ograjo v beton</h2>
            <p>
              Šest korakov, kot gredo na gradbišču. Izberite sveder in sidro, izvrtajte, izpihajte luknje, zabijte
              sidra in jih zategnite. Če kaj ni po vrsti, vam vaja pove, zakaj ne gre.
            </p>
          </div>
          <IgraSidranje />
        </div>
      </section>

      <DveZnamki trenutna="ASfix" />

      <div className="cta">
        <div className="w">
          <div>
            <h2>Zanima vas program ASfix za vašo trgovino?</h2>
            <p>Pošljite povpraševanje in pripravimo predlog asortimana ter pogoje.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=asfix">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
      <PotiProdaje izpusti="/asfix" />
    </>
  );
}
