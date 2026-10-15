"use client";

import { useActionState, useState } from "react";
import { posljiTestENovice, posljiENoviceVsem } from "@/lib/akcije/enovice-posiljanje";

function Sporocilo({ s }) {
  if (!s) return null;
  return <div className={s.stanje === "ok" ? "uspeh" : "opozorilo"}>{s.sporocilo}</div>;
}

export default function ENoviceObrazec({ segmenti, posiljatelj }) {
  const [html, setHtml] = useState("");
  const [testStanje, testAkcija, testCaka] = useActionState(posljiTestENovice, null);
  const [vsemStanje, vsemAkcija, vsemCaka] = useActionState(posljiENoviceVsem, null);
  const caka = testCaka || vsemCaka;
  const brezOdjave = html && !html.includes("{{{RESEND_UNSUBSCRIBE_URL}}}");

  return (
    <form className="adm-obr" style={{ maxWidth: "none" }}>
      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="zadeva">Zadeva *</label>
          <input id="zadeva" name="zadeva" type="text" required placeholder="Novo: jekleno sidro ASfix TX1 – ETA Option 1" />
        </div>
        <div className="adm-polje">
          <label htmlFor="posiljatelj">Pošiljatelj</label>
          <input id="posiljatelj" name="posiljatelj" type="text" defaultValue={posiljatelj} />
          <p className="namig">Domena mora biti potrjena v Resendu. Odgovori gredo na info@as-system.si.</p>
        </div>
      </div>

      <div className="adm-polje">
        <label htmlFor="predogled">Predogledno besedilo (neobvezno)</label>
        <input id="predogled" name="predogled" type="text" placeholder="Kratek tekst, ki se v nabiralniku izpiše pod zadevo" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20 }}>
        <div className="adm-polje">
          <label htmlFor="html">HTML koda maila *</label>
          <textarea
            id="html"
            name="html"
            required
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Sem prilepi celotno HTML kodo (od <!DOCTYPE html> do </html>)"
            style={{ minHeight: 620, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12 }}
          />
          {brezOdjave && (
            <p className="namig" style={{ color: "#cb2026" }}>
              V kodi ni povezave za odjavo {"{{{RESEND_UNSUBSCRIBE_URL}}}"} – za pošiljanje vsem jo dodaj.
            </p>
          )}
        </div>
        <div className="adm-polje">
          <label>Predogled</label>
          <iframe
            title="Predogled maila"
            srcDoc={html || "<p style='font-family:sans-serif;color:#999;padding:20px'>Tu se prikaže mail.</p>"}
            sandbox=""
            style={{ width: "100%", height: 620, border: "1px solid #dde0e2", background: "#fff" }}
          />
        </div>
      </div>

      {/* 1 · TEST */}
      <div style={{ borderTop: "1px solid #e4e6e8", marginTop: 10, paddingTop: 18 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 10px" }}>1 · Pošlji test</h2>
        <Sporocilo s={testStanje} />
        <div className="adm-vrsta" style={{ alignItems: "end" }}>
          <div className="adm-polje">
            <label htmlFor="test_naslovi">Testni naslovi</label>
            <input id="test_naslovi" name="test_naslovi" type="text" defaultValue="claudia.seidl@as-system.si" />
            <p className="namig">Več naslovov loči z vejico.</p>
          </div>
          <div className="adm-polje">
            <button className="gumb siv" formAction={testAkcija} disabled={caka}>
              {testCaka ? "Pošiljam …" : "Pošlji test"}
            </button>
          </div>
        </div>
      </div>

      {/* 2 · VSEM */}
      <div style={{ borderTop: "1px solid #e4e6e8", marginTop: 10, paddingTop: 18 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 10px" }}>2 · Pošlji prejemnikom</h2>
        <Sporocilo s={vsemStanje} />
        <div className="adm-polje">
          <label htmlFor="segment">Komu (segment v Resendu)</label>
          <select id="segment" name="segment" defaultValue="">
            <option value="" disabled>
              — izberi segment —
            </option>
            {segmenti.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {segmenti.length === 0 && <p className="namig">V Resendu še ni segmentov (Contacts → Segments).</p>}
        </div>
        <div className="adm-polje">
          <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center" }}>
            <input name="potrditev" type="checkbox" />
            Test sem pregledal(a) – pošlji vsem v izbranem segmentu
          </label>
        </div>
        <button className="gumb" formAction={vsemAkcija} disabled={caka}>
          {vsemCaka ? "Pošiljam …" : "Pošlji vsem"}
        </button>
      </div>
    </form>
  );
}
