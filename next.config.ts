import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Logos can be up to 3 MB; leave headroom for the rest of the form.
    serverActions: { bodySizeLimit: "4mb" },
  },
  // Card images read these fonts at runtime; ship them with those routes on any host.
  outputFileTracingIncludes: {
    "/f/[slug]/card.png": ["./src/assets/fonts/**"],
    "/opengraph-image": ["./src/assets/fonts/**"],
  },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
