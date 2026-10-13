import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { oddelki, kogaPoklicem, teren, poisci, telRaw } from "@/lib/kontakti";

export const metadata = {
  title: "O nas",
  description:
    "AS system d.o.o. — slovensko družinsko podjetje s področja pritrdilne tehnike od leta 1993. Lastna proizvodnja sider, zidnih vložkov in udarnih vijakov, dve lokaciji, kontakti po oddelkih.",
  alternates: { canonical: "/o-nas" },
};

const stevilke = [
  ["1993", "Leto ustanovitve"],
  ["2", "Lokaciji v Sloveniji"],
  [`${site.drzave}`, "Držav, kamor dobavljamo"],
  ["ISO 9001", "Certificiran sistem kakovosti"],
];

const lokacije = [
  {
    naziv: "Šmarje pri Jelšah",
    vloga: "Sedež in uprava, visokoregalno skladišče, avtomatska montaža in pakiranje",
    naslov: "Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
    zemljevid: "AS system d.o.o., Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
  },
  {
    naziv: "Bistrica ob Sotli",
    vloga: "Proizvodnja: hladno kovanje, valjanje navojev, brizganje plastike",
    naslov: "Bistrica ob Sotli, Slovenija",
    zemljevid: "Bistrica ob Sotli, Slovenija",
  },
];

function Stik({ p, svetlo }) {
  if (!p) return null;
  const nic = !p.tel && !p.mob && !p.email;
  return (
    <ul className={`on-stik${svetlo ? " svetlo" : ""}`}>
      {p.tel && (
        <li>
          <span>T</span>
          <a href={`tel:${telRaw(p.tel)}`}>{p.tel}</a>
        </li>
      )}
      {p.mob && (
        <li>
          <span>M</span>
          <a href={`tel:${telRaw(p.mob)}`}>{p.mob}</a>
        </li>
      )}
      {p.email && (
        <li>
          <span>@</span>
          <a href={`mailto:${p.email}`}>{p.email}</a>
        </li>
      )}
      {nic && (
        <li className="on-kmalu">
          Kontakt v pripravi — do takrat{" "}
          <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a> ·{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
      )}
    </ul>
  );
}

export default function ONas() {
  return (
    <>
      {/* Glava */}
      <section className="zn-hero antracit">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / O nas
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Podjetje</span>
            <h1>Pritrdilna tehnika iz Slovenije — od leta 1993</h1>
            <p>
              AS system je slovensko družinsko podjetje z lastno proizvodnjo.
              Jeklena sidra, zidne vložke in udarne vijake razvijamo, izdelamo in
              zapakiramo sami — v Šmarju pri Jelšah in Bistrici ob Sotli.
            </p>
            <ul className="zn-znacke">
              <li>Od 1993</li>
              <li>Lastna proizvodnja</li>
              <li>ETA · CE</li>
              <li>ISO 9001</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#kontakti">Kontakti</a>
              <a className="b b-o" href="#lokacije">Kje smo</a>
            </div>
          </div>
          <div className="zn-slika">
            <Image
              src="/slike/o-nas/asfix-skatla.webp"
              alt="Škatla ASfix iz lastne proizvodnje AS system"
              width={1400}
              height={1047}
              priority
              sizes="(max-width: 1000px) 90vw, 620px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* Na kratko */}
      <section className="sec">
        <div className="w">
          <div className="on-kratko">
            <div className="st" style={{ marginBottom: 0 }}>
              <span>Na kratko</span>
              <h2>Proizvajalec in veletrgovec na enem naslovu</h2>
              <p>
                Podjetje sta leta 1993 ustanovila Aleš in Cvetka Seidl. Danes
                imamo lastno proizvodnjo sider, zidnih vložkov in udarnih
                vijakov, izdelujemo vijake po naročilu in pakiramo pod znamko
                kupca. Na slovenskem trgu smo tudi veletrgovec s kompletnim
                vijačnim blagom — vse za pritrjevanje pri enem dobavitelju.
              </p>
              <p style={{ marginTop: 12 }}>
                Doma prodajamo trgovcem in izvajalcem, v tujino pa svoje znamke
                ASfix in ASco prek distributerjev.
              </p>
            </div>
            <dl className="on-nums">
              {stevilke.map(([v, k]) => (
                <div key={k}>
                  <dt>{v}</dt>
                  <dd>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Koga pokličem */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Hitro do prave osebe</span>
            <h2>Koga pokličem?</h2>
          </div>
          <div className="on-koga">
            {kogaPoklicem.map((k) => (
              <div key={k.kdo} className="on-koga-k">
                <b>{k.kdo}</b>
                <p>{k.opis}</p>
                {k.oseba && (
                  <div className="on-koga-o">
                    <strong>{k.oseba}</strong>
                    <Stik p={poisci(k.oseba)} />
                  </div>
                )}
                {k.deljeno &&
                  k.deljeno.map((d) => (
                    <div key={d.kje} className="on-koga-o">
                      <em>{d.kje}</em>
                      <strong>{d.oseba}</strong>
                      <Stik p={poisci(d.oseba)} />
                    </div>
                  ))}
                {k.regija && (
                  <a className="more" href="#teren" style={{ marginTop: "auto" }}>
                    Poiščite svojega komercialista →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teren */}
      <section className="sec" id="teren">
        <div className="w">
          <div className="st">
            <span>Za trgovce</span>
            <h2>Komercialisti na terenu</h2>
            <p>Slovenija je razdeljena po regijah. Poiščite svojo in pokličite komercialista, ki jo pokriva.</p>
          </div>
          <div className="on-teren">
            <div className="on-karta">
              <Image
                src="/slike/o-nas/teren-regije.webp"
                alt="Zemljevid Slovenije, razdeljen na regije komercialistov"
                width={1420}
                height={935}
                sizes="(max-width: 1000px) 100vw, 720px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="on-komerc">
              {teren.map((t) => (
                <div key={t.oseba} className="on-kom">
                  <strong>{t.oseba}</strong>
                  <ul className="on-reg">
                    <li>
                      <i style={{ background: t.barva }} />
                      <span>{t.regije.join(" · ")}</span>
                    </li>
                    {t.dodatno && (
                      <li>
                        <i style={{ background: t.dodatno.barva }} />
                        <span>{t.dodatno.regije.join(" · ")}</span>
                      </li>
                    )}
                  </ul>
                  <Stik p={poisci(t.oseba)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kontakti po oddelkih */}
      <section className="sec grey" id="kontakti">
        <div className="w">
          <div className="st">
            <span>Ekipa</span>
            <h2>Kontakti po oddelkih</h2>
            <p>
              Splošno: <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a> ·{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> · pon–pet 7.00–15.00
            </p>
          </div>
          {oddelki.map((o) => (
            <div key={o.naziv} className="on-odd">
              <h3>{o.naziv}</h3>
              <div className="on-ljudje">
                {o.ljudje.map((p) => (
                  <div key={p.ime} className="on-oseba">
                    <strong>{p.ime}</strong>
                    <span className="on-vloga">{p.vloga}</span>
                    <Stik p={p} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lokacije */}
      <section className="sec" id="lokacije">
        <div className="w">
          <div className="st">
            <span>Kje smo</span>
            <h2>Dve lokaciji</h2>
          </div>
          <div className="on-lok">
            {lokacije.map((l) => (
              <div key={l.naziv} className="on-lok-k">
                <div className="on-lok-tx">
                  <b>{l.naziv}</b>
                  <p>{l.naslov}</p>
                  <span>{l.vloga}</span>
                  <a
                    className="more"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.zemljevid)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Navodila za pot →
                  </a>
                </div>
                <iframe
                  title={`Zemljevid — ${l.naziv}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(l.zemljevid)}&z=15&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Pišite nam</h2>
            <p>Pošljite povpraševanje — odgovorimo v enem delovnem dnevu.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=o-nas">
            Povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}
