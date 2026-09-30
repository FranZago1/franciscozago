import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-ed-serif",
});
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap", variable: "--font-ed-sans" });

export const metadata: Metadata = {
  title: "Demo Editorial — Portfolio de fotografía",
  description: "Demo de portfolio de fotografía estilo editorial, con contenido ficticio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
