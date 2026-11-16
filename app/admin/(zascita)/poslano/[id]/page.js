import Link from "next/link";
import { poslanoSporocilo, STANJA } from "@/lib/resend-poslano";

export const dynamic = "force-dynamic";

const cas = (d) => (d ? new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana" }) : "");

export default async function Sporocilo({ params }) {
  const { id } = await params;
  let m = null, napaka = null;
  try {
    m = await poslanoSporocilo(id);
  } catch (e) {
    napaka = e.message;
  }
  const [st, cl] = m ? STANJA[m.last_event] ?? [m.last_event, "caka"] : [];
  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad"><Link href="/admin/poslano">← Poslana sporočila</Link></div>
          <h1>{m?.subject ?? "Sporočilo"}</h1>
        </div>
      </div>
      <div className="adm-telo siroko">
        {napaka && <div className="opozorilo">Resend: {napaka}</div>}
        {m && (
          <>
            <div className="ps-glava">
              <div><span>Od</span>{m.from}</div>
              <div><span>Za</span>{m.to?.join(", ")}</div>
              {m.cc?.length ? <div><span>Kp</span>{m.cc.join(", ")}</div> : null}
              {m.bcc?.length ? <div><span>Skp</span>{m.bcc.join(", ")}</div> : null}
              {m.reply_to?.length ? <div><span>Odgovor na</span>{m.reply_to.join(", ")}</div> : null}
              <div><span>Poslano</span>{cas(m.created_at)}</div>
              <div><span>Stanje</span><i className={`ps-st ${cl}`}>{st}</i></div>
            </div>
            {m.html ? (
              <iframe title="Vsebina" className="ps-okno" srcDoc={m.html} sandbox="" />
            ) : (
              <pre className="ps-tekst">{m.text}</pre>
            )}
          </>
        )}
      </div>
    </>
  );
}
