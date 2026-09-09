import type { MetadataRoute } from "next";
import { product } from "@/config";
import { indexedRoutes } from "@/content/routes";

// The marketing and legal pages, from the route directory. Auth and app
// pages are not listed, because a search result that lands on a sign in
// form helps nobody.

export default function sitemap(): MetadataRoute.Sitemap {
  return indexedRoutes.map((route) => ({
    url: `${product.url}${route.href === "/" ? "" : route.href}`,
    changeFrequency: "monthly",
    priority: route.href === "/" ? 1 : 0.5,
  }));
}
