import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

// Las demos se pueden rastrear para que los buscadores lean su meta noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
