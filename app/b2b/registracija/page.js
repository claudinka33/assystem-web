import Link from "next/link";
import Registracija from "./Registracija";

export const metadata = { title: "Registracija podjetja — B2B", robots: { index: false } };

export default function Stran() {
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 760 }}>
        <p className="izd-kat"><Link href="/b2b">B2B</Link></p>
        <h1 className="izd-h1">Registracija podjetja</h1>
        <p style={{ marginTop: 10 }}>
          Vpišite podatke podjetja. Po potrditvi e-naslova jih preverimo v našem sistemu; če ste že naš partner, takoj vidite svoje cene.
        </p>
        <div className="b2b-skatla" style={{ marginTop: 20 }}>
          <Registracija />
        </div>
      </div>
    </section>
  );
}
