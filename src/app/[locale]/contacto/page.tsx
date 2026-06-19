import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Contacto", description: "Conversemos sobre una oportunidad concreta de inteligencia artificial.", alternates: { canonical: "/es/contacto" } };

export default function ContactoPage() {
  return <><PageHero eyebrow="Contacto" title="Una buena conversación empieza con una pregunta real." description="Comparte el contexto suficiente para entender tu reto. No incluyas secretos, datos personales de terceros ni información confidencial." asideTitle="Qué ocurre después" items={["Revisamos tu contexto", "Respondemos por correo", "Definimos si tiene sentido conversar"]} />
  <section className="section"><div className="container content-grid"><div><p className="eyebrow">Formulario</p><h2 className="title">Cuéntanos el trabajo, no la solución.</h2><p className="subtitle">Así podemos ayudarte a pensar mejor desde el primer mensaje.</p></div><LeadForm /></div></section></>;
}
