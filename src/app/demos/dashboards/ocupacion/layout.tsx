import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "@/demos/dashboards/shared/dv.css";

const sans = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-pa",
});
const condensada = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-pa-cond",
});

export const metadata: Metadata = {
  title: "Demo Ocupación — Dashboards",
  description: "Demo de dashboard de ocupación para un complejo deportivo, con datos ficticios.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${condensada.variable}`}>{children}</div>;
}
