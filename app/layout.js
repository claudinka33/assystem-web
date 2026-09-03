import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Merjenje from "@/components/Merjenje";
import { site } from "@/lib/site";
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
    "ASfix je blagovna znamka podjetja AS system: jeklena sidra, zidni vložki, udarni vijaki in kemična sidra iz lastne slovenske proizvodnje. Od 1993, dobava v 19 držav.",
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
    title: "AS system — pritrdilna tehnika ASfix",
    description:
      "Jeklena sidra, zidni vložki in kemična sidra iz lastne proizvodnje. Od 1993, dobava v 19 držav.",
  },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#3f4140" };

export default function RootLayout({ children }) {
  return (
    <html lang="sl" className={poppins.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Merjenje />
      </body>
    </html>
  );
}
