import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";

const serif = Newsreader({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap", variable: "--font-as-serif" });
const sans = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-as-sans" });

export const metadata: Metadata = {
  title: "Demo Asistente — Web apps",
  description:
    "Demo de web app: asistente con IA del Consorcio Torre Alameda que responde con el reglamento y las actas, y cita sus fuentes. Respuestas simuladas y contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
