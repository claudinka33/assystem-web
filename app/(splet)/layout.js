import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Merjenje from "@/components/Merjenje";
import { pridobiKategorije } from "@/lib/podatki";

export default async function SpletLayout({ children }) {
  // Kategorije za spustni meni »Izdelki« (slika + naziv).
  const { seznam } = await pridobiKategorije();
  const kategorijeMeni = seznam.map((k) => ({ slug: k.slug, naziv: k.naziv, slika: k.slika ?? null, opis: k.opis ?? null }));

  return (
    <>
      <Header kategorije={kategorijeMeni} />
      <main>{children}</main>
      <Footer />
      <Merjenje />
    </>
  );
}
