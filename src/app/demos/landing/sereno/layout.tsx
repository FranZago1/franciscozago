import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-ac-serif",
});
const sans = Figtree({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap", variable: "--font-ac-sans" });

export const metadata: Metadata = {
  title: "Demo Sereno — Landing de centro de estética",
  description:
    "Demo de landing page para Alma Clara, un centro de estética y bienestar ficticio: tratamientos filtrables, comparador antes/después y turnos online.",
};

export const viewport: Viewport = { themeColor: "#F6F4EE" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
