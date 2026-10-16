import Link from "next/link";
import { notFound } from "next/navigation";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";
import { privzetiPosiljatelj, prekliciNacrt, podvojiKampanjo } from "@/lib/akcije/enovice-kampanje";
import KampanjaUrejevalnik from "./KampanjaUrejevalnik";

export const dynamic = "force-dynamic";

async function segmentiIzResenda() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { napaka: "RESEND_API_KEY ni nastavljen.", segmenti: [] };
  const s = await new Resend(kljuc).segments.list().catch((e) => ({ error: e }));
  return { napaka: s.error?.message ?? null, segmenti: s.data?.data ?? [] };
}

const cas = (d) =>
  d ? new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "medium", timeStyle: "short" }) : "";

export default async function Kampanja({ params }) {
  const { id } = await params;
  const { data: k } = await supabaseAdmin().from("enovice_kampanje").select("*").eq("id", id).single();
  if (!k) notFound();

  const urejanje = ["osnutek", "predloga"].includes(k.status);

  return (
    <>
      <div className="adm-glava">
        <h1>
          {k.status === "predloga" ? "Predloga" : "E-novica"}
          {k.status === "nacrtovano" && <span className="znacka novo" style={{ marginLeft: 10, verticalAlign: "middle" }}>načrtovano</span>}
          {k.status === "poslano" && <span className="znacka da" style={{ marginLeft: 10, verticalAlign: "middle" }}>poslano</span>}
        </h1>
        <Link className="gumb siv mini" href={`/admin/e-novice?z=${k.status}`}>
          ← Seznam
        </Link>
      </div>

      <div className="adm-telo">
        {urejanje ? (
          <Urejanje k={k} />
        ) : (
          <Pregled k={k} />
        )}
      </div>
    </>
  );
}

async function Urejanje({ k }) {
  const { napaka, segmenti } = await segmentiIzResenda();
  return (
    <>
      {napaka && <div className="opozorilo">Resend: {napaka}</div>}
      <KampanjaUrejevalnik kampanja={k} segmenti={segmenti} privzetiPosiljatelj={await privzetiPosiljatelj()} />
    </>
  );
}

function Pregled({ k }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 380px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
      <div className="adm-obr" style={{ maxWidth: "none", padding: 18, fontSize: 14 }}>
        <p style={{ margin: "0 0 4px", color: "#6e767e", fontSize: 12 }}>Zadeva</p>
        <p style={{ margin: "0 0 14px", fontWeight: 600 }}>{k.zadeva}</p>
        <p style={{ margin: "0 0 4px", color: "#6e767e", fontSize: 12 }}>Komu</p>
        <p style={{ margin: "0 0 14px" }}>{k.segment_ime || k.segment_id}</p>
        {k.status === "nacrtovano" ? (
          <>
            <p style={{ margin: "0 0 4px", color: "#6e767e", fontSize: 12 }}>Pošlje se</p>
            <p style={{ margin: "0 0 16px", fontWeight: 600 }}>{cas(k.nacrtovano_za)}</p>
            <form action={prekliciNacrt}>
              <input type="hidden" name="id" value={k.id} />
              <button className="gumb siv" style={{ width: "100%" }}>
                Prekliči in vrni med osnutke
              </button>
            </form>
          </>
        ) : (
          <>
            <p style={{ margin: "0 0 4px", color: "#6e767e", fontSize: 12 }}>Poslano</p>
            <p style={{ margin: "0 0 16px" }}>{cas(k.poslano_ob)}</p>
          </>
        )}
        <form action={podvojiKampanjo} style={{ marginTop: 10 }}>
          <input type="hidden" name="iz" value={k.id} />
          <button className="gumb siv" style={{ width: "100%" }}>
            Podvoji v nov osnutek
          </button>
        </form>
      </div>
      <iframe
        title="Predogled maila"
        srcDoc={k.html || ""}
        sandbox=""
        style={{ width: "100%", height: "calc(100vh - 200px)", minHeight: 420, border: "1px solid #dde0e2", background: "#fff" }}
      />
    </div>
  );
}
