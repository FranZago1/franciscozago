import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";

const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-am-serif",
});
const sans = Figtree({ subsets: ["latin"], display: "swap", variable: "--font-am-sans" });

export const metadata: Metadata = {
  title: "Demo Cabañas — Reservas online",
  description: "Demo de reservas para cabañas en las sierras de Córdoba: calendario de fechas, huéspedes y total al instante, con contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
