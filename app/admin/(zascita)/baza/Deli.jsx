"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { nastaviPanoge, shraniKontakt, uvoziVBazo, uskladiZResend, preklopiOdjavo, izbrisiKontaktIzBaze, izkljuciDomeno, odstraniIzkljucitev } from "@/lib/akcije/baza";
import IzbrisiGumb from "../../IzbrisiGumb";

const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Hitra izbira panoge z iskalnikom — kontakt se takoj shrani.
export function PanogaIzbira({ email, panoge, izbrane }) {
  const ime = Object.fromEntries(panoge.map((p) => [p.sifra, p.ime]));
  const [trenutne, setTrenutne] = useState(izbrane);
  const [odprto, setOdprto] = useState(false);
  const [q, setQ] = useState("");
  const [caka, zacni] = useTransition();
  const [ok, setOk] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (!odprto) return;
    const zunaj = (e) => ref.current && !ref.current.contains(e.target) && setOdprto(false);
    document.addEventListener("mousedown", zunaj);
    return () => document.removeEventListener("mousedown", zunaj);
  }, [odprto]);
  const izberi = (sif) => {
    const nove = sif == null ? [] : [sif];
    setTrenutne(nove);
    setOdprto(false);
    setQ("");
    zacni(async () => {
      const r = await nastaviPanoge(email, nove);
      setOk(r?.ok ? "✓" : "✗");
      setTimeout(() => setOk(null), 1500);
    });
  };
  const seznam = panoge.filter((p) => !q || norm(p.ime).includes(norm(q)));
  const oznaka = trenutne.length === 0 ? "— nerazvrščen —" : trenutne.map((s) => ime[s]).join(", ");
  return (
    <span className="bz-pan" ref={ref}>
      <button type="button" className={`bz-pan-gumb${trenutne.length ? "" : " prazno"}`} disabled={caka} onClick={() => setOdprto(!odprto)} title={oznaka}>
        <span>{oznaka}</span><i>▾</i>
      </button>
      {ok && <b className={ok === "✓" ? "bz-ok" : "bz-ne"}>{ok}</b>}
      {odprto && (
        <div className="bz-pan-meni">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Išči panogo …"
            onKeyDown={(e) => {
              if (e.key === "Enter" && seznam[0]) { e.preventDefault(); izberi(seznam[0].sifra); }
              if (e.key === "Escape") setOdprto(false);
            }}
          />
          <div className="bz-pan-seznam">
            {!q && <button type="button" className="neraz" onClick={() => izberi(null)}>— nerazvrščen —</button>}
            {seznam.map((p) => (
              <button key={p.sifra} type="button" className={trenutne.includes(p.sifra) ? "on" : ""} onClick={() => izberi(p.sifra)}>{p.ime}</button>
            ))}
            {seznam.length === 0 && <span className="siv" style={{ padding: 6 }}>Ni zadetkov</span>}
          </div>
        </div>
      )}
    </span>
  );
}

const peIme = (x) => (x.naziv2 || x.naziv || "").trim();
const peKraj = (x) => String(x.posta ?? "").replace(/^[A-Z]{0,2}-?\d{3,6}\s*/, "").trim();

export function KontaktObrazec({ panoge, k = null, poslovalnice = [] }) {
  const [stanje, akcija, caka] = useActionState(shraniKontakt, null);
  const [pe, setPe] = useState(k?.poslovalnica ?? "");
  const [kraj, setKraj] = useState(k?.kraj ?? "");
  const [posta, setPosta] = useState(k?.posta ?? "");
  const obstaja = !pe || poslovalnice.some((x) => peIme(x) === pe);
  return (
    <form action={akcija} className="bz-obr" autoComplete="off">
      {k && <input type="hidden" name="prejsnji" value={k.email} />}
      <div className="bz-polja">
        <div className="adm-polje s2"><label>E-naslov *</label><input name="email" type="email" required defaultValue={k?.email ?? ""} /></div>
        <div className="adm-polje"><label>Ime in priimek</label><input name="ime" defaultValue={k?.ime ?? ""} /></div>
        <div className="adm-polje"><label>Podjetje</label><input name="podjetje" defaultValue={k?.podjetje ?? ""} /></div>
        <div className="adm-polje"><label>Davčna</label><input name="davcna" defaultValue={k?.davcna ?? ""} /></div>
        <div className="adm-polje"><label>Telefon</label><input name="telefon" defaultValue={k?.telefon ?? ""} /></div>
        <div className="adm-polje">
          <label>Poslovalnica{poslovalnice.length ? ` (${poslovalnice.length} iz Vasca)` : ""}</label>
          {poslovalnice.length ? (
            <select
              name="poslovalnica"
              value={pe}
              onChange={(e) => {
                const v = e.target.value;
                setPe(v);
                const x = poslovalnice.find((y) => peIme(y) === v);
                if (x) { setKraj(peKraj(x)); setPosta(x.posta ?? ""); }
              }}
            >
              <option value="">— sedež / brez poslovalnice —</option>
              {!obstaja && <option value={pe}>{pe}</option>}
              {poslovalnice.map((x) => (
                <option key={x.sifra} value={peIme(x)}>{peIme(x)}{peKraj(x) ? ` · ${peKraj(x)}` : ""}</option>
              ))}
            </select>
          ) : (
            <input name="poslovalnica" value={pe} onChange={(e) => setPe(e.target.value)} autoComplete="off" />
          )}
        </div>
        <div className="adm-polje"><label>Pošta (npr. 3240 Šmarje pri Jelšah)</label><input name="posta" value={posta} onChange={(e) => setPosta(e.target.value)} autoComplete="off" /></div>
        <div className="adm-polje"><label>Kraj</label><input name="kraj" value={kraj} onChange={(e) => setKraj(e.target.value)} autoComplete="off" /></div>
        <div className="adm-polje s3"><label>Opomba</label><input name="opomba" defaultValue={k?.opomba ?? ""} /></div>
      </div>
      <div className="bz-cb">
        {panoge.map((p) => (
          <label key={p.sifra}><input type="checkbox" name="panoge" value={p.sifra} defaultChecked={k?.panoge?.includes(p.sifra)} /> {p.ime}</label>
        ))}
      </div>
      <div className="bz-cb">
        <label><input type="checkbox" name="soglasje" defaultChecked={k?.soglasje} /> Soglasje za e-novice</label>
        <label><input type="checkbox" name="odjavljen" defaultChecked={k?.odjavljen} /> Odjavljen</label>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="gumb" type="submit" disabled={caka}>{caka ? "Shranjujem …" : k ? "Shrani" : "Dodaj kontakt"}</button>
        {stanje?.napaka && <span className="bz-ne">{stanje.napaka}</span>}
        {stanje?.ok && <span className="bz-ok">✓ {stanje.sporocilo}</span>}
      </div>
    </form>
  );
}

export function UvozBaze({ panoge, privzeta }) {
  const [stanje, akcija, caka] = useActionState(uvoziVBazo, null);
  return (
    <form action={akcija} className="bz-obr">
      <div className="adm-polje">
        <label>Prilepi iz Excela — en kontakt na vrstico (e-naslov, ime, podjetje)</label>
        <textarea name="besedilo" rows={8} placeholder={"janez@firma.si\tJanez Novak\tFirma d.o.o.\nmarija@krovstvo.si"} required />
      </div>
      <div className="adm-polje">
        <label>V panogo</label>
        <select name="panoga" defaultValue={privzeta}>
          <option value="">— nerazvrščeni —</option>
          {panoge.map((p) => <option key={p.sifra} value={p.sifra}>{p.ime}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="gumb" type="submit" disabled={caka}>{caka ? "Uvažam …" : "Uvozi"}</button>
        {stanje?.napaka && <span className="bz-ne">{stanje.napaka}</span>}
        {stanje?.ok && <span className="bz-ok">✓ {stanje.sporocilo}</span>}
      </div>
    </form>
  );
}

export function UskladiGumb() {
  const [caka, zacni] = useTransition();
  const [r, setR] = useState(null);
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <button className="gumb" type="button" disabled={caka} onClick={() => zacni(async () => setR(await uskladiZResend()))}>
        {caka ? "Usklajujem …" : "Uskladi z Resend"}
      </button>
      {r && <span className={r.ok ? "bz-ok" : "bz-ne"} style={{ maxWidth: 520, fontSize: 12 }}>{r.ok ? `✓ ${r.sporocilo}` : r.napaka}</span>}
    </span>
  );
}

export function OdjavaGumb({ email, odjavljen }) {
  const [caka, zacni] = useTransition();
  const [st, setSt] = useState(odjavljen);
  return (
    <button
      className="gumb siv mini"
      type="button"
      disabled={caka}
      onClick={() =>
        zacni(async () => {
          const r = await preklopiOdjavo(email, !st);
          if (r?.ok) setSt(!st);
        })
      }
    >
      {st ? "Ponovno prijavi" : "Odjavi od mailingov"}
    </button>
  );
}

// Klik na luč preklopi Aktiven ↔ Neaktiven (odjavljen od mailingov, tudi v Resendu).
export function StanjeGumb({ email, odjavljen, title }) {
  const [caka, zacni] = useTransition();
  const [st, setSt] = useState(odjavljen);
  return (
    <button
      type="button"
      className="bz-stanje"
      disabled={caka}
      title={`${title}\nKlikni za ${st ? "ponovno aktivacijo" : "odjavo od mailingov"}`}
      onClick={() =>
        zacni(async () => {
          const r = await preklopiOdjavo(email, !st);
          if (r?.ok) setSt(!st);
        })
      }
    >
      {caka ? <i className="bz-luc">…</i> : st ? <i className="bz-luc rdeca">Neaktiven</i> : <i className="bz-luc zelena">Aktiven</i>}
    </button>
  );
}

const datum = (d) => (d ? new Date(d).toLocaleDateString("sl-SI") : "");

// Ena vrstica baze: hitra izbira panoge + »Uredi« odpre obrazec pod vrstico.
export function Vrstica({ k, panoge, poslovalnice = [] }) {
  const [odprto, setOdprto] = useState(false);
  return (
    <div className={`bz-k${odprto ? " odprt" : ""}${k.odjavljen ? " odj" : ""}`}>
      <div className="bz-vr">
        <span className="bz-mail" title={k.email}>{k.email}</span>
        <span className="ell" data-l="Oseba">{k.ime || <span className="siv">—</span>}{k.telefon && <span className="siv"> · {k.telefon}</span>}</span>
        <span className="ell" data-l="Podjetje" title={k.podjetje ?? ""}>{k.podjetje || <span className="siv">—</span>}{k.davcna && <span className="siv"> · SI{k.davcna}</span>}</span>
        <span className="ell" data-l="Poslovalnica" title={[k.poslovalnica, k.kraj].filter(Boolean).join(", ")}>
          {k.poslovalnica || k.kraj ? <>{k.poslovalnica}{k.poslovalnica && k.kraj ? ", " : ""}<span className="siv">{k.kraj}</span></> : <span className="siv">—</span>}
        </span>
        <span data-l="Panoga"><PanogaIzbira email={k.email} panoge={panoge} izbrane={k.panoge ?? []} /></span>
        <span data-l="Stanje">
          <StanjeGumb email={k.email} odjavljen={k.odjavljen} title={`Vir: ${k.vir} · dodan ${datum(k.ustvarjeno)}${k.soglasje ? " · soglasje za e-novice" : ""}`} />
        </span>
        <button type="button" className="bz-uredi" onClick={() => setOdprto(!odprto)}>{odprto ? "Zapri ▴" : "Uredi ▾"}</button>
      </div>
      {odprto && (
        <div className="bz-det">
          <p className="siv" style={{ margin: "0 0 6px", fontSize: 11.5 }}>
            Vir: <b>{k.vir}</b> · dodan {datum(k.ustvarjeno)}{k.vasco_partner ? ` · Vasco partner ${k.vasco_partner}` : ""} · {k.soglasje ? "soglasje za e-novice" : "brez izrecnega soglasja (poslovni kontakt)"}
          </p>
          <KontaktObrazec panoge={panoge} k={k} poslovalnice={poslovalnice} />
          <div className="bz-det-noga">
            <OdjavaGumb email={k.email} odjavljen={k.odjavljen} />
            <span style={{ flex: 1 }} />
            Izbriši iz baze
            <IzbrisiGumb action={izbrisiKontaktIzBaze} id={k.email} ime={k.email} opozorilo="Kontakt se izbriše iz baze in iz Resenda." />
          </div>
        </div>
      )}
    </div>
  );
}

export function IzkljuciDomeno({ domene }) {
  const [stanje, akcija, caka] = useActionState(izkljuciDomeno, null);
  const [, zacni] = useTransition();
  return (
    <form
      action={akcija}
      className="bz-obr"
      onSubmit={(e) => {
        const d = new FormData(e.currentTarget).get("domena");
        if (!window.confirm(`Izbrišem VSE kontakte z domeno »${d}« in jih ne uvažam več?`)) e.preventDefault();
      }}
    >
      <div className="adm-polje">
        <label>Domena podjetja, ki ne obstaja več (izbriše vse kontakte z njo in jih ne uvaža več)</label>
        <input name="domena" placeholder="npr. mtehnika.si" required />
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <button className="gumb" type="submit" disabled={caka}>{caka ? "Brišem …" : "Izbriši domeno"}</button>
        {stanje?.napaka && <span className="bz-ne">{stanje.napaka}</span>}
        {stanje?.ok && <span className="bz-ok">✓ {stanje.sporocilo}</span>}
      </div>
      {domene.length > 0 && (
        <div className="bz-cb">
          <span className="siv">Izključene:</span>
          {domene.map((d) => (
            <span key={d} className="znacka ne">
              {d}{" "}
              <button type="button" style={{ border: 0, background: "none", cursor: "pointer", color: "#cb2026" }} title="Spet dovoli" onClick={() => zacni(() => odstraniIzkljucitev(d))}>×</button>
            </span>
          ))}
        </div>
      )}
    </form>
  );
}
