import Link from "next/link";
import Pozabljeno from "./Pozabljeno";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = { title: "Pozabljeno geslo: B2B", robots: { index: false } };

async function Stran({ searchParams }) {
  const { potekla } = await searchParams;
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 520 }}>
        <p className="izd-kat"><Link href="/b2b">B2B</Link></p>
        <h1 className="izd-h1">{potekla ? "Nova povezava za geslo" : "Pozabljeno geslo"}</h1>
        {potekla && (
          <div className="b2b-info" style={{ marginTop: 16 }}>
            Povezava je že bila uporabljena ali je potekla. Vpišite svoj e-naslov in poslali vam bomo novo povezavo za nastavitev gesla.
          </div>
        )}
        <div className="b2b-skatla" style={{ marginTop: 20 }}>
          <Pozabljeno />
        </div>
      </div>
    </section>
  );
}

export default prevedenaStran(Stran);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
