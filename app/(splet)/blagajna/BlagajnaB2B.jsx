"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useKosarica, izprazni } from "@/lib/kosarica";
import { oddajNarocilo } from "@/lib/akcije/narocila";
import { eur, zaokrozi, izracunajPostnino, DDV } from "@/lib/cene";
import { useB2BCene } from "@/lib/b2b-klient";
import { dogodekKoJePripravljeno } from "@/lib/dogodki";
import { Ikona, Koraki, KodaPopust } from "@/components/trgovina/Deli";

// Blagajna za prijavljenega B2B kupca: cene po ceniku, plačilo na račun, dostava na sedež ali poslovalnico.
export default function BlagajnaB2B({ kupec, dostave, prodajalne }) {
  const p = useKosarica();
  const b2b = useB2BCene(p.map((x) => x.id));
  const router = useRouter();
  const [napaka, setNapaka] = useState("");
  const [dost, setDost] = useState(String(dostave.find((x) => x.koda !== "osebno")?.id ?? dostave[0]?.id ?? 0));
  const [prodajalna, setProdajalna] = useState("");
  const [koda, setKoda] = useState(null);
  const [cakam, zacni] = useTransition();

  useEffect(() => {
    if (!b2b || !p.length) return;
    dogodekKoJePripravljeno("begin_checkout", {
      currency: "EUR",
      value: zaokrozi(p.reduce((s, x) => s + (b2b.cene[x.id]?.neto ?? 0) * x.kolicina, 0)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(b2b)]);

  const glava = (
    <div className="trg-glava">
      <h1>Blagajna <small>B2B · {kupec.podjetje}</small></h1>
      <Koraki korak={2} />
    </div>
  );
  if (!p.length)
    return (
      <>
        {glava}
        <div className="trg-prazno">
          <Ikona ime="vozicek" velikost={40} />
          <h2>Košarica je prazna</h2>
          <p>Za oddajo naročila najprej dodajte izdelke.</p>
          <Link className="b b-r" href="/program">Na prodajni program</Link>
        </div>
      </>
    );
  if (kupec.ustavljena)
    return (
      <>
        {glava}
        <div className="bl-nap">Spletno naročanje za vaše podjetje je trenutno ustavljeno. Pokličite nas, uredimo naročilo po telefonu.</div>
      </>
    );
  if (!b2b) return <>{glava}<p>Nalagam vaše cene …</p></>;

  const cena = (x) => b2b.cene[x.id] ?? null;
  const brezCene = p.filter((x) => !cena(x));
  const neto = zaokrozi(p.reduce((s, x) => s + (cena(x)?.neto ?? 0) * x.kolicina, 0));
  const bruto = zaokrozi(neto * (1 + DDV));
  const popustNeto = koda?.popustNeto ?? 0;
  const netoPoPopustu = zaokrozi(neto - popustNeto);
  const d = dostave.find((x) => String(x.id) === dost) ?? dostave[0];
  const postnina = koda?.brezplacnaDostava ? 0 : izracunajPostnino(d, bruto);
  const skupaj = zaokrozi(netoPoPopustu * (1 + DDV) + postnina);
  const osebno = d?.koda === "osebno";

  function oddaj(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setNapaka("");
    zacni(async () => {
      const r = await oddajNarocilo({
        podatki: { ...f, dostava: dost, placilo: "racun", prodajalna: osebno ? "" : prodajalna, koda: koda?.koda ?? "", pogoji: f.pogoji === "on" },
        postavke: p.map((x) => ({ id: x.id, kolicina: x.kolicina })),
      });
      if (r?.napaka) return setNapaka(r.napaka);
      izprazni();
      router.push(`/blagajna/hvala?st=${encodeURIComponent(r.stevilka)}`);
    });
  }

  return (
    <>
      {glava}
      <form onSubmit={oddaj} className="trg-mreza">
        <div>
          <section className="trg-kar">
            <div className="trg-kar-g">
              <h2><b>1</b>Kupec in kontakt</h2>
              <span>{kupec.podjetje} · {kupec.naslov}</span>
            </div>
            <div className="trg-kar-t">
              <div className="bl-polja">
                <label>Kontaktna oseba<input name="ime" required defaultValue={kupec.ime} autoComplete="name" /></label>
                <label>E-pošta za potrdilo<input name="email" type="email" required defaultValue={kupec.email} autoComplete="email" /></label>
                <label>Telefon<input name="telefon" required defaultValue={kupec.telefon} autoComplete="tel" /></label>
                <label className="s3">Vaša št. naročilnice (neobvezno)<input name="narocilnica" maxLength={40} /></label>
                <label className="s3">Opomba<input name="opomba" /></label>
              </div>
            </div>
          </section>

          <section className="trg-kar">
            <div className="trg-kar-g"><h2><b>2</b>Dostava</h2></div>
            <div className="trg-kar-t">
              <div className="bl-moz">
                {dostave.map((x) => {
                  const c = koda?.brezplacnaDostava ? 0 : izracunajPostnino(x, bruto);
                  return (
                    <label key={x.id} className={dost === String(x.id) ? "on" : ""}>
                      <input type="radio" name="_dostava" checked={dost === String(x.id)} onChange={() => setDost(String(x.id))} />
                      <span className="ik"><Ikona ime={x.koda === "osebno" ? "trgovina" : "tovornjak"} /></span>
                      <span>
                        <b>{x.koda === "osebno" ? "Osebni prevzem" : x.naziv}</b>
                        <small>{x.koda === "osebno" ? "Šmarje pri Jelšah, pon–pet 7–15" : "Na sedež ali poslovalnico"}</small>
                      </span>
                      <span className={`cena${c === 0 ? " zast" : ""}`}>{c === 0 ? "brezplačno" : eur(c)}</span>
                    </label>
                  );
                })}
              </div>
              {!osebno && (
                <div className="bl-polja" style={{ marginTop: 10 }}>
                  <label className="s6">
                    Naslov dostave
                    <select value={prodajalna} onChange={(e) => setProdajalna(e.target.value)}>
                      <option value="">Sedež — {kupec.naslov}</option>
                      {prodajalne.map((x) => (
                        <option key={x.sifra} value={x.sifra}>{x.naziv2 || x.naziv} — {x.naslov}, {x.posta}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>
          </section>

          <section className="trg-kar">
            <div className="trg-kar-g"><h2><b>3</b>Plačilo</h2></div>
            <div className="trg-kar-t">
              <div className="bl-moz">
                <label className="on">
                  <input type="radio" checked readOnly />
                  <span className="ik"><Ikona ime="racun" /></span>
                  <span>
                    <b>Na račun</b>
                    <small>Račun prejmete z blagom{kupec.rok ? `, rok plačila ${kupec.rok} dni` : ""}</small>
                  </span>
                  <span />
                </label>
              </div>
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
                    <b>{cena(x) ? eur(zaokrozi(cena(x).neto * x.kolicina)) : "—"}</b>
                  </div>
                ))}
              </div>
              <KodaPopust postavke={p.map((x) => ({ id: x.id, kolicina: x.kolicina }))} koda={koda} setKoda={setKoda} />
              <div className="trg-v"><span>Blago brez DDV</span><b>{eur(neto)}</b></div>
              {popustNeto > 0 && <div className="trg-v pop"><span>Popust ({koda.koda})</span><b>−{eur(popustNeto)}</b></div>}
              <div className="trg-v"><span>DDV 22 %</span><b>{eur(zaokrozi(netoPoPopustu * DDV))}</b></div>
              <div className="trg-v"><span>Dostava (z DDV)</span><b>{postnina === 0 ? "brezplačno" : eur(postnina)}</b></div>
              <div className="trg-sk"><span>Skupaj z DDV</span><b>{eur(skupaj)}</b></div>
              {brezCene.length > 0 && <div className="bl-nap">Brez cene: {brezCene.map((x) => x.sifra).join(", ")}. Odstranite jih v košarici.</div>}
              <label className="bl-pog">
                <input type="checkbox" name="pogoji" required />
                <span>Strinjam se s <Link href="/splosni-pogoji" target="_blank">splošnimi pogoji poslovanja</Link>.</span>
              </label>
              {napaka && <div className="bl-nap">{napaka}</div>}
              <button className="trg-gumb" type="submit" disabled={cakam || brezCene.length > 0}>
                {cakam ? "Pošiljam …" : "Oddaj naročilo"}
              </button>
            </div>
          </div>
        </aside>
      </form>
    </>
  );
}
