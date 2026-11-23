"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navigacija, site } from "@/lib/site";
import KosaricaGumb from "@/components/KosaricaGumb";
import B2BPovezava from "@/components/B2BPovezava";
import { ZNAMKE, ZNAMKE_INFO } from "@/lib/znamke";
import { JEZIKI, IMENA_JEZIKOV, brezJezika, potZJezikom } from "@/lib/i18n/skupno";
import { prevedeno } from "@/lib/i18n/odjemalec";

// Postavke spustnega seznama: znamke z logotipi ali navadne povezave.
const podPostavke = (el, kategorije = [], skrite = []) =>
  el.kategorije
    ? kategorije.map((k) => ({ naziv: k.naziv, pot: `/program/${k.slug}`, slika: k.slika, opis: k.opis }))
    : el.znamke
    ? ZNAMKE.filter((z) => !skrite.includes(z)).map((z) => ({ naziv: ZNAMKE_INFO[z].ime, pot: ZNAMKE_INFO[z].pot, opis: ZNAMKE_INFO[z].opis, logo: ZNAMKE_INFO[z].znak ?? ZNAMKE_INFO[z] }))
    : el.pod ?? [];

// Preklop jezika: polna povezava (ne Link), da se ob menjavi naloži cela stran v novem jeziku.
function Jeziki({ jezik }) {
  const [pot, setPot] = useState("/");
  const brskalnik = usePathname(); // posodobi ob vsakem premiku po strani
  useEffect(() => {
    setPot(brezJezika(window.location.pathname) + window.location.search);
  }, [brskalnik]);
  return (
    <span className="jeziki" translate="no">
      {JEZIKI.map((j) => (
        <a key={j} href={j === "sl" ? pot : potZJezikom(pot, j)} hrefLang={j} lang={j} className={j === jezik ? "on" : undefined} aria-current={j === jezik ? "true" : undefined}>
          {IMENA_JEZIKOV[j]}
        </a>
      ))}
    </span>
  );
}

function Header({ kategorije = [], skrite = [], jezik = "sl" }) {
  const [odprt, setOdprt] = useState(false);
  const [isci, setIsci] = useState(false);
  // Spustni meni, ki je bil pravkar kliknjen — skrit, dokler miška ne zapusti postavke.
  const [zaprt, setZaprt] = useState(null);
  const zapri = (n) => {
    setZaprt(n);
    if (typeof document !== "undefined") document.activeElement?.blur?.();
  };

  return (
    <>
      {/* Zgornji pas: kdo smo, jeziki, hitre povezave */}
      <div className="util">
        <div className="w">
          <span>{site.ime} · proizvajalec pritrdilne tehnike od {site.ustanovljeno}</span>
          <span className="lang">
            <B2BPovezava />
            {" | "}
            <Jeziki jezik={jezik} />
          </span>
        </div>
      </div>

      <header className="hdr">
        <div className="w">
          <Link
            href={jezik === "sl" ? "/" : `/${jezik}`}
            className="logo"
            onClick={() => {
              setOdprt(false);
              // Klik na logotip vedno pelje na vrh naslovnice (tudi če smo že na njej)
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => window.scrollTo({ top: 0 }), 400);
            }}
          >
            <Image
              src="/logo-as-system.png"
              alt="AS system"
              width={336}
              height={159}
              priority
            />
          </Link>

          <nav className="nav">
            {navigacija.filter((el) => jezik === "sl" || !el.samoSl).map((el) => {
              const pod = podPostavke(el, kategorije, skrite);
              if (!pod.length)
                return (
                  <Link key={el.naziv} href={el.pot}>
                    {el.naziv}
                  </Link>
                );
              return (
                <div key={el.naziv} className={`nav-sk${el.kategorije ? " kt" : " zn"}`} onMouseLeave={() => zaprt === el.naziv && setZaprt(null)}>
                  <Link href={el.pot} className="nav-gl" aria-haspopup="true" onClick={() => zapri(el.naziv)}>
                    {el.naziv} <i aria-hidden="true">▾</i>
                  </Link>
                  <div className="nav-pod" style={zaprt === el.naziv ? { display: "none" } : undefined}>
                    {el.kategorije && (
                      <>
                        <div className="kt-mreza">
                          {pod.map((p) => (
                            <Link key={p.pot} href={p.pot} onClick={() => zapri(el.naziv)}>
                              <span className={p.slika ? "kt-im" : "kt-im prazna"}>
                                {p.slika && <img src={p.slika} alt="" loading="lazy" />}
                              </span>
                              <span className="kt-tx">
                                <b>{p.naziv}</b>
                                {p.opis && <small>{p.opis}</small>}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link href={el.pot} className="kt-vse" onClick={() => zapri(el.naziv)}>
                          Celoten prodajni program →
                        </Link>
                      </>
                    )}
                    {!el.kategorije && pod.map((p) => (
                      <Link key={p.pot} href={p.pot} className={p.logo ? undefined : "tx"} onClick={() => zapri(el.naziv)}>
                        {p.logo ? (
                          <Image src={p.logo.logo} alt={p.naziv} width={Math.round((p.logo.w / p.logo.h) * 26)} height={26} style={{ height: 26, width: "auto" }} />
                        ) : (
                          <b>{p.naziv}</b>
                        )}
                        {p.opis && <span>{p.opis}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <form action="/iskanje" className="isci">
            <input name="q" type="search" placeholder="Išči po šifri ali nazivu…" aria-label="Iskanje" />
            <button type="submit" aria-label="Išči">→</button>
          </form>

          <button type="button" className="isci-ikona" aria-label="Iskanje izdelkov" aria-expanded={isci} onClick={() => setIsci(!isci)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/b2b" className="b2b-gumb" title="B2B portal za podjetja: vaše cene, naročila in računi">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>B2B portal</span>
          </Link>

          <KosaricaGumb />

          <a className="tel" href={`tel:${site.telefonRaw}`}>
            {site.telefon}
            <span>{site.emailProdaja}</span>
          </a>

          <button
            type="button"
            className="burger"
            onClick={() => setOdprt(!odprt)}
            aria-expanded={odprt}
            aria-label={odprt ? "Zapri meni" : "Odpri meni"}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        {odprt && (
          <nav className="mobmeni">
            <div className="w">
              <form action="/iskanje" className="mob-isci" onSubmit={() => setOdprt(false)}>
                <input name="q" type="search" placeholder="Išči po šifri, EAN ali nazivu…" aria-label="Iskanje izdelkov" />
                <button type="submit" aria-label="Išči">→</button>
              </form>
              {navigacija.filter((el) => jezik === "sl" || !el.samoSl).map((el) => {
                const pod = podPostavke(el, kategorije, skrite);
                if (!pod.length)
                  return (
                    <Link key={el.naziv} href={el.pot} onClick={() => setOdprt(false)}>
                      {el.naziv}
                    </Link>
                  );
                return (
                  <div key={el.naziv} className="mob-sk">
                    <div className="mob-gl">{el.naziv}</div>
                    {pod.map((p) => (
                      <Link key={p.pot} href={p.pot} onClick={() => setOdprt(false)}>
                        {p.naziv}
                      </Link>
                    ))}
                  </div>
                );
              })}
              <Link href="/b2b" className="mob-b2b" onClick={() => setOdprt(false)}>B2B portal za podjetja →</Link>
              <div className="mob-jeziki">
                <Jeziki jezik={jezik} />
              </div>
              <a href={`tel:${site.telefonRaw}`} style={{ color: "var(--color-red)" }}>
                {site.telefon}
              </a>
            </div>
          </nav>
        )}
        {isci && (
          <div className="isci-pop">
            <form action="/iskanje" onSubmit={() => setIsci(false)}>
              <input name="q" type="search" placeholder="Šifra, EAN ali naziv izdelka" aria-label="Iskanje" autoFocus />
              <button type="submit">Išči</button>
            </form>
          </div>
        )}
      </header>
    </>
  );
}

export default prevedeno(Header);
