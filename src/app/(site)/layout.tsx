import { Footer } from "@/components/Footer";
import { CordobaClock } from "@/components/CordobaClock";
import { Header } from "@/components/Header";
import { hanken, newsreader } from "./fonts";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${hanken.variable} ${newsreader.variable} font-sans text-base`}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Header clock={<CordobaClock />} />
      <main id="contenido">{children}</main>
      <Footer />
    </div>
  );
}
