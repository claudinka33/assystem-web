import Image from "next/image";
import Link from "next/link";
import IgraSidranje from "@/components/IgraSidranje";
import EmbalazaAsfix from "@/components/EmbalazaAsfix";
import PolicaAsfix from "@/components/PolicaAsfix";
import NaslovStrani from "@/components/NaslovStrani";

export const metadata = {
  title: "ASfix — blagovna znamka",
  description:
    "ASfix je blagovna znamka pritrdilne tehnike podjetja AS system: sidra, vložki, vijaki in kemična sidra v embalaži, pripravljeni za polico.",
  alternates: { canonical: "/asfix" },
};

const aduti = [
  ["Znan izvor", "Za vsakim izdelkom stoji slovenska proizvodnja z lastnim razvojem. Kupec ve, kdo je izdelal to, kar drži v roki."],
  ["Evropska dokazila", "Nosilna sidra imajo oceno ETA in izjavo o lastnostih. Trgovec lahko izdelek zagovarja pred zahtevnim kupcem."],
  ["Embalaža, ki proda", "Vrečka z izveskom, škatla z jasno šifro in dimenzijo, paletna enota za centre. V treh sekundah je jasno, kaj je notri."],
  ["Dobava iz zaloge", "Osnovni asortiman je v visokoregalnem skladišču v Šmarju. Brez čakanja na uvoz."],
];

export default function ASfix() {
  return (
    <>
      <NaslovStrani
        oznaka="Blagovna znamka"
        naslov="ASfix"
        opis="Pritrdilna tehnika podjetja AS system — sidra, vložki, vijaki in kemična sidra pod eno znamko."
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj je ASfix</span>
                <h2>Znamka, ki jo trgovec lahko zagovarja</h2>
                <p>
                  ASfix je produktna znamka podjetja AS system. Nastopa na
                  embalaži, letakih in v katalogih, medtem ko AS system ostaja
                  znamka podjetja in razvojnega partnerja.
                </p>
                <p style={{ marginTop: 12 }}>
                  Program pokriva pritrdila za beton, opeko, votlake, mavčne
                  plošče, izolacijo, streho in inštalacije — od enega vijaka do
                  paletne enote.
                </p>
              </div>
              <Link className="b b-r" href="/program">
                Prodajni program
              </Link>
            </div>
            <div>
              <Image
                src="/hero-izdelki.png"
                alt="Program ASfix — jeklena sidra, zidni vložki, kemično sidro, udarni vijaki, vrečka in škatla"
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
          <div className="who">
            {aduti.map(([naziv, opis]) => (
              <div key={naziv}>
                <b>{naziv}</b>
                <p>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Embalaža</span>
            <h2>Ena skupina, več pakiranj</h2>
            <p>
              Isti izdelek pakiramo v različne formate, ker ima vsaka prodajna
              pot svoje zahteve. Trgovec s tem izkoristi polico, kupec pa dobi
              velikost, ki jo res potrebuje — od desetih kosov do palete.
            </p>
          </div>
          <EmbalazaAsfix />
        </div>
      </section>

      {/* ---------- Program znamke ---------- */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Kaj pokriva znamka ASfix</h2>
            <p>
              ASfix je zgodovinski temelj podjetja in znamka z največjo
              prepoznavnostjo na trgu. Pokriva gradbena pritrdila — od enega
              vijaka do paletne enote.
            </p>
          </div>
          <div className="kats">
            {[
              ["Jeklena sidra", "Nosilne pritrditve v beton, z evropsko tehnično oceno."],
              ["Zidni vložki", "Najlonski vložki za polne in luknjaste podlage."],
              ["Udarni vijaki", "Hitra montaža brez privijanja, za serijsko delo."],
              ["Dolgi vložek in vijak", "Komplet za okvirje, late in fasadne elemente."],
              ["Vložki za mavčne plošče", "Za suhomontažo, ki se za ploščo razprejo."],
              ["Lahka pritrdila", "Drobni program za vsakodnevna opravila."],
            ].map(([naziv, opis]) => (
              <div key={naziv} className="k" style={{ padding: "26px 24px" }}>
                <h3>{naziv}</h3>
                <p style={{ marginTop: 10 }}>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Lastna proizvodnja ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Lastna proizvodnja</span>
                <h2>Sidra, ki nastanejo pri nas</h2>
                <p>
                  Jeklena sidra TXH7 in TX1 so v celoti naša — od razvoja in
                  orodja do proizvodnje in pakiranja. Na voljo so v pocinkani
                  izvedbi ZnB in v nerjavečem jeklu A4, vsa z evropsko tehnično
                  oceno.
                </p>
                <p style={{ marginTop: 12 }}>
                  Enako velja za najlonske zidne vložke in udarne vijake. Ker
                  imamo orodja doma, lahko spremenimo dimenzijo ali pakiranje brez
                  čakanja na zunanjega dobavitelja.
                </p>
              </div>
              <Link className="more" href="/proizvodnja">
                Proizvodnja in razvoj →
              </Link>
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
        </div>
      </section>

      {/* ---------- Kje se vgrajuje ---------- */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Uporaba</span>
            <h2>Kam gre katero pritrdilo</h2>
            <p>
              Podlaga določa izbiro. Polni beton prenese nosilna jeklena sidra,
              votlaki in opeka zahtevajo vložek z veliko oprijemno površino, v
              mavčne plošče pa gredo posebni vložki.
            </p>
          </div>
          <div className="kats">
            {[
              ["Beton", "Jeklena sidra TXH7 in TX1, kemična sidra za največje obremenitve."],
              ["Opeka in votlaki", "Najlonski vložki z veliko oprijemno površino, kemična masa z mrežico."],
              ["Mavčne plošče", "Vložki za suhomontažo, ki se za ploščo razprejo."],
              ["Fasada in izolacija", "Okvirni vložki in izolacijska sidra za ETICS sisteme."],
            ].map(([naziv, opis]) => (
              <div key={naziv} className="k" style={{ padding: "26px 24px" }}>
                <h3>{naziv}</h3>
                <p style={{ marginTop: 10 }}>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Prodajna polica ---------- */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Za trgovce</span>
            <h2>Prodajna polica ASfix</h2>
            <p>
              Cel kotiček pritrdilne tehnike na enem mestu — polica, škatle AFR41
              in banner nad njo. Izberite širino in poglejte, kako izgleda pri vas.
              Polica je visoka 2 m in ima šest polic, na tekoči meter gredo štiri
              škatle.
            </p>
          </div>
          <PolicaAsfix />
        </div>
      </section>

      {/* ---------- Interaktivna vaja ---------- */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Preizkusite sami</span>
            <h2>Pritrdite ograjo v beton</h2>
            <p>
              Šest korakov, kot gredo na gradbišču. Izberite sveder in sidro,
              izvrtajte, izpihajte luknje, zabijte sidra in jih zategnite. Če kaj
              ni po vrsti, vam vaja pove, zakaj ne gre.
            </p>
          </div>
          <IgraSidranje />
        </div>
      </section>

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
    </>
  );
}
