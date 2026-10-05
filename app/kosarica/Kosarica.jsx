"use client";

import Link from "next/link";
import { useKosarica, nastaviKolicino, odstrani } from "@/lib/kosarica";
import { eur, zaokrozi, DDV } from "@/lib/cene";

export default function Kosarica() {
  const p = useKosarica();
  if (!p.length)
    return (
      <p>
        Košarica je prazna. <Link href="/program" style={{ color: "var(--color-red)" }}>Poglej prodajni program →</Link>
      </p>
    );
  const skupaj = zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0));
  const neto = zaokrozi(skupaj / (1 + DDV));
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Izdelek</th><th>Šifra</th><th>Pakiranje</th><th>Cena z DDV</th><th>Količina</th><th>Skupaj</th><th></th></tr>
          </thead>
          <tbody>
            {p.map((x) => (
              <tr key={x.id}>
                <td>
                  {x.pot ? <Link href={x.pot}><b>{x.naziv}</b></Link> : <b>{x.naziv}</b>}
                  <div className="izd-siv">{x.dimenzija} {Object.values(x.lastnosti ?? {}).join(" · ")}</div>
                </td>
                <td className="izd-siv">{x.sifra}</td>
                <td>{x.kos ? `${x.kos} kos` : "—"}</td>
                <td>{eur(x.cenaBruto)}</td>
                <td>
                  <input type="number" min="1" value={x.kolicina} onChange={(e) => nastaviKolicino(x.id, Number(e.target.value) || 1)} style={{ width: 70 }} aria-label="Količina" />
                </td>
                <td><b>{eur(zaokrozi(x.cenaBruto * x.kolicina))}</b></td>
                <td><button type="button" className="kos-x" onClick={() => odstrani(x.id)} aria-label="Odstrani">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
