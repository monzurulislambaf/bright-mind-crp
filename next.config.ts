import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.31.186"],
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB request body. The portal allows up
      // to 5 files of 8MB each, so the ceiling must cover the worst case
      // (plus multipart overhead).
      bodySizeLimit: "45mb",
    },
    // Turbopack's filesystem cache snapshots the build process environment
    // into .next/cache, which embedded the SESSION_SECRET value into build
    // artifacts and tripped Netlify's secrets scanning. The value must stay
    // runtime-only, so skip persisting the cache for builds.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
