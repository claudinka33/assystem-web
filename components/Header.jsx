"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navigacija, site } from "@/lib/site";
import KosaricaGumb from "@/components/KosaricaGumb";
import B2BPovezava from "@/components/B2BPovezava";
import { ZNAMKE, ZNAMKE_INFO } from "@/lib/znamke";

// Postavke spustnega seznama: znamke z logotipi ali navadne povezave.
const podPostavke = (el, kategorije = []) =>
  el.kategorije
    ? kategorije.map((k) => ({ naziv: k.naziv, pot: `/program/${k.slug}`, slika: k.slika, opis: k.opis }))
    : el.znamke
    ? ZNAMKE.map((z) => ({ naziv: ZNAMKE_INFO[z].ime, pot: ZNAMKE_INFO[z].pot, opis: ZNAMKE_INFO[z].opis, logo: ZNAMKE_INFO[z] }))
    : el.pod ?? [];

// Jeziki se prikažejo, ko bodo prevodi strani pripravljeni (npr. ["SI", "EN", "DE", "HR"]).
const jeziki = [];

export default function Header({ kategorije = [] }) {
  const [odprt, setOdprt] = useState(false);

  return (
    <>
      {/* Zgornji pas: kdo smo, jeziki, hitre povezave */}
      <div className="util">
        <div className="w">
          <span>{site.ime} · proizvajalec pritrdilne tehnike od {site.ustanovljeno}</span>
          <span className="lang">
            <B2BPovezava /> · <Link href="/katalogi">Katalogi</Link> · <Link href="/zaposlitev">Zaposlitev</Link>
            {jeziki.length > 1 && " | "}
            {jeziki.length > 1 && jeziki.map((j) => (
              <a key={j} href="#" className={j === "SI" ? "on" : undefined}>
                {j}
              </a>
            ))}
          </span>
        </div>
      </div>

      <header className="hdr">
        <div className="w">
          <Link href="/" className="logo" onClick={() => setOdprt(false)}>
            <Image
              src="/logo-as-system.png"
              alt="AS system"
              width={336}
              height={159}
              priority
            />
          </Link>

          <nav className="nav">
            {navigacija.map((el) => {
              const pod = podPostavke(el, kategorije);
              if (!pod.length)
                return (
                  <Link key={el.naziv} href={el.pot}>
                    {el.naziv}
                  </Link>
                );
              return (
                <div key={el.naziv} className={`nav-sk${el.kategorije ? " kt" : " zn"}`}>
                  <Link href={el.pot} className="nav-gl" aria-haspopup="true">
                    {el.naziv} <i aria-hidden="true">▾</i>
                  </Link>
                  <div className="nav-pod">
                    {el.kategorije && (
                      <>
                        <div className="kt-mreza">
                          {pod.map((p) => (
                            <Link key={p.pot} href={p.pot}>
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
                        <Link href={el.pot} className="kt-vse">
                          Celoten prodajni program →
                        </Link>
                      </>
                    )}
                    {!el.kategorije && pod.map((p) => (
                      <Link key={p.pot} href={p.pot}>
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
              {navigacija.map((el) => {
                const pod = podPostavke(el, kategorije);
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
              <Link href="/b2b" onClick={() => setOdprt(false)}>B2B prijava za podjetja</Link>
              <a href={`tel:${site.telefonRaw}`} style={{ color: "var(--color-red)" }}>
                {site.telefon}
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
