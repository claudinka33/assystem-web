/** @type {import('next').NextConfig} */
const nextConfig = {
  // 90 za fotografije lokacij (ostro na velikih zaslonih)
  images: { qualities: [75, 90] },
  // Obrazci s prilogami (risbe, življenjepisi). Vercel sprejme največ 4,5 MB na zahtevo.
  experimental: {
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
