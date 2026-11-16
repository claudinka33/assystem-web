import Link from "next/link";
import { poslanaSporocila, STANJA } from "@/lib/resend-poslano";
import IskalnikPoslanih from "./IskalnikPoslanih";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const cas = (d) =>
  new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default async function Poslano({ searchParams }) {
  const { po = "" } = await searchParams;
  let sporocila = [], naslednji = null, napaka = null;
  try {
    ({ sporocila, naslednji } = await poslanaSporocila({ after: po || null }));
  } catch (e) {
    napaka = e.message;
  }
  const { data: kampanje } = po
    ? { data: [] }
    : await supabaseAdmin()
        .from("enovice_kampanje")
        .select("id, naziv, zadeva, segment_ime, poslano_ob, nacrtovano_za, status, statistika")
        .in("status", ["poslano", "nacrtovano"])
        .order("poslano_ob", { ascending: false, nullsFirst: true })
        .limit(50);
  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">E-mailing</div>
          <h1>Poslana sporočila</h1>
        </div>
      </div>
      <div className="adm-telo siroko">
        <p className="adm-namig" style={{ marginTop: 0 }}>
          Vsi maili, ki jih pošlje spletna stran assystem.si (B2B registracije in odobritve, potrdila naročil, povpraševanja, vabila zaposlenim …).
          Pri mailingih klikni Odpri za seznam prejemnikov (kdo je dobil, odprl, kliknil).
        </p>
        {napaka && <div className="opozorilo">Resend: {napaka}</div>}
        {(kampanje ?? []).length > 0 && (
          <>
            <h2 className="adm-naslov" style={{ marginTop: 0 }}>Mailingi (e-novice)</h2>
            <div className="ps-tab" style={{ marginBottom: 18 }}>
              <div className="ps-vr ps-gl"><span>Poslano</span><span>Segment (komu)</span><span>Zadeva</span><span>Prejemniki</span><span></span></div>
              {kampanje.map((k) => {
                const st = k.statistika || {};
                const d = st.dostavljeno ?? st.poslano;
                return (
                  <div key={k.id} className="ps-vr">
                    <span className="siv">{k.status === "nacrtovano" ? `načrtovano ${cas(k.nacrtovano_za)}` : k.poslano_ob ? cas(k.poslano_ob) : "—"}</span>
                    <span className="ell" title={k.segment_ime ?? ""}>{k.segment_ime || "—"}</span>
                    <span className="ell" title={k.zadeva}>{k.zadeva || k.naziv}</span>
                    <span>{d != null ? <>{d} dost.{st.odprli != null ? <span className="siv"> · {st.odprli} odpr.</span> : null}</> : <span className="siv">—</span>}</span>
                    <Link href={`/admin/e-novice/${k.id}`} className="bz-uredi">Odpri</Link>
                  </div>
                );
              })}
            </div>
            <h2 className="adm-naslov">Posamezni maili</h2>
          </>
        )}
        <IskalnikPoslanih skupaj={sporocila.length} />
        <div className="ps-tab">
          <div className="ps-vr ps-gl"><span>Poslano</span><span>Prejemnik</span><span>Zadeva</span><span>Stanje</span><span></span></div>
          {sporocila.map((m) => {
            const [st, cl] = STANJA[m.last_event] ?? [m.last_event, "caka"];
            return (
              <div key={m.id} className="ps-vr ps-sp" data-isk={norm(`${m.to?.join(" ")} ${m.subject} ${m.cc?.join(" ") ?? ""} ${st}`)}>
                <span className="siv">{cas(m.created_at)}</span>
                <span className="ell" title={m.to?.join(", ")}>{m.to?.join(", ")}{m.cc?.length ? <span className="siv"> · cc {m.cc.join(", ")}</span> : null}</span>
                <span className="ell" title={m.subject}>{m.subject}</span>
                <span><i className={`ps-st ${cl}`}>{st}</i></span>
                <Link href={`/admin/poslano/${m.id}`} className="bz-uredi">Odpri</Link>
              </div>
            );
          })}
          <p id="ps-ni" className="bz-prazno" hidden={sporocila.length > 0}>Ni sporočil.</p>
        </div>
        <div className="bz-strani">
          {po && <Link className="gumb siv mini" href="/admin/poslano">← Najnovejša</Link>}
          {naslednji && <Link className="gumb siv mini" href={`/admin/poslano?po=${naslednji}`}>Starejša →</Link>}
        </div>
      </div>
    </>
  );
}
