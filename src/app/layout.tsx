import type { Metadata, Viewport } from "next";
import { site, siteUrl } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: site.titulo, template: `%s — ${site.nombre}` },
  description: site.descripcion,
  applicationName: site.nombre,
  authors: [{ name: site.nombre, url: site.github }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.nombre,
    title: site.titulo,
    description: site.descripcion,
  },
  twitter: { card: "summary_large_image", title: site.titulo, description: site.descripcion },
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
