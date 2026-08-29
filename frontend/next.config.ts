import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.31.244"],
  experimental: {
    // @ts-expect-error - Next.js experimental types might be incomplete
    turbopack: {
      root: "./",
    },
  },
};

export default nextConfig;
