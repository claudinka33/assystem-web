import { kategorije, site } from "@/lib/site";

// Sitemap se zgradi sam. Ko dodaš novo stran, jo dopiši v seznam spodaj.
export default function sitemap() {
  const strani = [
    "",
    "/program",
    "/asfix",
    "/private-label",
    "/proizvodnja",
    "/kakovost",
    "/distributerji",
    "/o-nas",
    "/katalogi",
    "/aktualno",
    "/zaposlitev",
    "/kontakt",
    "/splosni-pogoji",
    "/zasebnost",
  ];

  const zdaj = new Date();

  return [
    ...strani.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: zdaj,
      changeFrequency: p === "" ? "weekly" : "monthly",
      priority: p === "" ? 1 : 0.7,
    })),
    ...kategorije.map((k) => ({
      url: `${site.url}/program/${k.slug}`,
      lastModified: zdaj,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
