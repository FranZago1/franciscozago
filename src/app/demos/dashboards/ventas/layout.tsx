import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/demos/dashboards/shared/dv.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-an",
});

export const metadata: Metadata = {
  title: "Demo Ventas — Dashboards",
  description: "Demo de dashboard de ventas para una tienda online, con datos ficticios.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={sans.variable}>{children}</div>;
}
