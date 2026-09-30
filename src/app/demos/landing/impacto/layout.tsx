import type { Metadata, Viewport } from "next";
import { Anton, Barlow } from "next/font/google";

const display = Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-fn-display" });
const sans = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-fn-sans",
});

export const metadata: Metadata = {
  title: "Demo Impacto — Landing de box de entrenamiento",
  description:
    "Demo de landing page para Fuerza Norte, un box de entrenamiento funcional ficticio en Córdoba: horarios filtrables y reserva de clase de prueba.",
};

export const viewport: Viewport = { themeColor: "#0A0A0A" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${sans.variable}`}>{children}</div>;
}
