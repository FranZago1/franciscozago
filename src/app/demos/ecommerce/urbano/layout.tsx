import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";

const display = Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-pc-display" });
const sans = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], display: "swap", variable: "--font-pc-sans" });

export const metadata: Metadata = {
  title: "Demo Urbano — Tienda online de ropa",
  description: "Demo de tienda online de ropa urbana (Pampa Club) con drop en cuenta regresiva, talles, carrito y checkout. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal-tienda className={`${display.variable} ${sans.variable} [font-family:var(--font-pc-sans)]`}>
      {children}
    </div>
  );
}
