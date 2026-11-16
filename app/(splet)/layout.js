import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Merjenje from "@/components/Merjenje";
import Sledenje from "@/components/Sledenje";
import PopupB2B from "@/components/PopupB2B";
import { pridobiKategorije, skriteZnamke } from "@/lib/podatki";
import { jezik } from "@/lib/i18n/streznik";
import { prevediDrevo } from "@/lib/i18n/drevo";
import { prevedi } from "@/lib/i18n/prevajalnik";
import { JezikProvider } from "@/lib/i18n/odjemalec";
import NIZI_ODJEMALCA from "@/lib/i18n/nizi-odjemalca.json";

export default async function SpletLayout({ children }) {
  // Kategorije za spustni meni »Izdelki« (slika + naziv).
  const { seznam } = await pridobiKategorije();
  const skrite = await skriteZnamke();
  const kategorijeMeni = seznam.map((k) => ({ slug: k.slug, naziv: k.naziv, slika: k.slika ?? null, opis: k.opis ?? null }));

  // Jezik strani (/en, /de) in slovar za komponente v brskalniku
  const j = await jezik();
  const slovar = j === "sl" ? null : await prevedi(j, NIZI_ODJEMALCA, { vir: "odjemalec" });
  const glava = <Header kategorije={kategorijeMeni} skrite={skrite} jezik={j} />;
  const noga = <Footer kategorije={kategorijeMeni} />;

  return (
    <JezikProvider jezik={j} slovar={slovar}>
      {j === "sl" ? glava : await prevediDrevo(glava, j)}
      <main>{children}</main>
      {j === "sl" ? noga : await prevediDrevo(noga, j)}
      <Merjenje />
      <Sledenje />
      <PopupB2B />
    </JezikProvider>
  );
}
