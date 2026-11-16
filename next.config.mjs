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
