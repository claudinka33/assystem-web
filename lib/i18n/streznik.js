// Jezik zahteve in ovoji za strani (samo strežnik).
import { headers } from "next/headers";
import { JEZIKI, TUJI, kljuc, potZJezikom } from "./skupno";
import { prevediDrevo } from "./drevo";
import { prevedi } from "./prevajalnik";

/** Jezik trenutne zahteve: "sl" (privzeto), "en" ali "de". Nastavi ga proxy.js. */
export async function jezik() {
  try {
    const h = await headers();
    const j = h.get("x-jezik");
    return JEZIKI.includes(j) ? j : "sl";
  } catch {
    return "sl";
  }
}

/** Ovoj strani: v /en in /de se izrisana stran samodejno prevede. */
export function prevedenaStran(Stran) {
  async function PrevedenaStran(props) {
    const j = await jezik();
    const vsebina = await Stran(props);
    return j === "sl" ? vsebina : prevediDrevo(vsebina, j);
  }
  PrevedenaStran.displayName = `Prevedeno(${Stran.name || "Stran"})`;
  return PrevedenaStran;
}

/** Prevedi besedila v metapodatkih (naslov, opis) in dodaj jezikovne različice (hreflang). */
export async function prevediMetadata(meta) {
  if (!meta) return meta;
  const j = await jezik();
  const kanonicna = meta.alternates?.canonical;
  const out = { ...meta };
  if (typeof kanonicna === "string" && kanonicna.startsWith("/")) {
    out.alternates = {
      ...meta.alternates,
      canonical: potZJezikom(kanonicna, j),
      languages: {
        sl: kanonicna,
        en: potZJezikom(kanonicna, "en"),
        de: potZJezikom(kanonicna, "de"),
        hr: potZJezikom(kanonicna, "hr"),
        "x-default": kanonicna,
      },
    };
  }
  if (j === "sl") return out;

  const nizi = [];
  const dodaj = (s) => typeof s === "string" && s.trim() && nizi.push(s);
  const naslov = meta.title;
  if (typeof naslov === "string") dodaj(naslov);
  else if (naslov && typeof naslov === "object") {
    dodaj(naslov.default);
    dodaj(naslov.absolute);
  }
  dodaj(meta.description);
  dodaj(meta.openGraph?.title);
  dodaj(meta.openGraph?.description);
  const slovar = await prevedi(j, nizi, { vir: "metapodatki" });
  const t = (s) => (typeof s === "string" ? slovar[kljuc(s)] ?? s : s);

  if (typeof naslov === "string") out.title = t(naslov);
  else if (naslov && typeof naslov === "object") out.title = { ...naslov, ...(naslov.default ? { default: t(naslov.default) } : {}), ...(naslov.absolute ? { absolute: t(naslov.absolute) } : {}) };
  if (meta.description) out.description = t(meta.description);
  if (meta.openGraph) {
    out.openGraph = {
      ...meta.openGraph,
      locale: j === "de" ? "de_DE" : j === "hr" ? "hr_HR" : "en_GB",
      ...(meta.openGraph.title ? { title: t(meta.openGraph.title) } : {}),
      ...(meta.openGraph.description ? { description: t(meta.openGraph.description) } : {}),
    };
  }
  return out;
}

export { TUJI };
