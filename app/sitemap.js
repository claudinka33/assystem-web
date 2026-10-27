import { pridobiKategorije, pridobiNovice, skriteZnamke } from "@/lib/podatki";
import { ZNAMKE_INFO } from "@/lib/znamke";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const strani = [
    "", "/program", "/asfix", "/asco", "/mungo", "/silvermate", "/hammex", "/za-trgovce", "/private-label", "/vijaki-po-narocilu", "/proizvodnja", "/kakovost",
    "/distributerji", "/o-nas", "/katalogi", "/aktualno", "/zaposlitev",
    "/kontakt", "/b2b", "/splosni-pogoji", "/zasebnost", "/nacini-placila", "/dostava",
    "/odstop-od-pogodbe", "/reklamacije", "/izjava-o-dostopnosti", "/pravna-obvestila",
  ];

  const skrite = (await skriteZnamke()).map((z) => ZNAMKE_INFO[z]?.pot);
  const zdaj = new Date();
  const { seznam } = await pridobiKategorije();
  const novice = await pridobiNovice(50);

  return [
    ...strani.filter((p) => !skrite.includes(p)).map((p) => ({
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
