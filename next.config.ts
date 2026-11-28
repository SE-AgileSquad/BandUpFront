import type { NextConfig } from "next";
import { getLoopbackApiUrl } from "./src/config/local-api";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  output: "standalone",

  trailingSlash: true,

  allowedDevOrigins: [],

  async rewrites() {
    const apiUrl = process.env.NODE_ENV === "development"
      ? getLoopbackApiUrl(process.env.NEXT_PUBLIC_API_URL)
      : null;

    return apiUrl ? [{
      source: "/api/attempts/:attemptId/submit/",
      destination: `${apiUrl.origin}/api/attempts/:attemptId/submit`,
    }] : [];
  },
};

export default nextConfig;
