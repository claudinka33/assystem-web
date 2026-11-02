import Link from "next/link";
import { resendOdjemalec, vsiKontakti, vsePanoge } from "@/lib/enovice-resend";
import { dodajKontakt, novaPanoga } from "@/lib/akcije/enovice-kontakti";
import UvozKontaktov from "./UvozKontaktov";
import SeznamKontaktov from "./SeznamKontaktov";

export const dynamic = "force-dynamic";

async function podatki() {
  try {
    const r = resendOdjemalec();
    const panoge = await vsePanoge(r);
    const kontakti = await vsiKontakti(r);
    // kdo je v kateri panogi
    const clani = {};
    for (const p of panoge) {
      const vPanogi = await vsiKontakti(r, p.id);
      for (const k of vPanogi) (clani[k.email] ??= []).push(p.id);
    }
    return {
      panoge: panoge.map((p) => ({ id: p.id, ime: p.name })),
      kontakti: kontakti.map((k) => ({
        email: k.email,
        ime: [k.first_name, k.last_name].filter(Boolean).join(" "),
        odjavljen: !!k.unsubscribed,
        dodan: k.created_at,
        panoge: clani[k.email] ?? [],
      })),
    };
  } catch (e) {
    return { napaka: e.message, panoge: [], kontakti: [] };
  }
}

const polje = { padding: "9px 11px", border: "1px solid #c6cace", borderRadius: 6, fontSize: 14 };

export default async function KontaktiENovic() {
  const { napaka, panoge, kontakti } = await podatki();

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">E-novice</div>
          <h1>Kontakti</h1>
        </div>
        <Link className="gumb siv" href="/admin/e-novice">
          ← E-novice
        </Link>
      </div>

      <div className="adm-telo">
        {napaka && <div className="opozorilo">Resend: {napaka}</div>}

        {/* ---------- dodaj ---------- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 26 }}>
          <form action={dodajKontakt} style={{ background: "#fff", border: "1px solid #e3e5e8", borderRadius: 10, padding: "16px 18px" }}>
            <b style={{ display: "block", marginBottom: 10 }}>Dodaj kontakt</b>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input name="email" type="email" required placeholder="e-naslov *" style={{ ...polje, gridColumn: "1 / -1" }} />
              <input name="ime" placeholder="ime" style={polje} />
              <input name="priimek" placeholder="priimek" style={polje} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", margin: "12px 0" }}>
              {panoge.map((p) => (
                <label key={p.id} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 14, fontWeight: 400 }}>
                  <input type="checkbox" name="panoge" value={p.id} style={{ width: "auto", margin: 0 }} /> {p.ime}
                </label>
              ))}
            </div>
            <button className="gumb" type="submit">Dodaj kontakt</button>
          </form>

          <div style={{ background: "#fff", border: "1px solid #e3e5e8", borderRadius: 10, padding: "16px 18px" }}>
            <b style={{ display: "block", marginBottom: 10 }}>Nova panoga</b>
            <form action={novaPanoga} style={{ display: "flex", gap: 8 }}>
              <input name="ime" required placeholder="npr. Krovci, Distributerji tujina" style={{ ...polje, flex: 1 }} />
              <button className="gumb" type="submit">Dodaj</button>
            </form>
            <details style={{ marginTop: 16 }}>
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>Uvoz več kontaktov naenkrat (prilepi iz Excela)</summary>
              <div style={{ marginTop: 12 }}>
                <UvozKontaktov segmenti={panoge.map((p) => ({ id: p.id, name: p.ime }))} />
              </div>
            </details>
          </div>
        </div>

        <SeznamKontaktov kontakti={kontakti} panoge={panoge} />
      </div>
    </>
  );
}
