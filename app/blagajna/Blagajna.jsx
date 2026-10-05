"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useKosarica, izprazni } from "@/lib/kosarica";
import { oddajNarocilo } from "@/lib/akcije/narocila";
import { eur, zaokrozi } from "@/lib/cene";

const PLACILA = [
  { k: "predracun", n: "Po predračunu", o: "Po oddaji prejmete podatke za plačilo. Blago odpošljemo po prejemu plačila." },
  { k: "povzetje", n: "Po povzetju", o: "Plačate ob prevzemu paketa." },
  { k: "paypal", n: "PayPal", o: "Kmalu.", off: true },
  { k: "kartica", n: "Plačilna kartica (Stripe)", o: "Kmalu.", off: true },
];

export default function Blagajna({ dostave }) {
  const p = useKosarica();
  const router = useRouter();
  const [napaka, setNapaka] = useState("");
  const [dost, setDost] = useState(String(dostave[0]?.id ?? 0));
  const [plac, setPlac] = useState("predracun");
  const [cakam, zacni] = useTransition();

  if (!p.length)
    return <p>Košarica je prazna. <Link href="/program" style={{ color: "var(--color-red)" }}>Poglej prodajni program →</Link></p>;

  const blago = zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0));
  const d = dostave.find((x) => String(x.id) === dost) ?? dostave[0];
  const postnina = d?.brezplacno_nad && blago >= Number(d.brezplacno_nad) ? 0 : Number(d?.cena) || 0;

  function oddaj(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setNapaka("");
    zacni(async () => {
      const r = await oddajNarocilo({
        podatki: { ...f, dostava: dost, placilo: plac, pogoji: f.pogoji === "on" },
        postavke: p.map((x) => ({ id: x.id, kolicina: x.kolicina })),
      });
      if (r?.napaka) return setNapaka(r.napaka);
      izprazni();
      router.push(`/blagajna/hvala?st=${encodeURIComponent(r.stevilka)}&p=${r.placilo}&z=${r.skupaj}`);
    });
  }

  return (
    <form onSubmit={oddaj} className="blag">
      <div className="blag-l">
        <h2>Podatki za dostavo in račun</h2>
        <div className="blag-polja">
          <label>Ime in priimek *<input name="ime" required autoComplete="name" /></label>
          <label>Podjetje (neobvezno)<input name="podjetje" autoComplete="organization" /></label>
          <label>E-pošta *<input name="email" type="email" required autoComplete="email" /></label>
          <label>Telefon *<input name="telefon" required autoComplete="tel" /></label>
          <label className="cela">Ulica in hišna številka *<input name="ulica" required autoComplete="street-address" /></label>
          <label>Poštna številka *<input name="posta" required autoComplete="postal-code" /></label>
          <label>Kraj *<input name="kraj" required autoComplete="address-level2" /></label>
          <label className="cela">Opomba<textarea name="opomba" rows={3} /></label>
        </div>

        <h2>Dostava</h2>
        {dostave.map((x) => (
          <label key={x.id} className="blag-izb">
            <input type="radio" name="_dostava" checked={dost === String(x.id)} onChange={() => { setDost(String(x.id)); if (x.koda === "osebno" && plac === "povzetje") setPlac("predracun"); }} />
            <span><b>{x.naziv}</b> — {Number(x.cena) ? eur(Number(x.cena)) : "brezplačno"}{x.brezplacno_nad ? ` (brezplačno nad ${eur(Number(x.brezplacno_nad))})` : ""}</span>
          </label>
        ))}

        <h2>Plačilo</h2>
        {PLACILA.map((x) => {
          const off = x.off || (x.k === "povzetje" && d?.koda === "osebno");
          return (
            <label key={x.k} className={`blag-izb${off ? " off" : ""}`}>
              <input type="radio" name="_placilo" disabled={off} checked={plac === x.k} onChange={() => setPlac(x.k)} />
              <span><b>{x.n}</b> — {x.k === "povzetje" && d?.koda === "osebno" ? "samo z dostavo." : x.o}</span>
            </label>
          );
        })}
      </div>

      <aside className="blag-d">
        <h2>Povzetek</h2>
        {p.map((x) => (
          <div key={x.id} className="blag-v">
            <span>{x.kolicina} × {x.naziv} {x.dimenzija}</span>
            <b>{eur(zaokrozi(x.cenaBruto * x.kolicina))}</b>
          </div>
        ))}
        <div className="blag-v"><span>Dostava</span><b>{eur(postnina)}</b></div>
        <div className="blag-v blag-sk"><span>Skupaj z DDV</span><b>{eur(zaokrozi(blago + postnina))}</b></div>
        <label className="blag-pog">
          <input type="checkbox" name="pogoji" required /> Strinjam se s <Link href="/splosni-pogoji" target="_blank">splošnimi pogoji</Link> in <Link href="/zasebnost" target="_blank">varstvom podatkov</Link>.
        </label>
        {napaka && <p className="blag-nap">{napaka}</p>}
        <button className="b b-r" type="submit" disabled={cakam} style={{ width: "100%" }}>
          {cakam ? "Pošiljam …" : "Oddaj naročilo z obveznostjo plačila"}
        </button>
      </aside>
    </form>
  );
}
