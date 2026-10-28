"use client";

import { useMemo, useState } from "react";

const VIRI = [
  ["linkedin", "LinkedIn"],
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["google", "Google Ads"],
  ["youtube", "YouTube"],
  ["newsletter", "E-novice"],
  ["distributer", "Distributer"],
  ["sejem", "Sejem / tisk (QR)"],
];
const MEDIJI = [
  ["social", "objava (organsko)"],
  ["paid_social", "plačan oglas na omrežju"],
  ["cpc", "plačan klik (Google)"],
  ["email", "e-pošta"],
  ["referral", "povezava partnerja"],
  ["qr", "QR koda (letak, katalog)"],
];

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Naredi kampanjsko povezavo, da se obisk v statistiki pokaže pod pravo kampanjo.
export default function UtmGenerator() {
  const [stran, setStran] = useState("https://assystem.si/");
  const [kampanja, setKampanja] = useState("");
  const [vir, setVir] = useState("linkedin");
  const [medij, setMedij] = useState("social");
  const [vsebina, setVsebina] = useState("");
  const [kopirano, setKopirano] = useState(false);

  const povezava = useMemo(() => {
    if (!kampanja.trim()) return "";
    try {
      const u = new URL(stran.trim() || "https://assystem.si/");
      u.searchParams.set("utm_source", vir);
      u.searchParams.set("utm_medium", medij);
      u.searchParams.set("utm_campaign", slug(kampanja));
      if (vsebina.trim()) u.searchParams.set("utm_content", slug(vsebina));
      return u.toString();
    } catch {
      return "";
    }
  }, [stran, kampanja, vir, medij, vsebina]);

  async function kopiraj() {
    try {
      await navigator.clipboard.writeText(povezava);
      setKopirano(true);
      setTimeout(() => setKopirano(false), 1500);
    } catch {}
  }

  return (
    <div className="st-utm">
      <h3>Generator kampanjske povezave</h3>
      <p>Ime kampanje naj vsebuje regijo, npr. <code>dach-sidra-nov26</code>, <code>hr-trgovci-zima</code> — potem v tabeli zgoraj takoj vidiš, katera regija deluje.</p>
      <div className="st-utm-polja">
        <label>Stran<input value={stran} onChange={(e) => setStran(e.target.value)} placeholder="https://assystem.si/program/…" /></label>
        <label>Kampanja *<input value={kampanja} onChange={(e) => setKampanja(e.target.value)} placeholder="dach-sidra-nov26" /></label>
        <label>Kje bo povezava
          <select value={vir} onChange={(e) => setVir(e.target.value)}>
            {VIRI.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
          </select>
        </label>
        <label>Vrsta
          <select value={medij} onChange={(e) => setMedij(e.target.value)}>
            {MEDIJI.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
          </select>
        </label>
        <label>Različica (neobvezno)<input value={vsebina} onChange={(e) => setVsebina(e.target.value)} placeholder="video-a" /></label>
      </div>
      {povezava && (
        <div className="st-utm-rez">
          <code>{povezava}</code>
          <button type="button" className="gumb mini" onClick={kopiraj}>{kopirano ? "Kopirano ✓" : "Kopiraj"}</button>
        </div>
      )}
    </div>
  );
}
