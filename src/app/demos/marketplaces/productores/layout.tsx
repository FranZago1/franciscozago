import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-dv-display",
});
const sans = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-dv-sans" });

export const metadata: Metadata = {
  title: "Del Valle Mercado — Demo de marketplace de productores",
  description:
    "Demo de marketplace de productores locales de Córdoba: tiendita de cada productor, carrito agrupado por productor con envíos separados y mapa de zonas. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${sans.variable}`}>{children}</div>;
}
