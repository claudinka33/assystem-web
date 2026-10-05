// Skupne vrednosti za pravne strani
export const VELJA_OD = "5. 10. 2026";
export const IRPS_SEZNAM = "https://podatki.gov.si/dataset/register-izvajalcev-izvensodnega-resevanja-potrosniskih-sporov";
export const eur0 = (x) => new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(x);

export const PRAVNE = [
  { pot: "/splosni-pogoji", naziv: "Splošni pogoji poslovanja" },
  { pot: "/nacini-placila", naziv: "Načini plačila" },
  { pot: "/dostava", naziv: "Dostava in pošiljanje" },
  { pot: "/odstop-od-pogodbe", naziv: "Odstop od pogodbe in vračilo" },
  { pot: "/reklamacije", naziv: "Reklamacije in jamstvo" },
  { pot: "/zasebnost", naziv: "Varstvo osebnih podatkov" },
  { pot: "/izjava-o-dostopnosti", naziv: "Izjava o dostopnosti" },
  { pot: "/pravna-obvestila", naziv: "Podatki o podjetju" },
];
