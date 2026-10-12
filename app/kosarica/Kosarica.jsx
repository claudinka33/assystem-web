"use client";

import Link from "next/link";
import { useKosarica, nastaviKolicino, odstrani } from "@/lib/kosarica";
import { eur, zaokrozi, DDV } from "@/lib/cene";
import { useB2BCene } from "@/lib/b2b-klient";

export default function Kosarica() {
  const p = useKosarica();
  const b2b = useB2BCene(p.map((x) => x.id));
  if (!p.length)
    return (
      <p>
        Košarica je prazna. <Link href="/program" style={{ color: "var(--color-red)" }}>Poglej prodajni program →</Link>
      </p>
    );
  // B2B: cena po ceniku kupca (brez DDV); sicer maloprodajna cena z DDV
  const cenaNeto = (x) => (b2b ? b2b.cene[x.id]?.neto ?? null : zaokrozi(x.cenaBruto / (1 + DDV)));
  const neto = zaokrozi(p.reduce((s, x) => s + (cenaNeto(x) ?? 0) * x.kolicina, 0));
  const skupaj = b2b ? zaokrozi(neto * (1 + DDV)) : zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0));
  const brezCene = b2b ? p.filter((x) => cenaNeto(x) === null) : [];
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table className="mob-kartice">
          <thead>
            <tr><th>Izdelek</th><th>Šifra</th><th>Pakiranje</th><th>{b2b ? "Cena brez DDV" : "Cena z DDV"}</th><th>Število pakiranj</th><th>Skupaj</th><th></th></tr>
          </thead>
          <tbody>
            {p.map((x) => (
              <tr key={x.id}>
                <td className="mk-gl">
                  {x.pot ? <Link href={x.pot}><b>{x.naziv}</b></Link> : <b>{x.naziv}</b>}
                  <div className="izd-siv">{x.dimenzija} {Object.values(x.lastnosti ?? {}).join(" · ")}</div>
                </td>
                <td className="izd-siv" data-l="Šifra">{x.sifra}</td>
                <td data-l="Pakiranje">{x.kos ? `${x.kos} kos` : "—"}</td>
                <td data-l={b2b ? "Cena brez DDV" : "Cena z DDV"}>{b2b ? (cenaNeto(x) === null ? "ni na voljo" : eur(cenaNeto(x))) : eur(x.cenaBruto)}</td>
                <td data-l="Količina">
                  <span className="vk">
                    <input type="number" min="1" value={x.kolicina} onChange={(e) => nastaviKolicino(x.id, Number(e.target.value) || 1)} aria-label="Število pakiranj" />
                    {x.kos > 1 && <span className="vk-x">× {x.kos} kos</span>}
                  </span>
                  {x.kos > 1 && <div className="vk-sk">= {(x.kolicina * x.kos).toLocaleString("sl-SI")} kos</div>}
                </td>
                <td data-l="Skupaj"><b>{b2b ? eur(zaokrozi((cenaNeto(x) ?? 0) * x.kolicina)) : eur(zaokrozi(x.cenaBruto * x.kolicina))}</b></td>
                <td className="mk-x"><button type="button" className="kos-x" onClick={() => odstrani(x.id)} aria-label="Odstrani">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b2b && (
        <p className="b2b-ok" style={{ marginTop: 16 }}>
          Cene po ceniku za <b>{b2b.podjetje}</b> (brez DDV).
          {brezCene.length > 0 && <> Artiklov brez cene ({brezCene.map((x) => x.sifra).join(", ")}) ne moreš naročiti prek spleta — odstrani jih ali nas pokliči.</>}
        </p>
      )}
      <div className="kos-sum">
        <span>Brez DDV: {eur(neto)}</span>
        <span>DDV 22 %: {eur(zaokrozi(skupaj - neto))}</span>
        <b>Skupaj z DDV: {eur(skupaj)}</b>
        <span className="izd-siv">Dostava se izračuna na blagajni.</span>
        <Link className="b b-r" href="/blagajna">Na blagajno</Link>
      </div>
    </>
  );
}
