"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { slikeArtiklov } from "@/lib/akcije/narocila";
import { useKosarica, nastaviKolicino, odstrani } from "@/lib/kosarica";
import { eur, zaokrozi, DDV } from "@/lib/cene";
import { useB2BCene } from "@/lib/b2b-klient";
import { Ikona, Koraki, Zaupanje, BrezplacnaDostava } from "@/components/trgovina/Deli";

export default function Kosarica() {
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
          <p>Izberite izdelke v prodajnem programu — dodate jih z gumbom »V košarico« pri vsakem artiklu.</p>
          <Link className="b b-r" href="/program">Na prodajni program</Link>
        </div>
      </>
    );

  // B2B: cena po ceniku kupca (brez DDV); sicer maloprodajna cena z DDV
  const cenaPak = (x) => (b2b ? b2b.cene[x.id]?.neto ?? null : x.cenaBruto);
  const vrstica = (x) => zaokrozi((cenaPak(x) ?? 0) * x.kolicina);
  const neto = b2b
    ? zaokrozi(p.reduce((s, x) => s + vrstica(x), 0))
    : zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0) / (1 + DDV));
  const bruto = b2b ? zaokrozi(neto * (1 + DDV)) : zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0));
  const brezCene = b2b ? p.filter((x) => cenaPak(x) === null) : [];
  const kosov = p.reduce((s, x) => s + x.kolicina, 0);

  return (
    <>
      <div className="trg-glava">
        <h1>
          Košarica <small>{kosov} {kosov === 1 ? "pakiranje" : kosov < 5 ? "pakiranja" : "pakiranj"}</small>
        </h1>
        <Koraki korak={1} />
      </div>

      <div className="trg-mreza">
        <div>
          <div className="trg-kar">
            {p.map((x) => (
              <div key={x.id} className="ks-vrst">
                <div className="ks-sl">
                  {x.slika || slike[x.id] ? <img src={x.slika || slike[x.id]} alt="" loading="lazy" /> : <Ikona ime="skatla" velikost={26} />}
                </div>
                <div className="ks-ime">
                  {x.pot ? <Link href={x.pot}>{x.naziv}</Link> : <b>{x.naziv}</b>} {x.dimenzija && <span className="ks-dim">{x.dimenzija}</span>}
                  <p>
                    {Object.values(x.lastnosti ?? {}).filter(Boolean).join(" · ")}
                    {Object.keys(x.lastnosti ?? {}).length ? " · " : ""}
                    <em>šifra {x.sifra}</em>
                  </p>
                </div>
                <div className="ks-kol">
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
                  <small>{x.kos > 1 ? `pakiranje ${x.kos} kos · ${(x.kolicina * x.kos).toLocaleString("sl-SI")} kos` : "kos"}</small>
                </div>
                <div className="ks-cena">
                  <b>{cenaPak(x) === null ? "—" : eur(vrstica(x))}</b>
                  <small>{cenaPak(x) === null ? "ni cene" : `${eur(cenaPak(x))} / pak.`}</small>
                </div>
                <button type="button" className="ks-x" onClick={() => odstrani(x.id)} aria-label={`Odstrani ${x.naziv}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
                </button>
              </div>
            ))}
            <div className="ks-noga">
              <Link href="/program">← Nadaljuj z nakupom</Link>
              <span style={{ color: "var(--color-muted)" }}>{b2b ? `Cene po ceniku za ${b2b.podjetje}, brez DDV` : "Vse cene vključujejo 22 % DDV"}</span>
            </div>
          </div>
          {brezCene.length > 0 && (
            <div className="bl-nap">Artiklov {brezCene.map((x) => x.sifra).join(", ")} ni mogoče naročiti prek spleta — odstranite jih ali nas pokličite.</div>
          )}
        </div>

        <aside className="trg-pov">
          <div className="trg-kar">
            <div className="trg-kar-g"><h2>Povzetek</h2></div>
            <div className="trg-kar-t">
              <BrezplacnaDostava bruto={bruto} />
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
