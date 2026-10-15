import Link from "next/link";
import { Resend } from "resend";
import ENoviceObrazec from "./ENoviceObrazec";

export const dynamic = "force-dynamic";

// Seznam segmentov in zadnjih kampanj iz Resenda.
async function izResenda() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { napaka: "RESEND_API_KEY ni nastavljen.", segmenti: [], kampanje: [] };
  const r = new Resend(kljuc);
  const [s, b] = await Promise.all([r.segments.list().catch((e) => ({ error: e })), r.broadcasts.list().catch((e) => ({ error: e }))]);
  return {
    napaka: s.error?.message ?? null,
    segmenti: s.data?.data ?? [],
    kampanje: (b.data?.data ?? []).slice(0, 10),
  };
}

export default async function ENovice() {
  const { napaka, segmenti, kampanje } = await izResenda();
  const posiljatelj =
    process.env.EMAIL_NOVICE || `AS system <${process.env.EMAIL_POSILJATELJ || "splet@assystem.si"}>`;

  return (
    <>
      <div className="adm-glava">
        <h1>E-novice</h1>
        <Link className="gumb siv mini" href="/admin/e-novice/kontakti">
          + Dodaj kontakte
        </Link>
      </div>

      <div className="adm-telo">
        {napaka && <div className="opozorilo">Resend: {napaka}</div>}

        <ENoviceObrazec segmenti={segmenti} posiljatelj={posiljatelj} />

        {kampanje.length > 0 && (
          <h2 style={{ fontSize: 15, margin: "28px 0 10px" }}>Zadnje kampanje</h2>
        )}
        {kampanje.length > 0 && (
          <table className="adm-tab">
            <thead>
              <tr>
                <th>Kampanja</th>
                <th>Stanje</th>
                <th>Ustvarjeno</th>
              </tr>
            </thead>
            <tbody>
              {kampanje.map((k) => (
                <tr key={k.id}>
                  <td>{k.name || k.id}</td>
                  <td>
                    <span className={k.status === "sent" ? "znacka" : "znacka ne"}>{k.status}</span>
                  </td>
                  <td>{k.created_at ? new Date(k.created_at).toLocaleString("sl-SI") : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
