import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // the old vercel.app domain; localhost and preview deployments don't match
        source: "/:path*",
        has: [{ type: "host", value: "tifethedev.vercel.app" }],
        destination: "https://boluwatifeosineye.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
