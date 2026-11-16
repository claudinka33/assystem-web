import { supabaseAdmin, trenutniAdmin } from "@/lib/supabase-server";
import { spremeniStatusPovprasevanja } from "@/lib/akcije/skupno";
import OdgovorPovprasevanju from "@/components/admin/OdgovorPovprasevanju";
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

function Kartica({ p, admin }) {
            const izdelki = (p.izdelki ?? []).filter((x) => !x.datoteka);
            const priloge = (p.izdelki ?? []).filter((x) => x.datoteka);
            return (
              <article id={p.status === "novo" ? `p-${p.id}` : undefined} className={`povp${p.status === "novo" ? " povp-novo" : ""}`}>
                <header className="povp-glava">
                  <span className="povp-av">{zacetnice(p.podjetje || p.ime)}</span>
                  <div className="povp-kdo">
                    <b>{p.podjetje || p.ime}</b>
                    <span>
                      {p.ime && p.ime !== p.podjetje ? `${p.ime} · ` : ""}
                      <a href={`mailto:${p.email}`}>{p.email}</a>
                      {p.telefon ? ` · ${p.telefon}` : ""}
                    </span>
                  </div>
                  <div className="povp-meta">
                    <span className="povp-vir">{VIRI[p.vir] ?? p.vir}</span>
                    <span className={`povp-st st-${(p.status ?? "").replace(/\s/g, "-")}`}>{p.status}</span>
                    <time>{cas(p.ustvarjeno)}</time>
                  </div>
                </header>

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

                {p.sporocilo && <blockquote className="povp-sp">{p.sporocilo}</blockquote>}

                <OdgovorPovprasevanju
                  id={p.id}
                  email={p.email}
                  zadeva={zadevaZa(p)}
                  od={admin?.ime || admin?.email || "AS system"}
                  odEmail={admin?.email ?? ""}
                />

                <form action={spremeniStatusPovprasevanja} className="povp-noga">
                  <input type="hidden" name="id" value={p.id} />
                  <label>
                    Status
                    <select name="status" defaultValue={p.status}>
                      {statusi.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="povp-op">
                    Interna opomba
                    <textarea name="opomba" rows={Math.min(4, Math.max(1, (p.opomba ?? "").split("\n").length))} defaultValue={p.opomba ?? ""} placeholder="Vidijo jo samo zaposleni" />
                  </label>
                  <button className="gumb siv" type="submit">
                    Shrani
                  </button>
                </form>
              </article>
            );
}

function Vrstica({ p, admin }) {
  const izd = (p.izdelki ?? []).filter((x) => !x.datoteka).map((x) => x.naziv).join(", ");
  return (
    <details id={`p-${p.id}`} className="povp-vrsta">
      <summary>
        <span className="povp-av mali">{zacetnice(p.podjetje || p.ime)}</span>
        <b className="pv-kdo">{p.podjetje || p.ime}</b>
        <span className="pv-izd">{izd || (p.sporocilo ?? "").slice(0, 80)}</span>
        <span className="povp-vir">{VIRI[p.vir] ?? p.vir}</span>
        <span className={`povp-st st-${(p.status ?? "").replace(/\s/g, "-")}`}>{p.status}</span>
        <time>{cas(p.ustvarjeno)}</time>
      </summary>
      <Kartica p={p} admin={admin} />
    </details>
  );
}

export default async function Povprasevanja() {
  const admin = await trenutniAdmin();
  const { data } = await supabaseAdmin().from("povprasevanja").select("*").order("ustvarjeno", { ascending: false }).limit(200);

  const seznam = data ?? [];
  // Povezave do priloženih risb (zasebna shramba, povezava velja 1 uro)
  for (const p of seznam) {
    for (const x of p.izdelki ?? []) {
      if (x?.datoteka) {
        const { data: u } = await supabaseAdmin().storage.from("prijave").createSignedUrl(x.datoteka, 3600);
        x.url = u?.signedUrl ?? null;
      }
    }
  }
  const novih = seznam.filter((p) => p.status === "novo").length;

  return (
    <>
      <div className="adm-glava">
        <h1>Povpraševanja</h1>
        <span style={{ fontSize: 13, color: "#6e767e" }}>
          {novih > 0 ? `${novih} novih · ` : ""}
          {seznam.length} skupaj
        </span>
      </div>

      <div className="adm-telo">
        <OdpriPoHashu />
        {seznam.length === 0 ? (
          <div className="opozorilo">Povpraševanj še ni.</div>
        ) : (
          <>
            {seznam.filter((p) => p.status === "novo").map((p) => (
              <Kartica key={p.id} p={p} admin={admin} />
            ))}
            {seznam.some((p) => p.status !== "novo") && (
              <section className="povp-arhiv">
                <h2>Odgovorjena in zaključena</h2>
                {seznam.filter((p) => p.status !== "novo").map((p) => (
                  <Vrstica key={p.id} p={p} admin={admin} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
