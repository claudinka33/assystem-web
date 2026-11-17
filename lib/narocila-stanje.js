// Barva in oznaka stanja naročila (admin): novo, čaka na plačilo, v obdelavi, odposlano, zaključeno, preklicano
const VNAPREJ = new Set(["predracun", "kartica", "paypal"]);

export function stanjeNarocila(n) {
  const s = n?.status;
  if (s === "preklicano") return { oznaka: "preklicano", razred: "zn-preklic" };
  if (s === "zaključeno") return { oznaka: "zaključeno", razred: "zn-koncano" };
  if (VNAPREJ.has(n?.nacin_placila) && n?.status_placila !== "plačano") return { oznaka: "čaka na plačilo", razred: "zn-placilo" };
  if (s === "novo") return { oznaka: "novo", razred: "zn-novo" };
  if (s === "odposlano") return { oznaka: "odposlano", razred: "zn-poslano" };
  return { oznaka: s || "—", razred: "zn-obdelava" }; // potrjeno, v pripravi
}

export const STANJA_B2B = {
  caka_odobritev: { oznaka: "čaka na odobritev", razred: "zn-placilo" },
  preverjanje: { oznaka: "preverjanje v Vascu", razred: "zn-obdelava" },
  aktiven: { oznaka: "aktiven", razred: "zn-koncano" },
  zavrnjen: { oznaka: "zavrnjen", razred: "zn-preklic" },
};
