import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/car-marketplace',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bferxknatakjymihgsbs.supabase.co',
      },
    ],
  },
};

export default nextConfig;
