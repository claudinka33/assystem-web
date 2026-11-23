// Predloge e-pošte, ki jo dobijo stranke (in zaposleni). Urejanje: Admin → E-mailing → Sporočila strankam.
// Shranjeno v nastavitve.email_predloge kot JSON { kljuc: { polje: vrednost } }; manjkajoča polja vzamejo privzeto.
// Brez strežniških importov — uporablja ga tudi predogled v brskalniku.
import { site } from "@/lib/site";

export const KLJUC_PREDLOGE = "email_predloge";
export const KONTAKT = "info@as-system.si";

// Polja vsake predloge (vrstni red v sporočilu).
export const POLJA = [
  { k: "zadeva", oznaka: "Zadeva", vrstice: 1 },
  { k: "naslov", oznaka: "Naslov v sporočilu (rdeč)", vrstice: 1 },
  { k: "uvod", oznaka: "Besedilo", vrstice: 5 },
  { k: "gumb", oznaka: "Besedilo gumba", vrstice: 1, samoZGumbom: true },
  { k: "nadaljevanje", oznaka: "Besedilo pod gumbom / pod tabelo", vrstice: 4 },
  { k: "opomba", oznaka: "Drobni tisk (siv)", vrstice: 3 },
];

export const PREDLOGE = [
  {
    kljuc: "b2b_potrditev",
    skupina: "B2B portal",
    naziv: "Potrditev e-naslova ob registraciji",
    kdaj: "Kupec se sam registrira na /b2b/registracija.",
    gumb: true,
    spremenljivke: ["email"],
    privzeto: {
      zadeva: "Potrdite e-naslov: B2B dostop AS system",
      naslov: "Potrdite svoj e-naslov",
      uvod: "Hvala za registracijo v B2B spletno trgovino AS system. Za nadaljevanje potrdite svoj e-naslov:",
      gumb: "Potrdi e-naslov",
      nadaljevanje: "Po potrditvi vašo prijavo pregledamo in dostop odobrimo ročno, praviloma v 1 delovnem dnevu. Ko je dostop odobren, prejmete e-pošto.",
      opomba: "Če se niste registrirali vi, to sporočilo prezrite.",
    },
  },
  {
    kljuc: "b2b_aktiviran",
    skupina: "B2B portal",
    naziv: "B2B dostop odobren",
    kdaj: "Tjaša v administraciji odobri B2B kupca.",
    gumb: true,
    spremenljivke: ["ime", "podjetje", "rok_placila"],
    privzeto: {
      zadeva: "Vaš B2B dostop je aktiven, AS system",
      naslov: "B2B dostop je aktiven",
      uvod: "Pozdravljeni {ime},\n\nvaš B2B račun za **{podjetje}** je aktiven. Ob prijavi v spletni trgovini vidite svoje cene (brez DDV) in naročate na račun {rok_placila}.",
      gumb: "Prijava v B2B trgovino",
      nadaljevanje: "",
      opomba: "",
    },
  },
  {
    kljuc: "b2b_povabilo",
    skupina: "B2B portal",
    naziv: "Vabilo v B2B (pošlje AS system)",
    kdaj: "V administraciji kliknete »Pošlji vabilo« pri B2B kupcu.",
    gumb: true,
    spremenljivke: ["ime", "podjetje", "email"],
    privzeto: {
      zadeva: "Vabilo v B2B spletno trgovino AS system",
      naslov: "Vaš B2B dostop je pripravljen",
      uvod: "Pozdravljeni {ime},\n\nza podjetje **{podjetje}** smo vam odprli B2B dostop do spletne trgovine AS system. Potrdite e-naslov in si nastavite geslo:",
      gumb: "Potrdi in nastavi geslo",
      nadaljevanje: "Po prijavi vidite svoje cene (brez DDV) in naročate na račun. Za prijavo uporabite ta e-naslov: **{email}**.",
      opomba: "Če povezava ne deluje več, na strani za prijavo kliknite »Pozabljeno geslo« in poslali vam bomo novo.",
    },
  },
  {
    kljuc: "b2b_ponastavitev",
    skupina: "B2B portal",
    naziv: "Pozabljeno geslo",
    kdaj: "Kupec klikne »Pozabljeno geslo« pri prijavi.",
    gumb: true,
    spremenljivke: ["email"],
    privzeto: {
      zadeva: "Novo geslo: B2B dostop AS system",
      naslov: "Nastavite novo geslo",
      uvod: "Prejeli smo zahtevo za novo geslo za vaš B2B račun.",
      gumb: "Nastavi novo geslo",
      nadaljevanje: "",
      opomba: "Povezava velja 1 uro. Če zahteve niste poslali vi, sporočilo prezrite.",
    },
  },
  {
    kljuc: "narocilo_potrdilo",
    skupina: "Naročila",
    naziv: "Potrdilo naročila",
    kdaj: "Kupec odda naročilo v spletni trgovini. Tabela artiklov in podatki o dostavi se dodajo samodejno pod besedilo.",
    gumb: false,
    spremenljivke: ["stevilka", "navodilo", "skupaj"],
    opisSpremenljivk: { navodilo: "navodilo za plačilo/prevzem (samodejno glede na način plačila)" },
    privzeto: {
      zadeva: "Potrdilo naročila {stevilka}: AS system",
      naslov: "Hvala za naročilo!",
      uvod: "Prejeli smo vaše naročilo **{stevilka}**. {navodilo}",
      gumb: "",
      nadaljevanje: "",
      opomba: "",
    },
  },
  {
    kljuc: "povprasevanje_potrdilo",
    skupina: "Obrazci",
    naziv: "Potrdilo prejetega povpraševanja",
    kdaj: "Stranka odda povpraševanje (kontakt, izdelek, private label, vijaki po naročilu …). Privzeto izklopljeno.",
    gumb: false,
    izklopljivo: true,
    privzetoVklop: false,
    spremenljivke: ["ime", "podjetje"],
    privzeto: {
      zadeva: "Prejeli smo vaše povpraševanje: AS system",
      naslov: "Hvala za povpraševanje!",
      uvod: "Pozdravljeni {ime},\n\nprejeli smo vaše povpraševanje. Odgovorimo vam v najkrajšem možnem času, praviloma v 1–2 delovnih dneh.",
      gumb: "",
      nadaljevanje: "Če želite kaj dodati, preprosto odgovorite na to sporočilo.",
      opomba: "",
    },
  },
  {
    kljuc: "zaposlitev_potrdilo",
    skupina: "Obrazci",
    naziv: "Potrdilo prijave na delovno mesto",
    kdaj: "Kandidat odda prijavo na /zaposlitev. Privzeto izklopljeno.",
    gumb: false,
    izklopljivo: true,
    privzetoVklop: false,
    spremenljivke: ["ime", "delovno_mesto"],
    privzeto: {
      zadeva: "Prejeli smo vašo prijavo: AS system",
      naslov: "Hvala za prijavo!",
      uvod: "Pozdravljeni {ime},\n\nprejeli smo vašo prijavo{delovno_mesto}. Pregledali jo bomo in se vam oglasili.",
      gumb: "",
      nadaljevanje: "",
      opomba: "Vaše podatke hranimo skladno s politiko zasebnosti na assystem.si.",
    },
  },
  {
    kljuc: "admin_vabilo",
    skupina: "Zaposleni",
    naziv: "Dostop do administracije",
    kdaj: "V Sistem → Uporabniki dodate zaposlenega. Seznam dodeljenih delov se doda samodejno pod besedilo.",
    gumb: true,
    spremenljivke: ["ime", "povabil", "email"],
    privzeto: {
      zadeva: "Dostop do administracije spletne strani assystem.si",
      naslov: "Pozdravljen/-a, {ime}!",
      uvod: "{povabil} ti je odprl/-a dostop do administracije spletne strani **assystem.si**.\n\nUrejaš lahko:",
      gumb: "Odpri administracijo",
      nadaljevanje: "Prijaviš se z gumbom **Prijava z Microsoft**: s svojim službenim računom ({email}), brez novega gesla.",
      opomba: "Do administracije prideš tudi iz app.assystem.si, ikona 🌐 v glavi, ob Odjavi.",
    },
  },
];

export const OPISI_SPREMENLJIVK = {
  ime: "ime in priimek",
  podjetje: "naziv podjetja",
  email: "e-naslov prejemnika",
  rok_placila: "»z rokom plačila 30 dni« (če je rok nastavljen)",
  stevilka: "številka naročila",
  skupaj: "znesek naročila",
  delovno_mesto: "» za delovno mesto X« (če je izbrano)",
  povabil: "kdo je odprl dostop",
};

export function predlogaPoKljucu(kljuc) {
  return PREDLOGE.find((p) => p.kljuc === kljuc);
}

// Shranjene spremembe + privzeto → končna predloga.
export function zdruziPredlogo(kljuc, shranjeno) {
  const p = predlogaPoKljucu(kljuc);
  const s = (shranjeno && typeof shranjeno === "object" && shranjeno[kljuc]) || {};
  const out = { ...p.privzeto };
  for (const { k } of POLJA) if (typeof s[k] === "string") out[k] = s[k];
  out.vklopljeno = p.izklopljivo ? (typeof s.vklopljeno === "boolean" ? s.vklopljeno : p.privzetoVklop) : true;
  return out;
}

export function razcleniPredloge(vrednost) {
  try {
    const v = vrednost ? JSON.parse(vrednost) : {};
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const pocisti = (s) => s.replace(/[ \t]+([,.!?:;])/g, "$1").replace(/,([!?])/g, "$1").replace(/[ \t]{2,}/g, " "); // »Pozdravljeni ,« → »Pozdravljeni,«

// Navadno besedilo (zadeva): zamenja {spremenljivke}, brez HTML.
function vstavi(besedilo, vrednosti) {
  return pocisti(String(besedilo ?? "").replace(/\{(\w+)\}/g, (_, k) => String(vrednosti[k] ?? "")));
}

// Besedilo → HTML odstavki. **x** = krepko, prazna vrstica = nov odstavek.
// Vrednosti v `html` se vstavijo nespremenjene (že HTML), ostale se ubežijo.
function vHtml(besedilo, vrednosti, html, slog = "") {
  let s = String(besedilo ?? "");
  if (!s.trim()) return "";
  s = esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  s = pocisti(s.replace(/\{(\w+)\}/g, (_, k) => (k in html ? html[k] : esc(vrednosti[k] ?? ""))));
  return s
    .split(/\n\s*\n/)
    .filter((o) => o.trim())
    .map((odst) => `<p style="margin:0 0 12px;${slog}">${odst.trim().replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function zadevaIz(t, vrednosti = {}) {
  return vstavi(t.zadeva, vrednosti).trim();
}

// Sestavi HTML sporočila. `vmes` = samodejni del (tabela naročila, seznam …) med besedilom in nadaljevanjem.
export function sestaviHtml(t, { vrednosti = {}, html = {}, povezava = null, vmes = "" } = {}) {
  const gumb =
    povezava && t.gumb
      ? `<p style="margin:22px 0;"><a href="${povezava}" style="background:#C8102E;color:#fff;padding:12px 22px;text-decoration:none;font-weight:bold;display:inline-block;">${esc(vstavi(t.gumb, vrednosti))}</a></p>`
      : "";
  return `<div style="max-width:640px;font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1d21;">
    <h2 style="color:#C8102E;margin:0 0 16px;">${esc(vstavi(t.naslov, vrednosti))}</h2>
    ${vHtml(t.uvod, vrednosti, html)}
    ${vmes}
    ${gumb}
    ${vHtml(t.nadaljevanje, vrednosti, html)}
    ${vHtml(t.opomba, vrednosti, html, "font-size:13px;color:#6e7276;")}
    <p style="font-size:13px;color:#6e7276;margin-top:28px;">AS system d.o.o. · ${esc(site.lokacije[0].naslov)} · ${esc(site.telefon)} · ${esc(KONTAKT)}</p>
  </div>`;
}

// Primeri vrednosti za predogled v administraciji.
export const PRIMERI = {
  ime: "Janez Novak",
  podjetje: "Gradnje Novak d.o.o.",
  email: "janez@gradnje-novak.si",
  rok_placila: "z rokom plačila 30 dni",
  stevilka: "SP-2026-0142",
  skupaj: "245,80 €",
  delovno_mesto: " za delovno mesto Komercialist na terenu",
  povabil: "Claudia Seidl",
};
export const PRIMERI_HTML = {
  navodilo: "Račun prejmete po e-pošti ali po pošti (rok plačila 30 dni). Ko naročilo odpošljemo, vas obvestimo.",
};
