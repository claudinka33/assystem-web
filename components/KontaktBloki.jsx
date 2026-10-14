import Image from "next/image";
import { site } from "@/lib/site";
import { oddelki, kogaPoklicem, teren, poisci, telRaw } from "@/lib/kontakti";

// Skupni bloki s kontakti — uporabljata jih strani »O nas« in »Kontakt«.
// Podatki o ljudeh so v lib/kontakti.js.

export const lokacije = [
  {
    naziv: "Šmarje pri Jelšah",
    vloga: "Sedež in uprava, visokoregalno skladišče, avtomatska montaža in pakiranje",
    naslov: "Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
    zemljevid: "AS system d.o.o., Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
    slika: "/slike/proizvodnja/smarje-pri-jelsah.jpg",
    alt: "Sedež AS system v Šmarju pri Jelšah",
  },
  {
    naziv: "Bistrica ob Sotli",
    vloga: "Proizvodnja: hladno kovanje, valjanje navojev, brizganje plastike",
    naslov: "Hrastje ob Bistrici 2a, 3256 Bistrica ob Sotli",
    zemljevid: "Hrastje ob Bistrici 2a, 3256 Bistrica ob Sotli",
    slika: "/slike/proizvodnja/bistrica-ob-sotli.jpg",
    alt: "Proizvodni obrat AS system v Bistrici ob Sotli",
  },
];

export function Stik({ p, svetlo }) {
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

export function KogaPoklicem({ siva = true }) {
  return (
    <section className={`sec${siva ? " grey" : ""}`} id="koga">
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
              {k.regija &&
                teren.map((t) => (
                  <div key={t.oseba} className="on-koga-o">
                    <em className="on-koga-reg">
                      <i style={{ background: t.barva }} />
                      {t.dodatno && <i style={{ background: t.dodatno.barva }} />}
                      {t.kratko}
                    </em>
                    <strong>{t.oseba}</strong>
                    <Stik p={poisci(t.oseba)} />
                  </div>
                ))}
              {k.regija && (
                <a className="more" href="#teren" style={{ marginTop: 14 }}>
                  Zemljevid regij →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TerenKomercialisti() {
  return (
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
  );
}

export function KontaktiOddelki({ siva = true }) {
  return (
    <section className={`sec${siva ? " grey" : ""}`} id="kontakti">
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
  );
}

export function Lokacije({ siva = false, naslov = "Dve lokaciji" }) {
  return (
    <section className={`sec${siva ? " grey" : ""}`} id="lokacije">
      <div className="w">
        <div className="st">
          <span>Kje smo</span>
          <h2>{naslov}</h2>
        </div>
        <div className="on-lok">
          {lokacije.map((l) => (
            <div key={l.naziv} className="on-lok-k">
              {l.slika && (
                <div className="on-lok-foto">
                  <Image src={l.slika} alt={l.alt} fill sizes="(max-width: 1000px) 100vw, 50vw" quality={90} />
                </div>
              )}
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
  );
}
