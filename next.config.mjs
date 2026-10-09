/** @type {import('next').NextConfig} */
const nextConfig = {
  // Obrazci s prilogami (risbe, življenjepisi). Vercel sprejme največ 4,5 MB na zahtevo.
  experimental: {
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
