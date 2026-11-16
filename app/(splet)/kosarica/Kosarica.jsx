"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { slikeArtiklov } from "@/lib/akcije/narocila";
import { useKosarica, nastaviKolicino, odstrani } from "@/lib/kosarica";
import { eur, zaokrozi, DDV } from "@/lib/cene";
import { useB2BCene } from "@/lib/b2b-klient";
import { Ikona, Koraki, Zaupanje, BrezplacnaDostava } from "@/components/trgovina/Deli";
import { prevedeno } from "@/lib/i18n/odjemalec";

function Kosarica() {
  const p = useKosarica();
  const b2b = useB2BCene(p.map((x) => x.id));
  // slika izdelka za artikle, ki so bili dodani brez slike
  const [slike, setSlike] = useState({});
  const brezSlike = p.filter((x) => !x.slika).map((x) => x.id).join(",");
  useEffect(() => {
    if (!brezSlike) return;
    slikeArtiklov(brezSlike.split(",").map(Number)).then(setSlike).catch(() => {});
  }, [brezSlike]);

  if (!p.length)
    return (
      <>
        <div className="trg-glava">
          <h1>Košarica</h1>
          <Koraki korak={1} />
        </div>
        <div className="trg-prazno">
          <Ikona ime="vozicek" velikost={40} />
          <h2>Košarica je prazna</h2>
          <p>Izberite izdelke v prodajnem programu, dodate jih z gumbom »V košarico« pri vsakem artiklu.</p>
          <Link className="b b-r" href="/program">Na prodajni program</Link>
        </div>
      </>
    );

  // B2B: cena po ceniku kupca (brez DDV); sicer maloprodajna cena z DDV
  const cenaPak = (x) => (b2b ? b2b.cene[x.id]?.neto ?? null : x.cenaBruto);
  const rednaPak = (x) => (b2b ? b2b.cene[x.id]?.redna ?? null : null);
  const popustPak = (x) => (b2b ? b2b.cene[x.id]?.popust ?? 0 : 0);
  const vrstica = (x) => zaokrozi((cenaPak(x) ?? 0) * x.kolicina);
  const neto = b2b
    ? zaokrozi(p.reduce((s, x) => s + vrstica(x), 0))
    : zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0) / (1 + DDV));
  const bruto = b2b ? zaokrozi(neto * (1 + DDV)) : zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0));
  const redno = b2b ? zaokrozi(p.reduce((s, x) => s + (rednaPak(x) ?? cenaPak(x) ?? 0) * x.kolicina, 0)) : neto;
  const prihranek = b2b ? zaokrozi(redno - neto) : 0;
  const brezCene = b2b ? p.filter((x) => cenaPak(x) === null) : [];
  const kosov = p.reduce((s, x) => s + x.kolicina, 0);
  const na100 = (x) => (x.kos > 1 && cenaPak(x) != null ? (cenaPak(x) / x.kos) * 100 : null);
  const pakiranje = (x) => x.lastnosti?.Pakiranje || x.lastnosti?.pakiranje || "";
  const lastnosti = (x) =>
    Object.entries(x.lastnosti ?? {})
      .filter(([k, v]) => v && !/^pakiranje$/i.test(k))
      .map(([, v]) => v)
      .join(" · ");

  return (
    <>
      <div className="trg-glava ksb-glava">
        <h1>
          Košarica <small>{p.length} {p.length === 1 ? "artikel" : p.length === 2 ? "artikla" : p.length < 5 ? "artikli" : "artiklov"} · {kosov} {kosov === 1 ? "pakiranje" : kosov === 2 ? "pakiranji" : kosov < 5 ? "pakiranja" : "pakiranj"}</small>
        </h1>
        <Koraki korak={1} />
      </div>

      <div className="ksb-mreza">
        <div className="ksb-levo">
          <div className={b2b ? "ksb-tab" : "ksb-tab b2c"}>
            <div className="ksb-vr ksb-vr-gl">
              <span></span>
              <span>Artikel</span>
              <span>Pakiranje</span>
              <span>Količina</span>
              {b2b && <span className="d">Redna cena / pak.</span>}
              <span className="d">{b2b ? "Vaša cena / pak." : "Cena / pak."}</span>
              <span className="d">Cena / 100 kos</span>
              <span className="d">{b2b ? "Vrednost brez DDV" : "Vrednost z DDV"}</span>
              <span></span>
            </div>
            {p.map((x) => (
              <div key={x.id} className="ksb-vr">
                <div className="ksb-sl">
                  {x.slika || slike[x.id] ? <img src={x.slika || slike[x.id]} alt="" loading="lazy" /> : <Ikona ime="skatla" velikost={22} />}
                </div>
                <div className="ksb-ime">
                  {x.pot ? <Link href={x.pot}>{x.naziv}</Link> : <b>{x.naziv}</b>} {x.dimenzija && <b className="ksb-dim">{x.dimenzija}</b>}
                  <p>
                    <em>{x.sifra}</em>
                    {lastnosti(x) && <> · {lastnosti(x)}</>}
                  </p>
                </div>
                <div className="ksb-pak" data-l="Pakiranje">
                  <b>{x.kos > 1 ? `${x.kos.toLocaleString("sl-SI")} kos` : "1 kos"}</b>
                  <span>{pakiranje(x) || (x.kos > 1 ? "pakiranje" : "kos")}</span>
                </div>
                <div className="ksb-kol" data-l="Količina">
                  <div className="ks-st">
                    <button type="button" onClick={() => nastaviKolicino(x.id, x.kolicina - 1)} aria-label="Manj">−</button>
                    <input
                      type="number"
                      min="1"
                      value={x.kolicina}
                      onChange={(e) => nastaviKolicino(x.id, Number(e.target.value) || 1)}
                      aria-label={x.kos > 1 ? `Število pakiranj po ${x.kos} kos` : "Količina"}
                    />
                    <button type="button" onClick={() => nastaviKolicino(x.id, x.kolicina + 1)} aria-label="Več">+</button>
                  </div>
                  <span>{x.kos > 1 ? `= ${(x.kolicina * x.kos).toLocaleString("sl-SI")} kos` : ""}</span>
                </div>
                {b2b && (
                  <div className="d" data-l="Redna cena / pak.">
                    {rednaPak(x) != null && popustPak(x) > 0 ? <s className="ksb-redna">{eur(rednaPak(x))}</s> : <span className="ksb-siv">{rednaPak(x) != null ? eur(rednaPak(x)) : "—"}</span>}
                  </div>
                )}
                <div className="d" data-l={b2b ? "Vaša cena / pak." : "Cena / pak."}>
                  {cenaPak(x) === null ? <span className="ksb-siv">ni cene</span> : <b>{eur(cenaPak(x))}</b>}
                  {popustPak(x) > 0 && <i className="ksb-pop">−{String(popustPak(x)).replace(".", ",")} %</i>}
                </div>
                <div className="d ksb-siv" data-l="Cena / 100 kos">{na100(x) != null ? eur(na100(x)) : "—"}</div>
                <div className="d ksb-vred" data-l="Vrednost">{cenaPak(x) === null ? "—" : eur(vrstica(x))}</div>
                <button type="button" className="ks-x" onClick={() => odstrani(x.id)} aria-label={`Odstrani ${x.naziv}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
                </button>
              </div>
            ))}
            <div className="ksb-noga">
              <Link href="/program">← Nadaljuj z nakupom</Link>
              <span>{b2b ? `Cene po ceniku za ${b2b.podjetje}, brez DDV` : "Vse cene vključujejo 22 % DDV"}</span>
            </div>
          </div>
          {brezCene.length > 0 && (
            <div className="bl-nap">Artiklov {brezCene.map((x) => x.sifra).join(", ")} ni mogoče naročiti prek spleta, odstranite jih ali nas pokličite.</div>
          )}
        </div>

        <aside className="trg-pov">
          <div className="trg-kar ksb-pov">
            <div className="trg-kar-g"><h2>Povzetek</h2></div>
            <div className="trg-kar-t">
              <BrezplacnaDostava bruto={bruto} />
              {b2b && prihranek > 0.004 && (
                <>
                  <div className="trg-v"><span>Po redni ceni (VPC)</span><b><s style={{ color: "var(--color-muted)", fontWeight: 500 }}>{eur(redno)}</s></b></div>
                  <div className="trg-v ksb-prih"><span>Vaš popust</span><b>−{eur(prihranek)}</b></div>
                </>
              )}
              <div className="trg-v"><span>Blago brez DDV</span><b>{eur(neto)}</b></div>
              <div className="trg-v"><span>DDV 22 %</span><b>{eur(zaokrozi(bruto - neto))}</b></div>
              <div className="trg-v"><span>Dostava</span><b>izračun na blagajni</b></div>
              <div className="trg-sk"><span>Skupaj</span><b>{eur(bruto)}</b></div>
              <div className="trg-sk-ddv">z DDV, brez dostave</div>
              <Link href="/blagajna" className="trg-gumb" aria-disabled={brezCene.length > 0} onClick={(e) => brezCene.length > 0 && e.preventDefault()}>
                Na blagajno →
              </Link>
              <Zaupanje />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default prevedeno(Kosarica);
