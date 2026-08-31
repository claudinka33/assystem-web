import { Barlow, Barlow_Condensed } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AS system — razvoj in proizvodnja pritrdilne tehnike",
    template: "%s | AS system",
  },
  description:
    "Slovenski proizvajalec jeklenih sider, zidnih vložkov in vijakov. Lastni razvoj, hladno kovanje in brizganje plastike. Private label za evropske blagovne znamke.",
  keywords: [
    "pritrdilna tehnika",
    "jeklena sidra",
    "zidni vložki",
    "vijaki",
    "private label",
    "ASfix",
  ],
  openGraph: {
    type: "website",
    locale: "sl_SI",
    url: site.url,
    siteName: site.ime,
    title: "AS system — razvoj in proizvodnja pritrdilne tehnike",
    description:
      "Od 1993 razvijamo in proizvajamo pritrdilno tehniko. Dobavljamo v 19 držav, tudi pod znamko naročnika.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#2b2e32",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
