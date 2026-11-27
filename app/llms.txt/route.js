import { pridobiKategorije, pridobiNovice, skriteZnamke } from "@/lib/podatki";
import { ZNAMKE, ZNAMKE_INFO } from "@/lib/znamke";
import { site } from "@/lib/site";

// /llms.txt — kratek povzetek podjetja za AI asistente (ChatGPT, Claude, Perplexity, Gemini).
// Standard: https://llmstxt.org — Markdown s povezavami do najpomembnejših strani.
export const revalidate = 3600;

export async function GET() {
  const u = site.url;
  const skrite = await skriteZnamke();
  const znamke = ZNAMKE.filter((z) => !skrite.includes(z)).map((z) => ZNAMKE_INFO[z]);
  const { seznam } = await pridobiKategorije();
  const novice = await pridobiNovice(15).catch(() => []);

  const vrstice = [
    "# AS system d.o.o.",
    "",
    `> Slovenski proizvajalec in dobavitelj pritrdilne tehnike od leta ${site.ustanovljeno}. Lastna proizvodnja jeklenih sider z evropsko tehnično oceno ETA, najlonskih zidnih vložkov, udarnih vijakov in perforiranega traku; vijačno blago po DIN in ISO; private label pakiranje in vijaki po risbi. Dobava v ${site.drzave} držav. Slovenian manufacturer of fastening technology (steel anchors with ETA, nylon wall plugs, hammer-in fixings, DIN/ISO fasteners, private label and screws made to drawing).`,
    "",
    "## Podjetje",
    `- Sedež: ${site.podjetje.naslov}`,
    ...site.lokacije.map((l) => `- Lokacija ${l.naziv}: ${l.vloga} (${l.naslov})`),
    `- Telefon (prodaja): ${site.telefon}; centrala: ${site.telefonCentrala}`,
    `- E-pošta: ${site.email}`,
    "- Jeziki spletne strani: slovenščina, angleščina (/en), nemščina (/de), hrvaščina (/hr)",
    "- Prodaja: trgovine in izvajalci v Sloveniji in na Hrvaškem, B2B spletna trgovina, distributerji v Evropi",
    "",
    "## Blagovne znamke",
    ...znamke.map((z) => `- [${z.ime}](${u}${z.pot}): ${z.opis}`),
    "",
    "## Prodajni program",
    `- [Vsi izdelki](${u}/program)`,
    ...seznam.map((k) => `- [${k.naziv}](${u}/program/${k.slug})${k.opis ? `: ${k.opis}` : ""}`),
    "",
    "## Za poslovne partnerje",
    `- [Za trgovce](${u}/za-trgovce): prodajne police in asortiman za trgovine`,
    `- [Private label](${u}/private-label): proizvodnja in pakiranje v škatle ali vrečke pod blagovno znamko naročnika`,
    `- [Bespoke — izdelava po meri](${u}/bespoke): vijaki po risbi in izdelki v izvedbi po meri`,
    `- [Postanite distributer](${u}/distributerji)`,
    `- [B2B trgovina](${u}/b2b): registracija podjetja, cene in zaloga za poslovne kupce`,
    `- [Proizvodnja](${u}/proizvodnja): hladno kovanje, valjanje navojev, brizganje plastike, avtomatska montaža`,
    `- [Katalogi](${u}/katalogi)`,
    "",
    "## Več",
    `- [O nas](${u}/o-nas)`,
    `- [Kontakt](${u}/kontakt)`,
    `- [Aktualno — novice in nasveti](${u}/aktualno)`,
    ...novice.filter((n) => n.slug && n.naslov).map((n) => `- [${n.naslov}](${u}/aktualno/${n.slug})`),
    `- [Zemljevid strani](${u}/sitemap.xml)`,
    "",
  ];

  return new Response(vrstice.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
