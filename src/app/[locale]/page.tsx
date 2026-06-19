import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, Compass, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "IA que se convierte en trabajo real",
  description: "Formación práctica y consultoría para aplicar inteligencia artificial con método y criterio.",
  alternates: { canonical: "/es" },
};

const steps = [
  ["01", "Entender antes de automatizar", "Partimos del trabajo real: contexto, fricciones, decisiones y límites. La tecnología llega después de tener una pregunta clara."],
  ["02", "Construir una primera versión útil", "Diseñamos una aplicación pequeña, medible y segura que permita aprender con evidencia, no con promesas."],
  ["03", "Transferir la capacidad", "Documentamos lo aprendido y dejamos criterio instalado en las personas que continuarán operando la solución."],
] as const;

const faqs = [
  ["¿aiLearning es una plataforma de cursos o una consultora?", "Es ambas, con recorridos separados. Academia ayuda a profesionales a desarrollar habilidades; Consultoría ayuda a organizaciones a identificar y ejecutar oportunidades concretas."],
  ["¿Necesito saber programar para empezar?", "No para explorar los fundamentos. Cuando una ruta requiere experiencia técnica, lo indicamos antes de que comiences."],
  ["¿Publican precios y planes en este sitio?", "Solo cuando existe un contrato comercial vigente y verificable con Academia. Mientras tanto, el acceso y cualquier precio se confirman en la plataforma responsable del registro."],
  ["¿Qué ocurre con mis datos al contactarlos?", "Usamos únicamente la información necesaria para responder tu solicitud. No enviamos datos personales en URLs ni los exponemos a servicios de terceros desde el navegador."],
] as const;

export default function SpanishHome() {
  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Inteligencia artificial aplicada</p>
            <h1 className="display">Menos ruido.<br />Más <em>capacidad.</em></h1>
            <p className="subtitle">Aprende a construir con IA o convierte una oportunidad de tu empresa en un sistema que la gente pueda usar.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/es/academia">Explorar Academia <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="button button-outline" href="/es/consultoria">Ver Consultoría</Link>
            </div>
            <div className="hero-note">
              <span className="mono">01 / PRINCIPIO</span>
              <span><strong>La IA solo importa cuando mejora una decisión o un trabajo.</strong><br />Diseñamos desde ese punto.</span>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Declaración de aiLearning">
            <div className="panel-index"><span className="mono">AILEARNING / MX</span><span className="mono">2026</span></div>
            <p className="panel-statement">La herramienta cambia. El criterio se queda.</p>
            <div className="panel-footer"><span>Formación</span><span>Consultoría</span></div>
          </aside>
        </div>
      </section>

      <section className="section" aria-labelledby="elige-ruta">
        <div className="container">
          <p className="eyebrow">Dos rutas, una misma exigencia</p>
          <h2 className="title" id="elige-ruta">¿Qué necesitas mover hoy?</h2>
          <div className="choice-grid" style={{ marginTop: "2.5rem" }}>
            <Link className="choice" href="/es/academia">
              <span className="choice-number mono">RUTA 01 · PROFESIONALES</span>
              <BookOpen size={34} strokeWidth={1.5} aria-hidden="true" />
              <h2>Quiero<br />aprender.</h2>
              <p>Rutas prácticas para entender, construir y trabajar con sistemas de IA con mayor autonomía.</p>
              <span className="choice-link">Conocer Academia <ArrowUpRight size={18} aria-hidden="true" /></span>
            </Link>
            <Link className="choice choice-consult" href="/es/consultoria">
              <span className="choice-number mono">RUTA 02 · ORGANIZACIONES</span>
              <BriefcaseBusiness size={34} strokeWidth={1.5} aria-hidden="true" />
              <h2>Quiero<br />implementar.</h2>
              <p>Diagnóstico y acompañamiento para convertir una oportunidad en una solución útil y gobernable.</p>
              <span className="choice-link">Conocer Consultoría <ArrowUpRight size={18} aria-hidden="true" /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="manifesto section">
        <div className="container manifesto-grid">
          <div><p className="eyebrow">Nuestra postura</p><p className="mono">HUMANO → SISTEMA → RESULTADO</p></div>
          <div className="manifesto-copy"><p>No vendemos una colección de trucos. <span>Diseñamos comprensión, práctica y sistemas</span> alrededor del trabajo que sí tiene que suceder.</p></div>
        </div>
      </section>

      <section className="section" aria-labelledby="metodo">
        <div className="container method-grid">
          <div className="sticky-intro"><p className="eyebrow">Método</p><h2 className="title" id="metodo">Del problema a una capacidad.</h2><p className="subtitle">Un proceso corto para aprender antes de escalar.</p></div>
          <div className="steps">{steps.map(([index, title, copy]) => <article className="step" key={index}><span className="step-index mono">{index}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        </div>
      </section>

      <section className="resources section" aria-labelledby="recursos">
        <div className="container">
          <p className="eyebrow">Recursos vigentes</p><h2 className="title" id="recursos">Empieza por algo concreto.</h2>
          <div className="resource-grid">
            <Link className="resource-card" href="/es/academia"><BookOpen aria-hidden="true" /><h3>Ruta Academia</h3><p>Comprende el enfoque y continúa el registro en la plataforma académica.</p></Link>
            <Link className="resource-card" href="/es/consultoria"><Compass aria-hidden="true" /><h3>Diagnóstico de oportunidad</h3><p>Ordena un caso de uso antes de comprometer tecnología y presupuesto.</p></Link>
            <Link className="resource-card" href="/jornadas2026"><FileText aria-hidden="true" /><h3>Guía Jornadas 2026</h3><p>Recurso descargable de la campaña para asistentes de AMCP.</p></Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="preguntas">
        <div className="container content-grid">
          <div><p className="eyebrow">Preguntas frecuentes</p><h2 className="title" id="preguntas">Antes de empezar.</h2></div>
          <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="cta-band section-sm">
        <div className="container cta-grid"><div><p className="eyebrow">Siguiente paso</p><h2 className="title">Elige una pregunta real. Empecemos ahí.</h2></div><Link className="button button-light" href="/es/contacto">Hablemos <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </section>
    </>
  );
}
