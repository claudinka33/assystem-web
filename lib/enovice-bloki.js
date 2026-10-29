// E-novice: bloki → e-mail HTML (tabele, 600 px, inline stili — deluje v Outlooku,
// Gmailu, Apple Mailu). Uporablja se v brskalniku (živ predogled) in na strežniku.
// Celostna podoba: AS rdeča #CB2026, antracit #3F4140, podlaga s »šraufki«
// (rdeča ali antracit), Barlow / Barlow Condensed.

export const SPLET = "https://assystem.si";
const PODLAGA = {
  antracit: { slika: `${SPLET}/mailing/tx1/podlaga_antracit.jpg`, barva: "#1a1e21" },
  rdeca: { slika: `${SPLET}/mailing/tx1/podlaga_rdeca.jpg`, barva: "#cd2026" },
};
const LOGO = `${SPLET}/mailing/tx1/asfix_logo_negativ.png`;
const RDECA = "#cb2026";
const ANTRACIT = "#3f4140";
const SIVA = "#6e767e";
const NASLOVNA = "'Barlow Condensed','Arial Narrow',Arial,Helvetica,sans-serif";
const TELO = "Barlow,Arial,Helvetica,sans-serif";
export const UNSUB = "{{{RESEND_UNSUBSCRIBE_URL}}}";

// ---------------- definicije blokov (urejevalnik jih bere za polja) ----------------

export const TIPI_BLOKOV = {
  glava: {
    ime: "Glava s šraufki",
    opis: "Logo, velik naslov in uvod na podlagi z vijaki",
    privzeto: {
      ozadje: "antracit",
      oznaka1: "JEKLENA SIDRA",
      oznaka2: "TXm1 · GREENTEC® / A4",
      naslov: "VISOKOZMOGLJIVO SIDRO",
      naslov2: "ZA ZAHTEVNA PRITRJEVANJA",
      besedilo: "Sidro **ASfix TXm1** z evropsko tehnično oceno za razpokan in nerazpokan beton.",
      gumb: "",
      povezava: "",
    },
    polja: [
      ["ozadje", "Ozadje", "podlaga"],
      ["oznaka1", "Oznaka desno zgoraj", "text"],
      ["oznaka2", "Oznaka pod njo", "text"],
      ["naslov", "Naslov (bel)", "text"],
      ["naslov2", "Naslov – 2. vrstica (rdeča / bela na rdeči)", "text"],
      ["besedilo", "Uvod", "textarea"],
      ["gumb", "Gumb (neobvezno)", "text"],
      ["povezava", "Povezava gumba", "url"],
    ],
  },
  naslov: {
    ime: "Naslov",
    opis: "Naslov sekcije ali mala oznaka",
    privzeto: { besedilo: "EN IZDELEK · DVE IZVEDBI", slog: "oznaka", poravnava: "levo" },
    polja: [
      ["besedilo", "Besedilo", "text"],
      ["slog", "Slog", "izbira", [["oznaka", "Mala oznaka (razprto)"], ["velik", "Velik naslov"]]],
      ["poravnava", "Poravnava", "izbira", [["levo", "Levo"], ["sredina", "Sredina"]]],
    ],
  },
  besedilo: {
    ime: "Besedilo",
    opis: "Odstavek; **krepko**, [povezava](https://…)",
    privzeto: { besedilo: "Spoštovani,\n\nnapišite besedilo. Za **krepko** uporabite zvezdice, za povezavo [besedilo](https://assystem.si).", poravnava: "levo" },
    polja: [
      ["besedilo", "Besedilo", "textarea"],
      ["poravnava", "Poravnava", "izbira", [["levo", "Levo"], ["sredina", "Sredina"]]],
    ],
  },
  slika: {
    ime: "Slika",
    opis: "Fotografija ali grafika, lahko s povezavo",
    privzeto: { url: "", alt: "", povezava: "", robovi: "da" },
    polja: [
      ["url", "Slika", "slika"],
      ["alt", "Opis slike (alt)", "text"],
      ["povezava", "Povezava ob kliku", "url"],
      ["robovi", "Odmik od robov", "izbira", [["da", "Z robovi"], ["ne", "Čez celo širino"]]],
    ],
  },
  izdelki: {
    ime: "Izdelki",
    opis: "1–3 kartice izdelkov (tudi iz kataloga)",
    privzeto: {
      elementi: [
        { slika: "", naslov: "TXm1", podnaslov: "GREENTEC® ZAŠČITA", opis: "Cink-nikljev premaz – več kot 750 h v slani komori.", povezava: "" },
        { slika: "", naslov: "TXm1r", podnaslov: "NERJAVNO JEKLO A4", opis: "A4/316 nerjavno jeklo za notranjo in zunanjo uporabo.", povezava: "" },
      ],
    },
    polja: [["elementi", "Izdelki", "izdelki"]],
  },
  gumb: {
    ime: "Gumb",
    opis: "Poziv k dejanju",
    privzeto: { besedilo: "Poglejte ponudbo", povezava: SPLET, slog: "rdec", poravnava: "sredina" },
    polja: [
      ["besedilo", "Besedilo", "text"],
      ["povezava", "Povezava", "url"],
      ["slog", "Slog", "izbira", [["rdec", "Rdeč"], ["antracit", "Antracit"], ["obroba", "Rdeča obroba"]]],
      ["poravnava", "Poravnava", "izbira", [["sredina", "Sredina"], ["levo", "Levo"]]],
    ],
  },
  znacke: {
    ime: "Značke",
    opis: "ETA, C1/C2, R120 … (prva polna)",
    privzeto: { besedilo: "ETA OPCIJA 1, C1/C2, R120" },
    polja: [["besedilo", "Značke, ločene z vejico", "text"]],
  },
  pasica: {
    ime: "Pasica s šraufki",
    opis: "Poudarjen pas na podlagi z vijaki",
    privzeto: { ozadje: "rdeca", naslov: "POSEBNA PONUDBA ZA TRGOVCE", besedilo: "Ob prvem naročilu prodajna polica ASfix brezplačno.", gumb: "Pišite nam", povezava: "mailto:info@as-system.si" },
    polja: [
      ["ozadje", "Ozadje", "podlaga"],
      ["naslov", "Naslov", "text"],
      ["besedilo", "Besedilo", "textarea"],
      ["gumb", "Gumb (neobvezno)", "text"],
      ["povezava", "Povezava gumba", "url"],
    ],
  },
  kontakt: {
    ime: "Kontaktna oseba",
    opis: "Ime, vloga, telefon, e-pošta",
    privzeto: { ime: "", vloga: "Prodaja", telefon: "+386 3 800 70 00", email: "info@as-system.si", slika: "" },
    polja: [
      ["ime", "Ime in priimek", "text"],
      ["vloga", "Vloga", "text"],
      ["telefon", "Telefon", "text"],
      ["email", "E-pošta", "text"],
      ["slika", "Fotografija (neobvezno)", "slika"],
    ],
  },
  locilo: {
    ime: "Ločilo",
    opis: "Črta ali prazen prostor",
    privzeto: { slog: "crta" },
    polja: [["slog", "Slog", "izbira", [["crta", "Tanka črta"], ["rdeca", "Rdeča črta"], ["prostor", "Prazen prostor"]]]],
  },
  html: {
    ime: "Lastna HTML koda",
    opis: "Za posebne primere",
    privzeto: { koda: "<p style=\"margin:0\">HTML</p>" },
    polja: [["koda", "HTML koda", "koda"]],
  },
};

export const NOGA_JEZIKI = {
  sl: { odjava: "Odjava od e-novic", prejeli: "To sporočilo ste prejeli, ker ste naročeni na e-novice AS system.", splet: "assystem.si" },
  en: { odjava: "Unsubscribe", prejeli: "You received this email because you subscribed to AS system news.", splet: "assystem.si" },
  de: { odjava: "Abmelden", prejeli: "Sie erhalten diese E-Mail, weil Sie den AS system Newsletter abonniert haben.", splet: "assystem.si" },
  hr: { odjava: "Odjava s e-novosti", prejeli: "Ovu poruku primate jer ste prijavljeni na e-novosti AS system.", splet: "assystem.si" },
};

export function novBlok(tip) {
  const d = TIPI_BLOKOV[tip];
  return { id: Math.random().toString(36).slice(2, 10), tip, ...JSON.parse(JSON.stringify(d.privzeto)) };
}

export function zacetniBloki() {
  return {
    nastavitve: { jezik: "sl" },
    // stalni id-ji, da se strežniški in brskalniški izris ujemata
    bloki: ["glava", "naslov", "izdelki", "znacke", "besedilo", "gumb"].map((t, i) => ({ ...novBlok(t), id: `z${i + 1}` })),
  };
}

// ---------------- pomožne ----------------

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const varenUrl = (u) => {
  const s = String(u ?? "").trim();
  if (!s) return "";
  if (/^(https?:|mailto:|tel:)/i.test(s) || s === UNSUB) return s;
  if (s.startsWith("/")) return SPLET + s;
  return `https://${s}`;
};

// **krepko**, *ležeče*, [besedilo](url), prazna vrstica = nov odstavek
function oblikuj(besedilo, barva = ANTRACIT) {
  const odstavki = String(besedilo ?? "").trim().split(/\n\s*\n/);
  return odstavki
    .map((o) => {
      let h = esc(o);
      h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${esc(varenUrl(u.replace(/&amp;/g, "&")))}" style="color:${RDECA};text-decoration:underline">${t}</a>`);
      h = h.replace(/\*\*([^*]+)\*\*/g, `<strong style="color:${barva}">$1</strong>`);
      h = h.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      return h.replace(/\n/g, "<br>");
    })
    .filter(Boolean)
    .map((h, i, a) => `<p style="margin:0${i < a.length - 1 ? " 0 14px" : ""}">${h}</p>`)
    .join("");
}

const vrsta = (vsebina, { pad = "0 36px", bg = "#ffffff", attr = "" } = {}) =>
  `<tr${attr}><td style="padding:${pad};background:${bg}" bgcolor="${bg}">${vsebina}</td></tr>`;

function gumbHtml(besedilo, url, slog = "rdec", poravnava = "sredina") {
  if (!besedilo) return "";
  const barve = {
    rdec: { bg: RDECA, fg: "#ffffff", rob: RDECA },
    antracit: { bg: ANTRACIT, fg: "#ffffff", rob: ANTRACIT },
    obroba: { bg: "#ffffff", fg: RDECA, rob: RDECA },
    bel: { bg: "#ffffff", fg: ANTRACIT, rob: "#ffffff" },
  }[slog] || { bg: RDECA, fg: "#ffffff", rob: RDECA };
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${poravnava === "levo" ? "left" : "center"}" style="margin:${poravnava === "levo" ? "0" : "0 auto"}"><tr><td bgcolor="${barve.bg}" style="background:${barve.bg};border:2px solid ${barve.rob}"><a href="${esc(varenUrl(url) || SPLET)}" style="display:inline-block;padding:13px 28px;font-family:${NASLOVNA};font-size:17px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${barve.fg};text-decoration:none">${esc(besedilo)}</a></td></tr></table>`;
}

function podlagaCelica(ozadje, vsebina, pad) {
  const p = PODLAGA[ozadje] || PODLAGA.antracit;
  return `<td background="${p.slika}" bgcolor="${p.barva}" style="background:${p.barva} url('${p.slika}') center top / 600px auto repeat;padding:${pad}">${vsebina}</td>`;
}

// ---------------- posamezni bloki ----------------

const RISI = {
  glava(b) {
    const rdeca = b.ozadje === "rdeca";
    const naslov2 = b.naslov2
      ? `<div style="font-family:${NASLOVNA};font-size:44px;line-height:1.02;font-weight:800;text-transform:uppercase;color:${rdeca ? "#ffffff" : RDECA};margin:0">${esc(b.naslov2)}</div>`
      : "";
    const vsebina = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td valign="top"><img src="${LOGO}" width="160" alt="ASfix" style="display:block;width:160px;height:auto;border:0"></td>
    <td valign="top" align="right" style="font-family:${TELO};font-size:11px;letter-spacing:2.5px;line-height:1.6;color:#ffffff;text-transform:uppercase">${esc(b.oznaka1)}${b.oznaka2 ? `<br><strong style="text-transform:none">${esc(b.oznaka2)}</strong>` : ""}</td>
  </tr>
</table>
<div style="height:44px;line-height:44px">&nbsp;</div>
<div style="font-family:${NASLOVNA};font-size:44px;line-height:1.02;font-weight:800;text-transform:uppercase;color:#ffffff;margin:0">${esc(b.naslov)}</div>
${naslov2}
${b.besedilo ? `<div style="font-family:${TELO};font-size:16px;line-height:1.55;color:#ffffff;margin-top:18px">${oblikuj(b.besedilo, "#ffffff")}</div>` : ""}
${b.gumb ? `<div style="height:22px;line-height:22px">&nbsp;</div>${gumbHtml(b.gumb, b.povezava, rdeca ? "bel" : "rdec", "levo")}<div style="clear:both"></div>` : ""}`;
    return `<tr>${podlagaCelica(b.ozadje, vsebina, "34px 36px 38px")}</tr>
<tr><td style="padding:0 36px;background:#ffffff" bgcolor="#ffffff"><div style="width:200px;height:5px;background:${RDECA};line-height:5px;font-size:0">&nbsp;</div></td></tr>
<tr><td style="height:26px;line-height:26px;background:#ffffff;font-size:0" bgcolor="#ffffff">&nbsp;</td></tr>`;
  },

  naslov(b) {
    const center = b.poravnava === "sredina";
    const html =
      b.slog === "velik"
        ? `<div style="font-family:${NASLOVNA};font-size:30px;line-height:1.1;font-weight:800;text-transform:uppercase;color:${ANTRACIT};text-align:${center ? "center" : "left"}">${esc(b.besedilo)}</div>`
        : `<div style="font-family:${NASLOVNA};font-size:15px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${ANTRACIT};text-align:${center ? "center" : "left"}">${esc(b.besedilo)}</div>`;
    return vrsta(html, { pad: "4px 36px 14px" });
  },

  besedilo(b) {
    return vrsta(
      `<div style="font-family:${TELO};font-size:15.5px;line-height:1.6;color:${ANTRACIT};text-align:${b.poravnava === "sredina" ? "center" : "left"}">${oblikuj(b.besedilo)}</div>`,
      { pad: "4px 36px 18px" }
    );
  },

  slika(b) {
    if (!b.url) return vrsta(`<div style="padding:40px;text-align:center;border:2px dashed #ccd0d4;font-family:${TELO};color:${SIVA};font-size:14px">Slika – naloži jo v urejevalniku</div>`, { pad: "4px 36px 18px" });
    const polna = b.robovi === "ne";
    const sirina = polna ? 600 : 528;
    let img = `<img src="${esc(varenUrl(b.url))}" width="${sirina}" alt="${esc(b.alt)}" style="display:block;width:100%;max-width:${sirina}px;height:auto;border:0">`;
    if (b.povezava) img = `<a href="${esc(varenUrl(b.povezava))}" style="text-decoration:none">${img}</a>`;
    return vrsta(img, { pad: polna ? "0 0 18px" : "4px 36px 18px" });
  },

  izdelki(b) {
    const el = (b.elementi || []).slice(0, 3);
    if (!el.length) return "";
    const n = el.length;
    const sirina = Math.floor((528 - (n - 1) * 16) / n);
    const kartica = (x) => {
      const url = varenUrl(x.povezava);
      const ovij = (h) => (url ? `<a href="${esc(url)}" style="text-decoration:none;color:inherit">${h}</a>` : h);
      return `<td valign="top" width="${sirina}" style="width:${sirina}px;border:1px solid #dde0e2;background:#ffffff" bgcolor="#ffffff">
        ${x.slika ? ovij(`<img src="${esc(varenUrl(x.slika))}" width="${sirina - 2}" alt="${esc(x.naslov)}" style="display:block;width:100%;height:auto;border:0">`) : ""}
        <div style="padding:14px 16px 18px">
          <div style="font-family:${NASLOVNA};font-size:24px;font-weight:800;color:${ANTRACIT};line-height:1.1">${ovij(esc(x.naslov))}</div>
          ${x.podnaslov ? `<div style="font-family:${NASLOVNA};font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${RDECA};margin-top:4px">${esc(x.podnaslov)}</div>` : ""}
          ${x.opis ? `<div style="font-family:${TELO};font-size:13.5px;line-height:1.5;color:${SIVA};margin-top:8px">${oblikuj(x.opis, SIVA)}</div>` : ""}
          ${url ? `<div style="font-family:${NASLOVNA};font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-top:12px"><a href="${esc(url)}" style="color:${RDECA};text-decoration:none">Več →</a></div>` : ""}
        </div>
      </td>`;
    };
    const celice = el.map(kartica).join(`<td width="16" style="width:16px;font-size:0">&nbsp;</td>`);
    return vrsta(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${celice}</tr></table>`, { pad: "4px 36px 20px" });
  },

  gumb(b) {
    return vrsta(gumbHtml(b.besedilo, b.povezava, b.slog, b.poravnava) + `<div style="clear:both"></div>`, { pad: "6px 36px 22px" });
  },

  znacke(b) {
    const z = String(b.besedilo || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    if (!z.length) return "";
    const celice = z
      .map(
        (t, i) =>
          `<td style="padding:0 5px 8px"><div style="border:2px solid ${RDECA};background:${i === 0 ? RDECA : "#ffffff"};color:${i === 0 ? "#ffffff" : RDECA};font-family:${NASLOVNA};font-size:17px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:8px 16px;white-space:nowrap">${esc(t)}</div></td>`
      )
      .join("");
    return vrsta(`<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto"><tr>${celice}</tr></table>`, { pad: "4px 36px 18px" });
  },

  pasica(b) {
    const rdeca = b.ozadje === "rdeca";
    const vsebina = `
${b.naslov ? `<div style="font-family:${NASLOVNA};font-size:30px;line-height:1.08;font-weight:800;text-transform:uppercase;color:#ffffff">${esc(b.naslov)}</div>` : ""}
${b.besedilo ? `<div style="font-family:${TELO};font-size:15.5px;line-height:1.55;color:#ffffff;margin-top:10px">${oblikuj(b.besedilo, "#ffffff")}</div>` : ""}
${b.gumb ? `<div style="height:18px;line-height:18px">&nbsp;</div>${gumbHtml(b.gumb, b.povezava, rdeca ? "bel" : "rdec", "levo")}<div style="clear:both"></div>` : ""}`;
    return `<tr>${podlagaCelica(b.ozadje, vsebina, "30px 36px")}</tr><tr><td style="height:22px;line-height:22px;background:#ffffff;font-size:0" bgcolor="#ffffff">&nbsp;</td></tr>`;
  },

  kontakt(b) {
    const slika = b.slika
      ? `<td valign="top" width="72" style="width:72px;padding-right:16px"><img src="${esc(varenUrl(b.slika))}" width="72" height="72" alt="${esc(b.ime)}" style="display:block;width:72px;height:72px;border-radius:36px;object-fit:cover;border:0"></td>`
      : "";
    const vsebina = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid ${RDECA}"><tr><td style="padding:4px 0 4px 16px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${slika}<td valign="middle" style="font-family:${TELO};font-size:14px;line-height:1.55;color:${ANTRACIT}">
      ${b.ime ? `<strong style="font-family:${NASLOVNA};font-size:19px;text-transform:uppercase;letter-spacing:.5px">${esc(b.ime)}</strong><br>` : ""}
      ${b.vloga ? `<span style="color:${SIVA}">${esc(b.vloga)}</span><br>` : ""}
      ${b.telefon ? `${esc(b.telefon)}<br>` : ""}
      ${b.email ? `<a href="mailto:${esc(b.email)}" style="color:${RDECA};text-decoration:none">${esc(b.email)}</a>` : ""}
    </td></tr></table></td></tr></table>`;
    return vrsta(vsebina, { pad: "6px 36px 22px" });
  },

  locilo(b) {
    if (b.slog === "prostor") return `<tr><td style="height:28px;line-height:28px;background:#ffffff;font-size:0" bgcolor="#ffffff">&nbsp;</td></tr>`;
    const crta = b.slog === "rdeca" ? `height:4px;background:${RDECA};width:120px` : "height:1px;background:#dde0e2";
    return vrsta(`<div style="${crta};line-height:1px;font-size:0">&nbsp;</div>`, { pad: "8px 36px 24px" });
  },

  html(b) {
    return vrsta(String(b.koda ?? ""), { pad: "4px 36px 18px" });
  },
};

function noga(jezik) {
  const t = NOGA_JEZIKI[jezik] || NOGA_JEZIKI.sl;
  return `<tr>${podlagaCelica(
    "antracit",
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="top"><img src="${LOGO}" width="110" alt="ASfix" style="display:block;width:110px;height:auto;border:0"></td>
      <td valign="top" align="right" style="font-family:${TELO};font-size:12px;line-height:1.7;color:#c4c8cc">
        <strong style="color:#ffffff">AS system d.o.o.</strong><br>
        Obrtniška ulica 14, 3240 Šmarje pri Jelšah<br>
        <a href="tel:+38638007000" style="color:#c4c8cc;text-decoration:none">+386 3 800 70 00</a> · <a href="mailto:info@as-system.si" style="color:#c4c8cc;text-decoration:none">info@as-system.si</a><br>
        <a href="${SPLET}" style="color:#ffffff;text-decoration:none;font-weight:700">${t.splet}</a>
      </td></tr></table>
      <div style="border-top:1px solid #3a3f43;margin-top:18px;padding-top:14px;font-family:${TELO};font-size:11px;line-height:1.6;color:#8a9096;text-align:center">
        ${t.prejeli}<br><a href="${UNSUB}" style="color:#c4c8cc;text-decoration:underline">${t.odjava}</a>
      </div>`,
    "26px 36px 22px"
  )}</tr>`;
}

// predogled = true → vsak blok dobi data-blok (klik v predogledu izbere blok)
export function zgradiHtml(vsebina, { zadeva = "", predogledno = "", predogled = false } = {}) {
  const bloki = vsebina?.bloki ?? [];
  const jezik = vsebina?.nastavitve?.jezik || "sl";
  const telo = bloki
    .map((b) => {
      const risi = RISI[b.tip];
      if (!risi) return "";
      let h = risi(b);
      if (predogled) h = h.replace(/<tr(?=[\s>])/, `<tr data-blok="${b.id}"`);
      return h;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${jezik}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(zadeva)}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#eef0f1}
  a{color:${RDECA}}
  @media (max-width:620px){
    .ovoj{width:100% !important}
    .ovoj td{padding-left:20px !important;padding-right:20px !important}
  }${predogled ? `
  [data-blok]{cursor:pointer}
  [data-blok]:hover>td{outline:2px dashed rgba(203,32,38,.55);outline-offset:-2px}
  [data-blok].izbran>td{outline:3px solid ${RDECA};outline-offset:-3px}` : ""}
</style>
</head>
<body style="margin:0;padding:0;background:#eef0f1">
${predogledno ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(predogledno)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef0f1" style="background:#eef0f1">
<tr><td align="center" style="padding:24px 10px">
<table role="presentation" class="ovoj" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff" bgcolor="#ffffff">
${telo}
${noga(jezik)}
</table>
</td></tr>
</table>
</body>
</html>`;
}
