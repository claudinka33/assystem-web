"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useKosarica, izprazni } from "@/lib/kosarica";
import { oddajNarocilo } from "@/lib/akcije/narocila";
import { eur, zaokrozi, izracunajPostnino, DDV } from "@/lib/cene";
import { dogodekKoJePripravljeno } from "@/lib/dogodki";
import { Ikona, Koraki, Zaupanje, KodaPopust } from "@/components/trgovina/Deli";

const PLACILA = [
  { k: "kartica", n: "Plačilna kartica", o: "Visa, Mastercard, Maestro, Amex, Apple Pay, Google Pay", ik: "kartica" },
  { k: "paypal", n: "PayPal", o: "Plačilo s PayPal računom", ik: "paypal" },
  { k: "predracun", n: "Po predračunu", o: "Nakazilo na TRR, odprema po plačilu", ik: "banka" },
  { k: "povzetje", n: "Po povzetju", o: "Plačate ob prevzemu paketa", ik: "denar" },
];

export default function Blagajna({ dostave, placila = ["predracun", "povzetje"] }) {
  const p = useKosarica();
  const router = useRouter();
  const [napaka, setNapaka] = useState("");
  const [dost, setDost] = useState(String(dostave.find((x) => x.koda !== "osebno")?.id ?? dostave[0]?.id ?? 0));
  const [plac, setPlac] = useState(placila.includes("kartica") ? "kartica" : "predracun");
  const [koda, setKoda] = useState(null);
  const [opomba, setOpomba] = useState(false);
  const [podjetje, setPodjetje] = useState(false);
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
    return (
      <div className="trg-prazno">
        <Ikona ime="vozicek" velikost={40} />
        <h2>Košarica je prazna</h2>
        <p>Za oddajo naročila najprej dodajte izdelke.</p>
        <Link className="b b-r" href="/program">Na prodajni program</Link>
      </div>
    );

  const blago = zaokrozi(p.reduce((s, x) => s + x.cenaBruto * x.kolicina, 0));
  const d = dostave.find((x) => String(x.id) === dost) ?? dostave[0];
  const osebno = d?.koda === "osebno";
  const postnina = koda?.brezplacnaDostava ? 0 : izracunajPostnino(d, blago);
  const popust = koda?.popustBruto ?? 0;
  const skupaj = zaokrozi(blago - popust + postnina);
  const spletno = plac === "kartica" || plac === "paypal";

  function oddaj(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setNapaka("");
    zacni(async () => {
      const r = await oddajNarocilo({
        podatki: { ...f, dostava: dost, placilo: plac, koda: koda?.koda ?? "", pogoji: f.pogoji === "on" },
        postavke: p.map((x) => ({ id: x.id, kolicina: x.kolicina })),
      });
      if (r?.napaka) return setNapaka(r.napaka);
      izprazni();
      if (r.preusmeritev) {
        window.location.href = r.preusmeritev;
        return;
      }
      router.push(`/blagajna/hvala?st=${encodeURIComponent(r.stevilka)}`);
    });
  }

  return (
    <>
      <div className="trg-glava">
        <h1>Blagajna</h1>
        <Koraki korak={2} />
      </div>

      <form onSubmit={oddaj} className="trg-mreza">
        <div>
          <section className="trg-kar">
            <div className="trg-kar-g">
              <h2><b>1</b>Vaši podatki</h2>
              <span>
                <Link href="/b2b?naprej=/blagajna" style={{ textDecoration: "underline" }}>Podjetje s cenikom? Prijava B2B</Link>
              </span>
            </div>
            <div className="trg-kar-t">
              <div className="bl-polja">
                <label>Ime in priimek<input name="ime" required autoComplete="name" /></label>
                <label>E-pošta<input name="email" type="email" required autoComplete="email" /></label>
                <label>Telefon<input name="telefon" required autoComplete="tel" inputMode="tel" /></label>
                <label className="s3">Ulica in hišna številka<input name="ulica" required autoComplete="street-address" /></label>
                <label className="pol" style={{ gridColumn: "span 1" }}>Pošta<input name="posta" required autoComplete="postal-code" inputMode="numeric" /></label>
                <label className="pol">Kraj<input name="kraj" required autoComplete="address-level2" /></label>
                {podjetje && <label className="s6">Podjetje in ID za DDV (za račun na podjetje)<input name="podjetje" autoComplete="organization" placeholder="npr. Gradnje d.o.o., SI12345678" /></label>}
                {opomba && <label className="s6">Opomba k naročilu<textarea name="opomba" /></label>}
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
                {!podjetje && <button type="button" className="trg-link" onClick={() => setPodjetje(true)}>+ Račun na podjetje</button>}
                {!opomba && <button type="button" className="trg-link" onClick={() => setOpomba(true)}>+ Dodaj opombo</button>}
              </div>
            </div>
          </section>

          <section className="trg-kar">
            <div className="trg-kar-g"><h2><b>2</b>Dostava</h2></div>
            <div className="trg-kar-t">
              <div className="bl-moz">
                {dostave.map((x) => {
                  const cena = koda?.brezplacnaDostava ? 0 : izracunajPostnino(x, blago);
                  return (
                    <label key={x.id} className={dost === String(x.id) ? "on" : ""}>
                      <input
                        type="radio"
                        name="_dostava"
                        checked={dost === String(x.id)}
                        onChange={() => {
                          setDost(String(x.id));
                          if (x.koda === "osebno" && plac === "povzetje") setPlac("predracun");
                        }}
                      />
                      <span className="ik"><Ikona ime={x.koda === "osebno" ? "trgovina" : "tovornjak"} /></span>
                      <span>
                        <b>{x.koda === "osebno" ? "Osebni prevzem" : x.naziv}</b>
                        <small>{x.koda === "osebno" ? "Šmarje pri Jelšah, pon–pet 7–15" : "Dostava naslednji delovni dan"}</small>
                      </span>
                      <span className={`cena${cena === 0 ? " zast" : ""}`}>{cena === 0 ? "brezplačno" : eur(cena)}</span>
                    </label>
                  );
                })}
              </div>
              {!osebno && <p className="bl-opomba">Poštnina: do 50 € 10 €, do 100 € 5 €, nad 100 € brezplačno.</p>}
            </div>
          </section>

          <section className="trg-kar">
            <div className="trg-kar-g"><h2><b>3</b>Plačilo</h2></div>
            <div className="trg-kar-t">
              <div className="bl-moz">
                {PLACILA.filter((x) => placila.includes(x.k)).map((x) => {
                  const off = x.k === "povzetje" && osebno;
                  return (
                    <label key={x.k} className={`${plac === x.k ? "on" : ""}${off ? " off" : ""}`}>
                      <input type="radio" name="_placilo" disabled={off} checked={plac === x.k} onChange={() => setPlac(x.k)} />
                      <span className="ik"><Ikona ime={x.ik} /></span>
                      <span>
                        <b>{x.n}</b>
                        <small>{off ? "Samo pri dostavi na naslov" : x.o}</small>
                      </span>
                      <span />
                    </label>
                  );
                })}
              </div>
              {spletno && <p className="bl-opomba">Po oddaji vas preusmerimo na varno plačilno stran. Plačilo je šifrirano; podatkov o kartici ne vidimo in ne hranimo.</p>}
              {plac === "predracun" && <p className="bl-opomba">Podatke za nakazilo (TRR in sklic) prejmete takoj po oddaji in po e-pošti.</p>}
            </div>
          </section>
        </div>

        <aside className="trg-pov">
          <div className="trg-kar">
            <div className="trg-kar-g">
              <h2>Vaše naročilo</h2>
              <Link href="/kosarica" style={{ fontSize: 12.5, textDecoration: "underline" }}>uredi</Link>
            </div>
            <div className="trg-kar-t">
              <div className="bl-art">
                {p.map((x) => (
                  <div key={x.id}>
                    <span>{x.kolicina}×</span>
                    <span title={`${x.naziv} ${x.dimenzija ?? ""}`}>{x.naziv} {x.dimenzija}</span>
                    <b>{eur(zaokrozi(x.cenaBruto * x.kolicina))}</b>
                  </div>
                ))}
              </div>
              <KodaPopust postavke={p.map((x) => ({ id: x.id, kolicina: x.kolicina }))} koda={koda} setKoda={setKoda} />
              <div className="trg-v"><span>Blago</span><b>{eur(blago)}</b></div>
              {popust > 0 && <div className="trg-v pop"><span>Popust ({koda.koda})</span><b>−{eur(popust)}</b></div>}
              <div className="trg-v"><span>Dostava</span><b>{postnina === 0 ? "brezplačno" : eur(postnina)}</b></div>
              <div className="trg-sk"><span>Za plačilo</span><b>{eur(skupaj)}</b></div>
              <div className="trg-sk-ddv">vključno z DDV ({eur(zaokrozi(skupaj - skupaj / (1 + DDV)))})</div>
              <label className="bl-pog">
                <input type="checkbox" name="pogoji" required />
                <span>
                  Strinjam se s <Link href="/splosni-pogoji" target="_blank">splošnimi pogoji</Link>, seznanjen/-a sem s{" "}
                  <Link href="/odstop-od-pogodbe" target="_blank">pravico do odstopa</Link> in{" "}
                  <Link href="/zasebnost" target="_blank">varstvom podatkov</Link>.
                </span>
              </label>
              {napaka && <div className="bl-nap">{napaka}</div>}
              <button className="trg-gumb" type="submit" disabled={cakam}>
                {cakam ? "Pošiljam …" : spletno ? <>Plačaj {eur(skupaj)}</> : "Oddaj naročilo"}
              </button>
              <p style={{ fontSize: 11.5, color: "var(--color-muted)", margin: "6px 0 0", textAlign: "center" }}>Naročilo z obveznostjo plačila</p>
              <Zaupanje />
            </div>
          </div>
        </aside>
      </form>
    </>
  );
}
