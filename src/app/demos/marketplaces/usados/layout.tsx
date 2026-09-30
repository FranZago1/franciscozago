import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap", variable: "--font-sv-display" });
const sans = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-sv-sans" });

export const metadata: Metadata = {
  title: "Segunda Vuelta — Demo de marketplace de usados",
  description:
    "Demo de marketplace de compra y venta de usados: filtros, favoritos que se guardan, detalle con galería, ofertas, chat con el vendedor y publicación en tres pasos. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${sans.variable}`}>{children}</div>;
}
