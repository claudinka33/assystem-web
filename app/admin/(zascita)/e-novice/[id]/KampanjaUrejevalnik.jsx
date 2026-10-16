"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  shraniKampanjo,
  posljiTest,
  posljiKampanjo,
  shraniKotPredlogo,
  izbrisiKampanjo,
} from "@/lib/akcije/enovice-kampanje";

const UNSUB = "{{{RESEND_UNSUBSCRIBE_URL}}}";

const korak = { fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#6e767e", margin: "0 0 8px" };
const blok = { borderTop: "1px solid #e4e6e8", paddingTop: 14, marginTop: 14 };
const vrsta = { display: "flex", gap: 8, alignItems: "center" };
const vnos = { width: "100%", padding: "8px 10px", border: "1px solid #c6cace", borderRadius: 6, fontSize: 13, font: "inherit" };

function Sporocilo({ s }) {
  if (!s) return null;
  return (
    <div className={s.stanje === "ok" ? "uspeh" : "opozorilo"} style={{ margin: "8px 0", padding: "8px 12px", fontSize: 13 }}>
      {s.sporocilo}
    </div>
  );
}

// datetime-local zahteva "YYYY-MM-DDTHH:mm" v lokalnem času
function lokalno(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function KampanjaUrejevalnik({ kampanja, segmenti, privzetiPosiljatelj }) {
  const router = useRouter();
  const jePredloga = kampanja.status === "predloga";

  const [v, setV] = useState({
    naziv: kampanja.naziv ?? "",
    zadeva: kampanja.zadeva ?? "",
    predogled: kampanja.predogled ?? "",
    posiljatelj: kampanja.posiljatelj || privzetiPosiljatelj,
    html: kampanja.html ?? "",
  });
  const [segment, setSegment] = useState(kampanja.segment_id ?? "");
  const [kdaj, setKdaj] = useState("zdaj");
  const [cas, setCas] = useState(() => {
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    d.setHours(8, 0, 0, 0);
    return lokalno(d);
  });
  const [potrjeno, setPotrjeno] = useState(false);
  const [testNaslovi, setTestNaslovi] = useState("claudia.seidl@as-system.si");

  const [shranjeno, setShranjeno] = useState(kampanja.posodobljeno);
  const [shranjujem, setShranjujem] = useState(false);
  const [napakaShr, setNapakaShr] = useState(null);
  const [testS, setTestS] = useState(null);
  const [posljiS, setPosljiS] = useState(null);
  const [predlogaS, setPredlogaS] = useState(null);
  const [caka, zacni] = useTransition();

  const nastavi = (polje) => (e) => setV((x) => ({ ...x, [polje]: e.target.value }));

  // ---- samodejno shranjevanje (1,2 s po zadnji spremembi) ----
  const prvic = useRef(true);
  const zadnje = useRef(JSON.stringify(v));
  useEffect(() => {
    if (prvic.current) {
      prvic.current = false;
      return;
    }
    const json = JSON.stringify(v);
    if (json === zadnje.current) return;
    const t = setTimeout(async () => {
      setShranjujem(true);
      const r = await shraniKampanjo(kampanja.id, v).catch((e) => ({ ok: false, napaka: e.message }));
      setShranjujem(false);
      if (r.ok) {
        zadnje.current = json;
        setShranjeno(r.posodobljeno);
        setNapakaShr(null);
      } else setNapakaShr(r.napaka);
    }, 1200);
    return () => clearTimeout(t);
  }, [v, kampanja.id]);

  // opozorilo pred zapiranjem, če sprememba še ni shranjena
  useEffect(() => {
    const h = (e) => {
      if (JSON.stringify(v) !== zadnje.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [v]);

  const segmentIme = segmenti.find((s) => s.id === segment)?.name ?? kampanja.segment_ime ?? "";
  const brezOdjave = v.html && !v.html.includes(UNSUB);

  function test() {
    setTestS(null);
    zacni(async () => setTestS(await posljiTest(kampanja.id, v, testNaslovi)));
  }

  function poslji() {
    setPosljiS(null);
    const iso = kdaj === "nacrt" ? new Date(cas).toISOString() : null;
    const besedilo =
      kdaj === "nacrt"
        ? `Načrtujem pošiljanje »${v.zadeva}« segmentu »${segmentIme}« za ${new Date(cas).toLocaleString("sl-SI")}?`
        : `Res pošljem »${v.zadeva}« VSEM v segmentu »${segmentIme}« ZDAJ?`;
    if (!window.confirm(besedilo)) return;
    zacni(async () => {
      const r = await posljiKampanjo(kampanja.id, v, { segmentId: segment, segmentIme, kdaj: iso, potrjeno });
      setPosljiS(r);
      if (r.stanje === "ok") {
        zadnje.current = JSON.stringify(v);
        router.refresh();
      }
    });
  }

  function kotPredloga() {
    const ime = window.prompt("Ime predloge:", v.naziv || v.zadeva || "Predloga");
    if (!ime) return;
    setPredlogaS(null);
    zacni(async () => {
      const r = await shraniKotPredlogo(kampanja.id, { ...v, ime_predloge: ime });
      setPredlogaS({ stanje: r.ok ? "ok" : "napaka", sporocilo: r.ok ? r.sporocilo : r.napaka });
    });
  }

  function izbrisi() {
    if (!window.confirm(jePredloga ? "Izbrišem predlogo?" : "Izbrišem ta osnutek?")) return;
    zadnje.current = JSON.stringify(v);
    const fd = new FormData();
    fd.set("id", kampanja.id);
    fd.set("nazaj", "1");
    zacni(() => izbrisiKampanjo(fd));
  }

  const stanjeShr = napakaShr ? (
    <span style={{ color: "#cb2026" }}>Ni shranjeno: {napakaShr}</span>
  ) : shranjujem ? (
    "Shranjujem …"
  ) : (
    `Shranjeno ${shranjeno ? new Date(shranjeno).toLocaleTimeString("sl-SI", { hour: "2-digit", minute: "2-digit" }) : ""}`
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 400px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
      {/* LEVO: vnos in pošiljanje */}
      <div className="adm-obr" style={{ maxWidth: "none", padding: 18 }}>
        <div style={{ ...vrsta, justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ ...korak, margin: 0 }}>1 · Vsebina</p>
          <span style={{ fontSize: 12, color: "#6e767e" }}>{stanjeShr}</span>
        </div>

        {jePredloga && (
          <div className="adm-polje">
            <label htmlFor="naziv">Ime predloge</label>
            <input id="naziv" type="text" value={v.naziv} onChange={nastavi("naziv")} />
          </div>
        )}
        <div className="adm-polje">
          <label htmlFor="zadeva">Zadeva *</label>
          <input id="zadeva" type="text" value={v.zadeva} onChange={nastavi("zadeva")} placeholder="Novo: jekleno sidro ASfix TX1" />
        </div>
        <div className="adm-polje">
          <label htmlFor="html">HTML koda *</label>
          <textarea
            id="html"
            value={v.html}
            onChange={nastavi("html")}
            placeholder="Prilepi celotno HTML kodo maila"
            style={{ minHeight: 110, height: 110, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11 }}
          />
          {brezOdjave && (
            <p className="namig" style={{ color: "#cb2026" }}>
              Manjka povezava za odjavo {UNSUB}.
            </p>
          )}
        </div>
        <details style={{ fontSize: 13, marginBottom: 4 }}>
          <summary style={{ cursor: "pointer", color: "#6e767e" }}>Več možnosti</summary>
          {!jePredloga && (
            <div className="adm-polje" style={{ marginTop: 10 }}>
              <label htmlFor="naziv">Interno ime</label>
              <input id="naziv" type="text" value={v.naziv} onChange={nastavi("naziv")} placeholder="npr. TXm1 – trgovci okt 2026" />
            </div>
          )}
          <div className="adm-polje" style={{ marginTop: jePredloga ? 10 : 0 }}>
            <label htmlFor="predogled">Predogledno besedilo</label>
            <input id="predogled" type="text" value={v.predogled} onChange={nastavi("predogled")} placeholder="Tekst pod zadevo v nabiralniku" />
          </div>
          <div className="adm-polje">
            <label htmlFor="posiljatelj">Pošiljatelj</label>
            <input id="posiljatelj" type="text" value={v.posiljatelj} onChange={nastavi("posiljatelj")} />
            <p className="namig">Odgovori gredo na info@as-system.si.</p>
          </div>
        </details>

        {!jePredloga && (
          <>
            <div style={blok}>
              <p style={korak}>2 · Test</p>
              <div style={vrsta}>
                <input
                  type="text"
                  value={testNaslovi}
                  onChange={(e) => setTestNaslovi(e.target.value)}
                  aria-label="Testni naslovi"
                  style={{ ...vnos, flex: 1, minWidth: 0 }}
                />
                <button type="button" className="gumb siv mini" onClick={test} disabled={caka}>
                  Pošlji test
                </button>
              </div>
              <Sporocilo s={testS} />
            </div>

            <div style={blok}>
              <p style={korak}>3 · Pošlji</p>
              <select value={segment} onChange={(e) => setSegment(e.target.value)} aria-label="Segment" style={{ ...vnos, marginBottom: 10 }}>
                <option value="" disabled>
                  {segmenti.length ? "Komu? (segment / panoga)" : "Ni segmentov v Resendu"}
                </option>
                {segmenti.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", gap: 14, fontSize: 13, marginBottom: 8 }}>
                <label style={vrsta}>
                  <input type="radio" name="kdaj" checked={kdaj === "zdaj"} onChange={() => setKdaj("zdaj")} />
                  Pošlji zdaj
                </label>
                <label style={vrsta}>
                  <input type="radio" name="kdaj" checked={kdaj === "nacrt"} onChange={() => setKdaj("nacrt")} />
                  Načrtuj
                </label>
              </div>
              {kdaj === "nacrt" && (
                <input
                  type="datetime-local"
                  value={cas}
                  onChange={(e) => setCas(e.target.value)}
                  style={{ ...vnos, marginBottom: 10 }}
                />
              )}

              <label style={{ ...vrsta, fontSize: 13, marginBottom: 10 }}>
                <input type="checkbox" checked={potrjeno} onChange={(e) => setPotrjeno(e.target.checked)} />
                Test je pregledan – pošlji vsem
              </label>
              <button type="button" className="gumb" onClick={poslji} disabled={caka || !segment || !potrjeno} style={{ width: "100%" }}>
                {caka ? "…" : kdaj === "nacrt" ? "Načrtuj pošiljanje" : "Pošlji vsem"}
              </button>
              <Sporocilo s={posljiS} />
            </div>
          </>
        )}

        <div style={{ ...blok, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!jePredloga && (
            <button type="button" className="gumb siv mini" onClick={kotPredloga} disabled={caka}>
              Shrani kot predlogo
            </button>
          )}
          <button type="button" className="gumb siv mini" onClick={izbrisi} disabled={caka} style={{ color: "#cb2026" }}>
            {jePredloga ? "Izbriši predlogo" : "Izbriši osnutek"}
          </button>
        </div>
        <Sporocilo s={predlogaS} />
      </div>

      {/* DESNO: predogled */}
      <div style={{ position: "sticky", top: 16 }}>
        <iframe
          title="Predogled maila"
          srcDoc={
            v.html ||
            "<div style='font-family:sans-serif;color:#9aa0a6;display:flex;height:90vh;align-items:center;justify-content:center'>Predogled maila</div>"
          }
          sandbox=""
          style={{ width: "100%", height: "calc(100vh - 200px)", minHeight: 420, border: "1px solid #dde0e2", background: "#fff" }}
        />
      </div>
    </div>
  );
}
