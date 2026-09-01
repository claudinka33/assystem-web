"use client";

import Link from "next/link";
import { useState } from "react";
import { navigacija, site } from "@/lib/site";

const jeziki = ["SI", "EN", "DE", "HR"];

export default function Header() {
  const [odprt, setOdprt] = useState(false);

  return (
    <>
      {/* Zgornji pas: kdo smo, jeziki, hitre povezave */}
      <div className="util">
        <div className="w">
          <span>{site.ime} · proizvajalec pritrdilne tehnike od {site.ustanovljeno}</span>
          <span className="lang">
            <Link href="/katalogi">Katalogi</Link> · <Link href="/zaposlitev">Zaposlitev</Link>
            {" | "}
            {jeziki.map((j) => (
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
            AS<i>system</i>
            <small>ASFIX · ANCHORS &amp; FIXINGS</small>
          </Link>

          <nav className="nav">
            {navigacija.map((el) => (
              <Link key={el.pot} href={el.pot}>
                {el.naziv}
              </Link>
            ))}
          </nav>

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
      </header>

      {odprt && (
        <nav className="mobmeni">
          <div className="w">
            {navigacija.map((el) => (
              <Link key={el.pot} href={el.pot} onClick={() => setOdprt(false)}>
                {el.naziv}
              </Link>
            ))}
            <a href={`tel:${site.telefonRaw}`} style={{ color: "var(--color-red)" }}>
              {site.telefon}
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
