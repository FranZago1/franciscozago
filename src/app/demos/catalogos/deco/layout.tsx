import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-nido-serif",
});
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-nido-sans" });

export const metadata: Metadata = {
  title: "Demo Deco — Catálogo online",
  description: "Demo de catálogo online de muebles y objetos con ambientes, fichas y consulta por WhatsApp. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
