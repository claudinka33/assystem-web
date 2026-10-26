import { Poppins } from "next/font/google";
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
    "AS system: pritrdilna tehnika in vijačno blago pod znamkami ASfix, ASco in Silvermate. Proizvodnja v Sloveniji, police za trgovce, private label in vijaki po naročilu. Od 1993, dobava v 19 držav.",
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
      "Pritrdilna tehnika in vijačno blago ASfix, ASco in Silvermate. Od 1993, dobava v 19 držav.",
  },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#3f4140" };

// Korenska postavitev je namenoma prazna: javna stran dobi glavo in nogo
// v app/(splet)/layout.js, administracija pa ima svojo postavitev.
export default function RootLayout({ children }) {
  return (
    <html lang="sl" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
