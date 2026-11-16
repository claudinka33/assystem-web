import KljukicaZakljuceno from "./KljukicaZakljuceno";
import { virPovprasevanja } from "@/lib/viri-povprasevanj";
import { supabaseAdmin, trenutniAdmin } from "@/lib/supabase-server";
import { spremeniStatusPovprasevanja } from "@/lib/akcije/skupno";
import OdgovorPovprasevanju from "@/components/admin/OdgovorPovprasevanju";
import { stevilo, STRANKA, NOVO } from "@/lib/sklanjanje";
import OdpriPoHashu from "@/components/admin/OdpriPoHashu";

export const dynamic = "force-dynamic";

const statusi = ["novo", "v obdelavi", "zaključeno"];

const VIRI = {
  "rok-dobave-b2b": "Rok dobave · B2B",
  "rok-dobave": "Rok dobave",
  kontakt: "Kontakt",
  katalogi: "Gradiva",
  certifikat: "Certifikat",
  "private-label": "Private label",
  "vijaki-po-narocilu": "Vijaki po naročilu",
  trgovci: "Za trgovce",
};

const cas = (d) =>
  new Date(d).toLocaleString("sl-SI", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Ljubljana" });

const zacetnice = (s) =>
  String(s ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();

function zadevaZa(p) {
  const izd = (p.izdelki ?? []).filter((x) => !x.datoteka).map((x) => x.naziv).join(", ");
  return (p.vir ?? "").startsWith("rok-dobave") ? `Rok dobave${izd ? `: ${izd}` : ""}` : `Vaše povpraševanje${izd ? `: ${izd}` : ""}`;
}

// Odgovori, poslani preden se je shranjevalo besedilo, so zapisani samo v opombi:
// »16. 11. 2026, 12:17:35: odgovoril/a Claudia Seidl (priloge: racun.pdf)«
function izOpombe(opomba) {
  const out = [];
  for (const v of String(opomba ?? "").split("\n")) {
    const m = v.trim().match(/^(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4}),?\s(\d{1,2}):(\d{2})(?::(\d{2}))?:\sodgovoril\/a\s([^(]+?)(?:\s\(priloge:\s(.+)\))?$/);
    if (!m) continue;
    const [, d, mo, l, h, mi, se, od, pr] = m;
    const cas = new Date(`${l}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${h.padStart(2, "0")}:${mi}:${se ?? "00"}+01:00`).toISOString();
    out.push({
      cas,
      od: od.trim(),
      zadeva: null,
      besedilo: "Besedilo tega odgovora ni shranjeno (poslano pred uvedbo zgodovine).",
      priloge: pr ? pr.split(", ").map((naziv) => ({ naziv })) : [],
    });
  }
  return out;
}

// Vsa povpraševanja iste stranke (po e-naslovu) so ena nit: vprašanja in naši odgovori po času.
function niti(seznam) {
  const po = new Map();
  for (const p of seznam) {
    const k = String(p.email ?? `id-${p.id}`).toLowerCase();
    if (!po.has(k)) po.set(k, []);
    po.get(k).push(p);
  }
  return [...po.values()]
    .map((povp) => {
      povp.sort((a, b) => new Date(a.ustvarjeno) - new Date(b.ustvarjeno));
      const zadnje = povp[povp.length - 1];
      const dogodki = [];
      for (const p of povp) {
        dogodki.push({ tip: "vprasanje", cas: p.ustvarjeno, p });
        for (const o of p.odgovori?.length ? p.odgovori : izOpombe(p.opomba)) dogodki.push({ tip: "odgovor", cas: o.cas, o });
      }
      dogodki.sort((a, b) => new Date(a.cas) - new Date(b.cas));
      const zadnjiCas = dogodki.length ? dogodki[dogodki.length - 1].cas : zadnje.ustvarjeno;
      return { povp, zadnje, dogodki, novo: povp.some((p) => p.status === "novo"), zadnjiCas, odgovorov: dogodki.filter((d) => d.tip === "odgovor").length };
    })
    .sort((a, b) => new Date(b.zadnjiCas) - new Date(a.zadnjiCas));
}

function Vprasanje({ p }) {
  const izdelki = (p.izdelki ?? []).filter((x) => !x.datoteka);
  const priloge = (p.izdelki ?? []).filter((x) => x.datoteka);
  return (
    <li className={`tl tl-vpr${p.status === "novo" ? " tl-novo" : ""}`}>
      <div className="tl-glava">
        <b>Vprašanje stranke</b>
        <span className={`povp-vir nad-vir ${virPovprasevanja(p.vir).skupina}`}>{virPovprasevanja(p.vir).oznaka}</span>
        {p.status === "novo" && <span className="povp-st st-novo">novo</span>}
        <time>{cas(p.ustvarjeno)}</time>
      </div>
      {(izdelki.length > 0 || priloge.length > 0) && (
        <div className="povp-izd">
          {izdelki.map((x, i) => (
            <span key={i} className="povp-cip">
              {x.naziv}
              {x.sifra && <small>{x.sifra}</small>}
            </span>
          ))}
          {priloge.map((x, i) => (
            <a key={i} className="povp-cip povp-pril" href={x.url ?? "#"} target="_blank" rel="noreferrer">
              📎 {x.naziv}
            </a>
          ))}
        </div>
      )}
      {(p.email || p.telefon) && (
        <div className="povp-kontakt">
          {p.podjetje && <span><em>Podjetje</em><b>{p.podjetje}</b></span>}
          {p.ime && p.ime !== p.podjetje && p.ime !== p.email && <span><em>Ime</em><b>{p.ime}</b></span>}
          {p.email && <span><em>E-naslov</em><a href={`mailto:${p.email}`}>{p.email}</a></span>}
          {p.telefon ? <span><em>Telefon</em><a href={`tel:${String(p.telefon).replace(/[^\d+]/g, "")}`}>{p.telefon}</a></span> : <span><em>Telefon</em><i className="siv">ni vpisan</i></span>}
          <span className="povp-kontakt-gumbi">
            {p.telefon && <a className="gumb siv mini" href={`tel:${String(p.telefon).replace(/[^\d+]/g, "")}`}>📞 Pokliči</a>}
            {p.email && <a className="gumb siv mini" href={`mailto:${p.email}?subject=${encodeURIComponent("Ponudba AS system")}`}>✉️ Pošlji mail</a>}
          </span>
        </div>
      )}
      {p.sporocilo && <div className="povp-sp">{p.sporocilo}</div>}
    </li>
  );
}

function Odgovor({ o }) {
  return (
    <li className="tl tl-odg">
      <div className="tl-glava">
        <b>Odgovor · {o.od}</b>
        <time>{cas(o.cas)}</time>
      </div>
      {o.zadeva && <div className="tl-zadeva">{o.zadeva}</div>}
      <div className="tl-besedilo">{o.besedilo}</div>
      {(o.priloge ?? []).length > 0 && (
        <div className="povp-izd">
          {o.priloge.map((x, i) => (
            <a key={i} className="povp-cip povp-pril" href={x.url ?? "#"} target="_blank" rel="noreferrer">
              📎 {x.naziv}
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

function Nit({ n, admin, odprta }) {
  const z = n.zadnje;
  const vsebina = (
    <>
      <ol className="tl-seznam">
        {n.dogodki.map((d, i) => (d.tip === "vprasanje" ? <Vprasanje key={`v${d.p.id}`} p={d.p} /> : <Odgovor key={`o${i}`} o={d.o} />))}
      </ol>

      <OdgovorPovprasevanju id={z.id} email={z.email} zadeva={zadevaZa(z)} od={admin?.ime || admin?.email || "AS system"} odEmail={admin?.email ?? ""} />

      <form action={spremeniStatusPovprasevanja} className="povp-noga">
        {n.povp.map((p) => (
          <input key={p.id} type="hidden" name="id" value={p.id} />
        ))}
        <input type="hidden" name="opomba_id" value={z.id} />
        <label>
          Status
          <select name="status" defaultValue={z.status}>
            {statusi.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="povp-op">
          Interna opomba
          <textarea name="opomba" rows={Math.min(4, Math.max(1, (z.opomba ?? "").split("\n").length))} defaultValue={z.opomba ?? ""} placeholder="Vidijo jo samo zaposleni" />
        </label>
        <button className="gumb siv" type="submit">
          Shrani
        </button>
      </form>
    </>
  );

  const glava = (
    <>
      <span className="povp-av">{zacetnice(z.podjetje || z.ime)}</span>
      <div className="povp-kdo">
        <b>{z.podjetje || z.ime}</b>
        <span>
          {z.ime && z.ime !== z.podjetje ? `${z.ime} · ` : ""}
          <a href={`mailto:${z.email}`}>{z.email}</a>
          {z.telefon ? ` · ${z.telefon}` : ""}
        </span>
      </div>
      <div className="povp-meta">
        <KljukicaZakljuceno ids={n.povp.map((p) => p.id)} zakljuceno={n.povp.every((p) => p.status === "zaključeno")} />
        {n.povp.length > 1 && <span className="povp-vir">{n.povp.length} povpraševanj</span>}
        {n.odgovorov > 0 && <span className="povp-vir">{n.odgovorov} odgovorov</span>}
        <span className={`povp-st st-${(z.status ?? "").replace(/\s/g, "-")}`}>{n.novo ? "novo" : z.status}</span>
        <time>{cas(n.zadnjiCas)}</time>
      </div>
    </>
  );

  if (odprta)
    return (
      <article id={`p-${z.id}`} className="povp povp-novo">
        {n.povp.slice(0, -1).map((p) => (
          <span key={p.id} id={`p-${p.id}`} />
        ))}
        <header className="povp-glava">{glava}</header>
        {vsebina}
      </article>
    );

  const izd = (z.izdelki ?? []).filter((x) => !x.datoteka).map((x) => x.naziv).join(", ");
  return (
    <details id={`p-${z.id}`} className="povp-vrsta" data-ids={n.povp.map((p) => p.id).join(",")}>
      <summary>
        <span className="povp-av mali">{zacetnice(z.podjetje || z.ime)}</span>
        <b className="pv-kdo">{z.podjetje || z.ime}</b>
        <span className="pv-izd">{izd || (z.sporocilo ?? "").slice(0, 80)}</span>
        <span className="povp-vir">
          {n.povp.length > 1 ? `${n.povp.length} povp. · ` : ""}
          {n.odgovorov} odg.
        </span>
        <span className={`povp-st st-${(z.status ?? "").replace(/\s/g, "-")}`}>{z.status}</span>
        <time>{cas(n.zadnjiCas)}</time>
      </summary>
      <div className="povp">{vsebina}</div>
    </details>
  );
}

export default async function Povprasevanja() {
  const admin = await trenutniAdmin();
  const { data } = await supabaseAdmin().from("povprasevanja").select("*").order("ustvarjeno", { ascending: false }).limit(500);

  const seznam = data ?? [];
  // Povezave do priloženih datotek (zasebna shramba, povezava velja 1 uro)
  const podpisi = async (x) => {
    if (x?.datoteka) {
      const { data: u } = await supabaseAdmin().storage.from("prijave").createSignedUrl(x.datoteka, 3600);
      x.url = u?.signedUrl ?? null;
    }
  };
  for (const p of seznam) {
    for (const x of p.izdelki ?? []) await podpisi(x);
    for (const o of p.odgovori ?? []) for (const x of o.priloge ?? []) await podpisi(x);
  }

  const vse = niti(seznam);
  const nove = vse.filter((n) => n.novo);
  const ostale = vse.filter((n) => !n.novo);

  return (
    <>
      <div className="adm-glava">
        <h1>Povpraševanja</h1>
        <span style={{ fontSize: 13, color: "#6e767e" }}>
          {nove.length > 0 ? `${stevilo(nove.length, NOVO)} · ` : ""}
          {stevilo(vse.length, STRANKA)}
        </span>
      </div>

      <div className="adm-telo">
        <OdpriPoHashu />
        {vse.length === 0 && <div className="opozorilo">Povpraševanj še ni.</div>}
        {nove.map((n) => (
          <Nit key={n.zadnje.id} n={n} admin={admin} odprta />
        ))}
        {ostale.length > 0 && (
          <section className="povp-arhiv">
            <h2>Odgovorjena in zaključena</h2>
            {ostale.map((n) => (
              <Nit key={n.zadnje.id} n={n} admin={admin} />
            ))}
          </section>
        )}
      </div>
    </>
  );
}
