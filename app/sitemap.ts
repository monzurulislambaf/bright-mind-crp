import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/navigation";

const routes = [
  "/",
  "/services",
  "/expert-forensic",
  "/country-reports",
  "/training-research",
  "/our-experts",
  "/about",
  "/reporting",
  "/counselling",
  "/insights",
  "/for-solicitors",
  "/for-psychologists",
  "/for-individuals",
  "/how-it-works",
  "/faqs",
  "/contact",
  "/request-a-report",
  "/join-psychologist-network",
  "/solicitor-partnership",
  "/request-callback",
  "/privacy",
  "/terms",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMeta.url.replace(/\/$/, "");
  const now = new Date();

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
