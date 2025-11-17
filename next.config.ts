import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      {
        protocol: "https",
        hostname: "www.2kratings.com",
      },
      {
        protocol: "https",
        hostname: "2kratings.com",
      },
    ],
  },
};

export default nextConfig;
