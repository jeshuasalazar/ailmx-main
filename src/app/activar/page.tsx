import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Activación AMCP", robots: { index: false, follow: true } };

export default function ActivarPage() {
  return <main><section className="page-hero"><div className="page-hero-grid"><div className="page-hero-copy"><p className="eyebrow">Campaña AMCP 2026</p><h1 className="title">Activa tu acceso desde Academia.</h1><p className="subtitle">Para proteger tus datos, esta página ya no recibe nombres ni correos mediante la URL. El registro continúa en la plataforma responsable del acceso.</p><div className="hero-actions"><a className="button button-primary" href="https://academia.ailearning.mx/register?locale=es&source=ailearning-hub&campaign=amcp-2026" target="_blank" rel="noreferrer">Continuar a Academia <ExternalLink size={18} aria-hidden="true" /></a><a className="button button-outline" href="/es"><ArrowLeft size={18} aria-hidden="true" /> Volver al inicio</a></div></div><aside className="page-hero-aside blue"><p className="mono">PRIVACIDAD PRIMERO</p><h2>Sin activación automática.</h2><ul className="aside-list"><li>Sin datos personales en la URL</li><li>Sin envíos sin consentimiento</li><li>Registro en la plataforma de Academia</li></ul></aside></div></section></main>;
}
