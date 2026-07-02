import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { buildAcademyUrl } from "@/lib/academy";

export const metadata: Metadata = { title: "Academia", description: "Desarrolla criterio y práctica para trabajar con inteligencia artificial.", alternates: { canonical: "/es/academia" } };

export default function AcademiaPage() {
  const academyUrl = buildAcademyUrl({ locale: "es", source: "ailearning-hub", campaign: "academia-page" });
  return <>
    <PageHero eyebrow="Academia" title="Aprender IA es aprender a decidir mejor." description="Un espacio para desarrollar criterio, práctica y autonomía frente a herramientas que cambian cada semana." asideTitle="Aprendizaje orientado al trabajo" items={["Fundamentos comprensibles", "Práctica guiada", "Proyectos aplicados"]} cta={{ label: "Ir a Academia", href: academyUrl, external: true }} />
    <section className="section"><div className="container content-grid"><div><p className="eyebrow">Cómo funciona</p><h2 className="title">Aprender haciendo, sin perder el porqué.</h2></div><div className="prose"><h2>Empieza desde tu contexto</h2><p>No necesitas perseguir cada novedad. Empiezas con una tarea, una pregunta o un proyecto que te permita entender qué hace bien un sistema de IA y dónde necesita supervisión.</p><h2>Construye una práctica transferible</h2><p>El objetivo no es memorizar una interfaz. Es adquirir un método que puedas trasladar a nuevas herramientas, modelos y problemas.</p><h2>Continúa en la plataforma responsable</h2><p>El registro, acceso a contenidos y cualquier transacción ocurren en Academia. Este hub no duplica cuentas ni procesa pagos.</p><a className="button button-primary" href={academyUrl} target="_blank" rel="noreferrer">Explorar Academia <ArrowRight size={18} aria-hidden="true" /></a></div></div></section>
  </>;
}
