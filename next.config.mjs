/** @type {import('next').NextConfig} */
const nextConfig = {
  // 90 za fotografije lokacij (ostro na velikih zaslonih)
  images: {
    qualities: [75, 90],
    // slike, naložene v administraciji (Supabase Storage)
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // Obrazci s prilogami (risbe, življenjepisi). Vercel sprejme največ 4,5 MB na zahtevo.
  // Znamka žebljev se je preimenovala HAMMER → HAMMEX
  async redirects() {
    return [
      { source: "/hammer", destination: "/hammex", permanent: true },
      // Stara stran as-system.si → nove poti (domena as-system.si preusmerja na assystem.si z isto potjo)
      { source: "/spletna-trgovina/vijaki-matice-podlozkice/:pot*", destination: "/program/vijacno-blago", permanent: true },
      { source: "/spletna-trgovina/klasicna-pritrdila/:pot*", destination: "/program/zidni-vlozki", permanent: true },
      { source: "/spletna-trgovina/pritrdila-za-v-votle-stene/:pot*", destination: "/program/pritrdila-za-suhomontazo", permanent: true },
      { source: "/spletna-trgovina/pritrdila-za-v-izolacijo/:pot*", destination: "/program/pritrdila-za-streho", permanent: true },
      { source: "/spletna-trgovina/zeblji/:pot*", destination: "/program/zicniki", permanent: true },
      { source: "/spletna-trgovina/pritrdila-za-beton/:pot*", destination: "/program/pritrdila-za-beton", permanent: true },
      { source: "/spletna-trgovina/pritrdila-za-suhomontazo/:pot*", destination: "/program/pritrdila-za-suhomontazo", permanent: true },
      { source: "/spletna-trgovina/pritrdila-za-instalacije/:pot*", destination: "/program/pritrdila-za-instalacije", permanent: true },
      { source: "/spletna-trgovina/kemicna-pritrditev/:pot*", destination: "/program/kemicna-pritrditev", permanent: true },
      { source: "/spletna-trgovina/pritrdila-za-streho/:pot*", destination: "/program/pritrdila-za-streho", permanent: true },
      { source: "/spletna-trgovina/pritrdila-za-sanitarno-opremo/:pot*", destination: "/program/pritrdila-za-sanitarno-opremo", permanent: true },
      { source: "/spletna-trgovina/:pot*", destination: "/program", permanent: true },
      { source: "/reference", destination: "/o-nas", permanent: true },
      { source: "/galerija", destination: "/proizvodnja", permanent: true },
      { source: "/certifikati", destination: "/kakovost", permanent: true },
      { source: "/pritrdilna-tehnika", destination: "/asfix", permanent: true },
      { source: "/standard-vijaki", destination: "/asco", permanent: true },
      { source: "/resitve-po-meri", destination: "/bespoke", permanent: true },
      { source: "/pogoji-poslovanja", destination: "/splosni-pogoji", permanent: true },
      { source: "/piskotki", destination: "/zasebnost", permanent: true },
      { source: "/varstvo-osebnih-podatkov", destination: "/zasebnost", permanent: true },
      { source: "/domov", destination: "/", permanent: true },
      { source: "/priz-19-20", destination: "/o-nas", permanent: true },
      { source: "/izvajanje-operacije-v-sklopu-jr-p4i-2022", destination: "/o-nas", permanent: true },
      { source: "/zaposlitev.4", destination: "/zaposlitev", permanent: true },
      { source: "/aktualno/voscilo", destination: "/aktualno", permanent: true },
      { source: "/", has: [{ type: "query", key: "lang", value: "en" }], destination: "/en", permanent: true },
      // Vijaki po naročilu so zdaj del strani Bespoke (izdelava po meri)
      { source: "/vijaki-po-narocilu", destination: "/bespoke", permanent: true },
      { source: "/:jezik(en|de)/vijaki-po-narocilu", destination: "/:jezik/bespoke", permanent: true },
    ];
  },
  experimental: {
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
