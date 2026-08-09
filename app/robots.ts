import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/navigation";

export default function robots(): MetadataRoute.Robots {
  const base = siteMeta.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/crm", "/portal", "/dashboard", "/login", "/register"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
