import type { Metadata } from "next";
import { ArrowLeft, Download } from "lucide-react";

export const metadata: Metadata = { title: "Guía Jornadas AMCP 2026", description: "Recurso para asistentes de las Jornadas AMCP 2026.", robots: { index: false, follow: true } };

export default function JornadasPage() {
  return <main><section className="page-hero"><div className="page-hero-grid"><div className="page-hero-copy"><p className="eyebrow">Jornadas AMCP 2026</p><h1 className="title">Tu guía está lista para descargar.</h1><p className="subtitle">Accede directamente al material del evento. No necesitamos poner tu nombre o correo en la URL para entregártelo.</p><div className="hero-actions"><a className="button button-primary" href="/jornadas2026/guia.pdf" download><Download size={18} aria-hidden="true" /> Descargar guía</a><a className="button button-outline" href="/es"><ArrowLeft size={18} aria-hidden="true" /> Volver al inicio</a></div></div><aside className="page-hero-aside coral"><p className="mono">RECURSO DE CAMPAÑA</p><h2>Descarga directa, sin fricción.</h2><ul className="aside-list"><li>Documento PDF</li><li>Sin formulario obligatorio</li><li>Sin seguimiento automático</li></ul></aside></div></section></main>;
}
