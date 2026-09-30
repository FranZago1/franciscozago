import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

const sans = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-vt-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-vt-mono" });

export const metadata: Metadata = {
  title: "Demo Tech store — Tienda online de electrónica",
  description: "Demo de tienda online de electrónica (Voltio) con filtros combinables, comparador de productos, fichas técnicas, cuotas y checkout. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal-tienda className={`${sans.variable} ${mono.variable} [font-family:var(--font-vt-sans)]`}>
      {children}
    </div>
  );
}
