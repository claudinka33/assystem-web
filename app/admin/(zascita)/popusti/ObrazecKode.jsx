"use client";

import { useActionState, useState } from "react";
import { shraniKodo } from "@/lib/akcije/popusti-admin";

const VELJA = {
  trgovina: "celotno naročilo",
  kategorija: "izbrano kategorijo",
  znamka: "izbrano znamko",
  artikel: "en artikel",
};

function nakljucna() {
  const c = "ABCDEFGHJKLMNPRSTUVZ23456789";
  return "AS" + Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join("");
}

export default function ObrazecKode({ kategorije, znamke }) {
  const [stanje, akcija, cakam] = useActionState(shraniKodo, null);
  const [koda, setKoda] = useState("");
  const [tip, setTip] = useState("odstotek");
  const [vrednost, setVrednost] = useState("");
  const [veljaZa, setVeljaZa] = useState("trgovina");
  const [kupci, setKupci] = useState("vsi");
  const [min, setMin] = useState("");
  const [do_, setDo] = useState("");

  const popust =
    tip === "dostava" ? "Brezplačna dostava" : tip === "odstotek" ? `−${vrednost || "?"} %` : `−${vrednost || "?"} €`;

  return (
    <form action={akcija} className="kupon-obrazec" key={stanje?.ok ?? "nova"}>
      <div className="kupon-polja">
        <h2>Nova koda za popust</h2>
        {stanje?.napaka && <div className="opozorilo">{stanje.napaka}</div>}
        {stanje?.ok && <div className="uspeh">{stanje.ok}</div>}

        <div className="kupon-korak">
          <span className="korak-st">1</span>
          <div className="korak-vsebina">
            <h3>Koda in popust</h3>
            <div className="adm-vrsta-3">
              <div className="adm-polje">
                <label>Koda *</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input name="koda" required value={koda} onChange={(e) => setKoda(e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="JESEN10" style={{ textTransform: "uppercase", fontWeight: 600, letterSpacing: ".5px" }} />
                  <button type="button" className="gumb siv mini" onClick={() => setKoda(nakljucna())} title="Ustvari naključno kodo">⟳</button>
                </div>
              </div>
              <div className="adm-polje">
                <label>Vrsta popusta</label>
                <select name="tip" value={tip} onChange={(e) => setTip(e.target.value)}>
                  <option value="odstotek">Odstotek (%)</option>
                  <option value="znesek">Fiksen znesek (€ z DDV)</option>
                  <option value="dostava">Brezplačna dostava</option>
                </select>
              </div>
              {tip !== "dostava" ? (
                <div className="adm-polje">
                  <label>{tip === "odstotek" ? "Popust v %" : "Znesek v € (z DDV)"} *</label>
                  <input name="vrednost" inputMode="decimal" value={vrednost} onChange={(e) => setVrednost(e.target.value)} placeholder={tip === "odstotek" ? "10" : "5,00"} />
                </div>
              ) : <div />}
            </div>
          </div>
        </div>

        <div className="kupon-korak">
          <span className="korak-st">2</span>
          <div className="korak-vsebina">
            <h3>Za kaj in za koga velja</h3>
            <div className="adm-vrsta-3">
              <div className="adm-polje">
                <label>Velja za</label>
                <select name="velja_za" value={veljaZa} onChange={(e) => setVeljaZa(e.target.value)}>
                  <option value="trgovina">Celotno naročilo</option>
                  <option value="kategorija">Kategorijo izdelkov</option>
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
                <div className="adm-polje"><label>Šifra artikla *</label><input name="artikel_sifra" placeholder="AFM9214007505210" /></div>
              )}
              {veljaZa === "trgovina" && <div />}
              <div className="adm-polje">
                <label>Kupci</label>
                <select name="kupci" value={kupci} onChange={(e) => setKupci(e.target.value)}>
                  <option value="vsi">Vsi kupci</option>
                  <option value="b2c">Samo fizične osebe (B2C)</option>
                  <option value="b2b">Samo podjetja (B2B)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="kupon-korak">
          <span className="korak-st">3</span>
          <div className="korak-vsebina">
            <h3>Pogoji <span className="opomba">— vse neobvezno</span></h3>
            <div className="adm-vrsta-3">
              <div className="adm-polje"><label>Najmanjši nakup (€)</label><input name="min_znesek" inputMode="decimal" value={min} onChange={(e) => setMin(e.target.value)} placeholder="brez omejitve" /></div>
              <div className="adm-polje"><label>Velja od</label><input name="velja_od" type="date" /></div>
              <div className="adm-polje"><label>Velja do</label><input name="velja_do" type="date" value={do_} onChange={(e) => setDo(e.target.value)} /></div>
            </div>
            <div className="adm-vrsta">
              <div className="adm-polje"><label>Največ uporab skupaj</label><input name="max_uporab" inputMode="numeric" placeholder="neomejeno" /></div>
              <div className="adm-polje"><label>Interni opis</label><input name="opis" placeholder="npr. jesenska akcija za monterje" /></div>
            </div>
          </div>
        </div>
      </div>

      <aside className="kupon-predogled">
        <small>Predogled</small>
        <div className="kupon">
          <div className="kupon-vrh">
            <span>AS system</span>
            <b>{popust}</b>
          </div>
          <div className="kupon-koda">{koda || "KODA"}</div>
          <ul>
            <li>Velja za {VELJA[veljaZa]}</li>
            <li>{kupci === "vsi" ? "Za vse kupce" : kupci === "b2b" ? "Samo za podjetja" : "Samo za fizične osebe"}</li>
            {min && <li>Ob nakupu nad {min} €</li>}
            {do_ && <li>Do {new Date(do_).toLocaleDateString("sl-SI")}</li>}
          </ul>
        </div>
        <button className="gumb" type="submit" disabled={cakam} style={{ width: "100%", marginTop: 16 }}>
          {cakam ? "Shranjujem …" : "Ustvari kodo"}
        </button>
      </aside>
    </form>
  );
}
