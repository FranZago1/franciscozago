import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-of-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-of-mono" });

export const metadata: Metadata = {
  title: "Demo Cotizador — Web apps",
  description:
    "Demo de web app: cotizador de reformas de Obra Fina con cálculo en vivo, pasos guiados y presupuesto listo para imprimir. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
