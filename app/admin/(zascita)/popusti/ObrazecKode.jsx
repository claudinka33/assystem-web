"use client";

import { useActionState, useState } from "react";
import { shraniKodo } from "@/lib/akcije/popusti-admin";

export default function ObrazecKode({ kategorije, znamke }) {
  const [stanje, akcija, cakam] = useActionState(shraniKodo, null);
  const [tip, setTip] = useState("odstotek");
  const [veljaZa, setVeljaZa] = useState("trgovina");
  const vrsta = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 };

  return (
    <form action={akcija} className="adm-obr" key={stanje?.ok ?? "nova"}>
      <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Nova koda</h2>
      {stanje?.napaka && <div className="opozorilo">{stanje.napaka}</div>}
      {stanje?.ok && <div className="opozorilo" style={{ background: "#eaf6ee", borderColor: "#1a7f3c" }}>{stanje.ok}</div>}
      <div style={vrsta}>
        <div className="adm-polje"><label>Koda *</label><input name="koda" required placeholder="npr. JESEN10" style={{ textTransform: "uppercase" }} /></div>
        <div className="adm-polje">
          <label>Vrsta popusta</label>
          <select name="tip" value={tip} onChange={(e) => setTip(e.target.value)}>
            <option value="odstotek">Odstotek (%)</option>
            <option value="znesek">Fiksen znesek (€ z DDV)</option>
            <option value="dostava">Brezplačna dostava</option>
          </select>
        </div>
        {tip !== "dostava" && (
          <div className="adm-polje"><label>{tip === "odstotek" ? "Popust v %" : "Znesek v € (z DDV)"} *</label><input name="vrednost" inputMode="decimal" placeholder={tip === "odstotek" ? "10" : "5,00"} /></div>
        )}
        <div className="adm-polje">
          <label>Velja za</label>
          <select name="velja_za" value={veljaZa} onChange={(e) => setVeljaZa(e.target.value)}>
            <option value="trgovina">Celotno naročilo (vsa trgovina)</option>
            <option value="kategorija">Segment programa (kategorija)</option>
            <option value="znamka">Blagovno znamko</option>
            <option value="artikel">En artikel (šifra)</option>
          </select>
        </div>
        {veljaZa === "kategorija" && (
          <div className="adm-polje">
            <label>Kategorija *</label>
            <select name="kategorija_id">
              <option value="">— izberi —</option>
              {kategorije.map((k) => <option key={k.id} value={k.id}>{k.naziv}</option>)}
            </select>
          </div>
        )}
        {veljaZa === "znamka" && (
          <div className="adm-polje">
            <label>Znamka *</label>
            <select name="znamka">{znamke.map((z) => <option key={z}>{z}</option>)}</select>
          </div>
        )}
        {veljaZa === "artikel" && (
          <div className="adm-polje"><label>Šifra artikla *</label><input name="artikel_sifra" placeholder="npr. AFM9214007505210" /></div>
        )}
        <div className="adm-polje">
          <label>Kupci</label>
          <select name="kupci" defaultValue="vsi">
            <option value="vsi">Vsi</option>
            <option value="b2c">Samo fizične osebe (B2C)</option>
            <option value="b2b">Samo podjetja (B2B)</option>
          </select>
        </div>
        <div className="adm-polje"><label>Najmanjši nakup (€ z DDV)</label><input name="min_znesek" inputMode="decimal" placeholder="neobvezno" /></div>
        <div className="adm-polje"><label>Največ uporab skupaj</label><input name="max_uporab" inputMode="numeric" placeholder="neomejeno" /></div>
        <div className="adm-polje"><label>Velja od</label><input name="velja_od" type="date" /></div>
        <div className="adm-polje"><label>Velja do</label><input name="velja_do" type="date" /></div>
      </div>
      <div className="adm-polje"><label>Interni opis</label><input name="opis" placeholder="npr. jesenska akcija za monterje" /></div>
      <button className="gumb" type="submit" disabled={cakam}>{cakam ? "Shranjujem …" : "Ustvari kodo"}</button>
    </form>
  );
}
