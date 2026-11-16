// Nastavitve pop-upa »Kupujete za podjetje?« (urejanje: Admin → Prodaja → Pop-up).
// Shranjeno v nastavitve.popup_b2b kot JSON; manjkajoča polja vzamejo privzeto vrednost.
export const KLJUC_POPUP = "popup_b2b";

export const PRIVZETO_POPUP = {
  vklopljen: true,
  zakasnitev: 15, // sekund na strani
  premor: 7, // dni se ne pokaže po zaprtju
  znacka: "B2B",
  naslovLevo: "Cene za podjetja",
  alineje: ["Ponudba v 1–2 delovnih dneh", "Posebne cene in rabati", "Plačilo na račun", "Lastna proizvodnja od 1993"],
  nadnaslov: "Pritrdilna tehnika ASfix · vijačno blago ASco",
  naslov: "Kupujete za podjetje?",
  opis: "Pustite kontakt — v **1–2 delovnih dneh** vas pokličemo in pripravimo **ponudbo s cenami za vaše podjetje**.",
  gumb: "Pošljite mi ponudbo",
  hvalaNaslov: "Hvala! Prejeli smo vaš kontakt.",
  hvalaBesedilo: "V 1–2 delovnih dneh vas kontaktiramo in pripravimo ponudbo za vaše podjetje.",
  brezStrani: ["/blagajna", "/kosarica", "/b2b", "/v-pripravi", "/zaposlitev"],
};

export function razcleniPopup(vrednost) {
  let v = {};
  try {
    v = vrednost ? JSON.parse(vrednost) : {};
  } catch {}
  return { ...PRIVZETO_POPUP, ...(v && typeof v === "object" ? v : {}) };
}

// Besedila, ki se prevedejo v /en in /de
export const BESEDILA_POPUP = ["naslovLevo", "nadnaslov", "naslov", "opis", "gumb", "hvalaNaslov", "hvalaBesedilo"];
