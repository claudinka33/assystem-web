"use client";

import { useActionState, useState } from "react";
import { shraniPopup } from "@/lib/akcije/popup";

const krepko = (s) =>
  String(s ?? "")
    .split(/(\*\*[^*]+\*\*)/)
    .map((d, i) => (d.startsWith("**") && d.endsWith("**") ? <b key={i}>{d.slice(2, -2)}</b> : d));

export default function ObrazecPopup({ n }) {
  const [stanje, akcija, caka] = useActionState(shraniPopup, null);
  const [v, setV] = useState({ ...n, alineje: n.alineje.join("\n"), brezStrani: n.brezStrani.join("\n") });
  const sp = (k) => (e) => setV({ ...v, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <div className="pu-ured">
      <form action={akcija} className="adm-obr" style={{ maxWidth: "none" }}>
        <label className="pu-vkl">
          <input type="checkbox" name="vklopljen" checked={v.vklopljen} onChange={sp("vklopljen")} /> Pop-up je vklopljen
        </label>
        <div className="pu-mreza">
          <div className="adm-polje"><label>Pokaži po (sekund)</label><input name="zakasnitev" type="number" min="0" value={v.zakasnitev} onChange={sp("zakasnitev")} /></div>
          <div className="adm-polje"><label>Po zaprtju ne pokaži (dni)</label><input name="premor" type="number" min="0" value={v.premor} onChange={sp("premor")} /></div>
          <div className="adm-polje"><label>Značka</label><input name="znacka" value={v.znacka} onChange={sp("znacka")} /></div>
          <div className="adm-polje"><label>Naslov levo (rdeče)</label><input name="naslovLevo" value={v.naslovLevo} onChange={sp("naslovLevo")} /></div>
        </div>
        <div className="adm-polje"><label>Alineje levo (vsaka v svoji vrstici, največ 6)</label><textarea name="alineje" rows={4} value={v.alineje} onChange={sp("alineje")} /></div>
        <div className="adm-polje"><label>Nadnaslov</label><input name="nadnaslov" value={v.nadnaslov} onChange={sp("nadnaslov")} /></div>
        <div className="adm-polje"><label>Naslov</label><input name="naslov" value={v.naslov} onChange={sp("naslov")} /></div>
        <div className="adm-polje"><label>Opis (**besedilo** = krepko)</label><textarea name="opis" rows={3} value={v.opis} onChange={sp("opis")} /></div>
        <div className="pu-mreza">
          <div className="adm-polje"><label>Besedilo gumba</label><input name="gumb" value={v.gumb} onChange={sp("gumb")} /></div>
          <div className="adm-polje"><label>Zahvala — naslov</label><input name="hvalaNaslov" value={v.hvalaNaslov} onChange={sp("hvalaNaslov")} /></div>
        </div>
        <div className="adm-polje"><label>Zahvala — besedilo</label><textarea name="hvalaBesedilo" rows={2} value={v.hvalaBesedilo} onChange={sp("hvalaBesedilo")} /></div>
        <div className="adm-polje"><label>Strani brez pop-upa (ena na vrstico, velja tudi za podstrani)</label><textarea name="brezStrani" rows={4} value={v.brezStrani} onChange={sp("brezStrani")} /></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="gumb" type="submit" disabled={caka}>{caka ? "Shranjujem …" : "Shrani"}</button>
          {stanje?.ok && <span style={{ color: "#1a7f3c", fontWeight: 600 }}>✓ Shranjeno — na strani velja takoj.</span>}
          {stanje?.napaka && <span style={{ color: "#c8102e" }}>{stanje.napaka}</span>}
        </div>
      </form>

      <div className="pu-pred">
        <div className="adm-nad" style={{ marginBottom: 6 }}>Predogled</div>
        <div className="popb2b pu-popb2b">
          <div className="popb2b-levo">
            {v.znacka && <span className="popb2b-znacka">{v.znacka}</span>}
            <b>{v.naslovLevo}</b>
            <ul>{v.alineje.split("\n").filter((x) => x.trim()).map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
          <div className="popb2b-desno">
            {v.nadnaslov && <p className="popb2b-nad">{v.nadnaslov}</p>}
            <h2>{v.naslov}</h2>
            <p className="popb2b-opis">{krepko(v.opis)}</p>
            <div className="pu-polje">Službeni e-naslov *</div>
            <div className="popb2b-vrsta"><div className="pu-polje">Podjetje</div><div className="pu-polje">Telefon</div></div>
            <div className="popb2b-gumb" style={{ textAlign: "center", marginTop: 10 }}>{v.gumb}</div>
          </div>
        </div>
        {!v.vklopljen && <p style={{ color: "#c8102e", fontWeight: 600 }}>Pop-up je izklopljen — na strani se ne prikaže.</p>}
      </div>
    </div>
  );
}
