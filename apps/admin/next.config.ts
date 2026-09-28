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
};

export default nextConfig;
