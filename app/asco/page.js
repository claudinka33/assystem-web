import Image from "next/image";
import Link from "next/link";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";
import PotiProdaje from "@/components/PotiProdaje";

export const metadata = {
  title: "ASco — standardno vijačno blago po DIN in ISO",
  description:
    "Vijaki, matice in podložke po DIN in ISO pod znamko ASco: pocinkano, črno in nerjavno jeklo A2/A4, v škatlah za podjetja in vrečkah za trgovine.",
  alternates: { canonical: "/asco" },
};

// Isti štirje aduti kot pri ASfix — prilagojeni vijačnemu blagu
const aduti = [
  { naziv: "Po standardu DIN in ISO", opis: "Vsak vijak, matica in podložka je izdelana po standardu DIN ali ISO. Kupec ve, kaj dobi, brez ugibanja o merah.", slike: ["/slike/DIN/933_ZnB.jpeg"] },
  { naziv: "Barva pove material", opis: "Modra vrečka je pocinkano jeklo ZnB, zelena nerjavno INOX. Na polici se ne zamenja.", slike: ["/slike/znamke/asco-vrecka-znb.jpg", "/slike/znamke/asco-vrecka-inox.jpg"] },
  { naziv: "Od vrečke do škatle", opis: "Vrečke za trgovino, škatle za servis in industrijo, večje količine v rinfuzi.", slike: ["/slike/znamke/asco-skatla-brez-sence.png"] },
  { naziv: "Skupaj z ASfix", opis: "Vijaki in pritrdilna tehnika z enim naročilom. Trgovec ima en dobavni rok za celo polico.", slike: ["/slike/znamke/asfix-afr41.png"] },
];

const police = [
  { m: "1 m", opis: "Vstopni modul — pocinkano in INOX na enem metru.", slika: "/slike/trgovci/asco-polica-1m.jpg" },
  { m: "2 m", opis: "DIN vijačno blago ZnB in modul z INOX programom.", slika: "/slike/trgovci/asco-polica-2m.jpg" },
  { m: "4 m", opis: "Vsaka skupina svoj modul — DIN, lesni vijaki, INOX.", slika: "/slike/trgovci/asco-polica-4m.jpg" },
  { m: "6 m", opis: "Celoten program z več zaloge — 4 m ZnB, 2 m INOX.", slika: "/slike/trgovci/asco-polica-6m.jpg" },
];

const skupine = [
  { naziv: "Vijaki s šestrobo glavo", norme: "DIN 931 · DIN 933", slika: "/slike/DIN/933_ZnB.jpeg" },
  { naziv: "Imbus in ugrezni vijaki", norme: "DIN 912 · DIN 7991", slika: "/slike/DIN/912_A2.jpeg" },
  { naziv: "Matice", norme: "DIN 934 · DIN 985 · DIN 1587", slika: "/slike/DIN/934_ZnB.jpeg" },
  { naziv: "Podložke", norme: "DIN 125 · DIN 9021 · DIN 127B", slika: "/slike/DIN/125_ZnB.jpeg" },
  { naziv: "Samorezni in samovrtni", norme: "DIN 7981 · DIN 7982 · DIN 7504", slika: "/slike/DIN/7504K_ZnB.jpeg" },
  { naziv: "Navojne palice", norme: "DIN 975", slika: "/slike/DIN/975_ZnB.jpeg" },
  { naziv: "Vijaki za les s šestrobo glavo", norme: "DIN 571", slika: "/slike/DIN/571_ZnB.jpeg" },
  { naziv: "Vijaki za kovino", norme: "DIN 603 · DIN 84 · DIN 965", slika: "/slike/DIN/603_ZnB.jpeg" },
];

// Vrstni red materialov: ZnB, črn, INOX A2, INOX A4
const izvedbe = [
  { b: "ZnB", s: "pocinkano", p: "Osnovna izvedba za notranjo rabo in suhe prostore. Modra vrečka.", c: "#4a9fcc" },
  { b: "Črn", s: "brez prevleke", p: "Za strojegradnjo in notranje jeklene konstrukcije.", c: "#3f4140" },
  { b: "INOX A2", s: "nerjavno", p: "Za zunanjo rabo in vlažne prostore. Zelena vrečka.", c: "#2a9c48" },
  { b: "INOX A4", s: "nerjavno", p: "Za morsko okolje, bazene in zahtevnejše pogoje.", c: "#2a9c48" },
];

const pakiranja = [
  {
    naziv: "Škatla ASco",
    kolicina: "za podjetja",
    opis: "Za servise, montažo in industrijo. Kartonska škatla z logotipom ASco in nalepko z normo, dimenzijo in številom kosov.",
    slika: "/slike/znamke/asco-skatla-brez-sence.jpg",
  },
  {
    naziv: "Modra vrečka",
    kolicina: "ZnB · za trgovine",
    opis: "Pocinkani vijaki v vrečki z eurolukno za obešanje na stojalo ali perforirano steno.",
    slika: "/slike/znamke/asco-vrecka-znb.jpg",
  },
  {
    naziv: "Zelena vrečka",
    kolicina: "INOX · za trgovine",
    opis: "Nerjavni vijaki v enaki vrečki — zelena barva kupcu takoj pove, da gre za INOX.",
    slika: "/slike/znamke/asco-vrecka-inox.jpg",
  },
];

export default function ASco() {
  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="ASco"
        logo="/slike/znamke/asco-logo-negativ.png"
        oznaka="Blagovna znamka · vijačno blago"
        naslov="Vijaki, matice in podložke po DIN in ISO standardih"
        opis="Vijačno blago po DIN in ISO standardih iz zaloge — pocinkano, črno in nerjavno, v škatlah za podjetja in vrečkah za trgovine."
        znacke={["DIN · ISO standardi", "ZnB", "INOX A2 / A4"]}
        slika="/slike/stojala/asco-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        slikaAlt="Prodajna polica ASco"
        gumbi={[
          { href: "/program/vijacno-blago", naziv: "Vijačno blago v katalogu", cls: "b-r" },
          { href: "/kontakt?vir=asco", naziv: "Povpraševanje →", cls: "b-o" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj je ASco</span>
                <h2>Vijačno blago, ki je vedno na zalogi</h2>
                <p>
                  ASco je naša znamka za vijačno blago po DIN in ISO standardih. Pokriva vijake, matice,
                  podložke, navojne palice in lesne vijake v pocinkani, črni in nerjavni izvedbi.
                </p>
                <p style={{ marginTop: 12 }}>
                  Kjer ASfix pritrdi v beton, opeko ali mavčno ploščo, ASco poveže kovino s kovino in les z lesom.
                  Skupaj pokrijeta celotno polico pritrdilnega materiala.
                </p>
              </div>
              <Link className="b b-r" href="/program/vijacno-blago">
                Vijačno blago v katalogu
              </Link>
            </div>
            <div>
              <Image
                src="/slike/znamke/asco-skatla-brez-sence.jpg"
                alt="Škatla ASco s pogledom od spredaj"
                width={1242}
                height={654}
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
            <h2>Zakaj ASco na polici</h2>
          </div>
          <div className="kats">
            {aduti.map((a) => (
              <div key={a.naziv} className="k adut">
                <div className="im adut-sl">
                  {a.slike.map((sl) => (
                    <div key={sl}>
                      <Image src={sl} alt={a.naziv} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
                    </div>
                  ))}
                </div>
                <div className="tx">
                  <h3>{a.naziv}</h3>
                  <p>{a.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Kaj pokriva znamka ASco</h2>
            <p>Najpogostejši DIN in ISO standardi za montažo, servis in industrijo.</p>
          </div>
          <div className="kats">
            {skupine.map((x) => (
              <Link key={x.naziv} href="/program/vijacno-blago" className="k">
                <div className="im">
                  <Image src={x.slika} alt={x.naziv} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 18 }} />
                </div>
                <div className="tx">
                  <h3>{x.naziv}</h3>
                  <p>{x.norme}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Izvedbe</span>
            <h2>Material izberete po okolju</h2>
            <p>Ista mera v različnih izvedbah. V trgovini barva vrečke loči pocinkano od nerjavnega.</p>
          </div>
          <div className="izvedbe">
            {izvedbe.map((x) => (
              <div key={x.b} style={{ "--c": x.c }}>
                <b>{x.b}</b>
                <span>{x.s}</span>
                <p>{x.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Embalaža</span>
            <h2>Za podjetja in za trgovine</h2>
            <p>
              Isti vijak pakiramo glede na to, kdo ga kupuje. Podjetje dobi škatlo za skladišče, trgovina vrečko
              za stojalo, večji odjemalci pa rinfuzo.
            </p>
          </div>
          <div className="embalaza" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {pakiranja.map((t) => (
              <div key={t.naziv} className="embalaza-kartica">
                <div className="embalaza-slika">
                  <Image src={t.slika} alt={t.naziv} fill sizes="300px" style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
                <h3>{t.naziv}</h3>
                <span className="embalaza-kolicina">{t.kolicina}</span>
                <p>{t.opis}</p>
              </div>
            ))}
            <div className="embalaza-kartica">
              <div className="embalaza-slika">
                <Image src="/slike/znamke/asco-rinfuza.jpg" alt="Vijaki, matice in podložke po DIN standardu v rinfuzi" fill sizes="300px" style={{ objectFit: "cover" }} />
              </div>
              <h3>Rinfuza</h3>
              <span className="embalaza-kolicina">večje količine</span>
              <p>Za industrijo in serijsko montažo — količina in pakiranje po dogovoru.</p>
            </div>
          </div>
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
                <span>Za trgovce</span>
                <h2>Stojalo ASco</h2>
                <p>
                  Samostoječe stojalo na kolesih s tremi stranicami za obešanje vrečk. Modre vrečke ZnB in zelene
                  INOX so ločene po barvi, tako da kupec v trenutku najde pravo izvedbo.
                </p>
              </div>
              <ul>
                <li>Zavzame malo prostora — ob pultu ali na koncu regala.</li>
                <li>Asortiman sestavimo glede na vašo prodajo in ga dopolnjujemo.</li>
                <li>Postavi se ob polico ASfix — sidra in vijaki na enem mestu.</li>
              </ul>
              <div className="zn-gumbi">
                <Link className="b b-r" href="/kontakt?vir=asco-stojalo">
                  Želim stojalo →
                </Link>
                <Link className="b b-d" href="/asfix">
                  Polica ASfix
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Za trgovce</span>
            <h2>Polica ASco — 1, 2, 4 ali 6 metrov</h2>
            <p>Moduli se samo dodajajo. Zgoraj vrečke, spodaj škatle z večjim pakiranjem, na vsaki nalepki standard, dimenzija in količina.</p>
          </div>
          <div className="kats">
            {police.map((d) => (
              <div key={d.m} className="k">
                <div className="im" style={{ height: 260, background: "#fff" }}>
                  <Image src={d.slika} alt={`Polica ASco ${d.m}`} fill sizes="(max-width: 700px) 100vw, 320px" style={{ objectFit: "contain", padding: 10 }} />
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
              Želim polico ASco →
            </Link>
            <Link className="b b-d" href="/za-trgovce">
              Vse za trgovce
            </Link>
          </div>
        </div>
      </section>

      <DveZnamki trenutna="ASco" />

      <div className="cta">
        <div className="w">
          <div>
            <h2>Zanima vas program ASco za vašo trgovino?</h2>
            <p>Pošljite povpraševanje in pripravimo predlog asortimana ter pogoje.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=asco">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
      <PotiProdaje izpusti="/asco" />
    </>
  );
}
