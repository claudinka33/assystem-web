"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Odjava from "./Odjava";

// Preproste črtne ikone (24×24, stroke = currentColor).
const I = {
  plosca: <><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>,
  kategorije: <><path d="M3 7h7l2 2h9v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M3 7V5a1 1 0 0 1 1-1h5l2 2" /></>,
  izdelki: <><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></>,
  znamke: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  uvoz: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 17v3h16v-3" /></>,
  sinhro: <><path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" /></>,
  besedila: <><path d="M4 6h16M4 12h16M4 18h10" /></>,
  novice: <><rect x="3" y="4" width="18" height="16" /><path d="M7 8h10M7 12h10M7 16h6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" /><path d="m3 7 9 6 9-6" /></>,
  kontakti: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></>,
  delo: <><rect x="3" y="7" width="18" height="13" /><path d="M8 7V4h8v3M3 13h18" /></>,
  prijave: <><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></>,
  narocila: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" /></>,
  b2b: <><path d="M3 21V9l9-6 9 6v12" /><path d="M9 21v-6h6v6" /></>,
  popust: <><path d="m19 5-14 14" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
  povprasevanja: <><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" /></>,
  nastavitve: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></>,
  zunaj: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v6H4V6h6" /></>,
};

export function Ikona({ ime, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {I[ime]}
    </svg>
  );
}

const MENI = [
  { skupina: "Katalog", povezave: [
    { naziv: "Kategorije", pot: "/admin/kategorije", ikona: "kategorije" },
    { naziv: "Izdelki", pot: "/admin/izdelki", ikona: "izdelki" },
    { naziv: "Znamke izdelkov", pot: "/admin/znamke", ikona: "znamke" },
    { naziv: "Sinhronizacija Vasco", pot: "/admin/sinhronizacija", ikona: "sinhro" },
  ]},
  { skupina: "Prodaja", povezave: [
    { naziv: "Naročila", pot: "/admin/narocila", ikona: "narocila", stevec: "narocila" },
    { naziv: "B2B kupci", pot: "/admin/b2b", ikona: "b2b", stevec: "b2b" },
    { naziv: "Kode za popust", pot: "/admin/popusti", ikona: "popust" },
    { naziv: "Povpraševanja", pot: "/admin/povprasevanja", ikona: "povprasevanja", stevec: "povprasevanja" },
  ]},
  { skupina: "Vsebina", povezave: [
    { naziv: "Besedila na strani", pot: "/admin/vsebine", ikona: "besedila" },
    { naziv: "Katalogi in gradiva", pot: "/admin/gradiva", ikona: "prijave" },
    { naziv: "Novice", pot: "/admin/novice", ikona: "novice" },
    { naziv: "E-novice (mailing)", pot: "/admin/e-novice", ikona: "mail", tocno: true },
    { naziv: "E-novice kontakti", pot: "/admin/e-novice/kontakti", ikona: "kontakti" },
  ]},
  { skupina: "Zaposlovanje", povezave: [
    { naziv: "Delovna mesta", pot: "/admin/delovna-mesta", ikona: "delo" },
    { naziv: "Prijave za delo", pot: "/admin/prijave", ikona: "prijave" },
  ]},
  { skupina: "Sistem", povezave: [
    { naziv: "Nastavitve", pot: "/admin/nastavitve", ikona: "nastavitve" },
  ]},
];

export default function AdminMeni({ ime, stevci = {} }) {
  const pot = usePathname();
  const [odprt, setOdprt] = useState(false);

  // ob menjavi strani na telefonu zapri meni
  useEffect(() => setOdprt(false), [pot]);

  const aktiven = (p, tocno) => (tocno ? pot === p : pot === p || pot.startsWith(p + "/"));
  const zacetnice = (ime || "?").split(" ").map((d) => d[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <div className="adm-mobilna">
        <button type="button" className="adm-burger" onClick={() => setOdprt(true)} aria-label="Odpri meni">
          <span /><span /><span />
        </button>
        <Link href="/admin" className="adm-mobilna-logo">AS <i>system</i> · admin</Link>
      </div>

      {odprt && <div className="adm-zavesa" onClick={() => setOdprt(false)} />}

      <aside className={`adm-bok${odprt ? " odprt" : ""}`}>
        <Link className="adm-logo" href="/admin">
          <span className="adm-logo-znak">AS</span>
          <span>
            <b>AS <i>system</i></b>
            <small>Urejanje spletne strani</small>
          </span>
        </Link>

        <nav>
          <Link href="/admin" className={pot === "/admin" ? "on" : ""}>
            <Ikona ime="plosca" /> Nadzorna plošča
          </Link>
          {MENI.map((s) => (
            <div key={s.skupina}>
              <div className="skupina">{s.skupina}</div>
              {s.povezave.map((p) => (
                <Link key={p.pot} href={p.pot} className={aktiven(p.pot, p.tocno) ? "on" : ""}>
                  <Ikona ime={p.ikona} /> <span className="naziv">{p.naziv}</span>
                  {p.stevec && stevci[p.stevec] > 0 && <em className="stevec">{stevci[p.stevec]}</em>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="adm-uporabnik">
          <span className="avatar">{zacetnice}</span>
          <div>
            <b>{ime}</b>
            <div className="akcije">
              <a href="/" target="_blank" rel="noreferrer">Poglej stran ↗</a>
              <Odjava />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
