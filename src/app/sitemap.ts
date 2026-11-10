import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

const routes = ["", "/historial", "/alertas", "/dispositivo", "/ajustes"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-11-09"),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
