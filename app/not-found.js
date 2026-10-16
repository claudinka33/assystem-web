import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pridobiKategorije } from "@/lib/podatki";

export const metadata = { title: "Stran ne obstaja" };

export default async function NiNajdeno() {
  const { seznam } = await pridobiKategorije();
  const kategorijeMeni = seznam.map((k) => ({ slug: k.slug, naziv: k.naziv, slika: k.slika ?? null, opis: k.opis ?? null }));

  return (
    <>
    <Header kategorije={kategorijeMeni} />
    <main>
    <section className="sec">
      <div className="w">
        <div className="st">
          <span>Napaka 404</span>
          <h1>Te strani ni</h1>
          <p>Povezava je zastarela ali napačno vnesena.</p>
        </div>
        <Link className="b b-r" href="/">
          Nazaj na domačo stran
        </Link>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
