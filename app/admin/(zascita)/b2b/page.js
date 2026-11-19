import { supabaseAdmin } from "@/lib/supabase-server";
import { adminB2B, izbrisiB2B, preklopiRacuneB2B } from "@/lib/akcije/b2b";
import { B2B_STATUSI } from "@/lib/b2b";
import IzbrisiGumb from "../../IzbrisiGumb";
import Osvezi from "../../Osvezi";
import NovB2B from "./NovB2B";
import IskalnikB2B from "./IskalnikB2B";
import { komercialisti } from "@/lib/kontakti";

export const dynamic = "force-dynamic";

const cas = (t) => (t ? new Date(t).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" }) : "—");
const VRSTNI_RED = ["caka_odobritev", "preverjanje", "aktiven", "zavrnjen"];
const ZNACKA = { aktiven: "znacka da", caka_odobritev: "znacka novo", preverjanje: "znacka ne", zavrnjen: "znacka ne" };
const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default async function B2BKupci({ searchParams }) {
  const { napaka, shranjeno, poslano, izbrisano, geslo } = await searchParams;
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("b2b_kupci").select("*").order("ustvarjeno", { ascending: false }).limit(3000);
  if (error)
    return (
      <div className="adm-telo">
        <div className="opozorilo">Tabela B2B kupcev še ne obstaja. V Supabase (assystem-web) zaženi SQL »40-b2b.sql«.</div>
      </div>
    );
  const kupci = data ?? [];
  const poDavcni = {};
  for (const k of kupci) (poDavcni[k.davcna] ??= []).push(k);
  const rang = (u) => Math.min(...u.map((k) => VRSTNI_RED.indexOf(k.status)));
  const skupine = Object.values(poDavcni).sort((a, b) => rang(a) - rang(b) || String(a[0].vasco_naziv || a[0].podjetje).localeCompare(String(b[0].vasco_naziv || b[0].podjetje), "sl"));
  const partnerji = [...new Set(kupci.map((k) => k.vasco_partner).filter(Boolean))];
  const [{ data: vseProdajalne }, racRes] = await Promise.all([
    partnerji.length
      ? sb.from("b2b_prodajalne").select("vasco_partner, sifra, naziv, naziv2, naslov, posta").in("vasco_partner", partnerji).order("naziv2")
      : Promise.resolve({ data: [] }),
    partnerji.length ? sb.from("b2b_racuni_partnerji").select("vasco_partner, zadnji_prenos_ob").in("vasco_partner", partnerji) : Promise.resolve({ data: [] }),
  ]);
  const racuniPartnerja = Object.fromEntries((racRes?.data ?? []).map((x) => [String(x.vasco_partner), x]));
  const prodajalnePartnerja = {};
  for (const x of vseProdajalne ?? []) (prodajalnePartnerja[x.vasco_partner] ??= []).push(x);
  const imeProdajalne = (partner, sifra) => {
    const x = (prodajalnePartnerja[partner] ?? []).find((y) => y.sifra === sifra);
    return x ? x.naziv2 || x.naziv : `poslovalnica ${sifra}`;
  };
  const stej = (s) => kupci.filter((k) => k.status === s).length;

  return (
    <>
      <Osvezi aktivno={kupci.some((k) => k.status === "preverjanje")} />
      <div className="adm-glava">
        <h1>B2B kupci</h1>
        <NovB2B />
      </div>
      <div className="adm-telo siroko">
        {napaka && <div className="opozorilo">{napaka}</div>}
        {geslo && <div className="uspeh">✓ Geslo je nastavljeno za <b>{geslo}</b>. Uporabnik se prijavi na assystem.si → B2B prijava z e-naslovom in tem geslom.</div>}
        {poslano && <div className="uspeh">✓ Povabilo za potrditev in geslo je poslano na <b>{poslano}</b>.</div>}
        {izbrisano && <div className="uspeh">B2B uporabnik {izbrisano} je izbrisan. Njegova naročila ostanejo v seznamu naročil.</div>}
        {shranjeno && (
          <div className="uspeh">
            {{ odobreno: "✓ Uporabnik je odobren — poslovalnica in podatki so shranjeni. Kupec dobi mail, ko je dostop aktiven.", zavrnjeno: "Registracija je zavrnjena.", "racuni-vklop": "✓ Računi vklopljeni — prenesejo se ob naslednji sinhronizaciji (do 20 min).", "racuni-izklop": "Računi izklopljeni — kupec jih ne vidi več." }[shranjeno] ?? "✓ Spremembe shranjene."}
          </div>
        )}

        <IskalnikB2B
          skupaj={skupine.length}
          stevci={{ caka_odobritev: stej("caka_odobritev"), preverjanje: stej("preverjanje"), aktiven: stej("aktiven"), zavrnjen: stej("zavrnjen"), racuni: Object.keys(racuniPartnerja).length }}
        />

        <div className="b2ba">
          <div className="b2ba-vr b2ba-gl">
            <span>Podjetje</span><span>Davčna</span><span>Vasco</span><span>Sedež</span><span className="c">Upor.</span><span className="c">PE</span><span>Plačilo</span><span>Računi</span><span>Status</span>
          </div>
          {kupci.length === 0 && <p className="b2ba-prazno">Ni še registracij.</p>}
          {skupine.map((uporabniki) => {
            const g = uporabniki.find((x) => x.vasco_partner) ?? uporabniki[0];
            const pr = prodajalnePartnerja[g.vasco_partner] ?? [];
            const najStatus = [...uporabniki].sort((a, b) => VRSTNI_RED.indexOf(a.status) - VRSTNI_RED.indexOf(b.status))[0].status;
            const rac = racuniPartnerja[String(g.vasco_partner)];
            const isk = norm([
              g.vasco_naziv, g.podjetje, g.davcna, `si${g.davcna}`, g.vasco_partner, g.vasco_naslov, g.vasco_posta, g.naslov, g.posta, g.kraj,
              ...uporabniki.flatMap((k) => [k.ime, k.email, k.telefon, k.poslovalnica_vnos]),
              ...pr.flatMap((p) => [p.naziv, p.naziv2, p.naslov, p.posta]),
              ...(g.vasco_emaili ?? []),
            ].filter(Boolean).join(" "));
            const statusi = [...new Set(uporabniki.map((k) => k.status))].join(" ");
            return (
              <details key={g.davcna} className="b2ba-podj" data-isk={isk} data-status={statusi} data-racuni={rac ? "1" : ""} open={najStatus === "caka_odobritev" || undefined}>
                <summary className="b2ba-vr">
                  <span className="ime"><b>{g.vasco_naziv || g.podjetje}</b>{g.ustavljena_prodaja && <i className="b2ba-ust">ustavljena prodaja</i>}</span>
                  <span data-l="Davčna">SI{g.davcna}</span>
                  <span data-l="Vasco">{g.vasco_partner ?? <i className="b2ba-rd">ni v Vascu</i>}</span>
                  <span data-l="Sedež" className="siv ell">{g.vasco_naslov ? `${g.vasco_naslov}, ${g.vasco_posta ?? ""}` : `${g.naslov ?? ""} ${g.posta ?? ""} ${g.kraj ?? ""}`}</span>
                  <span data-l="Uporabniki" className="c">{uporabniki.length}</span>
                  <span data-l="Poslovalnice" className="c">{pr.length || "—"}</span>
                  <span data-l="Plačilo" className="siv">{g.vasco_partner ? `${g.rok_placila ?? "—"} dni · ${Number(g.rabat ?? 0)} %` : "—"}</span>
                  <span data-l="Računi">{rac ? <i className="znacka da">vklopljeni</i> : <span className="siv">—</span>}</span>
                  <span data-l="Status"><i className={ZNACKA[najStatus]}>{B2B_STATUSI[najStatus] ?? najStatus}</i></span>
                </summary>

                <div className="b2ba-det">
                  <div className="b2ba-det-gl">
                    <div className="siv">
                      Vasco: {g.vasco_partner ? <b style={{ color: "#23262a" }}>{g.vasco_partner} — {g.vasco_naziv} ({g.vasco_naslov}, {g.vasco_posta})</b> : <span className="b2ba-rd">partner ni najden</span>}
                      {g.vasco_emaili?.length ? <> · E-naslovi v Vascu: {g.vasco_emaili.join(", ")}</> : null}
                      {pr.length > 0 && <> · Poslovalnice: {pr.map((p) => p.naziv2 || p.naziv).join(", ")}</>}
                    </div>
                    <div className="b2ba-gumbi">
                      {g.vasco_partner && (
                        <form action={preklopiRacuneB2B}>
                          <input type="hidden" name="partner" value={g.vasco_partner} />
                          <input type="hidden" name="vklopi" value={rac ? "0" : "1"} />
                          <button className={rac ? "gumb mini" : "gumb siv mini"} type="submit" title="Kupec vidi letošnje račune iz Vasca (po poslovalnicah) z izpisom PDF">
                            {rac ? "✓ Računi v B2B — izklopi" : "Vklopi račune v B2B"}
                          </button>
                        </form>
                      )}
                      <NovB2B zacetnaDavcna={g.davcna} oznaka="+ Dodaj uporabnika" siv />
                    </div>
                  </div>

                  <div className="b2ba-upor">
                    {uporabniki.map((k) => (
                      <details key={k.id} className="b2ba-u" open={k.status === "caka_odobritev" || undefined}>
                        <summary>
                          <span className="ime"><b>{k.ime}</b> <span className="siv">{k.email}{k.telefon ? ` · ${k.telefon}` : ""}</span></span>
                          <span className="siv">
                            {k.prodajalna ? `📍 ${imeProdajalne(k.vasco_partner, k.prodajalna)}` : k.poslovalnica_vnos ? <span style={{ color: "#b26a00" }}>⚠ določi poslovalnico (»{k.poslovalnica_vnos}«)</span> : "sedež / vse poslovalnice"}
                          </span>
                          <span className="siv">{cas(k.ustvarjeno)}</span>
                          <i className={ZNACKA[k.status]}>{B2B_STATUSI[k.status] ?? k.status}</i>
                          <span className="b2ba-uredi">Uredi ▾</span>
                        </summary>
                        <div className="b2ba-u-tel">
                          <p className="siv" style={{ margin: "0 0 8px", fontSize: 11.5 }}>
                            Registracija: {cas(k.ustvarjeno)} · zadnja sinhronizacija: {cas(k.vasco_sync_ob)}
                            {k.vasco_sporocilo ? ` — ${k.vasco_sporocilo}` : ""}
                            {k.odobreno_rocno && <> · odobreno ročno</>}
                          </p>
                          <form action={adminB2B}>
                            <input type="hidden" name="id" value={k.id} />
                            <div className="b2ba-polja">
                              <div className="adm-polje s2"><label>Podjetje</label><input name="podjetje" defaultValue={k.podjetje ?? ""} required /></div>
                              <div className="adm-polje"><label>Davčna</label><input name="davcna" defaultValue={k.davcna ?? ""} required /></div>
                              <div className="adm-polje"><label>Šifra partnerja v Vascu</label><input name="vasco_partner" defaultValue={k.vasco_partner ?? ""} placeholder="poišče se po davčni" /></div>
                              <div className="adm-polje"><label>Kontaktna oseba</label><input name="ime" defaultValue={k.ime ?? ""} required /></div>
                              <div className="adm-polje"><label>E-naslov (prijava)</label><input name="email" type="email" defaultValue={k.email ?? ""} required /></div>
                              <div className="adm-polje"><label>Telefon</label><input name="telefon" defaultValue={k.telefon ?? ""} /></div>
                              <div className="adm-polje s2"><label>Naslov</label><input name="naslov" defaultValue={k.naslov ?? ""} /></div>
                              <div className="adm-polje"><label>Pošta</label><input name="posta" defaultValue={k.posta ?? ""} /></div>
                              <div className="adm-polje"><label>Kraj</label><input name="kraj" defaultValue={k.kraj ?? ""} /></div>
                              {(prodajalnePartnerja[k.vasco_partner] ?? []).length > 0 && (
                                <div className="adm-polje s3">
                                  <label>
                                    Poslovalnica uporabnika
                                    {k.poslovalnica_vnos && !k.prodajalna && <span style={{ color: "#b26a00", fontWeight: 400 }}> — kupec je vpisal: »{k.poslovalnica_vnos}«</span>}
                                  </label>
                                  <select name="prodajalna" defaultValue={k.prodajalna ?? ""}>
                                    <option value="">Sedež — vidi vse poslovalnice in vsa naročila podjetja</option>
                                    {prodajalnePartnerja[k.vasco_partner].map((x) => (
                                      <option key={x.sifra} value={x.sifra}>{x.naziv2 || x.naziv} — {x.naslov}, {x.posta}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              <div className="adm-polje s3">
                                <label>Komercialist (kupec vidi njegove kontakte v B2B računu)</label>
                                <select name="komercialist" defaultValue={k.komercialist ?? ""}>
                                  <option value="">— ni določen (prikaže se splošni kontakt) —</option>
                                  {komercialisti().map((x) => (
                                    <option key={x.ime} value={x.ime}>{x.ime} — {x.vloga}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="adm-polje s3">
                                <input type="hidden" name="trgovec_polje" value="1" />
                                <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 600 }}>
                                  <input type="checkbox" name="trgovec" defaultChecked={k.trgovec === true} style={{ width: "auto" }} />
                                  Trgovec — vidi stran »Za trgovce« in police (velja za vse uporabnike podjetja)
                                </label>
                              </div>
                              <div className="adm-polje s3"><label>Interna opomba / kontakti</label><textarea name="opomba_interna" rows={2} defaultValue={k.opomba_interna ?? ""} /></div>
                            </div>
                            <div className="b2ba-akcije">
                              {k.status !== "aktiven" && <button className="gumb" type="submit" name="akcija" value="odobri">Shrani in odobri</button>}
                              <button className={k.status !== "aktiven" ? "gumb siv" : "gumb"} type="submit" name="akcija" value="shrani">Shrani spremembe</button>
                              <button className="gumb siv" type="submit" name="akcija" value="preveri">Preveri v Vascu</button>
                              {k.status !== "zavrnjen" && <button className="gumb siv" type="submit" name="akcija" value="povabilo">Pošlji povabilo za geslo</button>}
                              {k.status !== "zavrnjen" && <button className="gumb siv" type="submit" name="akcija" value="zavrni">Zavrni</button>}
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 10, paddingTop: 10, borderTop: "1px dashed #ddd" }}>
                              <span style={{ fontSize: 12, color: "#666" }}>Ročno geslo (brez povezave po e-pošti, ne poteče):</span>
                              <input name="novo_geslo" type="text" autoComplete="off" placeholder="vsaj 8 znakov" style={{ width: 180 }} />
                              <button className="gumb siv" type="submit" name="akcija" value="geslo" formNoValidate>Nastavi geslo</button>
                            </div>
                          </form>
                          <div className="b2ba-brisi">
                            Izbriši uporabnika
                            <IzbrisiGumb action={izbrisiB2B} id={k.id} ime={`${k.ime} (${k.email})`} opozorilo="B2B dostop tega uporabnika bo izbrisan. Naročila ostanejo, košarica se izprazni. Tega ni mogoče razveljaviti." />
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </details>
            );
          })}
          <p className="b2ba-prazno" id="b2ba-ni" hidden>Ni zadetkov.</p>
        </div>
      </div>
    </>
  );
}
