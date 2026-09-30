import type { Metadata } from "next";

// Las demos no se indexan para no competir con el portfolio en buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
