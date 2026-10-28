"use client";

import { useActionState, useState, useTransition } from "react";
import { poisciPodjetje, ustvariB2B } from "@/lib/akcije/b2b";

const prazno = { podjetje: "", naslov: "", posta: "", kraj: "" };

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
      if (r?.najdeno) setPodj({ podjetje: r.podjetje, naslov: r.naslov, posta: r.posta, kraj: r.kraj });
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
            nastavi geslo. Ko as-terminal najde partnerja v Vascu, se dostop aktivira sam.
          </p>
          <button className="gumb" type="button" onClick={znova}>+ Še en kupec</button>
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
          {iskanje?.najdeno && <p style={{ color: "#2e7d32", fontSize: 13, margin: "8px 0 0" }}>Najdeno v registru FURS/VIES — preveri podatke.</p>}
          {iskanje?.obstojeci && (
            <p style={{ color: "#b26a00", fontSize: 13, margin: "6px 0 0" }}>Za to davčno že obstaja B2B dostop: {iskanje.obstojeci.join(", ")}</p>
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
              <input name="vasco_partner" inputMode="numeric" placeholder="neobvezno" />
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
            Kupec dobi e-sporočilo s povezavo: potrdi e-naslov in si sam nastavi geslo. Dostop do cen dobi, ko je partner najden v Vascu.
          </p>
        </form>
      )}
    </div>
  );
}
