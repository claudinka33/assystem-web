"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  shraniKampanjo,
  posljiTest,
  posljiKampanjo,
  shraniKotPredlogo,
  izbrisiKampanjo,
} from "@/lib/akcije/enovice-kampanje";
import { zgradiHtml, zacetniBloki, UNSUB } from "@/lib/enovice-bloki";
import BlokUrejevalnik from "./BlokUrejevalnik";

const korak = { fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#6e767e", margin: "0 0 8px" };
const blok = { borderTop: "1px solid #e4e6e8", paddingTop: 14, marginTop: 14 };
const vrsta = { display: "flex", gap: 8, alignItems: "center" };
const vnos = { width: "100%", padding: "8px 10px", border: "1px solid #c6cace", borderRadius: 6, fontSize: 13, font: "inherit" };
const PRAZEN = "<div style='font-family:sans-serif;color:#9aa0a6;display:flex;height:90vh;align-items:center;justify-content:center'>Predogled maila</div>";

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

// Predogled blokov: dokument v iframu prepišemo (brez ponovnega nalaganja), da se
// ohrani položaj drsnika; klik na blok v predogledu ga izbere v urejevalniku.
function PredogledBlokov({ html, izbran, onIzberi }) {
  const ref = useRef(null);
  const izberi = useRef(onIzberi);
  useEffect(() => {
    izberi.current = onIzberi;
  }, [onIzberi]);

  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    const y = ref.current.contentWindow?.scrollY ?? 0;
    doc.open();
    doc.write(html);
    doc.close();
    ref.current.contentWindow?.scrollTo(0, y);
    doc.addEventListener("click", (e) => {
      const a = e.target.closest?.("a");
      if (a) e.preventDefault();
      const tr = e.target.closest?.("[data-blok]");
      if (tr) izberi.current(tr.getAttribute("data-blok"));
    });
  }, [html]);

  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll("[data-blok].izbran").forEach((x) => x.classList.remove("izbran"));
    const el = izbran ? doc.querySelector(`[data-blok="${izbran}"]`) : null;
    if (el) {
      el.classList.add("izbran");
      const r = el.getBoundingClientRect();
      const h = ref.current.clientHeight;
      if (r.top < 0 || r.bottom > h) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [izbran, html]);

  return (
    <iframe
      ref={ref}
      title="Predogled maila"
      sandbox="allow-same-origin"
      style={{ width: "100%", height: "calc(100vh - 200px)", minHeight: 420, border: "1px solid #dde0e2", background: "#eef0f1" }}
    />
  );
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
  const [nacin, setNacin] = useState(kampanja.nacin === "bloki" ? "bloki" : "html");
  const [vsebina, setVsebina] = useState(() => (kampanja.bloki?.bloki ? kampanja.bloki : zacetniBloki()));
  const [izbran, setIzbran] = useState(null);
  const [mobilni, setMobilni] = useState(false);

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

  // HTML, ki se shrani in pošlje
  const koncniHtml = useMemo(
    () => (nacin === "bloki" ? zgradiHtml(vsebina, { zadeva: v.zadeva, predogledno: v.predogled }) : v.html),
    [nacin, vsebina, v.zadeva, v.predogled, v.html]
  );
  const predogledHtml = useMemo(
    () => (nacin === "bloki" ? zgradiHtml(vsebina, { zadeva: v.zadeva, predogled: true }) : null),
    [nacin, vsebina, v.zadeva]
  );
  const podatki = useMemo(
    () => ({ ...v, html: koncniHtml, nacin, bloki: nacin === "bloki" ? vsebina : kampanja.bloki ?? null }),
    [v, koncniHtml, nacin, vsebina, kampanja.bloki]
  );

  // ---- samodejno shranjevanje (1,2 s po zadnji spremembi) ----
  const json = JSON.stringify(podatki);
  const zadnje = useRef(json);
  useEffect(() => {
    if (json === zadnje.current) return;
    const t = setTimeout(async () => {
      setShranjujem(true);
      const r = await shraniKampanjo(kampanja.id, JSON.parse(json)).catch((e) => ({ ok: false, napaka: e.message }));
      setShranjujem(false);
      if (r.ok) {
        zadnje.current = json;
        setShranjeno(r.posodobljeno);
        setNapakaShr(null);
      } else setNapakaShr(r.napaka);
    }, 1200);
    return () => clearTimeout(t);
  }, [json, kampanja.id]);

  // opozorilo pred zapiranjem, če sprememba še ni shranjena
  useEffect(() => {
    const h = (e) => {
      if (json !== zadnje.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [json]);

  const segmentIme = segmenti.find((s) => s.id === segment)?.name ?? kampanja.segment_ime ?? "";
  const brezOdjave = nacin === "html" && v.html && !v.html.includes(UNSUB);

  function zamenjajNacin(nov) {
    if (nov === nacin) return;
    if (nov === "html") {
      if (!window.confirm("Preklopim na HTML? Iz blokov se ustvari HTML koda, ki jo lahko urejaš ročno. Bloki ostanejo shranjeni, a se ne posodabljajo več.")) return;
      setV((x) => ({ ...x, html: koncniHtml }));
    } else if (v.html && !kampanja.bloki?.bloki) {
      if (!window.confirm("Preklopim na bloke? Prilepljen HTML se bo nadomestil z mailom iz blokov.")) return;
    }
    setNacin(nov);
  }

  function test() {
    setTestS(null);
    zacni(async () => setTestS(await posljiTest(kampanja.id, podatki, testNaslovi)));
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
      const r = await posljiKampanjo(kampanja.id, podatki, { segmentId: segment, segmentIme, kdaj: iso, potrjeno });
      setPosljiS(r);
      if (r.stanje === "ok") {
        zadnje.current = json;
        router.refresh();
      }
    });
  }

  function kotPredloga() {
    const ime = window.prompt("Ime predloge:", v.naziv || v.zadeva || "Predloga");
    if (!ime) return;
    setPredlogaS(null);
    zacni(async () => {
      const r = await shraniKotPredlogo(kampanja.id, { ...podatki, ime_predloge: ime });
      setPredlogaS({ stanje: r.ok ? "ok" : "napaka", sporocilo: r.ok ? r.sporocilo : r.napaka });
    });
  }

  function izbrisi() {
    if (!window.confirm(jePredloga ? "Izbrišem predlogo?" : "Izbrišem ta osnutek?")) return;
    zadnje.current = json;
    const fd = new FormData();
    fd.set("id", kampanja.id);
    fd.set("nazaj", "1");
    zacni(() => izbrisiKampanjo(fd));
  }

  function izberiIzPredogleda(id) {
    setIzbran(id);
    setTimeout(() => document.querySelector(`[data-vrsta="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 50);
  }

  const stanjeShr = napakaShr ? (
    <span style={{ color: "#cb2026" }}>Ni shranjeno: {napakaShr}</span>
  ) : shranjujem ? (
    "Shranjujem …"
  ) : (
    `Shranjeno ${shranjeno ? new Date(shranjeno).toLocaleTimeString("sl-SI", { hour: "2-digit", minute: "2-digit" }) : ""}`
  );

  const preklop = (
    <div style={{ display: "inline-flex", border: "1px solid #ccd0d4", borderRadius: 7, overflow: "hidden" }}>
      {[
        ["bloki", "Bloki"],
        ["html", "HTML"],
      ].map(([k, t]) => (
        <button
          key={k}
          type="button"
          onClick={() => zamenjajNacin(k)}
          style={{
            border: 0,
            padding: "5px 12px",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            background: nacin === k ? "#3f4140" : "#fff",
            color: nacin === k ? "#fff" : "#3f4140",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 430px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
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

        <div style={{ ...vrsta, justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{nacin === "bloki" ? "Sestavi mail" : "HTML koda *"}</span>
          {preklop}
        </div>

        {nacin === "bloki" ? (
          <BlokUrejevalnik vsebina={vsebina} onChange={setVsebina} izbran={izbran} setIzbran={setIzbran} />
        ) : (
          <div className="adm-polje">
            <textarea
              id="html"
              value={v.html}
              onChange={nastavi("html")}
              placeholder="Prilepi celotno HTML kodo maila"
              aria-label="HTML koda"
              style={{ minHeight: 110, height: 140, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11 }}
            />
            {brezOdjave && (
              <p className="namig" style={{ color: "#cb2026" }}>
                Manjka povezava za odjavo {UNSUB}.
              </p>
            )}
          </div>
        )}

        <details style={{ fontSize: 13, margin: "12px 0 4px" }}>
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
                <input type="datetime-local" value={cas} onChange={(e) => setCas(e.target.value)} style={{ ...vnos, marginBottom: 10 }} />
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
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 8 }}>
          {nacin === "bloki" && <span style={{ fontSize: 12, color: "#6e767e", marginRight: "auto", alignSelf: "center" }}>Klikni blok v predogledu za urejanje</span>}
          {[
            [false, "Računalnik"],
            [true, "Telefon"],
          ].map(([m, t]) => (
            <button key={t} type="button" className={`gumb mini ${mobilni === m ? "" : "siv"}`} onClick={() => setMobilni(m)}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ maxWidth: mobilni ? 390 : "none", margin: "0 auto" }}>
          {nacin === "bloki" ? (
            <PredogledBlokov html={predogledHtml} izbran={izbran} onIzberi={izberiIzPredogleda} />
          ) : (
            <iframe
              title="Predogled maila"
              srcDoc={v.html || PRAZEN}
              sandbox=""
              style={{ width: "100%", height: "calc(100vh - 200px)", minHeight: 420, border: "1px solid #dde0e2", background: "#fff" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
