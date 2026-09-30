import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { trabajos } from "@/content/trabajos";

// Las demos no se incluyen: tienen noindex para no competir con el portfolio.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    ...trabajos.map((t) => ({
      url: `${base}/trabajos/${t.slug}`,
      changeFrequency: "yearly" as const,
      priority: t.categoria === "cliente" ? 0.8 : 0.6,
    })),
  ];
}
