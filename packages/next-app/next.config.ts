import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),

  // OpenNext v3.6.6 compatibility: disable Turbopack for production builds
  /* webpack: (config) => {
    return config;
  }, */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      /* {
        protocol: "https",
        hostname: `cdn.${process.env.DOMAIN}`,
      },
      {
        protocol: "https",
        hostname: `cdn.dev.${process.env.DOMAIN}`,
      }, */
    ],
  },

};

export default nextConfig;
