import Link from "next/link";
import { poslanaSporocila, STANJA } from "@/lib/resend-poslano";
import IskalnikPoslanih from "./IskalnikPoslanih";

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
          Mailingi (e-novice) imajo statistiko po prejemnikih v »E-novice«.
        </p>
        {napaka && <div className="opozorilo">Resend: {napaka}</div>}
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
