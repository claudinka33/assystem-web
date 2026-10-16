"use client";

import { useRef, useState } from "react";
import { TIPI_BLOKOV, NOGA_JEZIKI, novBlok } from "@/lib/enovice-bloki";
import { naloziVShrambo } from "@/app/admin/nalaganje";
import { iskanjeIzdelkovZaMail } from "@/lib/akcije/enovice-kampanje";

// Urejevalnik e-novic iz blokov: povleci blok iz palete v seznam, razvrsti z
// vlečenjem, klikni za urejanje. Izbran blok je obrobljen tudi v predogledu.

const vnos = { width: "100%", padding: "7px 9px", border: "1px solid #c6cace", borderRadius: 6, fontSize: 13, font: "inherit", background: "#fff" };
const oznaka = { display: "block", fontSize: 12, fontWeight: 600, margin: "0 0 4px", color: "#3f4140" };
const malGumb = {
  border: "1px solid #dde0e2",
  background: "#fff",
  borderRadius: 5,
  width: 26,
  height: 26,
  cursor: "pointer",
  fontSize: 13,
  lineHeight: "24px",
  padding: 0,
  color: "#3f4140",
};

function povzetek(b) {
  const t = b.naslov || b.besedilo || b.ime || b.alt || b.url || (b.elementi ? b.elementi.map((x) => x.naslov).join(" · ") : "") || b.slog || "";
  return String(t).replace(/\*\*|\[|\]\([^)]*\)/g, "").slice(0, 60);
}

// ---------------- polja ----------------

function PoljeSlika({ vrednost, onChange }) {
  const [caka, setCaka] = useState(false);
  const [napaka, setNapaka] = useState("");
  const [nad, setNad] = useState(false);
  const ref = useRef(null);
  async function nalozi(f) {
    if (!f) return;
    setCaka(true);
    setNapaka("");
    const r = await naloziVShrambo(f, "slike");
    setCaka(false);
    if (r.napaka) setNapaka(r.napaka);
    else onChange(r.url);
  }
  return (
    <div
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setNad(true);
        }
      }}
      onDragLeave={() => setNad(false)}
      onDrop={(e) => {
        if (!e.dataTransfer.files?.length) return;
        e.preventDefault();
        e.stopPropagation();
        setNad(false);
        nalozi(e.dataTransfer.files[0]);
      }}
      style={{ border: `1px dashed ${nad ? "#cb2026" : "#c6cace"}`, borderRadius: 6, padding: 8, background: nad ? "#fff6f6" : "#fafbfb" }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ width: 56, height: 42, background: "#eef0f1", borderRadius: 4, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {vrednost ? <img src={vrednost} alt="" style={{ maxWidth: "100%", maxHeight: "100%" }} /> : <span style={{ fontSize: 10, color: "#9aa0a6" }}>ni slike</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <button type="button" className="gumb siv mini" onClick={() => ref.current?.click()} disabled={caka}>
            {caka ? "Nalagam …" : vrednost ? "Zamenjaj" : "Naloži"}
          </button>{" "}
          {vrednost && (
            <button type="button" className="gumb siv mini" onClick={() => onChange("")}>
              ✕
            </button>
          )}
          <div style={{ fontSize: 11, color: "#6e767e", marginTop: 3 }}>ali povleci sliko sem</div>
        </div>
      </div>
      <input type="text" value={vrednost || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://… (povezava do slike)" style={{ ...vnos, marginTop: 6, fontSize: 12 }} />
      {napaka && <div style={{ color: "#cb2026", fontSize: 12, marginTop: 4 }}>{napaka}</div>}
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => nalozi(e.target.files?.[0])} />
    </div>
  );
}

function IzKataloga({ onIzberi }) {
  const [odprt, setOdprt] = useState(false);
  const [q, setQ] = useState("");
  const [rez, setRez] = useState([]);
  const [caka, setCaka] = useState(false);
  const t = useRef(null);
  const isci = (niz) => {
    setQ(niz);
    clearTimeout(t.current);
    t.current = setTimeout(async () => {
      setCaka(true);
      const r = await iskanjeIzdelkovZaMail(niz);
      setCaka(false);
      setRez(r.izdelki ?? []);
    }, 300);
  };
  if (!odprt)
    return (
      <button
        type="button"
        className="gumb siv mini"
        onClick={() => {
          setOdprt(true);
          isci("");
        }}
      >
        Iz kataloga
      </button>
    );
  return (
    <div style={{ border: "1px solid #dde0e2", borderRadius: 6, padding: 8, background: "#fff", marginTop: 6 }}>
      <div style={{ display: "flex", gap: 6 }}>
        <input autoFocus type="search" value={q} onChange={(e) => isci(e.target.value)} placeholder="Išči izdelek (npr. TXH7)" style={vnos} />
        <button type="button" className="gumb siv mini" onClick={() => setOdprt(false)}>
          ✕
        </button>
      </div>
      <div style={{ maxHeight: 220, overflow: "auto", marginTop: 6 }}>
        {caka && <div style={{ fontSize: 12, color: "#6e767e" }}>Iščem …</div>}
        {!caka && rez.length === 0 && <div style={{ fontSize: 12, color: "#6e767e" }}>Ni zadetkov.</div>}
        {rez.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => {
              onIzberi(i);
              setOdprt(false);
            }}
            style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", textAlign: "left", border: 0, background: "transparent", padding: "5px 4px", cursor: "pointer", borderRadius: 4, fontSize: 13 }}
          >
            <span style={{ width: 34, height: 26, background: "#eef0f1", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {i.slika && <img src={i.slika} alt="" style={{ maxWidth: "100%", maxHeight: "100%" }} />}
            </span>
            {i.naziv}
          </button>
        ))}
      </div>
    </div>
  );
}

function PoljeIzdelki({ vrednost = [], onChange }) {
  const spremeni = (i, k, v) => onChange(vrednost.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const premakni = (i, d) => {
    const n = [...vrednost];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div>
      {vrednost.map((x, i) => (
        <div key={i} style={{ border: "1px solid #e4e6e8", borderRadius: 6, padding: 8, marginBottom: 8, background: "#fafbfb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <strong style={{ fontSize: 12 }}>Izdelek {i + 1}</strong>
            <span style={{ display: "flex", gap: 4 }}>
              <button type="button" style={malGumb} onClick={() => premakni(i, -1)} title="Levo">
                ←
              </button>
              <button type="button" style={malGumb} onClick={() => premakni(i, 1)} title="Desno">
                →
              </button>
              <button type="button" style={{ ...malGumb, color: "#cb2026" }} onClick={() => onChange(vrednost.filter((_, j) => j !== i))} title="Odstrani">
                ✕
              </button>
            </span>
          </div>
          <PoljeSlika vrednost={x.slika} onChange={(v) => spremeni(i, "slika", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
            <input style={vnos} value={x.naslov || ""} onChange={(e) => spremeni(i, "naslov", e.target.value)} placeholder="Naslov (TXm1)" />
            <input style={vnos} value={x.podnaslov || ""} onChange={(e) => spremeni(i, "podnaslov", e.target.value)} placeholder="Podnaslov (rdeč)" />
          </div>
          <textarea style={{ ...vnos, marginTop: 6, minHeight: 52 }} value={x.opis || ""} onChange={(e) => spremeni(i, "opis", e.target.value)} placeholder="Kratek opis" />
          <input style={{ ...vnos, marginTop: 6 }} value={x.povezava || ""} onChange={(e) => spremeni(i, "povezava", e.target.value)} placeholder="Povezava (https://assystem.si/…)" />
        </div>
      ))}
      {vrednost.length < 3 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-start" }}>
          <button type="button" className="gumb siv mini" onClick={() => onChange([...vrednost, { slika: "", naslov: "", podnaslov: "", opis: "", povezava: "" }])}>
            + Prazen izdelek
          </button>
          <IzKataloga
            onIzberi={(i) =>
              onChange([...vrednost, { slika: i.slika, naslov: i.naziv, podnaslov: "", opis: i.opis, povezava: i.povezava }])
            }
          />
        </div>
      )}
    </div>
  );
}

function Polje({ def, vrednost, onChange }) {
  const [k, ime, tip, moznosti] = def;
  let el;
  if (tip === "textarea")
    el = <textarea style={{ ...vnos, minHeight: 84, resize: "vertical" }} value={vrednost ?? ""} onChange={(e) => onChange(e.target.value)} />;
  else if (tip === "koda")
    el = (
      <textarea
        style={{ ...vnos, minHeight: 120, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11 }}
        value={vrednost ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  else if (tip === "izbira")
    el = (
      <select style={vnos} value={vrednost ?? ""} onChange={(e) => onChange(e.target.value)}>
        {moznosti.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    );
  else if (tip === "podlaga")
    el = (
      <div style={{ display: "flex", gap: 8 }}>
        {[
          ["antracit", "Antracit", "#1a1e21"],
          ["rdeca", "Rdeča", "#cd2026"],
        ].map(([v, t, barva]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 6,
              cursor: "pointer",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              background: `${barva} url('/mailing/tx1/podlaga_${v}.jpg') center/220px`,
              border: vrednost === v ? "3px solid #3f4140" : "3px solid transparent",
              boxShadow: vrednost === v ? "0 0 0 2px #fff inset" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    );
  else if (tip === "slika") el = <PoljeSlika vrednost={vrednost} onChange={onChange} />;
  else if (tip === "izdelki") el = <PoljeIzdelki vrednost={vrednost} onChange={onChange} />;
  else
    el = (
      <input
        type="text"
        style={vnos}
        value={vrednost ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={tip === "url" ? "https://…" : ""}
      />
    );
  return (
    <div style={{ marginBottom: 10 }} key={k}>
      {tip !== "izdelki" && <label style={oznaka}>{ime}</label>}
      {el}
    </div>
  );
}

// ---------------- glavni urejevalnik ----------------

export default function BlokUrejevalnik({ vsebina, onChange, izbran, setIzbran }) {
  const bloki = vsebina.bloki ?? [];
  const [vlecem, setVlecem] = useState(null); // {vir:'seznam', i} ali {vir:'paleta', tip}
  const [cilj, setCilj] = useState(null); // indeks vstavljanja
  const [paleta, setPaleta] = useState(false);

  const nastaviBloke = (n) => onChange({ ...vsebina, bloki: n });
  const spremeniBlok = (id, k, v) => nastaviBloke(bloki.map((b) => (b.id === id ? { ...b, [k]: v } : b)));

  const vstavi = (tip, na) => {
    const nb = novBlok(tip);
    const n = [...bloki];
    n.splice(na ?? bloki.length, 0, nb);
    nastaviBloke(n);
    setIzbran(nb.id);
    setPaleta(false);
  };
  const premakni = (od, na) => {
    if (od === na || od + 1 === na) return;
    const n = [...bloki];
    const [b] = n.splice(od, 1);
    n.splice(na > od ? na - 1 : na, 0, b);
    nastaviBloke(n);
  };
  const podvoji = (i) => {
    const n = [...bloki];
    n.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(bloki[i])), id: Math.random().toString(36).slice(2, 10) });
    nastaviBloke(n);
  };
  const izbrisi = (i) => {
    if (!window.confirm(`Odstranim blok »${TIPI_BLOKOV[bloki[i].tip]?.ime}«?`)) return;
    nastaviBloke(bloki.filter((_, j) => j !== i));
  };

  const izbranIndeks = bloki.findIndex((b) => b.id === izbran);

  const onDragOverVrsta = (e, i) => {
    if (!vlecem) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    setCilj(e.clientY < r.top + r.height / 2 ? i : i + 1);
  };
  const onDrop = (e) => {
    e.preventDefault();
    if (vlecem && cilj != null) {
      if (vlecem.vir === "seznam") premakni(vlecem.i, cilj);
      else vstavi(vlecem.tip, cilj);
    }
    setVlecem(null);
    setCilj(null);
  };

  const crta = <div style={{ height: 3, background: "#cb2026", borderRadius: 2, margin: "2px 0" }} />;

  return (
    <div>
      {/* paleta */}
      <div style={{ marginBottom: 10 }}>
        <button type="button" className="gumb siv mini" onClick={() => setPaleta((x) => !x)} style={{ width: "100%" }}>
          {paleta ? "Zapri bloke" : "+ Dodaj blok"}
        </button>
        {paleta && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
            {Object.entries(TIPI_BLOKOV).map(([tip, d]) => (
              <div
                key={tip}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "copy";
                  e.dataTransfer.setData("text/plain", tip);
                  setVlecem({ vir: "paleta", tip });
                }}
                onDragEnd={() => {
                  setVlecem(null);
                  setCilj(null);
                }}
                onClick={() => vstavi(tip, izbranIndeks >= 0 ? izbranIndeks + 1 : bloki.length)}
                title="Klikni za dodajanje ali povleci v seznam"
                style={{ border: "1px solid #dde0e2", borderRadius: 6, padding: "7px 9px", cursor: "grab", background: "#fff", userSelect: "none" }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{d.ime}</div>
                <div style={{ fontSize: 11, color: "#6e767e", lineHeight: 1.3 }}>{d.opis}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* seznam blokov */}
      <div onDragOver={(e) => vlecem && e.preventDefault()} onDrop={onDrop}>
        {bloki.length === 0 && (
          <div
            onDragOver={(e) => {
              if (vlecem) {
                e.preventDefault();
                setCilj(0);
              }
            }}
            style={{ border: "2px dashed #ccd0d4", borderRadius: 8, padding: 24, textAlign: "center", color: "#6e767e", fontSize: 13 }}
          >
            Povleci blok sem
          </div>
        )}
        {bloki.map((b, i) => {
          const d = TIPI_BLOKOV[b.tip];
          const odprt = b.id === izbran;
          return (
            <div key={b.id}>
              {cilj === i && crta}
              <div
                data-vrsta={b.id}
                onDragOver={(e) => onDragOverVrsta(e, i)}
                style={{
                  border: `1px solid ${odprt ? "#cb2026" : "#e4e6e8"}`,
                  borderRadius: 7,
                  marginBottom: 6,
                  background: "#fff",
                  opacity: vlecem?.vir === "seznam" && vlecem.i === i ? 0.4 : 1,
                  boxShadow: odprt ? "0 0 0 2px rgba(203,32,38,.12)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 6px 6px 4px" }}>
                  <span
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", b.id);
                      setVlecem({ vir: "seznam", i });
                    }}
                    onDragEnd={() => {
                      setVlecem(null);
                      setCilj(null);
                    }}
                    title="Povleci za premik"
                    style={{ cursor: "grab", color: "#9aa0a6", padding: "0 4px", fontSize: 16, userSelect: "none" }}
                  >
                    ⠿
                  </span>
                  <button
                    type="button"
                    onClick={() => setIzbran(odprt ? null : b.id)}
                    style={{ flex: 1, minWidth: 0, textAlign: "left", border: 0, background: "transparent", cursor: "pointer", padding: 0 }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#3f4140" }}>{d?.ime ?? b.tip}</div>
                    <div style={{ fontSize: 11.5, color: "#6e767e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{povzetek(b)}</div>
                  </button>
                  <button type="button" style={malGumb} onClick={() => i > 0 && premakni(i, i - 1)} title="Gor" disabled={i === 0}>
                    ↑
                  </button>
                  <button type="button" style={malGumb} onClick={() => i < bloki.length - 1 && premakni(i, i + 2)} title="Dol" disabled={i === bloki.length - 1}>
                    ↓
                  </button>
                  <button type="button" style={malGumb} onClick={() => podvoji(i)} title="Podvoji">
                    ⧉
                  </button>
                  <button type="button" style={{ ...malGumb, color: "#cb2026" }} onClick={() => izbrisi(i)} title="Odstrani">
                    ✕
                  </button>
                </div>
                {odprt && d && (
                  <div style={{ borderTop: "1px solid #eef0f1", padding: "10px 10px 2px" }}>
                    {d.polja.map((p) => (
                      <Polje key={p[0]} def={p} vrednost={b[p[0]]} onChange={(v) => spremeniBlok(b.id, p[0], v)} />
                    ))}
                  </div>
                )}
              </div>
              {cilj === bloki.length && i === bloki.length - 1 && crta}
            </div>
          );
        })}
      </div>

      {/* noga */}
      <div style={{ border: "1px dashed #dde0e2", borderRadius: 7, padding: "8px 10px", marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#3f4140" }}>Noga (samodejno)</div>
          <div style={{ fontSize: 11.5, color: "#6e767e" }}>Podatki podjetja + odjava</div>
        </div>
        <select
          value={vsebina.nastavitve?.jezik || "sl"}
          onChange={(e) => onChange({ ...vsebina, nastavitve: { ...vsebina.nastavitve, jezik: e.target.value } })}
          style={{ ...vnos, width: "auto" }}
          aria-label="Jezik noge"
        >
          {Object.keys(NOGA_JEZIKI).map((j) => (
            <option key={j} value={j}>
              {j.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
