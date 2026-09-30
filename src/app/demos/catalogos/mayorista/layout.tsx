import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";

const sans = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-r9-sans",
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-r9-mono" });

export const metadata: Metadata = {
  title: "Demo Mayorista — Catálogo online",
  description: "Demo de lista de precios mayorista con búsqueda instantánea, bultos y pedido por WhatsApp. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
