import Link from "next/link";
import IgraSidranje from "@/components/IgraSidranje";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

// Samostojna stran z igro (za povezave iz mailingov in objav) — igra je takoj na vrhu.
const metadataSl = {
  title: "Igra: pritrdite ograjo v beton",
  description:
    "Interaktivna vaja ASfix: izberite sveder in sidro TXH7, izvrtajte in izpihajte luknje, zabijte sidra in zategnite matice.",
  alternates: { canonical: "/igra" },
};

function Igra() {
  return (
    <>
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Preizkusite sami</span>
            <h2>Pritrdite ograjo v beton</h2>
            <p>
              Šest korakov, kot gredo na gradbišču. Izberite sveder in sidro, izvrtajte, izpihajte luknje, zabijte
              sidra in jih zategnite. Če kaj ni po vrsti, vam vaja pove, zakaj ne gre.
            </p>
          </div>
          <IgraSidranje />
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Naročate za podjetje?</h2>
            <p>Registrirajte podjetje na B2B portalu in vidite svoje cene, zalogo in certifikate.</p>
          </div>
          <Link className="b b-g" href="/b2b/registracija">
            Registriraj podjetje →
          </Link>
        </div>
      </div>
    </>
  );
}

export default prevedenaStran(Igra);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
