import Link from "next/link";
import { eur } from "@/lib/cene";
import { site } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase-server";
import { stripePreveriSejo } from "@/lib/placila";
import { oznaciPlacano } from "@/lib/narocila-potrdila";
import Konverzija from "./Konverzija";

export const metadata = { title: "Hvala za naročilo", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Hvala({ searchParams }) {
  const { st, sid } = await searchParams;
  const sb = supabaseAdmin();
  let { data: n } = await sb
    .from("narocila")
    .select("id, stevilka, skupaj, nacin_placila, status_placila, nacin_dostave")
    .eq("stevilka", String(st ?? ""))
    .maybeSingle();

  // Stripe: če je webhook še na poti, plačilo preverimo tukaj (varno za večkratni klic).
  if (n && sid && n.nacin_placila === "kartica" && n.status_placila !== "plačano") {
    try {
      const s = await stripePreveriSejo(sid);
      if (s.placano && s.narociloId === n.id) {
        await oznaciPlacano(n.id, { ref: s.ref, znesek: s.znesek, nacin: "kartica" });
        n = { ...n, status_placila: "plačano" };
      }
    } catch (e) {
      console.error("Preverjanje Stripe seje:", e?.message);
    }
  }

  if (!n)
    return (
      <section className="sec">
        <div className="w" style={{ maxWidth: 760 }}>
          <h1 className="izd-h1">Hvala za naročilo</h1>
          <p style={{ marginTop: 14 }}>Za vprašanja smo na voljo na {site.telefon} ali {site.emailProdaja}.</p>
        </div>
      </section>
    );

  const osebno = /prevzem/i.test(n.nacin_dostave ?? "");
  const placano = n.status_placila === "plačano";
  const spletno = n.nacin_placila === "kartica" || n.nacin_placila === "paypal";

  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 760 }}>
        <p className="izd-kat">Naročilo oddano</p>
        <h1 className="izd-h1">Hvala za naročilo {n.stevilka}</h1>

        {n.nacin_placila === "predracun" && (
          <div style={{ marginTop: 14 }}>
            <p>Za plačilo nakažite znesek na naš račun:</p>
            <table style={{ marginTop: 10, fontSize: 15 }}>
              <tbody>
                <tr><td style={{ paddingRight: 16 }}>Znesek</td><td><b>{eur(Number(n.skupaj))}</b></td></tr>
                <tr><td style={{ paddingRight: 16 }}>Prejemnik</td><td>{site.podjetje.polnoIme}</td></tr>
                <tr><td style={{ paddingRight: 16 }}>TRR</td><td><b>{site.podjetje.trr}</b></td></tr>
                <tr><td style={{ paddingRight: 16 }}>Sklic</td><td><b>{n.stevilka}</b></td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: 10 }}>Podatke in predračun prejmete tudi po e-pošti. Naročilo {osebno ? "pripravimo" : "odpremimo"} po prejemu plačila.</p>
          </div>
        )}
        {n.nacin_placila === "povzetje" && (
          <p style={{ marginTop: 14 }}>Znesek <b>{eur(Number(n.skupaj))}</b> plačate ob prevzemu paketa. Ko naročilo odpošljemo, vas obvestimo.</p>
        )}
        {spletno && placano && (
          <p style={{ marginTop: 14 }}>Plačilo <b>{eur(Number(n.skupaj))}</b> je uspešno. Potrdilo smo vam poslali po e-pošti.</p>
        )}
        {spletno && !placano && (
          <p style={{ marginTop: 14 }}>Plačilo še potrjujemo. Potrdilo prejmete po e-pošti v nekaj minutah.</p>
        )}
        {osebno && (
          <p style={{ marginTop: 14 }}>
            <b>Osebni prevzem:</b> {site.lokacije[0].naslov}, pon–pet 7.00–15.00. Obvestimo vas, ko bo naročilo pripravljeno.
          </p>
        )}

        <p style={{ marginTop: 14 }}>
          Za vprašanja smo na voljo na <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a> ali{" "}
          <a href={`mailto:${site.emailProdaja}`}>{site.emailProdaja}</a>.
        </p>
        <Link className="b b-r" href="/program" style={{ marginTop: 24, display: "inline-block" }}>Nazaj na program</Link>
        <Konverzija stevilka={n.stevilka} znesek={Number(n.skupaj)} />
      </div>
    </section>
  );
}
