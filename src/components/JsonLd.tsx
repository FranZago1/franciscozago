import { instagramUrl, site, siteUrl } from "@/content/site";

export function PersonJsonLd() {
  const ig = instagramUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.nombre,
    jobTitle: site.rol,
    url: siteUrl(),
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Córdoba",
      addressCountry: "AR",
    },
    sameAs: [site.github, site.linkedin, ...(ig ? [ig] : [])],
  };
  return (
    <script
      type="application/ld+json"
      // El contenido es estático y propio; se escapa "<" por seguridad.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
