import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "@/demos/dashboards/shared/dv.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-tc",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-tc-mono",
});

export const metadata: Metadata = {
  title: "Demo Finanzas — Dashboards",
  description: "Demo de dashboard financiero en modo oscuro para una pyme, con datos ficticios.",
};

export const viewport: Viewport = { themeColor: "#0b0d10", colorScheme: "dark" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
