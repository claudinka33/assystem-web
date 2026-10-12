"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { dogodekKoJePripravljeno } from "@/lib/dogodki";
import { useKosarica, izprazni } from "@/lib/kosarica";
import { oddajNarocilo } from "@/lib/akcije/narocila";
import { eur, zaokrozi, izracunajPostnino } from "@/lib/cene";

const PLACILA = [
  { k: "kartica", n: "Plačilna kartica", o: "Visa, Mastercard, Apple Pay, Google Pay — varno plačilo prek Stripe." },
  { k: "paypal", n: "PayPal", o: "Plačilo s PayPal računom." },
  { k: "predracun", n: "Po predračunu", o: "Po oddaji prejmete podatke za plačilo (TRR in sklic). Blago odpošljemo po prejemu plačila." },
  { k: "povzetje", n: "Po povzetju", o: "Plačate ob prevzemu paketa." },
];

export default function Blagajna({ dostave, placila = ["predracun", "povzetje"] }) {
  const p = useKosarica();
  const router = useRouter();
  const [napaka, setNapaka] = useState("");
  const [dost, setDost] = useState(String(dostave[0]?.id ?? 0));
  const [plac, setPlac] = useState(placila.includes("kartica") ? "kartica" : "predracun");
  const [cakam, zacni] = useTransition();

  useEffect(() => {
    if (!p.length) return;
    dogodekKoJePripravljeno("begin_checkout", {
      currency: "EUR",
      value: zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0)),
      items: p.map((x) => ({ item_id: x.sifra, item_name: x.naziv, price: x.cenaBruto, quantity: x.kolicina })),
    });
    // samo ob prihodu na blagajno
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!p.length)
    return <p>Košarica je prazna. <Link href="/program" style={{ color: "var(--color-red)" }}>Poglej prodajni program →</Link></p>;

  const blago = zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0));
  const d = dostave.find((x) => String(x.id) === dost) ?? dostave[0];
  const postnina = izracunajPostnino(d, blago);

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
      if (r.preusmeritev) {
        window.location.href = r.preusmeritev;
        return;
      }
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
            <span>
              <b>{x.naziv}</b> — {x.koda === "osebno" ? "brezplačno" : `${eur(izracunajPostnino(x, blago))}`}
              {x.koda === "osebno" ? (
                <em className="blag-op"> Obrtniška ulica 14, Šmarje pri Jelšah, pon–pet 7.00–15.00. Obvestimo vas, ko je naročilo pripravljeno.</em>
              ) : (
                <em className="blag-op"> Do 50 € 10 €, od 50 € do 100 € 5 €, nad 100 € brezplačno.</em>
              )}
            </span>
          </label>
        ))}

        <h2>Plačilo</h2>
        {PLACILA.filter((x) => placila.includes(x.k)).map((x) => {
          const off = x.k === "povzetje" && d?.koda === "osebno";
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
          <input type="checkbox" name="pogoji" required /> Strinjam se s <Link href="/splosni-pogoji" target="_blank">splošnimi pogoji poslovanja</Link> in sem seznanjen/-a z <Link href="/odstop-od-pogodbe" target="_blank">pravico do odstopa</Link> ter <Link href="/zasebnost" target="_blank">varstvom osebnih podatkov</Link>.
        </label>
        {napaka && <p className="blag-nap">{napaka}</p>}
        <button className="b b-r" type="submit" disabled={cakam} style={{ width: "100%" }}>
          {cakam ? "Pošiljam …" : plac === "kartica" || plac === "paypal" ? "Oddaj naročilo in plačaj" : "Oddaj naročilo z obveznostjo plačila"}
        </button>
      </aside>
    </form>
  );
}
