import Link from "next/link";
import { eur } from "@/lib/cene";
import { site } from "@/lib/site";

export const metadata = { title: "Hvala za naročilo", robots: { index: false } };

export default async function Hvala({ searchParams }) {
  const { st, p, z } = await searchParams;
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 760 }}>
        <p className="izd-kat">Naročilo oddano</p>
        <h1 className="izd-h1">Hvala za naročilo{st ? ` ${st}` : ""}</h1>
        {p === "predracun" ? (
          <p style={{ marginTop: 14 }}>
            Znesek za plačilo: <b>{eur(Number(z))}</b>. Predračun s podatki za plačilo vam pošljemo na e-pošto. Kot sklic uporabite
            številko naročila <b>{st}</b>. Blago odpošljemo po prejemu plačila.
          </p>
        ) : (
          <p style={{ marginTop: 14 }}>Znesek <b>{eur(Number(z))}</b> plačate ob prevzemu paketa. Ko naročilo odpošljemo, vas obvestimo.</p>
        )}
        <p style={{ marginTop: 14 }}>
          Za vprašanja smo na voljo na <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a> ali{" "}
          <a href={`mailto:${site.emailProdaja}`}>{site.emailProdaja}</a>.
        </p>
        <Link className="b b-r" href="/program" style={{ marginTop: 24, display: "inline-block" }}>Nazaj na program</Link>
      </div>
    </section>
  );
}
