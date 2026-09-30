import type { Metadata, Viewport } from "next";
import { Anton, Archivo } from "next/font/google";

const display = Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-ci-display" });
const sans = Archivo({ subsets: ["latin"], display: "swap", variable: "--font-ci-sans" });

export const metadata: Metadata = {
  title: "Demo Cinemático — Portfolio de fotografía",
  description: "Demo de portfolio de fotografía estilo cinemático, con contenido ficticio.",
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="cinematico" className={`${display.variable} ${sans.variable}`}>
      {children}
    </div>
  );
}
