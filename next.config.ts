import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  trailingSlash: true,

  output: "export",

  allowedDevOrigins: ["169.254.6.7"],

  images: {
    unoptimized: true,
  },
};

export default nextConfig;