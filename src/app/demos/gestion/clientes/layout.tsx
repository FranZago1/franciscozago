import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crm",
});

export const metadata: Metadata = {
  title: "Demo Clientes — CRM inmobiliario",
  description: "Demo de CRM para una inmobiliaria ficticia: embudo de ventas, ficha de clientes y tareas del día.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={sans.variable}>{children}</div>;
}
