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
const KORAK = 20; // prvih 20 vrstic, ostale z gumbom »Pokaži vse«
const norm = (x) => String(x ?? "").toLowerCase().replace(/\s+/g, "");
const st = (x) => new Intl.NumberFormat("sl-SI", { useGrouping: "always", maximumFractionDigits: 2 }).format(x);

// Barvna pikica za RAL odtenke (strešni vijaki ipd.)
const RAL = {
  "1000": "#CDBA88", "1001": "#D0B084", "1002": "#D2AA6D", "1003": "#F9A900", "1004": "#E49E00", "1005": "#CB8E00", "1006": "#E29000", "1007": "#E88C00",
  "1011": "#AF804F", "1012": "#DDAF27", "1013": "#E3D9C6", "1014": "#DDC49A", "1015": "#E6D2B5", "1016": "#F1DD38", "1017": "#F6A950", "1018": "#FACA30",
  "1019": "#A48F7A", "1020": "#A08F65", "1021": "#F6B600", "1023": "#F7B500", "1024": "#BA8F4C", "1028": "#FF9B00", "1032": "#E2A300", "1033": "#F99A1C", "1034": "#EB9C52",
  "2000": "#DA6E00", "2001": "#BA481B", "2002": "#BF3922", "2003": "#F67828", "2004": "#E25303", "2008": "#ED6B21", "2009": "#DE5307", "2010": "#D05D28", "2011": "#E26E0E",
  "3000": "#A72920", "3001": "#9B2423", "3002": "#9B2321", "3003": "#861A22", "3004": "#6B1C23", "3005": "#59191F", "3007": "#3E2022", "3009": "#6D342D", "3011": "#792423",
  "3012": "#C6846D", "3013": "#972E25", "3014": "#CB7375", "3015": "#D8A0A6", "3016": "#A63D2F", "3017": "#CB555D", "3018": "#C73F4A", "3020": "#BB1E10", "3027": "#B42041", "3031": "#A72A2A",
  "4001": "#816183", "4002": "#8D3C4B", "4003": "#C4618C", "4004": "#651E38", "4005": "#76689A", "4006": "#903373", "4007": "#47243C", "4008": "#844C82", "4009": "#9D8692",
  "5000": "#2F4A71", "5001": "#0E4C64", "5002": "#00387A", "5003": "#1F3855", "5004": "#191E28", "5005": "#005387", "5007": "#376B8C", "5008": "#2B3A44", "5009": "#225F78",
  "5010": "#004F7C", "5011": "#1A2B3C", "5012": "#0089B6", "5013": "#193153", "5014": "#637D96", "5015": "#007CAF", "5017": "#005B8C", "5018": "#048B8C", "5019": "#005E83",
  "5020": "#00414B", "5021": "#007577", "5022": "#222D5A", "5023": "#42698C", "5024": "#6093AC",
  "6000": "#3C7460", "6001": "#366735", "6002": "#325928", "6003": "#50533C", "6004": "#024442", "6005": "#114232", "6006": "#3C392E", "6007": "#2C3222", "6008": "#36342A",
  "6009": "#27352A", "6010": "#4D6F39", "6011": "#6B7C59", "6012": "#2F3D3A", "6013": "#7C765A", "6014": "#474135", "6015": "#3D3D36", "6016": "#00694C", "6017": "#587F40",
  "6018": "#61993B", "6019": "#B9CEAC", "6020": "#37422F", "6021": "#8A9977", "6022": "#3A3327", "6024": "#008351", "6025": "#5E6E3B", "6026": "#005F4E", "6027": "#7EBAB5",
  "6028": "#315442", "6029": "#006F3D", "6032": "#237F52", "6033": "#46877F", "6034": "#7AACAC",
  "7000": "#7E8B92", "7001": "#8F999F", "7002": "#817F68", "7003": "#7A7B6D", "7004": "#9EA0A1", "7005": "#6B716F", "7006": "#756F61", "7008": "#746643", "7009": "#5B6259",
  "7010": "#575D57", "7011": "#555D61", "7012": "#596163", "7013": "#555548", "7015": "#51565C", "7016": "#373F43", "7021": "#2E3234", "7022": "#4B4D46", "7023": "#818479",
  "7024": "#474A50", "7026": "#374447", "7030": "#939388", "7031": "#5D6970", "7032": "#B9B9A8", "7033": "#818979", "7034": "#939176", "7035": "#CBD0CC", "7036": "#9A9697",
  "7037": "#7C7F7E", "7038": "#B4B8B0", "7039": "#6B695F", "7040": "#9DA3A6", "7042": "#8F9695", "7043": "#4E5451", "7044": "#BDBDB2", "7045": "#91969A", "7046": "#82898E",
  "7047": "#CFD0CF", "7048": "#888175",
  "8000": "#887142", "8001": "#9C6B30", "8002": "#7B5141", "8003": "#80542F", "8004": "#8F4E35", "8007": "#6F4A2F", "8008": "#6F4F28", "8011": "#5A3826", "8012": "#66332B",
  "8014": "#4A3526", "8015": "#5E2F26", "8016": "#4C2B20", "8017": "#442F29", "8019": "#3D3635", "8022": "#1A1718", "8023": "#A45729", "8024": "#795038", "8025": "#755847",
  "8028": "#513A2A",
  "9001": "#E9E0D2", "9002": "#D7D5CB", "9003": "#ECECE7", "9004": "#2B2B2C", "9005": "#0E0E10", "9006": "#A1A1A0", "9007": "#878581", "9010": "#F1EDE1", "9011": "#27292B",
  "9016": "#F1F1EA", "9017": "#29292A", "9018": "#C8CBC4", "9022": "#858583", "9023": "#797B7A",
};
function RalPika({ v }) {
  const m = String(v ?? "").match(/RAL\s*(\d{4})/i);
  const barva = m && RAL[m[1]];
  return barva ? <i className="g-ral" style={{ background: barva }} aria-hidden="true" /> : null;
}

// Slika embalaže pred šifro: takoj se vidi, ali je škatla ali vrečka
function slikaPakiranja(a, znamka, pot, embalaza, naziv) {
  const v = String((a.lastnosti ?? {}).Pakiranje ?? "").toLowerCase();
  if (!v) {
    if (vrecaBrezTiska(naziv)) return "/slike/embalaza/ikone/vrecka-prozorna.jpg";
    const privzeta = privzetaSkatla(a, znamka, pot);
    return privzeta ? "/slike/embalaza/ikone/" + privzeta : null;
  }
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
// Zidni vložki in udarni vijaki brez navedenega pakiranja: prozorna vrečka po 50 ali 100 kos
// Brez vpisanega pakiranja: ASfix (šifra AF…) = škatla AFR41, ASco = rjava ASco škatla
function privzetaSkatla(a, znamka, pot) {
  if (znamka === "Silvermate" || znamka === "MUNGO") return null;
  if (String(a.sifra ?? "").toUpperCase().startsWith("AF")) return "asfix-afr41.jpg";
  if (znamka === "ASco" || String(pot ?? "").startsWith("/program/vijacno-blago") || String(pot ?? "").startsWith("/program/kljuke")) return "asco-skatla.jpg";
  return "asfix-afr41.jpg";
}
// UVS, UVZ (udarni vijak), ZVKR, ZVK (zidni vložek z robom / brez roba), vložek za stiropor, ZV.A, ZV.I
function vrecaBrezTiska(naziv) {
  return /udarni vijak|zidni vložek z robom|zidni vložek brez roba|stiropor|zv\.a\b|zv\.i\b/i.test(String(naziv ?? ""));
}
// Enota za količino v košarici: 4 škatle, 2 vrečki …
function enota(a, n, kos, naziv, znamka, pot) {
  if (!(kos > 1)) return "kos";
  const v = String((a.lastnosti ?? {}).Pakiranje ?? (vrecaBrezTiska(naziv) ? "vrečka" : privzetaSkatla(a, znamka, pot) ? "škatla" : "")).toLowerCase();
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

// Koliko kosov je v enem pakiranju: najprej iz Vasca (pakiranje), sicer iz naziva / lastnosti (»100 kos«, »a 50«, »/100«)
function kosov(a) {
  if (Number(a.pakiranje) > 0) return Number(a.pakiranje);
  const besedilo = [a.naziv, ...Object.values(a.lastnosti ?? {})].join(" ");
  const m = besedilo.match(/(\d{1,5})\s*(?:kos|kom|pcs|stk)\b/i) || besedilo.match(/(?:\ba|\/)\s*(\d{2,5})\b(?!\s*mm)/i);
  return m ? Number(m[1]) || null : null;
}
// Vrsta pakiranja: vpisana lastnost, sicer ista kot slika pred šifro (vrečka / škatla)
function vrstaPak(a, naziv, znamka, pot) {
  return vrednost(a, "Pakiranje") ?? (vrecaBrezTiska(naziv) ? "vrečka" : privzetaSkatla(a, znamka, pot) ? "škatla" : null);
}

function Kosarica({ a, cena, izdelek, b2b, zaloga }) {
  // Vnos je besedilo, da lahko številko izbrišeš in vpišeš novo; količina je vedno vsaj 1
  const [vnos, setVnos] = useState("1");
  const kol = Math.max(1, parseInt(vnos, 10) || 1);
  const [ok, setOk] = useState(false);
  if (!(Number(zaloga) > 0))
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
      <span className="g-st">
        <button type="button" aria-label="Manj" onClick={() => setVnos(String(Math.max(1, kol - 1)))} disabled={kol <= 1}>−</button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={vnos}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setVnos(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onBlur={() => setVnos(String(kol))}
          aria-label={cena.kos > 1 ? `Število pakiranj po ${cena.kos} kos` : "Količina"}
        />
        <button type="button" aria-label="Več" onClick={() => setVnos(String(kol + 1))}>+</button>
      </span>
      <span className="g-enota">{enota(a, kol, cena.kos, izdelek?.naziv, izdelek?.znamka, izdelek?.pot)}{cena.kos > 1 && <small>{st(kol * cena.kos)} kos</small>}</span>
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

// Cena samo za B2B: neprijavljen obiskovalec vidi povabilo k registraciji
function CenaZaklenjena() {
  return (
    <span className="g-zak">
      <b>🔒 Cena za B2B kupce</b>
      <Link href="/b2b/registracija">Postanite B2B kupec →</Link>
    </span>
  );
}

function Cena({ cena, b2b }) {
  if (b2b === false) return <CenaZaklenjena />;
  if (b2b === null) return <span className="g-siv">…</span>;
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

function TabelaGosta({ artikli: vhodni, stolpci, izdelek = null, naziviRazlicni = false, embalaza = [], slikeVrednosti = null }) {
  const { t } = useJezik();
  const artikli = useMemo(
    () => [...vhodni].sort((a, b) => (a.premer ?? 0) - (b.premer ?? 0) || (a.dolzina ?? 0) - (b.dolzina ?? 0) || String(a.sifra).localeCompare(String(b.sifra))),
    [vhodni]
  );
  const b2b = useB2BCene(useMemo(() => vhodni.map((a) => a.id), [vhodni]));
  // Cene in zaloga pridejo s strežnika samo za prijavljene B2B uporabnike (b2b === false: skrito)
  const cenaZa = (a) => (b2b ? b2b.cene[a.id] ?? null : null);
  const zalogaZa = (a) => (b2b ? b2b.zaloga?.[a.id] ?? 0 : null);
  const odklenjeno = Boolean(b2b);
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

  // Izbrana vrednost s svojo sliko (npr. metrični navoj) zamenja sliko na vrhu
  useEffect(() => {
    if (!slikeVrednosti) return;
    const e = Object.values(izbrani).filter(Boolean).map((v) => slikeVrednosti[String(v).toLowerCase()]).find(Boolean);
    window.dispatchEvent(new CustomEvent("izdelek-slika", { detail: e ? e.slika : null }));
  }, [izbrani, slikeVrednosti]);

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
      if (samoZaloga && odklenjeno && !(Number(zalogaZa(a)) > 0)) return false;
      if (!iq) return true;
      return norm(`${a.sifra} ${a.dimenzija ?? ""} ${a.ean ?? ""}`).includes(iq);
    });
  }, [artikli, izbrani, samoZaloga, q, b2b]);
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
                  <RalPika v={v} />{v}
                </button>
              ))}
            </span>
          ))}
          {odklenjeno && (
            <button type="button" className={`g-zal${samoZaloga ? " on" : ""}`} onClick={() => setSamoZaloga(!samoZaloga)}>
              <span className="g-pika da" /> Zaloga
            </button>
          )}
        </div>
        <input type="search" className="g-isk" value={q} onChange={(e) => { setQ(e.target.value); setPrikazano(KORAK); }} placeholder="Išči šifro, EAN ali dimenzijo …" />
      </div>
      {filtrirano && (
        <p className="g-stevec">
          <button type="button" onClick={() => { setIzbrani({}); setSamoZaloga(false); setQ(""); }}>Prikaži vse</button>
        </p>
      )}

      {b2b === false && (
        <div className="g-b2b-pas">
          <div>
            <b>Cene, zaloga in naročanje so na voljo samo B2B kupcem.</b>
            <span>Registrirajte podjetje in po potrditvi e-naslova takoj vidite cene.</span>
          </div>
          <Link className="g-b2b-p" href="/b2b">Prijava</Link>
          <Link className="g-b2b-r" href="/b2b/registracija">Postanite B2B kupec →</Link>
        </div>
      )}
      {b2b?.admin && (
        <div className="g-b2b-pas g-b2b-cakanje">
          <div>
            <b>Administratorski pogled: redne veleprodajne cene (brez DDV) in zaloga.</b>
          </div>
        </div>
      )}
      {b2b && !b2b.aktiven && !b2b.admin && (
        <div className="g-b2b-pas g-b2b-cakanje">
          <div>
            <b>Vidite redne veleprodajne cene (brez DDV).</b>
            <span>Vaše posebne cene in naročanje bodo na voljo, ko vaš račun odobrimo.</span>
          </div>
        </div>
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
              <th>Pakiranje</th>
              {odklenjeno && <th>Zaloga</th>}
              <th className="d">{b2b?.aktiven ? "Vaša cena" : b2b ? "Cena VPC" : "Cena"}</th>
              {odklenjeno && <th className="d">Košarica</th>}
            </tr>
          </thead>
          <tbody>
            {prikaz.map((a) => {
              const zal = !odklenjeno || Number(zalogaZa(a)) > 0;
              const n = kosov(a);
              return (
                <tr key={a.id} id={`art-${a.sifra}`} className={`${zal ? "" : "g-ni"}${oznacena === a.sifra ? " g-oznacen" : ""}`}>
                  <td className="g-sl">{slikaPakiranja(a, izdelek?.znamka, izdelek?.pot, embalaza, izdelek?.naziv) ? <img src={slikaPakiranja(a, izdelek?.znamka, izdelek?.pot, embalaza, izdelek?.naziv)} alt={(a.lastnosti ?? {}).Pakiranje ?? ""} loading="lazy" /> : null}</td>
                  <td className="g-sif" data-l="Šifra" translate="no">{a.sifra}</td>
                  <td className={`g-ean${a.ean ? "" : " g-prazno"}`} data-l="EAN" translate="no">{a.ean ?? "—"}</td>
                  {naziviRazlicni && <td className="g-las g-naz" data-l="Naziv">{a.naziv}</td>}
                  <td className="g-dim" translate="no">{a.dimenzija ?? "—"}</td>
                  {stolpciLastnosti.map((k) => <td key={k} className={`g-las${(a.lastnosti ?? {})[k] ? "" : " g-prazno"}`} data-l={k}><RalPika v={(a.lastnosti ?? {})[k]} />{(a.lastnosti ?? {})[k] ?? "—"}</td>)}
                  <td className="g-pakv" data-l="Pakiranje">{vrstaPak(a, izdelek?.naziv, izdelek?.znamka, izdelek?.pot) ?? (n ? "" : "—")}{n ? <small>{st(n)} kos</small> : null}</td>
                  {odklenjeno && <td className="g-zaloga">{zal ? <span className="g-z da"><span className="g-pika da" />Na zalogi</span> : <span className="g-z ne"><span className="g-pika ne" />Ni na zalogi</span>}</td>}
                  <td className="d g-c"><Cena cena={cenaZa(a)} b2b={b2b} /></td>
                  {odklenjeno && <td className="d g-k"><Kosarica a={a} cena={cenaZa(a)} izdelek={izdelek} b2b={b2b} zaloga={zalogaZa(a)} /></td>}
                </tr>
              );
            })}
            {prikaz.length === 0 && (
              <tr><td colSpan={20} className="g-siv" style={{ padding: 14 }}>Ni artiklov za izbrane filtre.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Telefon: kompaktne kartice namesto tabele */}
      <div className="g-kartice">
        {prikaz.map((a) => {
          const zal = !odklenjeno || Number(zalogaZa(a)) > 0;
          const sl = slikaPakiranja(a, izdelek?.znamka, izdelek?.pot, embalaza, izdelek?.naziv);
          const podatki = [
            ["Šifra", a.sifra],
            ["EAN", a.ean],
            ...(naziviRazlicni ? [["", a.naziv]] : []),
            ...stolpciLastnosti.map((k) => [k, (a.lastnosti ?? {})[k]]),
            ["Pakiranje", [vrstaPak(a, izdelek?.naziv, izdelek?.znamka, izdelek?.pot), kosov(a) ? `${st(kosov(a))} kos` : null].filter(Boolean).join(" · ")],
          ].filter(([, v]) => v);
          return (
            <div key={a.id} className={`g-kar${zal ? "" : " g-ni"}${oznacena === a.sifra ? " g-oznacen" : ""}`}>
              <div className="g-kar-1">
                {sl ? <img src={sl} alt="" loading="lazy" /> : null}
                <b translate="no">{a.dimenzija ?? a.sifra}</b>
                <Cena cena={cenaZa(a)} b2b={b2b} />
              </div>
              <div className="g-kar-2">
                {podatki.map(([k, v]) => (
                  <span key={k + v}>{k ? <em>{k}:</em> : null} <span translate="no"><RalPika v={v} />{v}</span></span>
                ))}
              </div>
              {odklenjeno && (
                <div className="g-kar-3">
                  {zal ? <span className="g-z da"><span className="g-pika da" />Na zalogi</span> : <span className="g-z ne"><span className="g-pika ne" />Ni na zalogi</span>}
                  <Kosarica a={a} cena={cenaZa(a)} izdelek={izdelek} b2b={b2b} zaloga={zalogaZa(a)} />
                </div>
              )}
            </div>
          );
        })}
        {prikaz.length === 0 && <p className="g-siv">Ni artiklov za izbrane filtre.</p>}
      </div>
      {vidni.length > prikazano && (
        <button type="button" className="g-vec" onClick={() => setPrikazano(vidni.length)}>Pokaži vse ({vidni.length})</button>
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
