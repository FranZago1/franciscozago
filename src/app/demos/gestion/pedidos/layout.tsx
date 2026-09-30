import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";

const sans = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-brasa" });
const condensada = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap", variable: "--font-brasa-cond" });

export const metadata: Metadata = {
  title: "Demo Pedidos — Comandas de parrilla",
  description: "Demo de sistema de comandas para una parrilla ficticia: plano del salón, pantalla de cocina con tiempos en vivo y delivery.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${condensada.variable}`}>{children}</div>;
}
