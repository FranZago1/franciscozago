import type { Metadata } from "next";
import { Inter_Tight, Manrope } from "next/font/google";

const head = Inter_Tight({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap", variable: "--font-tb-head" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-tb-body" });

export const metadata: Metadata = {
  title: "Demo Tablero — Web apps",
  description:
    "Demo de web app: tablero kanban de Estudio Brújula con arrastrar y soltar, etiquetas, filtros y checklist. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${head.variable} ${body.variable} font-[family-name:var(--font-tb-body)]`}>{children}</div>;
}
