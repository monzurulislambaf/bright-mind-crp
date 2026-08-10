import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.8"],
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB request body. The portal allows up
      // to 5 files of 8MB each, so the ceiling must cover the worst case
      // (plus multipart overhead).
      bodySizeLimit: "45mb",
    },
  },
};

export default nextConfig;
