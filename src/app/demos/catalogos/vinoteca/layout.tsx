import type { Metadata } from "next";
import { Bodoni_Moda, Outfit } from "next/font/google";

const serif = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cava-serif",
});
const sans = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap", variable: "--font-cava-sans" });

export const metadata: Metadata = {
  title: "Demo Vinoteca — Catálogo online",
  description:
    "Demo de catálogo de vinos con filtros por cepa, región y maridaje, fichas de cata y caja de 6 con consulta por WhatsApp. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
