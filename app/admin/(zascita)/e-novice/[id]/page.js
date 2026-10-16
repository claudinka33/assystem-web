import Link from "next/link";
import { notFound } from "next/navigation";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";
import { privzetiPosiljatelj } from "@/lib/akcije/enovice-kampanje";
import KampanjaUrejevalnik from "./KampanjaUrejevalnik";
import Pregled from "./Pregled";

export const dynamic = "force-dynamic";
// osveževanje statistike iz Resenda lahko pri velikih seznamih traja
export const maxDuration = 300;

async function segmentiIzResenda() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { napaka: "RESEND_API_KEY ni nastavljen.", segmenti: [] };
  const s = await new Resend(kljuc).segments.list().catch((e) => ({ error: e }));
  return { napaka: s.error?.message ?? null, segmenti: s.data?.data ?? [] };
}

export default async function Kampanja({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
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
          <Pregled k={k} sp={sp} />
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
