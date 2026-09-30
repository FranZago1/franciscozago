import type { Metadata } from "next";
import { PersonJsonLd } from "@/components/JsonLd";
import { Contacto } from "@/components/home/Contacto";
import { Demos } from "@/components/home/Demos";
import { Hero } from "@/components/home/Hero";
import { Proceso } from "@/components/home/Proceso";
import { Servicios } from "@/components/home/Servicios";
import { SobreMi } from "@/components/home/SobreMi";
import { Stack } from "@/components/home/Stack";
import { Trabajos } from "@/components/home/Trabajos";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <SobreMi />
      <Trabajos />
      <Servicios />
      <Demos />
      <Proceso />
      <Stack />
      <Contacto />
    </>
  );
}
