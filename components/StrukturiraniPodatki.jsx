import { site } from "@/lib/site";

// Strukturirani podatki (schema.org JSON-LD) za Google in AI iskalnike.
// Vsebina gre v <script type="application/ld+json">, ki ga prevajalnik (lib/i18n/drevo.js) ne prevaja.

const abs = (p) => (!p ? undefined : p.startsWith("http") ? p : `${site.url}${p.startsWith("/") ? "" : "/"}${p}`);

export function JsonLd({ podatki }) {
  if (!podatki) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(podatki).replace(/</g, "\\u003c") }}
    />
  );
}

// Podjetje + spletno mesto (na vseh javnih straneh)
export function podatkiPodjetja(znamke = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#podjetje`,
        name: "AS system d.o.o.",
        legalName: site.podjetje.polnoIme,
        alternateName: ["AS system", "AS SYSTEM", "ASfix"],
        url: site.url,
        logo: abs("/logo-as-system.png"),
        image: abs("/hero-izdelki-2026.png"),
        description:
          "Slovenski proizvajalec pritrdilne tehnike od leta 1993: jeklena sidra z oceno ETA, najlonski zidni vložki, udarni vijaki, vijaki po risbi in private label pakiranje. Dobava v 19 držav.",
        foundingDate: String(site.ustanovljeno),
        email: site.email,
        telephone: site.telefon,
        vatID: site.podjetje.davcna,
        taxID: site.podjetje.davcna,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Obrtniška ulica 14",
          postalCode: "3240",
          addressLocality: "Šmarje pri Jelšah",
          addressCountry: "SI",
        },
        location: site.lokacije.map((l) => ({
          "@type": "Place",
          name: `AS system — ${l.naziv}`,
          description: l.vloga,
          address: l.naslov,
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: site.telefon,
            email: site.email,
            availableLanguage: ["sl", "en", "de", "hr"],
          },
        ],
        brand: znamke.map((z) => ({ "@type": "Brand", name: z })),
        knowsAbout: [
          "pritrdilna tehnika",
          "jeklena sidra za beton",
          "zidni vložki",
          "kemična sidra",
          "vijačno blago DIN ISO",
          "hladno kovanje",
          "private label pakiranje",
          "vijaki po risbi",
        ],
        areaServed: ["SI", "HR", "AT", "DE", "Europe"],
        sameAs: Object.values(site.druzbena),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#splet`,
        url: site.url,
        name: "AS system",
        inLanguage: ["sl", "en", "de", "hr"],
        publisher: { "@id": `${site.url}/#podjetje` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.url}/iskanje?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

// Drobtine: [[naziv, pot], ...]
export function podatkiDrobtin(koraki) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: koraki.map(([name, pot], n) => ({
      "@type": "ListItem",
      position: n + 1,
      name,
      item: abs(pot),
    })),
  };
}

// Izdelek (brez cen — cene vidijo samo B2B kupci)
export function podatkiIzdelka({ i, pot, slike = [], artikli = [] }) {
  const sku = artikli.map((a) => a.sifra).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: i.naziv,
    description: i.seo_opis ?? i.kratek_opis ?? undefined,
    url: abs(pot),
    image: slike.map(abs).filter(Boolean).slice(0, 6),
    brand: i.znamka ? { "@type": "Brand", name: i.znamka } : undefined,
    manufacturer: { "@id": `${site.url}/#podjetje` },
    sku: sku[0],
    ...(i.eta_stevilka ? { additionalProperty: [{ "@type": "PropertyValue", name: "ETA", value: i.eta_stevilka }] } : {}),
  };
}
