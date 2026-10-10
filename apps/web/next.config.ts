import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@vantaged/config",
    "@vantaged/contracts",
    "@vantaged/core",
    "@vantaged/api-client",
    "@vantaged/integrations",
    "@vantaged/db",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.178.1",
    "192.168.164.82",
    "192.168.178.*",
    "192.168.164.*",
  ],
};

export default nextConfig;
