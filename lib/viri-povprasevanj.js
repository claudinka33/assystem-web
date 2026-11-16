// Od kod je prišlo povpraševanje (stolpec povprasevanja.vir) -> oznaka za admin in statistiko.
const VIRI = {
  "pop-up B2B": ["Pop-up B2B", "popup"],
  izdelek: ["Stran izdelka", "izdelek"],
  kontakt: ["Obrazec za povpraševanje", "obrazec"],
  "rok-dobave-b2b": ["Rok dobave · B2B", "izdelek"],
  "rok-dobave": ["Rok dobave", "izdelek"],
  katalogi: ["Katalogi in gradiva", "drugo"],
  certifikat: ["Certifikat", "izdelek"],
  "private-label": ["Private label", "obrazec"],
  "vijaki-po-narocilu": ["Vijaki po naročilu", "obrazec"],
  trgovci: ["Za trgovce", "obrazec"],
  iskanje: ["Iskanje", "drugo"],
  cenik: ["Cenik", "drugo"],
};

export function virPovprasevanja(vir) {
  const v = String(vir ?? "").trim();
  if (VIRI[v]) return { oznaka: VIRI[v][0], skupina: VIRI[v][1] };
  if (v.startsWith("igra")) return { oznaka: "Igrica na strani", skupina: "drugo" };
  if (!v) return { oznaka: "Obrazec za povpraševanje", skupina: "obrazec" };
  return { oznaka: `Stran: ${v}`, skupina: "drugo" };
}

export const SKUPINE_VIROV = [
  ["popup", "Pop-up"],
  ["izdelek", "Izdelek"],
  ["obrazec", "Obrazec"],
  ["drugo", "Drugo"],
];
