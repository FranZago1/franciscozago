import type { Metadata } from "next";
import { site, siteUrl } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: site.titulo, template: `%s — ${site.nombre}` },
  description: site.descripcion,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
