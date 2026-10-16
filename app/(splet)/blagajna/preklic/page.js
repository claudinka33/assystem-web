import Link from "next/link";
import { site } from "@/lib/site";
import PonovnoPlacaj from "./PonovnoPlacaj";

export const metadata = { title: "Plačilo ni bilo izvedeno", robots: { index: false } };

export default async function Preklic({ searchParams }) {
  const { st, napaka } = await searchParams;
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 760 }}>
        <p className="izd-kat">Plačilo</p>
        <h1 className="izd-h1">Plačilo ni bilo izvedeno</h1>
        <p style={{ marginTop: 14 }}>
          {napaka
            ? "Pri potrjevanju plačila je prišlo do napake. Če je bil znesek bremenjen, vas bomo kontaktirali."
            : "Plačilo ste prekinili ali ni uspelo."}{" "}
          {st && <>Naročilo <b>{st}</b> je shranjeno, a še ni plačano.</>}
        </p>
        {st && <PonovnoPlacaj stevilka={st} />}
        <p style={{ marginTop: 18 }}>
          Lahko nas tudi pokličete na <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a> ali pišete na{" "}
          <a href={`mailto:${site.emailProdaja}`}>{site.emailProdaja}</a> — naročilo uredimo s plačilom po predračunu.
        </p>
        <Link href="/kosarica" style={{ color: "var(--color-red)", display: "inline-block", marginTop: 16 }}>Nazaj v košarico</Link>
      </div>
    </section>
  );
}
