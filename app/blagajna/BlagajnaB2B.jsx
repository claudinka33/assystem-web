"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useKosarica, izprazni } from "@/lib/kosarica";
import { oddajNarocilo } from "@/lib/akcije/narocila";
import { eur, zaokrozi, izracunajPostnino, DDV } from "@/lib/cene";
import { useB2BCene } from "@/lib/b2b-klient";
import { dogodekKoJePripravljeno } from "@/lib/dogodki";

// Blagajna za prijavljenega B2B kupca: cene po ceniku, plačilo na račun, dostava na sedež ali poslovalnico.
export default function BlagajnaB2B({ kupec, dostave, prodajalne }) {
  const p = useKosarica();
  const b2b = useB2BCene(p.map((x) => x.id));
  const router = useRouter();
  const [napaka, setNapaka] = useState("");
  const [dost, setDost] = useState(String(dostave[0]?.id ?? 0));
  const [prodajalna, setProdajalna] = useState("");
  const [cakam, zacni] = useTransition();

  useEffect(() => {
    if (!b2b || !p.length) return;
    dogodekKoJePripravljeno("begin_checkout", {
      currency: "EUR",
      value: zaokrozi(p.reduce((s, x) => s + (b2b.cene[x.id]?.neto ?? 0) * x.kolicina, 0)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(b2b)]);

  if (!p.length)
    return <p>Košarica je prazna. <Link href="/program" style={{ color: "var(--color-red)" }}>Poglej prodajni program →</Link></p>;
  if (kupec.ustavljena)
    return <p className="b2b-info">Spletno naročanje za vaše podjetje je trenutno ustavljeno. Pokličite nas, uredimo naročilo po telefonu.</p>;
  if (!b2b) return <p>Nalagam vaše cene …</p>;

  const cena = (x) => b2b.cene[x.id] ?? null;
  const brezCene = p.filter((x) => !cena(x));
  const neto = zaokrozi(p.reduce((s, x) => s + (cena(x)?.neto ?? 0) * x.kolicina, 0));
  const bruto = zaokrozi(neto * (1 + DDV));
  const d = dostave.find((x) => String(x.id) === dost) ?? dostave[0];
  const postnina = izracunajPostnino(d, bruto);
  const osebno = d?.koda === "osebno";

  function oddaj(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setNapaka("");
    zacni(async () => {
      const r = await oddajNarocilo({
        podatki: { ...f, dostava: dost, placilo: "racun", prodajalna: osebno ? "" : prodajalna, pogoji: f.pogoji === "on" },
        postavke: p.map((x) => ({ id: x.id, kolicina: x.kolicina })),
      });
      if (r?.napaka) return setNapaka(r.napaka);
      izprazni();
      router.push(`/blagajna/hvala?st=${encodeURIComponent(r.stevilka)}`);
    });
  }

  return (
    <form onSubmit={oddaj} className="blag">
      <div className="blag-l">
        <h2>Kupec</h2>
        <p style={{ margin: "0 0 12px" }}>
          <b>{kupec.podjetje}</b>
          <br />
          {kupec.naslov}
        </p>
        <div className="blag-polja">
          <label>Kontaktna oseba *<input name="ime" required defaultValue={kupec.ime} autoComplete="name" /></label>
          <label>Telefon *<input name="telefon" required defaultValue={kupec.telefon} autoComplete="tel" /></label>
          <label className="cela">E-naslov za potrdilo *<input name="email" type="email" required defaultValue={kupec.email} autoComplete="email" /></label>
          <label className="cela">Vaša številka naročila (neobvezno)<input name="narocilnica" maxLength={40} /></label>
          <label className="cela">Opomba<textarea name="opomba" rows={3} /></label>
        </div>

        <h2>Dostava</h2>
        {dostave.map((x) => (
          <label key={x.id} className="blag-izb">
            <input type="radio" name="_dostava" checked={dost === String(x.id)} onChange={() => setDost(String(x.id))} />
            <span>
              <b>{x.naziv}</b> — {x.koda === "osebno" ? "brezplačno" : eur(izracunajPostnino(x, bruto))}
              <em className="blag-op">
                {x.koda === "osebno"
                  ? " Obrtniška ulica 14, Šmarje pri Jelšah, pon–pet 7.00–15.00."
                  : " Do 50 € 10 €, od 50 € do 100 € 5 €, nad 100 € brezplačno (vrednost z DDV)."}
              </em>
            </span>
          </label>
        ))}
        {!osebno && (
          <div className="blag-polja" style={{ marginTop: 6 }}>
            <label className="cela">
              Dostava na naslov
              <select value={prodajalna} onChange={(e) => setProdajalna(e.target.value)} style={{ padding: "9px 10px", border: "1px solid #c6cace", font: "inherit" }}>
                <option value="">Sedež — {kupec.naslov}</option>
                {prodajalne.map((x) => (
                  <option key={x.sifra} value={x.sifra}>
                    {x.naziv2 || x.naziv} — {x.naslov}, {x.posta}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <h2>Plačilo</h2>
        <label className="blag-izb">
          <input type="radio" checked readOnly />
          <span>
            <b>Na račun</b>
            <em className="blag-op"> Račun prejmete z blagom{kupec.rok ? `, rok plačila ${kupec.rok} dni` : ""}.</em>
          </span>
        </label>
      </div>

      <aside className="blag-d">
        <h2>Povzetek</h2>
        {p.map((x) => (
          <div key={x.id} className="blag-v">
            <span>{x.kolicina} × {x.naziv} {x.dimenzija}</span>
            <b>{cena(x) ? eur(zaokrozi(cena(x).neto * x.kolicina)) : "—"}</b>
          </div>
        ))}
        <div className="blag-v"><span>Blago brez DDV</span><b>{eur(neto)}</b></div>
        <div className="blag-v"><span>DDV 22 %</span><b>{eur(zaokrozi(bruto - neto))}</b></div>
        <div className="blag-v"><span>Dostava (z DDV)</span><b>{eur(postnina)}</b></div>
        <div className="blag-v blag-sk"><span>Skupaj z DDV</span><b>{eur(zaokrozi(bruto + postnina))}</b></div>
        {brezCene.length > 0 && (
          <p className="blag-nap">Brez cene: {brezCene.map((x) => x.sifra).join(", ")}. Odstrani jih v košarici.</p>
        )}
        <label className="blag-pog">
          <input type="checkbox" name="pogoji" required /> Strinjam se s <Link href="/splosni-pogoji" target="_blank">splošnimi pogoji poslovanja</Link>.
        </label>
        {napaka && <p className="blag-nap">{napaka}</p>}
        <button className="b b-r" type="submit" disabled={cakam || brezCene.length > 0} style={{ width: "100%" }}>
          {cakam ? "Pošiljam …" : "Oddaj naročilo"}
        </button>
      </aside>
    </form>
  );
}
