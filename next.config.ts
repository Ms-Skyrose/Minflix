import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The card and link-preview images read these fonts at runtime; make sure Vercel ships them with those routes.
  outputFileTracingIncludes: {
    "/f/[slug]/card.png": ["./src/assets/fonts/**"],
    "/opengraph-image": ["./src/assets/fonts/**"],
  },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
