import Image from "next/image";
import Link from "next/link";
import { pridobiDokumente } from "@/lib/podatki";
import { poisci, telRaw } from "@/lib/kontakti";

export const revalidate = 60;

export const metadata = {
  title: "Kakovost in certifikati",
  description:
    "ISO 9001:2015, evropske tehnične ocene ETA, oznaka CE in izjave o lastnostih (DoP) za sidra ASfix. Vhodna, medfazna in končna kontrola ter sledljivost vsake serije.",
  alternates: { canonical: "/kakovost" },
};

const oznakeDok = {
  eta: "ETA",
  dop: "DoP",
  certifikat: "Certifikat",
  letak: "Letak",
  katalog: "Katalog",
  navodila: "Navodila",
  risba: "Risba",
};

const pas = [
  ["ISO 9001", "Certificiran sistem kakovosti"],
  ["3", "Stopnje kontrole v proizvodnji"],
  ["LOT", "Sledljivost vsake serije"],
  ["F120", "Ognjevarnost"],
];

const oznake = [
  ["ETA", "Evropska tehnična ocena", "Neodvisna ocena nosilnosti sidra po evropskih smernicah. Osnova za projektiranje in dokaz ustreznosti na gradbišču."],
  ["CE", "Oznaka skladnosti", "Izdelek ustreza zahtevam evropske zakonodaje za gradbene proizvode. Oznaka je na vsaki embalaži."],
  ["DoP", "Izjava o lastnostih", "Dokument, ki ga izvajalec priloži dokumentaciji objekta. Za vsako sidro ga pripravimo sami."],
  ["ISO", "ISO 9001:2015", "Certificiran sistem vodenja kakovosti (Bureau Veritas). Postopki so zapisani, nadzorovani in ponovljivi."],
  ["F120", "Ognjevarnost", "Nosilnost sidra je dokazana 120 minut v požaru — za zahtevne konstrukcijske vgradnje."],
];

const sidra = [
  { izdelek: "Jekleno sidro TXH7", eta: "ETA-21/0597", dop: "01/22" },
  { izdelek: "Jekleno sidro TX1", eta: "ETA-17/0638", dop: "17/01" },
  { izdelek: "Jekleno sidro TXm2", eta: "ETA-23/0137", dop: "2873-CPR-0137" },
  { izdelek: "Jekleno sidro TXm2r", eta: "ETA-23/0136", dop: "2873-CPR-0136" },
];

const kontrola = [
  ["Vhodna kontrola", "Preverimo material in polizdelke ob prevzemu — žico, granulat, embalažo. Dobavitelje redno ocenjujemo skupaj z nabavo."],
  ["Medfazna kontrola", "Med proizvodnjo merimo po planu kontrole — dimenzije, navoj in videz. Odstopanje ustavi serijo, preden nastane škart."],
  ["Končna kontrola", "Pred pakiranjem preverimo izdelek, količino, etiketo in videz embalaže. Šele nato gre serija v skladišče."],
];

const sistem = [
  ["Sledljivost", "Vsaka serija ima svojo oznako LOT — od materiala, stroja in delovnega naloga do palete pri kupcu."],
  ["Merilna oprema", "Kalibrirana merilna oprema in usposobljeni kontrolorji. Kontrolni zapisi so podlaga za tehnično dokumentacijo."],
  ["Neskladni izdelki", "Kontrola ima pravico ustaviti proizvodnjo ali odpremo. Za vsako odstopanje sledi korektivni ukrep."],
  ["Reklamacije", "Vsako reklamacijo obravnavamo z analizo vzroka in kupcu odgovorimo v dogovorjenem roku."],
];

export default async function Kakovost() {
  const dokumenti = await pridobiDokumente();
  const kakovostnik = poisci("Mitja Babič");

  return (
    <>
      {/* Glava */}
      <section className="zn-hero antracit">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Kakovost
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Kakovost in certifikati</span>
            <h1>Naši izdelki držijo strehe in konstrukcije</h1>
            <p>
              Zato kakovost pri nas ni oddelek za papirje, ampak zadnja obramba
              pred tveganjem na gradbišču. Nosilna sidra imajo evropsko tehnično
              oceno, oznako CE in izjavo o lastnostih — pripravljene za
              projektanta in nadzornika.
            </p>
            <ul className="zn-znacke">
              <li>ISO 9001:2015</li>
              <li>ETA</li>
              <li>CE</li>
              <li>DoP</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#sidra">Certifikati sider</a>
              <a className="b b-o" href="#dokumenti">Dokumenti za prenos</a>
            </div>
          </div>
          <div className="zn-slika" style={{ maxWidth: 520, justifySelf: "center" }}>
            <Image
              src="/slike/kakovost/hero-txh7.png"
              alt="Jekleno sidro TXH7 v vrečki z oznako CE in številko ETA"
              width={1206}
              height={1039}
              priority
              sizes="(max-width: 1000px) 90vw, 520px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* Pas */}
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

      {/* Oznake */}
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Kaj pomenijo oznake</span>
            <h2>Dokazila, ki jih projekt zahteva</h2>
            <p>
              Nosilno sidro ni navaden vijak. Projektant in nadzornik zahtevata
              dokazila — pri nas so pripravljena za vsako sidro.
            </p>
          </div>
          <div className="kk-oznake">
            {oznake.map(([kr, naziv, opis]) => (
              <div key={kr}>
                <i>{kr}</i>
                <b>{naziv}</b>
                <p>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sidra z ETA */}
      <section className="sec grey" id="sidra">
        <div className="w">
          <div className="kk-sidra">
            <div className="st" style={{ marginBottom: 0 }}>
              <span>Certifikati</span>
              <h2>Sidra z evropsko tehnično oceno</h2>
              <p>
                Ocene ETA za naša jeklena sidra so izdane na AS system. Številka
                ETA je natisnjena na vsaki etiketi, skupaj z oznako CE.
              </p>
              <Link className="more" href="/program/pritrdila-za-beton" style={{ display: "inline-block", marginTop: 18 }}>
                Pritrdila za beton →
              </Link>
            </div>
            <div className="kk-tabela">
              <div className="kk-vrsta glava">
                <span>Izdelek</span>
                <span>ETA</span>
                <span>DoP</span>
                <span />
              </div>
              {sidra.map((s) => (
                <div key={s.izdelek} className="kk-vrsta">
                  <b>{s.izdelek}</b>
                  <span className="kk-eta">{s.eta}</span>
                  <span>{s.dop}</span>
                  <Link
                    className="kk-zahtevaj"
                    href={`/kontakt?izdelek=${encodeURIComponent(`${s.eta} ${s.izdelek}`)}&vir=certifikat`}
                  >
                    Zahtevaj →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kontrola */}
      <section className="on-stroji">
        <div className="w">
          <div className="st">
            <span>Kontrola v proizvodnji</span>
            <h2>Iz hiše ne gre nič, kar ni skladno</h2>
            <p>Tri stopnje kontrole — od materiala, ki pride v hišo, do škatle, ki gre iz nje.</p>
          </div>
          <ol className="kk-kontrola">
            {kontrola.map(([n, o]) => (
              <li key={n}>
                <b>{n}</b>
                <p>{o}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sistem */}
      <section className="sec">
        <div className="w">
          <div className="on-kratko" style={{ alignItems: "start" }}>
            <div>
              <div className="st">
                <span>Sistem kakovosti</span>
                <h2>Zapisano, merjeno, sledljivo</h2>
                <p>
                  Sistem vodenja kakovosti po ISO 9001:2015 velja za celotno pot
                  izdelka — od razvoja in nabave do proizvodnje, pakiranja in
                  odpreme.
                </p>
              </div>
              <div className="on-zakaj" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                {sistem.map(([n, o]) => (
                  <div key={n}>
                    <b>{n}</b>
                    <p>{o}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="kk-oseba">
              <small>Kontakt za kakovost</small>
              <strong>{kakovostnik?.ime}</strong>
              <span>Vodja kakovosti</span>
              <ul className="on-stik">
                {kakovostnik?.mob && (
                  <li>
                    <span>M</span>
                    <a href={`tel:${telRaw(kakovostnik.mob)}`}>{kakovostnik.mob}</a>
                  </li>
                )}
                {kakovostnik?.email && (
                  <li>
                    <span>@</span>
                    <a href={`mailto:${kakovostnik.email}`}>{kakovostnik.email}</a>
                  </li>
                )}
              </ul>
              <p>Reklamacije, kontrolni zapisi, sledljivost serije ali dokumentacija za projekt.</p>
              <Link className="b b-r" href="/reklamacije">Prijava reklamacije →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dokumenti */}
      <section className="sec grey" id="dokumenti">
        <div className="w">
          <div className="st">
            <span>Prenosi</span>
            <h2>Dokumenti za prenos</h2>
          </div>

          {dokumenti.length === 0 ? (
            <div className="priprava" style={{ background: "#fff", padding: "24px 22px" }}>
              <h2>Arhiv pripravljamo</h2>
              <p>
                Certifikate in izjave o lastnostih trenutno urejamo. Do takrat
                vam dokumentacijo za konkreten izdelek pošljemo po e-pošti.
              </p>
              <Link className="more" href="/kontakt?vir=kakovost" style={{ display: "inline-block", marginTop: 14 }}>
                Zaprosite za dokumentacijo →
              </Link>
            </div>
          ) : (
            <div className="kats">
              {dokumenti.map((d) => (
                <a
                  key={d.id}
                  className="k"
                  href={d.datoteka_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: "#fff" }}
                >
                  <div className="tx">
                    <span className="kick">{oznakeDok[d.tip] ?? d.tip}</span>
                    <h3 style={{ marginTop: 12 }}>{d.naziv}</h3>
                    <p>
                      {d.izdelki?.naziv ? `${d.izdelki.naziv} · ` : ""}PDF ·{" "}
                      {d.jezik?.toUpperCase()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Potrebujete dokumentacijo za projekt?</h2>
            <p>Pošljite seznam izdelkov — pripravimo ETA, DoP in navodila za vgradnjo.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=kakovost">
            Zaprosite za dokumentacijo →
          </Link>
        </div>
      </div>
    </>
  );
}
