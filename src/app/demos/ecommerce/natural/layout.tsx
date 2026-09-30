import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";

const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--font-hb-serif" });
const sans = Figtree({ subsets: ["latin"], display: "swap", variable: "--font-hb-sans" });

export const metadata: Metadata = {
  title: "Demo Natural — Tienda online de cosmética",
  description: "Demo de tienda online de cosmética natural (Hoja & Barro) con rutinas armadas, test de piel, ingredientes, reseñas y checkout. Contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal-tienda className={`${serif.variable} ${sans.variable} [font-family:var(--font-hb-sans)]`}>
      {children}
    </div>
  );
}
