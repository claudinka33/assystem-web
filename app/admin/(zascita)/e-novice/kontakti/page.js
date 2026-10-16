import Link from "next/link";
import { Resend } from "resend";
import UvozKontaktov from "./UvozKontaktov";

export const dynamic = "force-dynamic";

async function izResenda() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { napaka: "RESEND_API_KEY ni nastavljen.", segmenti: [], uvozi: [] };
  const r = new Resend(kljuc);
  const [s, u] = await Promise.all([
    r.segments.list().catch((e) => ({ error: e })),
    r.contacts.imports.list({ limit: 10 }).catch((e) => ({ error: e })),
  ]);
  return {
    napaka: s.error?.message ?? null,
    segmenti: s.data?.data ?? [],
    uvozi: u.data?.data ?? [],
  };
}

const stanja = { queued: "v čakanju", in_progress: "v teku", completed: "končano", failed: "napaka" };

export default async function KontaktiENovic() {
  const { napaka, segmenti, uvozi } = await izResenda();

  return (
    <>
      <div className="adm-glava">
        <h1>E-novice · kontakti</h1>
        <Link className="gumb siv mini" href="/admin/e-novice">
          ← Pošiljanje
        </Link>
      </div>

      <div className="adm-telo">
        {napaka && <div className="opozorilo">Resend: {napaka}</div>}

        <UvozKontaktov segmenti={segmenti} />

        {uvozi.length > 0 && (
          <>
            <h2 style={{ fontSize: 15, margin: "28px 0 10px" }}>Zadnji uvozi</h2>
            <table className="adm-tab">
              <thead>
                <tr>
                  <th>Začeto</th>
                  <th>Stanje</th>
                  <th>Skupaj</th>
                  <th>Novi</th>
                  <th>Posodobljeni</th>
                  <th>Napake</th>
                </tr>
              </thead>
              <tbody>
                {uvozi.map((u) => (
                  <tr key={u.id}>
                    <td>{u.created_at ? new Date(u.created_at).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana" }) : ""}</td>
                    <td>
                      <span className={u.status === "completed" ? "znacka" : "znacka ne"}>{stanja[u.status] ?? u.status}</span>
                    </td>
                    <td>{u.counts?.total ?? ""}</td>
                    <td>{u.counts?.created ?? ""}</td>
                    <td>{u.counts?.updated ?? ""}</td>
                    <td>{(u.counts?.failed ?? 0) + (u.counts?.skipped ?? 0) || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
