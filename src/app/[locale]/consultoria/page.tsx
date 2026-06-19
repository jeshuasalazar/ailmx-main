import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Consultoría", description: "Convierte oportunidades de IA en sistemas útiles, medibles y gobernables.", alternates: { canonical: "/es/consultoria" } };

export default function ConsultoriaPage() {
  return <>
    <PageHero eyebrow="Consultoría" title="No empieces por la herramienta. Empieza por el trabajo." description="Acompañamos a tu equipo a identificar una oportunidad, construir una primera solución y aprender lo suficiente para gobernarla." tone="coral" asideTitle="Intervenciones enfocadas" items={["Descubrimiento y diagnóstico", "Prototipo verificable", "Transferencia al equipo"]} cta={{ label: "Solicitar diagnóstico", href: "/es/contacto" }} />
    <section className="section"><div className="container method-grid"><div className="sticky-intro"><p className="eyebrow">La intervención</p><h2 className="title">Pequeña por diseño. Útil por evidencia.</h2><p className="subtitle">Acotamos antes de construir para reducir incertidumbre y retrabajo.</p></div><div className="steps"><article className="step"><span className="step-index mono">01</span><div><h3>Mapear</h3><p>Entendemos la decisión, el flujo y las restricciones. Separamos oportunidad real de entusiasmo tecnológico.</p></div></article><article className="step"><span className="step-index mono">02</span><div><h3>Probar</h3><p>Construimos la versión mínima que permita evaluar calidad, riesgo y adopción con usuarios reales.</p></div></article><article className="step"><span className="step-index mono">03</span><div><h3>Transferir</h3><p>Dejamos documentación, criterios de operación y un siguiente paso claro para tu equipo.</p></div></article></div></div></section>
    <section className="cta-band section-sm"><div className="container cta-grid"><div><p className="eyebrow">Una conversación concreta</p><h2 className="title">Cuéntanos qué trabajo quieres mejorar.</h2></div><Link className="button button-light" href="/es/contacto">Solicitar diagnóstico <ArrowRight size={18} aria-hidden="true" /></Link></div></section>
  </>;
}
