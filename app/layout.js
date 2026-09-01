import { Archivo, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
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

export const viewport = { themeColor: "#1a1d21" };

export default function RootLayout({ children }) {
  return (
    <html lang="sl" className={`${inter.variable} ${archivo.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
