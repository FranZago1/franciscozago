import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { hanken, mono } from "./fonts";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${hanken.variable} ${mono.variable} canvas-grid min-h-dvh font-sans text-base`}>
      <a
        href="#contenido"
        className="label-mono sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </div>
  );
}
