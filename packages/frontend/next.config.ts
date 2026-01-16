import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* productionBrowserSourceMaps: false,
  
  experimental: {
    cpus: 1,
    workerThreads: false,
  },

  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  }, */

  images: {
    minimumCacheTTL: 60,
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

  // Move outputFileTracingExcludes to top level (not in experimental)
  /* outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  }, */

};

export default nextConfig;