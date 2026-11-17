import Link from "next/link";
import Registracija from "./Registracija";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = { title: "Registracija podjetja: B2B", robots: { index: false } };

function Stran() {
  return (
    <section className="sec reg-sec">
      <div className="w" style={{ maxWidth: 1100 }}>
        <p className="izd-kat"><Link href="/b2b">B2B</Link></p>
        <h1 className="izd-h1">Registracija podjetja</h1>
        <p style={{ marginTop: 6 }}>
          Vpišite podatke podjetja. Po potrditvi e-naslova jih preverimo v našem sistemu, dostop pa ročno odobri naša prodaja (običajno isti ali naslednji delovni dan). O odobritvi vas obvestimo po e-pošti.
        </p>
        <div className="b2b-skatla" style={{ marginTop: 14, padding: "20px 24px" }}>
          <Registracija />
        </div>
      </div>
    </section>
  );
}

export default prevedenaStran(Stran);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
