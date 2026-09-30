import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-pc-display",
});
const sans = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-pc-sans" });

export const metadata: Metadata = {
  title: "Demo Canchas — Reservas online",
  description: "Demo de reservas de canchas de pádel con grilla de horarios, extras y seña, con contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${sans.variable}`}>{children}</div>;
}
