"use client";

import { useActionState, useState, useTransition } from "react";
import { poisciPodjetje, ustvariB2B } from "@/lib/akcije/b2b";

const prazno = { podjetje: "", naslov: "", posta: "", kraj: "", vasco_partner: "" };

// Ovoj: "+ Nov B2B kupec" odpre obrazec; vsak nov kupec dobi svež obrazec (key).
export default function NovB2B() {
  const [odprto, setOdprto] = useState(false);
  const [st, setSt] = useState(0);
  if (!odprto)
    return (
      <button className="gumb" type="button" onClick={() => setOdprto(true)} style={{ marginBottom: 18 }}>
        + Nov B2B kupec
      </button>
    );
  return <Obrazec key={st} zapri={() => setOdprto(false)} znova={() => setSt((x) => x + 1)} />;
}

function Obrazec({ zapri, znova }) {
  const [davcna, setDavcna] = useState("");
  const [podj, setPodj] = useState(prazno);
  const [iskanje, setIskanje] = useState(null);
  const [isce, zacni] = useTransition();
  const [stanje, akcija, cakam] = useActionState(ustvariB2B, null);

  const poisci = () =>
    zacni(async () => {
      const r = await poisciPodjetje(davcna);
      setIskanje(r);
      if (r?.davcna) setDavcna(r.davcna);
      if (r?.najdeno) setPodj({ podjetje: r.podjetje, naslov: r.naslov, posta: r.posta, kraj: r.kraj, vasco_partner: r.vasco_partner ?? "" });
    });

  return (
    <div className="adm-obr" style={{ marginBottom: 22, borderLeft: "4px solid #cb2026" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Nov B2B kupec</h3>
        <button className="gumb siv" type="button" onClick={zapri}>Zapri</button>
      </div>

      {stanje?.ok ? (
        <div style={{ marginTop: 14 }}>
          <p>
            ✅ <b>{stanje.podjetje}</b> dodano. Povabilo je poslano na <b>{stanje.email}</b> — kupec klikne povezavo, potrdi e-naslov in si
            nastavi geslo.{" "}
            {stanje.aktiven ? "Podjetje je že povezano z Vascom — dostop do cen je aktiven takoj." : "Ko as-terminal najde partnerja v Vascu (po davčni), se dostop aktivira sam."}
          </p>
          <button className="gumb" type="button" onClick={znova}>+ Nov kupec / uporabnik</button>
        </div>
      ) : (
        <form action={akcija} style={{ marginTop: 14 }}>
          {stanje?.napaka && <div className="opozorilo" style={{ marginBottom: 12 }}>{stanje.napaka}</div>}

          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="adm-polje" style={{ marginBottom: 0, width: 200 }}>
              <label>Davčna številka *</label>
              <input
                name="davcna"
                required
                value={davcna}
                onChange={(e) => setDavcna(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    poisci();
                  }
                }}
                placeholder="SI12345678"
                inputMode="text"
              />
            </div>
            <button className="gumb siv" type="button" onClick={poisci} disabled={isce || davcna.replace(/\D/g, "").length < 8}>
              {isce ? "Iščem …" : "Poišči podjetje"}
            </button>
          </div>
          {iskanje?.napaka && <p style={{ color: "#cb2026", fontSize: 13, margin: "8px 0 0" }}>{iskanje.napaka}</p>}
          {iskanje?.najdeno && iskanje.vir !== "obstojece" && (
            <p style={{ color: "#2e7d32", fontSize: 13, margin: "8px 0 0" }}>Najdeno v registru FURS/VIES — preveri podatke.</p>
          )}
          {iskanje?.vir === "obstojece" && (
            <div style={{ background: "#fff7e6", border: "1px solid #f0d199", padding: "8px 12px", fontSize: 13, marginTop: 8 }}>
              <b>Podjetje že ima B2B dostop</b> — dodajaš novega uporabnika istega podjetja
              {iskanje.aktiven ? " (povezan z Vascom, nov uporabnik bo takoj aktiven)" : ""}.
              <br />
              Obstoječi: {iskanje.uporabniki.join("; ")}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 14px", marginTop: 14 }}>
            <div className="adm-polje" style={{ gridColumn: "1 / -1" }}>
              <label>Naziv podjetja *</label>
              <input name="podjetje" required value={podj.podjetje} onChange={(e) => setPodj({ ...podj, podjetje: e.target.value })} />
            </div>
            <div className="adm-polje" style={{ gridColumn: "1 / -1" }}>
              <label>Naslov</label>
              <input name="naslov" value={podj.naslov} onChange={(e) => setPodj({ ...podj, naslov: e.target.value })} />
            </div>
            <div className="adm-polje">
              <label>Pošta</label>
              <input name="posta" value={podj.posta} onChange={(e) => setPodj({ ...podj, posta: e.target.value })} inputMode="numeric" />
            </div>
            <div className="adm-polje">
              <label>Kraj</label>
              <input name="kraj" value={podj.kraj} onChange={(e) => setPodj({ ...podj, kraj: e.target.value })} />
            </div>
            <div className="adm-polje">
              <label>Kontaktna oseba (ime in priimek) *</label>
              <input name="ime" required autoComplete="off" />
            </div>
            <div className="adm-polje">
              <label>E-naslov za prijavo *</label>
              <input name="email" type="email" required autoComplete="off" />
            </div>
            <div className="adm-polje">
              <label>Telefon</label>
              <input name="telefon" type="tel" autoComplete="off" />
            </div>
            <div className="adm-polje">
              <label>Šifra partnerja v Vascu (če jo poznaš)</label>
              <input
                name="vasco_partner"
                inputMode="numeric"
                placeholder="neobvezno — poveže se sam po davčni"
                value={podj.vasco_partner}
                onChange={(e) => setPodj({ ...podj, vasco_partner: e.target.value })}
              />
            </div>
            <div className="adm-polje" style={{ gridColumn: "1 / -1" }}>
              <label>Dodatni kontakti (nabava, računovodstvo …)</label>
              <textarea name="kontakti" rows={2} placeholder="npr. Janez Novak, nabava, janez@podjetje.si, 041 123 456" />
            </div>
            <div className="adm-polje" style={{ gridColumn: "1 / -1" }}>
              <label>Interna opomba</label>
              <input name="opomba_interna" />
            </div>
          </div>

          <button className="gumb" type="submit" disabled={cakam}>{cakam ? "Pošiljam …" : "Ustvari in pošlji povabilo"}</button>
          <p style={{ fontSize: 13, color: "#6e767e", margin: "10px 0 0" }}>
            Kupec dobi e-sporočilo s povezavo: potrdi e-naslov in si sam nastavi geslo. Šifre partnerja ni treba vpisati — as-terminal partnerja v Vascu poišče po davčni. Vpiši jo le, če je v Vascu podjetje pod drugo šifro.
          </p>
        </form>
      )}
    </div>
  );
}
