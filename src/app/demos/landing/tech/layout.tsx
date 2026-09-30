import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const sans = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-cc-sans" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-cc-mono" });

export const metadata: Metadata = {
  title: "Demo Tech — Landing de app de facturación",
  description:
    "Demo de landing page para Cuentaclara, una app de facturación ficticia para monotributistas y pymes: mock del producto, calculadora de ahorro y precios.",
};

export const viewport: Viewport = { themeColor: "#FAFAFB" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
