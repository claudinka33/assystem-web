"use client";

import { useActionState, useState } from "react";
import { posljiTestENovice, posljiENoviceVsem } from "@/lib/akcije/enovice-posiljanje";

function Sporocilo({ s }) {
  if (!s) return null;
  return (
    <div className={s.stanje === "ok" ? "uspeh" : "opozorilo"} style={{ margin: "8px 0", padding: "8px 12px", fontSize: 13 }}>
      {s.sporocilo}
    </div>
  );
}

const korak = { fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#6e767e", margin: "0 0 8px" };
const blok = { borderTop: "1px solid #e4e6e8", paddingTop: 14, marginTop: 14 };
const vrsta = { display: "flex", gap: 8, alignItems: "center" };

export default function ENoviceObrazec({ segmenti, posiljatelj }) {
  const [html, setHtml] = useState("");
  const [testStanje, testAkcija, testCaka] = useActionState(posljiTestENovice, null);
  const [vsemStanje, vsemAkcija, vsemCaka] = useActionState(posljiENoviceVsem, null);
  const caka = testCaka || vsemCaka;
  const brezOdjave = html && !html.includes("{{{RESEND_UNSUBSCRIBE_URL}}}");

  return (
    <form style={{ display: "grid", gridTemplateColumns: "minmax(300px, 380px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
      {/* LEVO: vnos in pošiljanje */}
      <div className="adm-obr" style={{ maxWidth: "none", padding: 18 }}>
        <p style={korak}>1 · Vsebina</p>
        <div className="adm-polje">
          <label htmlFor="zadeva">Zadeva *</label>
          <input id="zadeva" name="zadeva" type="text" required placeholder="Novo: jekleno sidro ASfix TX1" />
        </div>
        <div className="adm-polje">
          <label htmlFor="html">HTML koda *</label>
          <textarea
            id="html"
            name="html"
            required
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Prilepi celotno HTML kodo maila"
            style={{ minHeight: 110, height: 110, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11 }}
          />
          {brezOdjave && (
            <p className="namig" style={{ color: "#cb2026" }}>
              Manjka povezava za odjavo {"{{{RESEND_UNSUBSCRIBE_URL}}}"}.
            </p>
          )}
        </div>
        <details style={{ fontSize: 13, marginBottom: 4 }}>
          <summary style={{ cursor: "pointer", color: "#6e767e" }}>Več možnosti</summary>
          <div className="adm-polje" style={{ marginTop: 10 }}>
            <label htmlFor="predogled">Predogledno besedilo</label>
            <input id="predogled" name="predogled" type="text" placeholder="Tekst pod zadevo v nabiralniku" />
          </div>
          <div className="adm-polje">
            <label htmlFor="posiljatelj">Pošiljatelj</label>
            <input id="posiljatelj" name="posiljatelj" type="text" defaultValue={posiljatelj} />
            <p className="namig">Odgovori gredo na info@as-system.si.</p>
          </div>
        </details>

        <div style={blok}>
          <p style={korak}>2 · Test</p>
          <div style={vrsta}>
            <input
              name="test_naslovi"
              type="text"
              defaultValue="claudia.seidl@as-system.si"
              aria-label="Testni naslovi"
              style={{ flex: 1, minWidth: 0, padding: "8px 10px", border: "1px solid #c6cace", fontSize: 13 }}
            />
            <button className="gumb siv mini" formAction={testAkcija} disabled={caka}>
              {testCaka ? "…" : "Pošlji test"}
            </button>
          </div>
          <Sporocilo s={testStanje} />
        </div>

        <div style={blok}>
          <p style={korak}>3 · Pošlji</p>
          <select
            name="segment"
            defaultValue=""
            aria-label="Segment"
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #c6cace", fontSize: 13, marginBottom: 8 }}
          >
            <option value="" disabled>
              {segmenti.length ? "Komu? (segment)" : "Ni segmentov v Resendu"}
            </option>
            {segmenti.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <label style={{ ...vrsta, fontSize: 13, marginBottom: 10 }}>
            <input name="potrditev" type="checkbox" />
            Test je pregledan – pošlji vsem
          </label>
          <button className="gumb" formAction={vsemAkcija} disabled={caka} style={{ width: "100%" }}>
            {vsemCaka ? "Pošiljam …" : "Pošlji vsem"}
          </button>
          <Sporocilo s={vsemStanje} />
        </div>
      </div>

      {/* DESNO: predogled */}
      <div style={{ position: "sticky", top: 16 }}>
        <iframe
          title="Predogled maila"
          srcDoc={
            html ||
            "<div style='font-family:sans-serif;color:#9aa0a6;display:flex;height:90vh;align-items:center;justify-content:center'>Predogled maila</div>"
          }
          sandbox=""
          style={{ width: "100%", height: "calc(100vh - 200px)", minHeight: 420, border: "1px solid #dde0e2", background: "#fff" }}
        />
      </div>
    </form>
  );
}
