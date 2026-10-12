import Link from "next/link";
import { redirect } from "next/navigation";
import { trenutniB2B } from "@/lib/b2b";
import { site } from "@/lib/site";
import PrijavaB2B from "./PrijavaB2B";

export const metadata = {
  title: "B2B prijava za podjetja",
  description: "Spletna trgovina AS system za podjetja: vaše cene, naročanje na račun in pregled naročil.",
  robots: { index: true, follow: true },
};
export const dynamic = "force-dynamic";

export default async function B2B({ searchParams }) {
  const { napaka, naprej } = await searchParams;
  if (await trenutniB2B()) redirect(naprej && naprej.startsWith("/") ? naprej : "/b2b/racun");
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 1040 }}>
        <p className="izd-kat">Za podjetja</p>
        <h1 className="izd-h1">B2B spletna trgovina</h1>
        {napaka === "povezava" && (
          <div className="b2b-info" style={{ marginTop: 16 }}>Povezava je neveljavna ali je potekla. Prijavi se ali zahtevaj novo povezavo za geslo.</div>
        )}
        <div className="b2b-mreza" style={{ marginTop: 24 }}>
          <div className="b2b-skatla">
            <h2>Prijava</h2>
            <PrijavaB2B naprej={naprej ?? ""} />
            <p style={{ fontSize: 14, marginTop: 14 }}>
              <Link href="/b2b/pozabljeno-geslo" style={{ color: "var(--color-red)" }}>Pozabljeno geslo?</Link>
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 18, textTransform: "uppercase", margin: "0 0 6px" }}>Še nimate dostopa?</h2>
            <p>Podjetja in samostojni podjetniki kupujete neposredno pri proizvajalcu:</p>
            <ul className="b2b-seznam">
              <li>vaše dogovorjene cene in rabati (brez DDV)</li>
              <li>naročanje na račun z vašim rokom plačila</li>
              <li>dostava na sedež ali na vašo poslovalnico</li>
              <li>pregled vseh spletnih naročil na enem mestu</li>
            </ul>
            <p style={{ marginTop: 18 }}>
              Obstoječi partnerji dobijo dostop do svojih cen praviloma v nekaj minutah po potrditvi e-naslova, nove partnerje odobrimo v enem delovnem dnevu.
            </p>
            <Link className="b b-r" href="/b2b/registracija" style={{ display: "inline-block", marginTop: 14 }}>Registracija podjetja</Link>
            <p style={{ fontSize: 14, marginTop: 18, color: "var(--color-muted)" }}>
              Vprašanja: <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a> · <a href={`mailto:${site.emailProdaja}`}>{site.emailProdaja}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
