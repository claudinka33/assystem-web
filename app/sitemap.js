import { pridobiKategorije, pridobiNovice } from "@/lib/podatki";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const strani = [
    "", "/program", "/asfix", "/private-label", "/proizvodnja", "/kakovost",
    "/distributerji", "/o-nas", "/katalogi", "/aktualno", "/zaposlitev",
    "/kontakt", "/splosni-pogoji", "/zasebnost",
  ];

  const zdaj = new Date();
  const { seznam } = await pridobiKategorije();
  const novice = await pridobiNovice(50);

  return [
    ...strani.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: zdaj,
      changeFrequency: p === "" ? "weekly" : "monthly",
      priority: p === "" ? 1 : 0.7,
    })),
    ...seznam.map((k) => ({
      url: `${site.url}/program/${k.slug}`,
      lastModified: zdaj,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...novice.map((n) => ({
      url: `${site.url}/aktualno/${n.slug}`,
      lastModified: n.objavljeno_dne ? new Date(n.objavljeno_dne) : zdaj,
      changeFrequency: "yearly",
      priority: 0.5,
    })),
  ];
}
