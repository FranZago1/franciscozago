import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-df-serif",
});
const sans = Archivo({ subsets: ["latin"], display: "swap", variable: "--font-df-sans" });

export const metadata: Metadata = {
  title: "Demo Barbería — Reservas online",
  description: "Demo de turnos online para una barbería: servicios, barbero, día y hora, con contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
