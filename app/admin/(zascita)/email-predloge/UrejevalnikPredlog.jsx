"use client";

import { useActionState, useEffect, useState } from "react";
import { shraniPredlogo } from "@/lib/akcije/email-predloge";
import { OPISI_SPREMENLJIVK, POLJA, PRIMERI, PRIMERI_HTML, sestaviHtml, zadevaIz } from "@/lib/email-predloge";

function Predloga({ p }) {
  const [stanje, akcija, caka] = useActionState(shraniPredlogo, null);
  const [v, setV] = useState(p.vrednost);
  useEffect(() => {
    if (stanje?.ponastavljeno) setV(stanje.ponastavljeno);
  }, [stanje]);
  const sp = (k) => (e) => setV({ ...v, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const vmes = p.kljuc === "narocilo_potrdilo"
    ? '<div style="border:1px dashed #c9ccd0;padding:10px;color:#6e7276;font-size:13px;margin:0 0 12px;">Tabela artiklov, zneski in podatki o dostavi (samodejno)</div>'
    : p.kljuc === "admin_vabilo"
      ? '<ul style="margin:0 0 12px;padding-left:20px;"><li>Novice</li><li>Povpraševanja</li></ul>'
      : "";
  const html = sestaviHtml(v, { vrednosti: PRIMERI, html: PRIMERI_HTML, povezava: p.gumb ? "#" : null, vmes });

  return (
    <div className="ep-ured">
      <form action={akcija} className="adm-obr" style={{ maxWidth: "none" }}>
        <input type="hidden" name="kljuc" value={p.kljuc} />
        <p className="adm-namig" style={{ margin: "0 0 10px" }}><b>Kdaj:</b> {p.kdaj}</p>
        {p.izklopljivo && (
          <label className="pu-vkl">
            <input type="checkbox" name="vklopljeno" checked={Boolean(v.vklopljeno)} onChange={sp("vklopljeno")} /> Pošiljanje je vklopljeno
          </label>
        )}
        {POLJA.filter((f) => !f.samoZGumbom || p.gumb).map((f) => (
          <div className="adm-polje" key={f.k}>
            <label>{f.oznaka}</label>
            {f.vrstice > 1
              ? <textarea name={f.k} rows={f.vrstice} value={v[f.k] ?? ""} onChange={sp(f.k)} />
              : <input name={f.k} value={v[f.k] ?? ""} onChange={sp(f.k)} />}
          </div>
        ))}
        <div className="ep-spr">
          {p.spremenljivke.map((s) => (
            <span key={s} title={p.opisSpremenljivk[s] || OPISI_SPREMENLJIVK[s] || ""}><code>{`{${s}}`}</code> {p.opisSpremenljivk[s] || OPISI_SPREMENLJIVK[s]}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="gumb" type="submit" name="dejanje" value="shrani" disabled={caka}>{caka ? "Shranjujem …" : "Shrani"}</button>
          <button className="gumb siv" type="submit" name="dejanje" value="test" disabled={caka}>Shrani in pošlji test meni</button>
          <button className="gumb siv" type="submit" name="dejanje" value="ponastavi" disabled={caka}
            onClick={(e) => { if (!confirm("Vrnem na privzeto besedilo?")) e.preventDefault(); }}>Privzeto besedilo</button>
          {stanje?.ok && <span style={{ color: "#1a7f3c", fontWeight: 600 }}>✓ {stanje.ok}</span>}
          {stanje?.napaka && <span style={{ color: "#c8102e" }}>{stanje.napaka}</span>}
        </div>
      </form>
      <div className="ep-pred">
        <div className="adm-nad" style={{ marginBottom: 6 }}>Predogled</div>
        <div className="ep-zadeva"><span>Zadeva:</span> {zadevaIz(v, PRIMERI)}</div>
        <div className="ep-mail" dangerouslySetInnerHTML={{ __html: html }} />
        {p.izklopljivo && !v.vklopljeno && <p style={{ color: "#c8102e", fontWeight: 600 }}>Izklopljeno — stranke tega sporočila ne dobijo.</p>}
      </div>
    </div>
  );
}

function UrejevalnikPredlog({ predloge }) {
  const [odprta, setOdprta] = useState(null);
  const skupine = [...new Set(predloge.map((p) => p.skupina))];
  return (
    <div className="ep">
      {skupine.map((sk) => (
        <section key={sk} className="ep-skupina">
          <h2>{sk}</h2>
          {predloge.filter((p) => p.skupina === sk).map((p) => (
            <div key={p.kljuc} className={`ep-kartica${odprta === p.kljuc ? " odprta" : ""}`}>
              <button type="button" className="ep-glava" onClick={() => setOdprta(odprta === p.kljuc ? null : p.kljuc)}>
                <b>{p.naziv}</b>
                <span className="ep-zad">{p.vrednost.zadeva}</span>
                {p.izklopljivo && <span className={`ep-oznaka ${p.vrednost.vklopljeno ? "da" : "ne"}`}>{p.vrednost.vklopljeno ? "vklopljeno" : "izklopljeno"}</span>}
                {p.spremenjeno && <span className="ep-oznaka spr">spremenjeno</span>}
                <span className="ep-puscica">{odprta === p.kljuc ? "▲" : "▼"}</span>
              </button>
              {odprta === p.kljuc && <Predloga p={p} />}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export default UrejevalnikPredlog;
