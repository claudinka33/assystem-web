"use client";

import { useActionState, useState, useTransition } from "react";
import { nastaviPanoge, shraniKontakt, uvoziVBazo, uskladiZResend, preklopiOdjavo, izbrisiKontaktIzBaze, izkljuciDomeno, odstraniIzkljucitev } from "@/lib/akcije/baza";
import IzbrisiGumb from "../../IzbrisiGumb";

// Hitra izbira (ene) panoge — kontakt se takoj shrani.
export function PanogaIzbira({ email, panoge, izbrane }) {
  const [vrednost, setVrednost] = useState(izbrane.length > 1 ? "__vec" : String(izbrane[0] ?? ""));
  const [caka, zacni] = useTransition();
  const [ok, setOk] = useState(null);
  const ime = Object.fromEntries(panoge.map((p) => [p.sifra, p.ime]));
  return (
    <span className="bz-pan">
      <select
        value={vrednost}
        disabled={caka}
        className={!vrednost ? "prazno" : ""}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "__vec") return;
          setVrednost(v);
          zacni(async () => {
            const r = await nastaviPanoge(email, v ? [Number(v)] : []);
            setOk(r?.ok ? "✓" : "✗");
            setTimeout(() => setOk(null), 1500);
          });
        }}
        title={izbrane.map((s) => ime[s]).join(", ")}
      >
        <option value="">— nerazvrščen —</option>
        {izbrane.length > 1 && <option value="__vec">{izbrane.length} panoge: {izbrane.map((s) => ime[s]).join(", ")}</option>}
        {panoge.map((p) => <option key={p.sifra} value={p.sifra}>{p.ime}</option>)}
      </select>
      {ok && <b className={ok === "✓" ? "bz-ok" : "bz-ne"}>{ok}</b>}
    </span>
  );
}

export function KontaktObrazec({ panoge, k = null }) {
  const [stanje, akcija, caka] = useActionState(shraniKontakt, null);
  return (
    <form action={akcija} className="bz-obr">
      {k && <input type="hidden" name="prejsnji" value={k.email} />}
      <div className="bz-polja">
        <div className="adm-polje s2"><label>E-naslov *</label><input name="email" type="email" required defaultValue={k?.email ?? ""} /></div>
        <div className="adm-polje"><label>Ime in priimek</label><input name="ime" defaultValue={k?.ime ?? ""} /></div>
        <div className="adm-polje"><label>Podjetje</label><input name="podjetje" defaultValue={k?.podjetje ?? ""} /></div>
        <div className="adm-polje"><label>Davčna</label><input name="davcna" defaultValue={k?.davcna ?? ""} /></div>
        <div className="adm-polje"><label>Telefon</label><input name="telefon" defaultValue={k?.telefon ?? ""} /></div>
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

const datum = (d) => (d ? new Date(d).toLocaleDateString("sl-SI") : "");

// Ena vrstica baze: hitra izbira panoge + »Uredi« odpre obrazec pod vrstico.
export function Vrstica({ k, panoge }) {
  const [odprto, setOdprto] = useState(false);
  return (
    <div className={`bz-k${odprto ? " odprt" : ""}`}>
      <div className="bz-vr">
        <span className="bz-mail" title={k.email}>{k.email}</span>
        <span className="ell" data-l="Ime">
          {k.ime || <span className="siv">—</span>}
          {k.podjetje && <span className="siv"> · {k.podjetje}</span>}
          {k.davcna && <span className="siv"> · SI{k.davcna}</span>}
        </span>
        <span data-l="Panoga"><PanogaIzbira email={k.email} panoge={panoge} izbrane={k.panoge ?? []} /></span>
        <span className="siv" data-l="Vir">{k.vir}</span>
        <span className="siv" data-l="Dodan">{datum(k.ustvarjeno)}</span>
        <span data-l="Stanje">
          {k.odjavljen ? <i className="znacka ne">odjavljen</i> : k.soglasje ? <i className="znacka da">soglasje</i> : <i className="znacka ne">brez soglasja</i>}
        </span>
        <button type="button" className="bz-uredi" onClick={() => setOdprto(!odprto)}>{odprto ? "Zapri ▴" : "Uredi ▾"}</button>
      </div>
      {odprto && (
        <div className="bz-det">
          <KontaktObrazec panoge={panoge} k={k} />
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
