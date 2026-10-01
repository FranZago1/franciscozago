import type { Metadata } from "next";
import { PersonJsonLd } from "@/components/JsonLd";
import { Contacto } from "@/components/home/Contacto";
import { Hero } from "@/components/home/Hero";
import { Proceso } from "@/components/home/Proceso";
import { Servicios } from "@/components/home/Servicios";
import { Trabajos } from "@/components/home/Trabajos";
import { Tecnologias } from "@/components/home/Tecnologias";
import { Videos } from "@/components/home/Videos";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <Servicios />
      <Trabajos />
      <Proceso />
      <Videos />
      <Tecnologias />
      <Contacto />
    </>
  );
}
