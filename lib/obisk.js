// Razvrščanje obiskov: od kod (kanal/vir), kateri trg, kakšna naprava.
// Uporablja ga /api/obisk (zapis) in administracija (prikaz).

// Trgi po direktorjevi strategiji (SLO + HR lastni komercialisti, ostalo prek distributerjev).
export const TRGI = [
  { ime: "Slovenija", drzave: ["SI"] },
  { ime: "Hrvaška", drzave: ["HR"] },
  { ime: "EX-YU", drzave: ["BA", "RS", "ME", "MK", "XK", "AL"] },
  { ime: "DACH", drzave: ["DE", "AT", "CH", "LI"] },
  { ime: "Skandinavija", drzave: ["SE", "NO", "DK", "FI", "IS"] },
  { ime: "Baltik", drzave: ["EE", "LV", "LT"] },
  { ime: "Vzhodna Evropa", drzave: ["PL", "CZ", "SK", "HU", "RO", "BG", "UA", "MD", "BY", "RU"] },
  { ime: "Ostala Evropa", drzave: ["IT", "FR", "ES", "PT", "NL", "BE", "LU", "IE", "GB", "GR", "CY", "MT", "TR", "MC", "SM", "AD"] },
];

export function trgDrzave(iso) {
  if (!iso) return "Neznano";
  const t = TRGI.find((x) => x.drzave.includes(iso));
  return t ? t.ime : "Ostali svet";
}

export const KANALI = ["Iskalniki", "Plačani oglasi", "Družbena omrežja", "E-pošta", "AI asistenti", "Tisk / QR", "Napotitve", "Direktno"];

const ISKALNIKI = [
  [/(^|\.)google\./, "Google"], [/(^|\.)bing\.com$/, "Bing"], [/duckduckgo\./, "DuckDuckGo"],
  [/(^|\.)yahoo\./, "Yahoo"], [/ecosia\./, "Ecosia"], [/yandex\./, "Yandex"],
  [/seznam\.cz$/, "Seznam"], [/baidu\.com$/, "Baidu"], [/(^|\.)qwant\./, "Qwant"], [/brave\.com$/, "Brave"],
];
const DRUZBENA = [
  [/facebook\.com$|(^|\.)fb\.(me|com)$/, "Facebook"], [/instagram\.com$/, "Instagram"],
  [/linkedin\.com$|lnkd\.in$/, "LinkedIn"], [/(^|\.)t\.co$|twitter\.com$|(^|\.)x\.com$/, "X"],
  [/youtube\.com$|youtu\.be$/, "YouTube"], [/tiktok\.com$/, "TikTok"], [/pinterest\./, "Pinterest"],
  [/whatsapp\./, "WhatsApp"], [/reddit\.com$/, "Reddit"], [/xing\.com$/, "Xing"],
];
const AI = [
  [/chatgpt\.com$|openai\.com$/, "ChatGPT"], [/perplexity\.ai$/, "Perplexity"], [/claude\.ai$/, "Claude"],
  [/gemini\.google\.com$/, "Gemini"], [/copilot\.microsoft\.com$/, "Copilot"],
];
const POSTA = [/mail\./, /outlook\./, /webmail/, /mail\.google\.com$/];

function najdi(seznam, host) {
  const z = seznam.find(([re]) => re.test(host));
  return z ? z[1] : null;
}

const VIR_UTM = {
  google: "Google", fb: "Facebook", facebook: "Facebook", ig: "Instagram", instagram: "Instagram",
  linkedin: "LinkedIn", li: "LinkedIn", youtube: "YouTube", tiktok: "TikTok", bing: "Bing",
  newsletter: "E-novice", enovice: "E-novice", "e-novice": "E-novice", resend: "E-novice", klaviyo: "E-novice",
};

// Vrne { kanal, vir } iz referrerja in UTM parametrov.
export function razvrstiVir({ refHost, lastniHost, utm = {}, placanKlik = false, notranje = false }) {
  const src = (utm.source || "").toLowerCase().trim();
  const med = (utm.medium || "").toLowerCase().trim();
  const virUtm = src ? VIR_UTM[src] || utm.source : null;

  if (src || med) {
    if (/cpc|ppc|paid|ads?$|display|banner|cpm/.test(med) || placanKlik)
      return { kanal: "Plačani oglasi", vir: virUtm || "Oglas" };
    if (/e-?mail|newsletter|e-?novice/.test(med) || VIR_UTM[src] === "E-novice")
      return { kanal: "E-pošta", vir: virUtm || "E-pošta" };
    if (/social|social-network|sm$|organic_social/.test(med) || ["Facebook", "Instagram", "LinkedIn", "YouTube", "TikTok"].includes(virUtm))
      return { kanal: "Družbena omrežja", vir: virUtm || "Družbena omrežja" };
    if (/qr|print|tisk|letak|katalog|sejem/.test(med)) return { kanal: "Tisk / QR", vir: virUtm || src || "QR koda" };
    if (med === "organic") return { kanal: "Iskalniki", vir: virUtm || "Iskalnik" };
    return { kanal: "Napotitve", vir: virUtm || src || med };
  }

  if (placanKlik) {
    const v = refHost ? najdi(ISKALNIKI, refHost) || najdi(DRUZBENA, refHost) : null;
    return { kanal: "Plačani oglasi", vir: v || "Oglas" };
  }

  if (!refHost) return notranje ? { kanal: "Interno", vir: "Interno" } : { kanal: "Direktno", vir: "Direktno" };

  const goli = (h) => h.replace(/^www\./, "");
  if (lastniHost && (goli(refHost) === goli(lastniHost) || goli(refHost).endsWith("assystem.si")))
    return { kanal: "Interno", vir: "Interno" };

  let v;
  if ((v = najdi(AI, refHost))) return { kanal: "AI asistenti", vir: v };
  if ((v = najdi(ISKALNIKI, refHost))) return { kanal: "Iskalniki", vir: v };
  if ((v = najdi(DRUZBENA, refHost))) return { kanal: "Družbena omrežja", vir: v };
  if (POSTA.some((re) => re.test(refHost))) return { kanal: "E-pošta", vir: "E-pošta" };
  return { kanal: "Napotitve", vir: goli(refHost) };
}

export function jeBot(ua) {
  if (!ua) return true;
  return /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime|monitor|preview|facebookexternalhit|embedly|curl|wget|python|axios|node-fetch|go-http|java\/|vercel|semrush|ahrefs|mj12|petal|bytespider|gptbot|claudebot|perplexitybot/i.test(ua);
}

export function napravaIzUA(ua = "", sirina = 0) {
  let naprava = "Računalnik";
  if (/ipad|tablet|kindle|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) naprava = "Tablica";
  else if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua)) naprava = "Mobilni";
  else if (sirina && sirina < 768) naprava = "Mobilni";

  let brskalnik = "Drugo";
  if (/edg\//i.test(ua)) brskalnik = "Edge";
  else if (/opr\/|opera/i.test(ua)) brskalnik = "Opera";
  else if (/samsungbrowser/i.test(ua)) brskalnik = "Samsung";
  else if (/firefox|fxios/i.test(ua)) brskalnik = "Firefox";
  else if (/chrome|crios/i.test(ua)) brskalnik = "Chrome";
  else if (/safari/i.test(ua)) brskalnik = "Safari";

  let os = "Drugo";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  return { naprava, brskalnik, os };
}
