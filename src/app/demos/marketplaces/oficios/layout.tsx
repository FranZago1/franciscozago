import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-ma-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-ma-mono" });

export const metadata: Metadata = {
  title: "ManoAmiga — Demo de marketplace de oficios",
  description:
    "Demo de marketplace de profesionales de oficios: buscador por problema, filtros, perfiles con matrícula y reseñas, y pedido de presupuesto. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
