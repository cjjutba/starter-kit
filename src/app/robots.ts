import type { MetadataRoute } from "next";
import { product } from "@/config";
import { routeGroups } from "@/content/routes";

// Built from the route directory, so a route marked noindex there is kept
// out here without a second list. The app and the API are never for
// crawlers.

export default function robots(): MetadataRoute.Robots {
  const noindex = routeGroups.flatMap((group) => group.routes).filter((route) => route.noindex).map((route) => route.href);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/app", "/api", ...noindex] }],
    sitemap: `${product.url}/sitemap.xml`,
  };
}
