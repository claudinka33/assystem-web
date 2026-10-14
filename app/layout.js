import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Merjenje from "@/components/Merjenje";
import { site } from "@/lib/site";
import { pridobiKategorije } from "@/lib/podatki";
import "./globals.css";

// Poppins je edina pisava celostne podobe (CGP str. 07).
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AS system — pritrdilna tehnika ASfix",
    template: "%s | AS system",
  },
  description:
    "AS system: pritrdilna tehnika in vijačno blago pod znamkami ASfix, ASco, Mungo in Silvermate. Proizvodnja v Sloveniji, police za trgovce, private label in vijaki po naročilu. Od 1993, dobava v 19 držav.",
  keywords: [
    "pritrdilna tehnika",
    "jeklena sidra",
    "zidni vložki",
    "vijaki",
    "kemično sidro",
    "ASfix",
    "AS system",
  ],
  openGraph: {
    type: "website",
    locale: "sl_SI",
    url: site.url,
    siteName: site.ime,
    title: "AS system — pritrdilna tehnika in vijačno blago",
    description:
      "Pritrdilna tehnika in vijačno blago ASfix, ASco, Mungo in Silvermate. Od 1993, dobava v 19 držav.",
  },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#3f4140" };

export default async function RootLayout({ children }) {
  // Kategorije za spustni meni »Izdelki« (slika + naziv).
  const { seznam } = await pridobiKategorije();
  const kategorijeMeni = seznam.map((k) => ({ slug: k.slug, naziv: k.naziv, slika: k.slika ?? null, opis: k.opis ?? null }));

  return (
    <html lang="sl" className={poppins.variable}>
      <body>
        <Header kategorije={kategorijeMeni} />
        <main>{children}</main>
        <Footer />
        <Merjenje />
      </body>
    </html>
  );
}
