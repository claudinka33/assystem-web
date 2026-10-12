import Image from "next/image";
import Link from "next/link";
import DveZnamki from "@/components/DveZnamki";
import NaslovStrani from "@/components/NaslovStrani";
import { pridobiVsebine, v } from "@/lib/vsebine";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata = {
  title: "O nas",
  description:
    "AS system d.o.o. je slovensko družinsko podjetje s področja pritrdilne tehnike in vijačnega blaga. Od 1993, lastna proizvodnja, znamke ASfix, ASco, Mungo in Silvermate, dobava v 19 držav.",
  alternates: { canonical: "/o-nas" },
};

const stevilke = [
  ["1993", "Leto ustanovitve"],
  ["4", "Znamke v programu"],
  [`${site.drzave}`, "Držav, kamor dobavljamo"],
  ["ISO 9001", "Certifikat kakovosti"],
];

const skladisce = [
  ["2.300 m²", "Površina skladišča na dveh lokacijah"],
  ["1.400", "Paletnih mest v visokoregalnem skladišču"],
  ["1.200 t", "Zaloge, razpoložljive takoj"],
  ["ETA · DoP", "Dokumentacija za nosilna sidra"],
];

const proizvodnja = [
  ["Hladno kovanje", "Dvostopenjske stiskalnice, valjanje navojev, ekscentrične stiskalnice in CNC stružnice."],
  ["Brizganje plastike", "Najlonski vložki in tulci iz poliamida, brizgani na lastnih orodjih."],
  ["Lastna orodjarna", "Orodja razvijemo, izdelamo in vzdržujemo sami, zato so spremembe hitre."],
  ["Avtomatska montaža", "Sestavljanje kompletov in pakiranje v vrečke ali škatle brez ročnega dela."],
];

const kupci = [
  ["Trgovina", "Gradbeni centri, veletrgovine, specializirane trgovine s pritrdili in trgovine za obrtnike."],
  ["Izvajalci", "Podjetja, ki pritrdila dejansko vgrajujejo — od fasaderjev do inštalaterjev."],
  ["Distributerji", "Partnerji na tujih trgih, ki prodajajo naše lastne blagovne znamke."],
];

export default async function ONas() {
  const b = await pridobiVsebine("o-nas");

  return (
    <>
      <NaslovStrani
        oznaka="Podjetje"
        naslov="O nas"
        opis="Slovensko družinsko podjetje s področja pritrdilne tehnike in vijačnega blaga — z lastnim razvojem, proizvodnjo ter montažo in pakiranjem."
      />

      {/* Uvod */}
      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Od 1993</span>
                <h2>{v(b, "o-nas.uvod.naslov", "naslov", "Družinsko podjetje z lastno proizvodnjo")}</h2>
                <p>
                  {v(
                    b,
                    "o-nas.uvod.besedilo",
                    "besedilo",
                    "AS system sta leta 1993 ustanovila Aleš in Cvetka Seidl. Ime združuje priimek ustanovitelja in besedo »system« — sistematičen pristop k pritrjevanju je od prvega dne jedro tega, kar delamo."
                  )}
                </p>
                <p style={{ marginTop: 12 }}>
                  Poleg ustanoviteljev v podjetju delajo tudi njuni otroci, vsak
                  na svojem področju. Danes razvijamo in izdelujemo jeklena sidra
                  za beton, najlonske zidne vložke, udarne vijake in vijake po
                  naročilu, na slovenskem trgu pa nastopamo tudi kot veletrgovec
                  s kompletnim vijačnim blagom.
                </p>
              </div>
              <Link className="b b-r" href="/program">
                Prodajni program
              </Link>
            </div>
            <div className="foto">
              <Image
                src="/slike/as-system-smarje.jpg"
                alt="Sedež podjetja AS system v Šmarju pri Jelšah"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Številke */}
      <div className="nums">
        <div className="w">
          {stevilke.map(([v1, k]) => (
            <div key={k}>
              <b>{v1}</b>
              <span>{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Znamke */}
      <DveZnamki siv={false} />

      {/* Proizvodnja */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Proizvodnja</span>
            <h2>Kaj delamo sami</h2>
            <p>
              Tri skupine izdelkov so v celoti naše — od razvoja in orodja do
              proizvodnje in pakiranja: jeklena sidra, zidni vložki in udarni
              vijaki. Nosilna sidra imajo evropsko tehnično oceno.
            </p>
          </div>

          <div className="kats">
            {proizvodnja.map(([naziv, opis]) => (
              <div key={naziv} className="k" style={{ padding: "26px 24px" }}>
                <h3>{naziv}</h3>
                <p style={{ marginTop: 10 }}>{opis}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22 }}>
            <Link className="more" href="/proizvodnja">
              Več o proizvodnji in razvoju →
            </Link>
          </div>
        </div>
      </section>

      {/* Skladišče */}
      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Zaloga in dobava</span>
                <h2>Dvoje odloča, ali nas kupec izbere</h2>
                <p>
                  Ali imamo izdelek na zalogi in ali zanj obstajajo papirji. Oboje
                  imamo. Osnovni asortiman je v visokoregalnem skladišču v Šmarju
                  pri Jelšah in ga odpremimo takoj.
                </p>
              </div>
              <Link className="b b-r" href="/kontakt?vir=o-nas">
                Pošlji povpraševanje
              </Link>
            </div>

            <dl className="cert" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {skladisce.map(([v1, k]) => (
                <div key={k}>
                  <b style={{ fontSize: 21 }}>{v1}</b>
                  <span>{k}</span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Kupci */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Kupci</span>
            <h2>Komu prodajamo</h2>
            <p>
              Na domačem trgu pokrivamo celoten asortiman — pritrdilno tehniko in
              vijačno blago pri enem dobavitelju. Na tujih trgih prodajamo lastne
              blagovne znamke prek distributerjev.
            </p>
          </div>
          <div className="who">
            {kupci.map(([naziv, opis]) => (
              <div key={naziv}>
                <b>{naziv}</b>
                <p>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moto */}
      <section className="sec">
        <div className="w">
          <div className="st" style={{ marginBottom: 0, maxWidth: 780 }}>
            <span>Moto</span>
            <h2>Ko pritrjevanje postane igra</h2>
            <p>
              Sistematičen pristop k pritrjevanju je od prvega dne jedro tega, kar
              delamo. Enotna podoba je pri tem enako pomembna kot toleranca na
              vijaku — ista logika, isti red, isti občutek kakovosti, od tehnične
              risbe do embalaže.
            </p>
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Bi sodelovali z nami?</h2>
            <p>Kot trgovec, izvajalec, distributer ali blagovna znamka — pišite nam.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=o-nas">
            Kontakt →
          </Link>
        </div>
      </div>
    </>
  );
}
