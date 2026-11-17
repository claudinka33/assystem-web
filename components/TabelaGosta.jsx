"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cenaArtikla, eur } from "@/lib/cene";
import { dodaj, useKosarica } from "@/lib/kosarica";
import { dogodek } from "@/lib/dogodki";
import { useB2BCene } from "@/lib/b2b-klient";
import VprasajZaRok from "@/components/VprasajZaRok";
import { prevedeno, useJezik } from "@/lib/i18n/odjemalec";

// Gosta (data-dense) tabela artiklov: oznake za filtre, kratke vrstice,
// zaloga samo da/ne, enak stolpec za košarico; na telefonu kompaktne kartice.
const KORAK = 100;
const norm = (x) => String(x ?? "").toLowerCase().replace(/\s+/g, "");
const st = (x) => new Intl.NumberFormat("sl-SI", { useGrouping: "always", maximumFractionDigits: 2 }).format(x);

// Slika embalaže pred šifro: takoj se vidi, ali je škatla ali vrečka
function slikaPakiranja(a, znamka, pot, embalaza) {
  const v = String((a.lastnosti ?? {}).Pakiranje ?? "").toLowerCase();
  if (!v) return null;
  const lastna = (embalaza ?? []).find((e) => e.slika && e.lastnost === "Pakiranje" && String(e.vrednost).toLowerCase() === v);
  if (lastna) return lastna.slika;
  const D = "/slike/embalaza/ikone/";
  const asco = znamka === "ASco" || String(pot ?? "").startsWith("/program/vijacno-blago");
  if (v.startsWith("škatla") || v === "osnovno") {
    if (znamka === "Silvermate") return "/slike/silvermate/skatla-silvermate.png";
    if (znamka === "MUNGO") return null;
    if (asco) return D + "asco-skatla.jpg";
    const afr = v.match(/afr(51|71|81)/);
    return D + (afr ? `asfix-afr${afr[1]}.jpg` : "asfix-afr41.jpg");
  }
  if (v.startsWith("vrečka")) {
    if (znamka === "Silvermate" || znamka === "MUNGO") return null;
    if (!asco) return D + "asfix-vrecka-rdeca.jpg";
    return /A2|A4|INOX/.test(String((a.lastnosti ?? {}).Material ?? "").toUpperCase()) ? D + "asco-vrecka-zelena.jpg" : D + "asco-vrecka-modra.jpg";
  }
  return null;
}
// Enota za količino v košarici: 4 škatle, 2 vrečki …
function enota(a, n) {
  const v = String((a.lastnosti ?? {}).Pakiranje ?? "").toLowerCase();
  const m = n % 100;
  if (v.startsWith("škatla") || v === "osnovno") return m === 1 ? "škatla" : m === 2 ? "škatli" : m === 3 || m === 4 ? "škatle" : "škatel";
  if (v.startsWith("vrečka")) return m === 1 ? "vrečka" : m === 2 ? "vrečki" : m === 3 || m === 4 ? "vrečke" : "vrečk";
  if (v.startsWith("blister")) return m === 1 ? "blister" : m === 2 ? "blistra" : m === 3 || m === 4 ? "blistri" : "blistrov";
  return "pak.";
}

// Pakiranje združimo: "škatla AFR41", "škatla AFR51" … = škatla; vse vrečke = vrečka
function skupina(k, v) {
  if (k !== "Pakiranje" || typeof v !== "string") return v;
  const x = v.toLowerCase();
  if (x.startsWith("škatla") || x === "osnovno") return "škatla";
  if (x.startsWith("vrečka")) return "vrečka";
  if (x.startsWith("blister")) return "blister";
  return v;
}
const vrednost = (a, k) => skupina(k, (a.lastnosti ?? {})[k]);

function kosov(a) {
  if (a.pakiranje) return Number(a.pakiranje) || null;
  return null;
}

function Kosarica({ a, cena, izdelek, b2b }) {
  const [kol, setKol] = useState(1);
  const [ok, setOk] = useState(false);
  if (!(Number(a.zaloga) > 0))
    return (
      <span className="g-vk g-vk-ni">
        <VprasajZaRok sifra={a.sifra} naziv={izdelek?.naziv} dimenzija={a.dimenzija} />
      </span>
    );
  if (!cena)
    return (
      <span className="g-vk g-vk-ni">
        <span className="g-siv">na povpraševanje</span>
      </span>
    );
  return (
    <span className="g-vk" title={cena.kos > 1 ? `${kol} × ${cena.kos} kos = ${st(kol * cena.kos)} kos` : undefined}>
      <input
        type="number"
        min="1"
        value={kol}
        onChange={(e) => setKol(Math.max(1, Number(e.target.value) || 1))}
        aria-label={cena.kos > 1 ? `Število pakiranj po ${cena.kos} kos` : "Količina"}
      />
      <span className="g-enota">{enota(a, kol)}{cena.kos > 1 && <small>{st(kol * cena.kos)} kos</small>}</span>
      <button
        type="button"
        className={ok ? "on" : ""}
        aria-label="V košarico"
        onClick={() => {
          dodaj(
            {
              id: a.id,
              sifra: a.sifra,
              naziv: izdelek?.naziv ?? a.naziv,
              dimenzija: a.dimenzija,
              lastnosti: a.lastnosti ?? {},
              kos: cena.kos,
              cenaBruto: cena.bruto,
              cenaNeto: cena.neto,
              b2b: Boolean(b2b),
              pot: izdelek?.pot,
              slika: izdelek?.slika ?? null,
            },
            kol
          );
          dogodek("add_to_cart", {
            currency: "EUR",
            value: Math.round(cena.bruto * kol * 100) / 100,
            items: [{ item_id: a.sifra, item_name: `${izdelek?.naziv ?? a.naziv} ${a.dimenzija ?? ""}`.trim(), price: cena.bruto, quantity: kol }],
          });
          setOk(true);
          setTimeout(() => setOk(false), 1400);
        }}
      >
        {ok ? "✓" : "V košarico"}
      </button>
    </span>
  );
}

function Cena({ cena, b2b }) {
  if (!cena) return <span className="g-siv">—</span>;
  if (b2b)
    return (
      <span className="g-cena">
        <b>{eur(cena.neto)}</b>
        {cena.popust > 0 && <s>{eur(cena.redna)}</s>}
        {(cena.na100Neto != null || cena.kos === 100) && <small>{eur(cena.na100Neto ?? cena.neto)} / 100 kos</small>}
        <small>brez DDV{cena.popust > 0 ? ` · −${String(cena.popust).replace(".", ",")} %` : ""}</small>
      </span>
    );
  return (
    <span className="g-cena">
      <b>{eur(cena.bruto)}</b>
      <small>{cena.na100Bruto != null ? `${eur(cena.na100Bruto)} / 100 kos · z DDV` : cena.kos === 100 ? `${eur(cena.bruto)} / 100 kos · z DDV` : "z DDV"}</small>
    </span>
  );
}

function TabelaGosta({ artikli: vhodni, stolpci, izdelek = null, naziviRazlicni = false, embalaza = [] }) {
  const { t } = useJezik();
  const artikli = useMemo(
    () => [...vhodni].sort((a, b) => (a.premer ?? 0) - (b.premer ?? 0) || (a.dolzina ?? 0) - (b.dolzina ?? 0) || String(a.sifra).localeCompare(String(b.sifra))),
    [vhodni]
  );
  const b2b = useB2BCene(useMemo(() => vhodni.map((a) => a.id), [vhodni]));
  const cenaZa = (a) => (b2b ? b2b.cene[a.id] ?? null : cenaArtikla(a));
  const [q, setQ] = useState("");
  const [izbrani, setIzbrani] = useState({});
  const [samoZaloga, setSamoZaloga] = useState(false);
  const [prikazano, setPrikazano] = useState(KORAK);
  const [oznacena, setOznacena] = useState(null);

  useEffect(() => {
    const sif = new URLSearchParams(window.location.search).get("sifra");
    if (!sif || !vhodni.some((a) => a.sifra === sif)) return;
    const t0 = setTimeout(() => {
      setQ(sif);
      setOznacena(sif);
      document.getElementById(`art-${sif}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(t0);
  }, [vhodni]);

  // Filtri: lastnosti z 2–10 vrednostmi (Pakiranje prvo)
  const filtri = useMemo(() => {
    const kljuci = [...new Set(["Pakiranje", ...stolpci])];
    return kljuci
      .map((k) => {
        const vr = [...new Set(artikli.map((a) => vrednost(a, k)).filter(Boolean))].sort((x, y) => String(x).localeCompare(String(y), "sl", { numeric: true }));
        return [k, vr.map((v) => [v, artikli.filter((a) => vrednost(a, k) === v).length])];
      })
      .filter(([, vr]) => vr.length >= 2 && vr.length <= 10);
  }, [artikli, stolpci]);

  const vidni = useMemo(() => {
    const iq = norm(q);
    return artikli.filter((a) => {
      for (const [k, v] of Object.entries(izbrani)) if (v && vrednost(a, k) !== v) return false;
      if (samoZaloga && !(Number(a.zaloga) > 0)) return false;
      if (!iq) return true;
      return norm(`${a.sifra} ${a.dimenzija ?? ""} ${a.ean ?? ""}`).includes(iq);
    });
  }, [artikli, izbrani, samoZaloga, q]);
  const prikaz = vidni.slice(0, prikazano);
  const stolpciLastnosti = stolpci.filter((k) => k !== "Pakiranje");
  const imaPakiranje = artikli.some((a) => (a.lastnosti ?? {}).Pakiranje);
  const filtrirano = vidni.length !== artikli.length;

  return (
    <div className="g-tab">
      <div className="g-orodja">
        <div className="g-chips">
          <button type="button" className={!Object.values(izbrani).some(Boolean) && !samoZaloga ? "on" : ""} onClick={() => { setIzbrani({}); setSamoZaloga(false); setQ(""); }}>
            Vsi artikli
          </button>
          {filtri.map(([k, vr]) => (
            <span key={k} className="g-skupina">
              <em>{k}</em>
              {vr.map(([v, n]) => (
                <button key={v} type="button" className={izbrani[k] === v ? "on" : ""} onClick={() => { setIzbrani({ ...izbrani, [k]: izbrani[k] === v ? undefined : v }); setPrikazano(KORAK); }}>
                  {v}
                </button>
              ))}
            </span>
          ))}
          <button type="button" className={`g-zal${samoZaloga ? " on" : ""}`} onClick={() => setSamoZaloga(!samoZaloga)}>
            <span className="g-pika da" /> Zaloga
          </button>
        </div>
        <input type="search" className="g-isk" value={q} onChange={(e) => { setQ(e.target.value); setPrikazano(KORAK); }} placeholder="Išči šifro, EAN ali dimenzijo …" />
      </div>
      {filtrirano && (
        <p className="g-stevec">
          <button type="button" onClick={() => { setIzbrani({}); setSamoZaloga(false); setQ(""); }}>Prikaži vse</button>
        </p>
      )}

      <div className="g-ovoj">
        <table className="g-t">
          <thead>
            <tr>
              <th className="g-th-sl" aria-label="Embalaža" />
              <th>Šifra</th>
              <th>EAN</th>
              {naziviRazlicni && <th>Naziv</th>}
              <th>Dimenzija</th>
              {stolpciLastnosti.map((k) => <th key={k}>{k}</th>)}
              {imaPakiranje && <th>Pakiranje</th>}
              <th className="d">Kos v pak.</th>
              <th>Zaloga</th>
              <th className="d">{b2b ? "Vaša cena" : "Cena z DDV"}</th>
              <th className="d">Košarica</th>
            </tr>
          </thead>
          <tbody>
            {prikaz.map((a) => {
              const zal = Number(a.zaloga) > 0;
              const n = kosov(a);
              return (
                <tr key={a.id} id={`art-${a.sifra}`} className={`${zal ? "" : "g-ni"}${oznacena === a.sifra ? " g-oznacen" : ""}`}>
                  <td className="g-sl">{slikaPakiranja(a, izdelek?.znamka, izdelek?.pot, embalaza) ? <img src={slikaPakiranja(a, izdelek?.znamka, izdelek?.pot, embalaza)} alt={(a.lastnosti ?? {}).Pakiranje ?? ""} loading="lazy" /> : null}</td>
                  <td className="g-sif" data-l="Šifra" translate="no">{a.sifra}</td>
                  <td className="g-ean" data-l="EAN" translate="no">{a.ean ?? "—"}</td>
                  {naziviRazlicni && <td className="g-las g-naz" data-l="Naziv">{a.naziv}</td>}
                  <td className="g-dim" translate="no">{a.dimenzija ?? "—"}</td>
                  {stolpciLastnosti.map((k) => <td key={k} className="g-las" data-l={k}>{(a.lastnosti ?? {})[k] ?? "—"}</td>)}
                  {imaPakiranje && <td className="g-las" data-l="Pakiranje">{vrednost(a, "Pakiranje") ?? "—"}</td>}
                  <td className="d g-pak" data-l="Kos v pak.">{n ? `${st(n)} kos` : "—"}</td>
                  <td className="g-zaloga">{zal ? <span className="g-z da"><span className="g-pika da" />Na zalogi</span> : <span className="g-z ne"><span className="g-pika ne" />Ni na zalogi</span>}</td>
                  <td className="d g-c"><Cena cena={cenaZa(a)} b2b={b2b} /></td>
                  <td className="d g-k"><Kosarica a={a} cena={cenaZa(a)} izdelek={izdelek} b2b={b2b} /></td>
                </tr>
              );
            })}
            {prikaz.length === 0 && (
              <tr><td colSpan={20} className="g-siv" style={{ padding: 14 }}>Ni artiklov za izbrane filtre.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {vidni.length > prikazano && (
        <button type="button" className="g-vec" onClick={() => setPrikazano(prikazano + KORAK)}>Prikaži več ({vidni.length - prikazano})</button>
      )}
      <PasKosarice b2b={b2b} />
    </div>
  );
}

// Spodnji pas: koliko je v košarici, brez odhoda s strani
function PasKosarice({ b2b }) {
  const postavke = useKosarica();
  const { pot } = useJezik();
  const n = postavke.length;
  const vsota = postavke.reduce((s, x) => s + Number((b2b ? x.cenaNeto : x.cenaBruto) || 0) * Number(x.kolicina || 0), 0);
  return (
    <div className={`g-pas${n ? " poln" : ""}`}>
      <span className="g-pas-ik" aria-hidden="true">🛒</span>
      {n ? (
        <span>
          V košarici: <b>{n} {n === 1 ? "artikel" : n === 2 ? "artikla" : n < 5 ? "artikli" : "artiklov"}</b> · {eur(Math.round(vsota * 100) / 100)} {b2b ? "brez DDV" : "z DDV"}
        </span>
      ) : (
        <span className="g-siv">Košarica je prazna</span>
      )}
      <Link href={pot("/kosarica")} className={`g-pas-gumb${n ? "" : " prazno"}`}>Na blagajno →</Link>
    </div>
  );
}

export default prevedeno(TabelaGosta);
