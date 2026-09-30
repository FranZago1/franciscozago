import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], display: "swap", variable: "--font-do" });

export const metadata: Metadata = {
  title: "Demo Documental cálido — Portfolio de fotografía",
  description: "Demo de portfolio de fotografía estilo documental cálido, con contenido ficticio.",
};

export const viewport: Viewport = { themeColor: "#FCEBDD" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="documental" className={nunito.variable}>
      {children}
    </div>
  );
}
