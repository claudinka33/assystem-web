import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { Suspense } from "react";
import IskalnikBaze from "./IskalnikBaze";
import { REGIJE, RAZVRSTI, filtrRegije } from "@/lib/baza-regije";
import { KontaktObrazec, UvozBaze, UskladiGumb, Vrstica, IzkljuciDomeno } from "./Deli";

export const dynamic = "force-dynamic";

const NA_STRAN = 100;

export default async function Baza({ searchParams }) {
  const { q = "", p = "", vir = "", stran = "1", stanje = "", regija = "", red = "" } = await searchParams;
  const sb = supabaseAdmin();
  const { data: panoge, error } = await sb.from("baza_panoge").select("sifra, ime").order("vrstni_red");
  if (error)
    return (
      <div className="adm-telo">
        <div className="opozorilo">Baza še ni pripravljena — v Supabase (assystem-web) zaženi SQL »52-baza-kontaktov.sql«.</div>
      </div>
    );

  const { data: izk } = await sb.from("nastavitve").select("vrednost").eq("kljuc", "baza_izkljucene_domene").maybeSingle();
  const izkljucene = String(izk?.vrednost ?? "").split(",").map((x) => x.trim()).filter(Boolean);

  // števci panog
  const stej = (fn) => fn(sb.from("baza_kontakti").select("email", { count: "exact", head: true })).then((r) => r.count ?? 0);
  const [vsi, nerazvrsceni, odjavljeni, ...poPanogah] = await Promise.all([
    stej((x) => x),
    stej((x) => x.eq("panoge", "{}")),
    stej((x) => x.eq("odjavljen", true)),
    ...(panoge ?? []).map((pa) => stej((x) => x.contains("panoge", [pa.sifra]))),
  ]);
  const poRegijah = await Promise.all(REGIJE.map(([r]) => stej((x) => filtrRegije(x, r))));
  const stevec = Object.fromEntries((panoge ?? []).map((pa, i) => [pa.sifra, poPanogah[i]]));
  const imePanoge = Object.fromEntries((panoge ?? []).map((pa) => [pa.sifra, pa.ime]));

  // seznam
  const st = Math.max(1, Number(stran) || 1);
  let poiz = sb.from("baza_kontakti").select("*", { count: "exact" });
  if (p === "nerazvrsceni") poiz = poiz.eq("panoge", "{}");
  else if (Number(p)) poiz = poiz.contains("panoge", [Number(p)]);
  if (vir) poiz = poiz.eq("vir", vir);
  if (stanje === "odjavljeni") poiz = poiz.eq("odjavljen", true);
  if (stanje === "soglasje") poiz = poiz.eq("soglasje", true);
  poiz = filtrRegije(poiz, regija);
  const iskanje = q.trim().replace(/[,()%]/g, " ").trim();
  if (iskanje) {
    const v = `%${iskanje}%`;
    poiz = poiz.or(`email.ilike.${v},ime.ilike.${v},podjetje.ilike.${v},poslovalnica.ilike.${v},kraj.ilike.${v},davcna.ilike.${v},telefon.ilike.${v},opomba.ilike.${v}`);
  }
  const padajoce = red.startsWith("-");
  const kljucRed = RAZVRSTI[red.replace(/^-/, "")] ? red.replace(/^-/, "") : p === "nerazvrsceni" ? "dodan" : "email";
  const narascajoce = red ? !padajoce : kljucRed !== "dodan";
  poiz = poiz.order(RAZVRSTI[kljucRed][0], { ascending: narascajoce, nullsFirst: false });
  if (kljucRed !== "email") poiz = poiz.order("email");
  const { data: kontakti, count } = await poiz
    .range((st - 1) * NA_STRAN, st * NA_STRAN - 1);
  const partnerji = [...new Set((kontakti ?? []).map((k) => k.vasco_partner).filter(Boolean))];
  const { data: pes } = partnerji.length
    ? await sb.from("b2b_prodajalne").select("vasco_partner, sifra, naziv, naziv2, naslov, posta").in("vasco_partner", partnerji).order("naziv2")
    : { data: [] };
  const peZa = (partner) => (pes ?? []).filter((x) => x.vasco_partner === partner);
  const strani = Math.max(1, Math.ceil((count ?? 0) / NA_STRAN));
  const url = (spr) => {
    const o = { q, p, vir, stanje, regija, red, stran: "1", ...spr };
    const sp = new URLSearchParams();
    for (const k of ["q", "p", "vir", "stanje", "regija", "red"]) if (o[k]) sp.set(k, o[k]);
    if (o.stran !== "1") sp.set("stran", o.stran);
    return `/admin/baza${sp.toString() ? `?${sp}` : ""}`;
  };
  const izbranaPanoga = p === "nerazvrsceni" ? "Nerazvrščeni" : Number(p) ? imePanoge[Number(p)] : "Vsi kontakti";

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Mailing</div>
          <h1>Baza kontaktov</h1>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <a className="gumb siv" href={`/admin/baza/izvoz?${new URLSearchParams({ q, p, vir, stanje, regija, red })}`}>Izvoz CSV</a>
          <UskladiGumb />
        </div>
      </div>

      <div className="adm-telo siroko">
        <div className="bz">
          <aside className="bz-panoge">
            <Link href={url({ p: "" })} className={!p ? "on" : ""}><span>Vsi kontakti</span><em>{vsi}</em></Link>
            <Link href={url({ p: "nerazvrsceni" })} className={`bz-nerazv${p === "nerazvrsceni" ? " on" : ""}`}><span>⚑ Nerazvrščeni</span><em>{nerazvrsceni}</em></Link>
            <div className="bz-loc">Panoge</div>
            {(panoge ?? []).map((pa) => (
              <Link key={pa.sifra} href={url({ p: String(pa.sifra) })} className={Number(p) === pa.sifra ? "on" : ""}>
                <span>{pa.ime}</span><em>{stevec[pa.sifra]}</em>
              </Link>
            ))}
            <div className="bz-loc">Stanje</div>
            <Link href={url({ stanje: stanje === "odjavljeni" ? "" : "odjavljeni" })} className={stanje === "odjavljeni" ? "on" : ""}><span>Odjavljeni</span><em>{odjavljeni}</em></Link>
            <Link href={url({ stanje: stanje === "soglasje" ? "" : "soglasje" })} className={stanje === "soglasje" ? "on" : ""}><span>S soglasjem (e-novice)</span></Link>
            <div className="bz-loc">Regija</div>
            {REGIJE.map(([r, ime], i) => (
              <Link key={r} href={url({ regija: regija === r ? "" : r })} className={regija === r ? "on" : ""}><span>{ime}</span><em>{poRegijah[i]}</em></Link>
            ))}
          </aside>

          <section className="bz-glavno">
            <div className="bz-orodja">
              <Suspense><IskalnikBaze q={q} /></Suspense>
              <details className="bz-dodaj">
                <summary className="gumb">+ Dodaj kontakt</summary>
                <div className="bz-pop"><KontaktObrazec panoge={panoge ?? []} /></div>
              </details>
              <details className="bz-dodaj">
                <summary className="gumb siv">Izbriši domeno</summary>
                <div className="bz-pop"><IzkljuciDomeno domene={izkljucene} /></div>
              </details>
              <details className="bz-dodaj">
                <summary className="gumb siv">Uvoz iz Excela</summary>
                <div className="bz-pop"><UvozBaze panoge={panoge ?? []} privzeta={Number(p) || ""} /></div>
              </details>
            </div>

            <div className="bz-naslov">
              <b>{izbranaPanoga}</b> <span className="siv">{count ?? 0} kontaktov{q ? ` · iskanje »${q}«` : ""}{vir ? ` · vir ${vir}` : ""}{regija ? ` · ${REGIJE.find((x) => x[0] === regija)?.[1] ?? ""}` : ""}</span>
              {p === "nerazvrsceni" && <span className="bz-namig">Pri vsakem kontaktu izberi panogo — kontakt se takoj premakne.</span>}
            </div>

            <div className="bz-tab">
              <div className="bz-vr bz-gl">
                {["email", "ime", "podjetje", "kraj", "panoga", "stanje"].map((k) => {
                  const akt = kljucRed === k;
                  return (
                    <Link key={k} href={url({ red: akt && narascajoce ? `-${k}` : k })} className={`bz-sort${akt ? " on" : ""}`} title="Razvrsti">
                      {RAZVRSTI[k][1]} <i>{akt ? (narascajoce ? "▲" : "▼") : "↕"}</i>
                    </Link>
                  );
                })}
                <Link href={url({ red: kljucRed === "dodan" && !narascajoce ? "dodan" : "-dodan" })} className={`bz-sort${kljucRed === "dodan" ? " on" : ""}`} title="Razvrsti po datumu dodajanja">Novi <i>{kljucRed === "dodan" ? (narascajoce ? "▲" : "▼") : "↕"}</i></Link>
              </div>
              {(kontakti ?? []).length === 0 && <p className="bz-prazno">Ni kontaktov.</p>}
              {(kontakti ?? []).map((k) => (
                <Vrstica key={k.email} k={k} panoge={panoge ?? []} poslovalnice={peZa(k.vasco_partner)} />
              ))}
            </div>

            {strani > 1 && (
              <div className="bz-strani">
                {st > 1 && <Link className="gumb siv mini" href={url({ stran: String(st - 1) })}>← Prejšnja</Link>}
                <span className="siv">Stran {st} / {strani}</span>
                {st < strani && <Link className="gumb siv mini" href={url({ stran: String(st + 1) })}>Naslednja →</Link>}
              </div>
            )}
            <p className="adm-namig">
              Mailing pošiljaš v »E-novice (mailing)« — izberi segment »Baza · &lt;panoga&gt;«. Pred pošiljanjem klikni »Uskladi z Resend«, da so segmenti sveži.
              Kontakti brez soglasja so poslovni partnerji (Vasco, povpraševanja, naročila) — vsak mailing mora imeti povezavo za odjavo.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
