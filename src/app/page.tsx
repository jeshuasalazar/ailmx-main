"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { RegisterModal } from "./components/RegisterModal";
import { AvatarVSL } from "./components/AvatarVSL";
import { Ladder } from "./components/Ladder";

/* ─────────────────────────────────────────────────────────────
   THEME SYSTEM — dark/light + i18n
   ───────────────────────────────────────────────────────────── */
type Theme = "dark" | "light";
type Lang  = "es" | "en";

const T = {
  es: {
    nav: ["Formación","Consultoría","Precios","Cursos","Preguntas"],
    navCta: "Comenzar gratis",
    heroEyebrow: "IA aplicada · Formación y consultoría · México",
    heroH1a: "Dos caminos para llevar",
    heroH1b: "la IA a tu negocio:",
    heroH1c: "aprender",
    heroH1d: "o",
    heroH1e: "implementar.",
    heroLead: "Empieza gratis. Sube de nivel sólo si ves valor. Sin contratos, sin letra chica.",
    heroMeta: ["SAS constituida en México","CFDI 4.0","MXN · OXXO · SPEI · Tarjeta"],
    formTag: "Formación · Suscripción",
    formFree: "Empieza gratis",
    formH3: "Aprende IA haciendo.",
    formSub: "Cursos nuevos cada mes, sesiones en vivo, comunidad y mentoría. Cancela cuando quieras.",
    formPoints: ["Todo el catálogo en vivo y on-demand","Sesiones semanales con especialistas","Comunidad privada en Discord","Horas de oficina y mentoría 1:1"],
    formPrice: "699",
    formPriceSub: "/mes MXN",
    formNote: "o 2 meses gratis al año",
    formGuarantee: "Garantía 14 días: primer agente funcional o reembolso completo.",
    formCta: "Comenzar gratis",
    formCta2: "Ver planes",
    consTag: "Consultoría · Proyecto",
    consFree: "Diagnóstico gratis",
    consH3: "Implementamos IA en tu empresa.",
    consSub: "Del diagnóstico al agente en producción en 30 días. Sin retainers. Tú te quedas con todo.",
    consPoints: ["Diagnóstico de oportunidades y ROI · sin costo","Arquitectura, agentes y RAG corporativo","Despliegue en tu stack actual","Capacitación del equipo interno"],
    consPrice: "Desde 120K",
    consPriceSub: "MXN / proyecto",
    consNote: "Pagas en semana 5 contra ROI",
    consGuarantee: "Garantía 30 días: agente en producción o implementación gratis.",
    consCta: "Agendar diagnóstico",
    consCta2: "Ver casos",
    stats: [["2,400+","Alumnos formados"],["60+","Empresas atendidas"],["30 días","Time-to-production"],["100% ROI","Semana 5 consultoría"]],
    // Secciones
    ladderEyebrow: "Formación · Escalera de valor",
    ladderH2a: "De",
    ladderH2b: "curiosidad",
    ladderH2c: "a",
    ladderH2d: "experto aplicando IA",
    ladderH2e: ", al ritmo que elijas.",
    ladderLead: "Empieza gratis, sube sólo cuando tengas razones. Cada escalón multiplica lo que puedes construir.",
    guarF: "Garantía Formación · 14 días",
    guarFText: "Si en 14 días no has desplegado tu primer agente de IA funcional, te devolvemos el 100%. No vendemos videos, vendemos habilidades.",
    guarC: "Garantía Consultoría · 30 días",
    guarCText: "Tu agente en producción en 30 días o la implementación es gratis. El riesgo de la innovación lo asumimos nosotros.",
    pricingEyebrow: "Suscripción de formación",
    pricingH2a: "Planes claros.",
    pricingH2b: "Cancela cuando quieras.",
    pricingLead: "Todos los planes incluyen comunidad y actualizaciones mensuales. Facturación CFDI 4.0.",
    monthly: "Mensual", annual: "Anual",
    annualSave: "−2 MESES",
    plans: [
      { name:"Explorador", blurb:"Para empezar hoy mismo, sin tarjeta.", price:"$0", per:"/siempre", items:["3 cursos intro seleccionados","Comunidad abierta","Newsletter y recursos semanales"], dim:["Sesiones en vivo","Mentoría de oficina"], cta:"Crear cuenta", ctaStyle:"ghost" },
      { name:"Pro", blurb:"Todo lo que necesitas para llevar IA a tu día a día.", price:"$1,499", priceAnn:"$1,249", per:"/mes", items:["Todo el catálogo (en vivo + on-demand)","Sesiones en vivo semanales","Comunidad privada Discord","2 h/mes de oficina 1:1","Certificados verificables"], dim:[], cta:"Comenzar 14 días", ctaStyle:"blue", featured:true, ribbon:"Más elegido" },
      { name:"Ejecutivo", blurb:"Para equipos que quieren avanzar juntos.", price:"$4,900", priceAnn:"$4,083", per:"/mes", items:["Todo lo de Pro para 5 licencias","Cohortes privadas por empresa","Reporte de progreso del equipo","Integración SSO corporativo","20% dto. en consultoría"], dim:[], cta:"Hablar con ventas", ctaStyle:"ink" },
    ],
    pricingNote: "¿Solo quieres un curso? Compra suelto desde $1,900 MXN · CFDI 4.0 incluido",
    // Consultoría sección
    consHeroEyebrow: "Consultoría por proyecto",
    consHeroH2: "Del diagnóstico al agente en producción. En 30 días.",
    consHeroLead: "No vendemos presentaciones. Diseñamos, construimos y desplegamos sistemas de IA en tu stack, con tu equipo, hasta que funcionan en producción.",
    consPayTitle: "Cómo pagas",
    consPayText: "Pago único por proyecto. Sin retainers. Pagas en semana 5 contra el ROI medido. Si en 30 días el sistema no ejecuta procesos reales, reembolsamos todo.",
    // Cursos
    coursesEyebrow: "Cursos destacados",
    coursesH2a: "Aprende con",
    coursesH2b: "casos reales",
    coursesH2c: ", no con demos.",
    courses: [
      { label:"FIG · 01 / AGENTES", meta:["10 SEM · EN VIVO","NIVEL 02"], title:"Ingeniería de Agentes IA con LangChain", desc:"Construye agentes autónomos capaces de razonar, planificar y ejecutar tareas multi-paso.", price:"$8,900" },
      { label:"FIG · 02 / n8n",     meta:["4 SEM · ON-DEMAND","NIVEL 01"], title:"Automatización sin código con n8n", desc:"Diseña flujos de trabajo de IA que conectan tus herramientas sin escribir una línea de código.", price:"$3,900" },
      { label:"FIG · 03 / RAG",     meta:["8 SEM · EN VIVO","NIVEL 03"], title:"RAG Empresarial: tu conocimiento, tu IA", desc:"Sistemas RAG seguros sobre la base documental de tu empresa.", price:"$14,900" },
      { label:"FIG · 04 / VENTAS",  meta:["5 SEM · EN VIVO","NIVEL 01"], title:"IA para Ventas y CRM", desc:"Agentes que califican leads, redactan y dan seguimiento. Casos MX.", price:"$4,400" },
    ],
    // Caso
    casoEyebrow: "Caso de estudio",
    casoH2: "Un retailer regional redujo 38% el tiempo de atención al cliente.",
    casoStats: [["-38%","Tiempo de atención"],["+22%","CSAT"],["6 sem","Time-to-prod"],["3","Canales activos"]],
    casoQuote: "\"No vinieron a vender humo. Entregaron un agente funcionando y capacitaron al equipo interno. Pagamos en semana 5, con el ROI en la mano.\"",
    casoWho: "Jorge Delgado", casoRole: "Director de Operaciones",
    // Testimonios
    logosTitle: "Empresas que nos han elegido",
    logos: ["Grupo N42","Vertix","Corpo Lat","Nodo Azul","Meta Sur","Orb Tec"],
    testimonials: [
      { q:"\"El diplomado nos dio un lenguaje común entre negocio y TI. En 3 meses teníamos dos pilotos en producción.\"", name:"Mariana Ríos", role:"CTO · Grupo Logístico" },
      { q:"\"La suscripción vale sólo por las sesiones en vivo. Pregunto, construyo, pregunto otra vez, construyo mejor.\"", name:"Andrea Valverde", role:"Lead de Marketing" },
      { q:"\"Pagué sólo cuando el agente estaba en producción. Ningún otro proveedor nos ofreció eso.\"", name:"Ricardo Méndez", role:"CFO · Retailer Regional" },
    ],
    // FAQ
    faqEyebrow: "Preguntas frecuentes",
    faqH2a: "Lo que",
    faqH2b: "necesitas saber",
    faqH2c: "antes de empezar.",
    faqs: [
      ["¿Puedo empezar gratis?","Sí. Formación tiene un plan Explorador gratuito permanente (sin tarjeta). Consultoría siempre arranca con un diagnóstico sin costo de 30 minutos."],
      ["¿Cómo funciona la garantía de 14 días?","Si en 14 días no has desplegado tu primer agente de IA funcional, escribes a soporte y te devolvemos el 100%. No pedimos explicaciones."],
      ["¿Cómo es el pago de consultoría en semana 5?","Firmamos el alcance al inicio. Trabajamos el primer mes sin cobrar. Al cumplir 30 días revisamos el ROI medido con tu equipo. Si el agente está en producción y con impacto, pagas. Si no, nos vamos sin cobrar."],
      ["¿Emiten factura CFDI 4.0?","Sí. Somos una SAS constituida en México. Facturamos todas las suscripciones y proyectos en CFDI 4.0, uso y método de pago según tu régimen."],
      ["¿Qué métodos de pago aceptan?","Tarjeta (Stripe y Mercado Pago), SPEI y OXXO para clientes mexicanos. Proyectos también aceptan transferencia interbancaria."],
      ["¿Puedo cancelar la suscripción cuando quiera?","Sí. Cancelas desde tu portal con un click, efectiva al final del período en curso."],
      ["¿Puedo comprar un curso sin suscripción?","Sí. Si después te suscribes, acreditamos el monto del curso contra tu primer mes de Pro."],
    ],
    // Final CTA
    ctaFinalEyebrow: "Empezar hoy",
    ctaFinalH2: "Dos caminos, cero fricción.",
    ctaFinalSub: "Formación en IA por suscripción o consultoría por proyecto. Ambos empiezan gratis. Ambos comprometen resultados.",
    ctaF: "Comenzar formación gratis",
    ctaC: "Diagnóstico de consultoría",
    ctaWA: "Escribir por WhatsApp",
    // Footer
    footDesc: "Formación y consultoría en inteligencia artificial. SAS constituida en México.",
    footLegal: ["CFDI 4.0","Aviso de privacidad","Términos de uso","Política de cookies"],
    footCols: [
      { title:"Formación", links:[["Planes y precios","#precios"],["Catálogo","#cursos"],["Cursos sueltos","#cursos"],["Corporativo","#precios"]] },
      { title:"Consultoría", links:[["Diagnóstico gratis","#consultoria-hero"],["Casos","#casos"],["Agentes IA","#consultoria-hero"],["RAG empresarial","#consultoria-hero"]] },
      { title:"Contacto", links:[["hola@ailearning.mx","mailto:hola@ailearning.mx"],["WhatsApp","https://wa.me/5210000000000"],["LinkedIn","#"],["Calendly","#"]] },
    ],
    footBottom: "© 2026 aiLearning SAS · Hecho en México",
    privacy: "Al continuar aceptas nuestro",
    privacyLink: "aviso de privacidad",
  },
  en: {
    nav: ["Training","Consulting","Pricing","Courses","FAQ"],
    navCta: "Start free",
    heroEyebrow: "Applied AI · Training & consulting · Mexico",
    heroH1a: "Two paths to bring",
    heroH1b: "AI to your business:",
    heroH1c: "learn",
    heroH1d: "or",
    heroH1e: "implement.",
    heroLead: "Start free. Level up only when you see value. No long contracts, no fine print.",
    heroMeta: ["SAS incorporated in Mexico","CFDI 4.0","MXN · OXXO · SPEI · Card"],
    formTag: "Training · Subscription",
    formFree: "Start free",
    formH3: "Learn AI by doing.",
    formSub: "New courses every month, live sessions, community and mentorship. Cancel anytime.",
    formPoints: ["Full catalog live and on-demand","Weekly live sessions with specialists","Private Discord community","Office hours and 1:1 mentorship"],
    formPrice: "699",
    formPriceSub: "/mo MXN",
    formNote: "or 2 months free annually",
    formGuarantee: "14-day guarantee: first functional agent or full refund.",
    formCta: "Start free",
    formCta2: "See plans",
    consTag: "Consulting · Project",
    consFree: "Free diagnosis",
    consH3: "We implement AI in your company.",
    consSub: "From diagnosis to agent in production in 30 days. No retainers. You keep everything.",
    consPoints: ["Opportunity and ROI diagnosis · free","Architecture, agents and corporate RAG","Deployment in your current stack","Internal team training"],
    consPrice: "From 120K",
    consPriceSub: "MXN / project",
    consNote: "Pay at week 5 against ROI",
    consGuarantee: "30-day guarantee: agent in production or free implementation.",
    consCta: "Schedule diagnosis",
    consCta2: "See cases",
    stats: [["2,400+","Students trained"],["60+","Companies served"],["30 days","Time-to-production"],["100% ROI","Week 5 consulting"]],
    ladderEyebrow: "Training · Value ladder",
    ladderH2a: "From",
    ladderH2b: "curiosity",
    ladderH2c: "to",
    ladderH2d: "AI expert",
    ladderH2e: ", at your own pace.",
    ladderLead: "Start free, level up only when you have reasons. Each step multiplies what you can build.",
    guarF: "Training Guarantee · 14 days",
    guarFText: "If in 14 days you haven't deployed your first functional AI agent, we refund 100%. We don't sell videos, we sell skills.",
    guarC: "Consulting Guarantee · 30 days",
    guarCText: "Your agent in production in 30 days or the implementation is free. We take the innovation risk.",
    pricingEyebrow: "Training subscription",
    pricingH2a: "Clear plans.",
    pricingH2b: "Cancel anytime.",
    pricingLead: "All plans include community and monthly updates. CFDI 4.0 invoicing.",
    monthly: "Monthly", annual: "Annual",
    annualSave: "−2 MONTHS",
    plans: [
      { name:"Explorer", blurb:"Start today, no card needed.", price:"$0", per:"/forever", items:["3 intro courses","Open community","Weekly newsletter"], dim:["Live sessions","Office hours"], cta:"Create account", ctaStyle:"ghost" },
      { name:"Pro", blurb:"Everything you need to apply AI daily.", price:"$1,499", priceAnn:"$1,249", per:"/mo", items:["Full catalog (live + on-demand)","Weekly live sessions","Private Discord","2 h/mo 1:1 office hours","Verifiable certificates"], dim:[], cta:"Start 14 days", ctaStyle:"blue", featured:true, ribbon:"Most chosen" },
      { name:"Executive", blurb:"For teams moving forward together.", price:"$4,900", priceAnn:"$4,083", per:"/mo", items:["Everything in Pro for 5 seats","Private company cohorts","Team progress reporting","SSO integration","20% off consulting"], dim:[], cta:"Talk to sales", ctaStyle:"ink" },
    ],
    pricingNote: "Want just one course? Buy standalone from $1,900 MXN · CFDI 4.0 included",
    consHeroEyebrow: "Project consulting",
    consHeroH2: "From diagnosis to agent in production. In 30 days.",
    consHeroLead: "We don't sell presentations. We design, build and deploy AI systems in your stack, with your team, until they work in production.",
    consPayTitle: "How you pay",
    consPayText: "One-time project fee. No retainers. Pay at week 5 against measured ROI. If in 30 days the system isn't running real processes, we refund everything.",
    coursesEyebrow: "Featured courses",
    coursesH2a: "Learn with",
    coursesH2b: "real cases",
    coursesH2c: ", not demos.",
    courses: [
      { label:"FIG · 01 / AGENTS", meta:["10 WK · LIVE","LEVEL 02"], title:"AI Agent Engineering with LangChain", desc:"Build autonomous agents capable of reasoning, planning and executing multi-step tasks.", price:"$8,900" },
      { label:"FIG · 02 / n8n",    meta:["4 WK · ON-DEMAND","LEVEL 01"], title:"No-code automation with n8n", desc:"Design AI workflows connecting your tools without writing a single line of code.", price:"$3,900" },
      { label:"FIG · 03 / RAG",    meta:["8 WK · LIVE","LEVEL 03"], title:"Enterprise RAG: your knowledge, your AI", desc:"Secure RAG systems over your company's document base.", price:"$14,900" },
      { label:"FIG · 04 / SALES",  meta:["5 WK · LIVE","LEVEL 01"], title:"AI for Sales and CRM", desc:"Agents that qualify leads, draft and follow up. MX cases.", price:"$4,400" },
    ],
    casoEyebrow: "Case study",
    casoH2: "A regional retailer reduced customer service time by 38%.",
    casoStats: [["-38%","Service time"],["+22%","CSAT"],["6 wk","Time-to-prod"],["3","Active channels"]],
    casoQuote: "\"They didn't come to sell smoke. They delivered a working agent and trained the internal team. We paid at week 5, ROI in hand.\"",
    casoWho: "Jorge Delgado", casoRole: "Operations Director",
    logosTitle: "Companies that chose us",
    logos: ["Grupo N42","Vertix","Corpo Lat","Nodo Azul","Meta Sur","Orb Tec"],
    testimonials: [
      { q:"\"The program gave us a common language between business and IT. In 3 months we had two pilots in production.\"", name:"Mariana Ríos", role:"CTO · Logistics Group" },
      { q:"\"The subscription is worth it just for the live sessions. I ask, I build, I ask again, I build better.\"", name:"Andrea Valverde", role:"Marketing Lead" },
      { q:"\"I only paid when the agent was in production. No other vendor offered that.\"", name:"Ricardo Méndez", role:"CFO · Regional Retailer" },
    ],
    faqEyebrow: "Frequently asked questions",
    faqH2a: "What you",
    faqH2b: "need to know",
    faqH2c: "before starting.",
    faqs: [
      ["Can I start free?","Yes. Training has a permanent free Explorer plan (no card). Consulting always starts with a free 30-minute diagnosis."],
      ["How does the 14-day guarantee work?","If in 14 days you haven't deployed your first functional AI agent, contact support and we refund 100%. No questions asked."],
      ["How does week 5 consulting payment work?","We sign the scope upfront. We work the first month without charging. At 30 days we review measured ROI with your team. If the agent is in production with impact, you pay. Otherwise we leave without charging."],
      ["Do you issue CFDI 4.0 invoices?","Yes. We are a SAS incorporated in Mexico. We invoice all subscriptions and projects in CFDI 4.0."],
      ["What payment methods do you accept?","Card (Stripe and Mercado Pago), SPEI and OXXO for Mexican clients."],
      ["Can I cancel the subscription anytime?","Yes. Cancel from your portal with one click, effective at the end of the current period."],
      ["Can I buy a course without subscribing?","Yes. If you later subscribe, we credit the course amount against your first Pro month."],
    ],
    ctaFinalEyebrow: "Start today",
    ctaFinalH2: "Two paths, zero friction.",
    ctaFinalSub: "AI training by subscription or consulting by project. Both start free. Both commit to results.",
    ctaF: "Start training free",
    ctaC: "Consulting diagnosis",
    ctaWA: "Write on WhatsApp",
    footDesc: "Artificial intelligence training and consulting. SAS incorporated in Mexico.",
    footLegal: ["CFDI 4.0","Privacy notice","Terms of use","Cookie policy"],
    footCols: [
      { title:"Training", links:[["Plans & pricing","#precios"],["Catalog","#cursos"],["Single courses","#cursos"],["Corporate","#precios"]] },
      { title:"Consulting", links:[["Free diagnosis","#consultoria-hero"],["Cases","#casos"],["AI Agents","#consultoria-hero"],["Enterprise RAG","#consultoria-hero"]] },
      { title:"Contact", links:[["hola@ailearning.mx","mailto:hola@ailearning.mx"],["WhatsApp","https://wa.me/5210000000000"],["LinkedIn","#"],["Calendly","#"]] },
    ],
    footBottom: "© 2026 aiLearning SAS · Made in Mexico",
    privacy: "By continuing you accept our",
    privacyLink: "privacy notice",
  },
};

/* ─────────────────────────────────────────────────────────────
   COUNTER
   ───────────────────────────────────────────────────────────── */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView) return;
    const dur = 1400, start = performance.now();
    const update = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [inView, target]);
  return <span ref={ref}>{val.toLocaleString("es-MX")}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────
   REVEAL WRAPPER
   ───────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PARTICLE CANVAS
   ───────────────────────────────────────────────────────────── */
function ParticleCanvas({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const pts = Array.from({ length: 28 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 700,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.2 + 0.4,
    }));
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = theme === "dark" ? "96,165,250" : "30,64,175";
      pts.forEach(p => { p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1; });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${color},${(1-d/160)*0.25})`; ctx.lineWidth = 0.5; ctx.stroke(); }
      }
      pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},0.7)`; ctx.fill(); });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [theme]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"/>;
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────────────────────── */
export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang]   = useState<Lang>("es");
  const [billing, setBilling] = useState<"monthly"|"annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [modal, setModal] = useState<{open:boolean;tipo:"f"|"b";email:string}>({open:false,tipo:"f",email:""});
  const [sent, setSent]   = useState<{f:boolean;b:boolean}>({f:false,b:false});

  const t = T[lang];

  // CSS variables dinámicas según tema
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.style.setProperty("--bg", "#0A0A0B");
      root.style.setProperty("--surface", "#111113");
      root.style.setProperty("--surface2", "#18181B");
      root.style.setProperty("--ink", "#F5F4EE");
      root.style.setProperty("--ink2", "#D7D5CA");
      root.style.setProperty("--muted", "#8F8E87");
      root.style.setProperty("--faint", "#5B5B5E");
      root.style.setProperty("--line", "#26262A");
      root.style.setProperty("--blue", "#6E8FEA");
      root.style.setProperty("--orange", "#E88854");
    } else {
      root.style.setProperty("--bg", "#FAFAF7");
      root.style.setProperty("--surface", "#FFFFFF");
      root.style.setProperty("--surface2", "#F3F2ED");
      root.style.setProperty("--ink", "#0A0A0B");
      root.style.setProperty("--ink2", "#1E1E20");
      root.style.setProperty("--muted", "#6B6B70");
      root.style.setProperty("--faint", "#9B9B9F");
      root.style.setProperty("--line", "#E4E2DA");
      root.style.setProperty("--blue", "#1E40AF");
      root.style.setProperty("--orange", "#D96A2C");
    }
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";
  const bg       = isDark ? "#0A0A0B"  : "#FAFAF7";
  const surface  = isDark ? "#111113"  : "#FFFFFF";
  const surface2 = isDark ? "#18181B"  : "#F3F2ED";
  const ink      = isDark ? "#F5F4EE"  : "#0A0A0B";
  const ink2     = isDark ? "#D7D5CA"  : "#1E1E20";
  const muted    = isDark ? "#8F8E87"  : "#6B6B70";
  const faint    = isDark ? "#5B5B5E"  : "#9B9B9F";
  const line     = isDark ? "#26262A"  : "#E4E2DA";
  const blue     = isDark ? "#6E8FEA"  : "#1E40AF";
  const blueSoft = isDark ? "#151B33"  : "#EEF2FC";
  const orange   = isDark ? "#E88854"  : "#D96A2C";
  const orgSoft  = isDark ? "#2A1C12"  : "#FAF0E7";

  // Helpers de estilo
  const S = {
    bg, surface, surface2, ink, ink2, muted, faint, line, blue, blueSoft, orange, orgSoft,
    fontDisplay: "'Fraunces', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', ui-monospace, monospace",
    btnBlue: { background: blue, color: "#fff", border: "none", padding: "13px 24px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontFamily: "'Inter',sans-serif", boxShadow: `0 0 24px ${blue}66, 0 0 48px ${blue}22`, transition: "all 0.25s" } as React.CSSProperties,
    btnOrange: { background: orange, color: "#fff", border: "none", padding: "13px 24px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontFamily: "'Inter',sans-serif", boxShadow: `0 0 24px ${orange}66, 0 0 48px ${orange}22`, transition: "all 0.25s" } as React.CSSProperties,
    btnInk: { background: ink, color: bg, border: "none", padding: "13px 24px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontFamily: "'Inter',sans-serif", boxShadow: `0 0 20px ${ink}33`, transition: "all 0.25s" } as React.CSSProperties,
    btnGhost: { background: "transparent", color: ink, borderWidth: "1px", borderStyle: "solid", borderColor: line, padding: "12px 24px", borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontFamily: "'Inter',sans-serif", transition: "all 0.25s" } as React.CSSProperties,
    eyebrow: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, display: "inline-flex", alignItems: "center", gap: 10 },
    mono: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: faint },
    h1: { fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.05, color: ink, fontVariationSettings: '"opsz" 144' } as React.CSSProperties,
    h2: { fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300, letterSpacing: "-0.025em", lineHeight: 1.05, color: ink, fontVariationSettings: '"opsz" 144' } as React.CSSProperties,
    h3: { fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, color: ink } as React.CSSProperties,
  };

  return (
    <>
    {/* Google Fonts */}
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      html{scroll-behavior:smooth}
      body{font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
      button:hover,a[href]:hover{opacity:0.88;transform:translateY(-1px)}
      button:active,a[href]:active{transform:translateY(0);opacity:1}
      ::selection{background:${blue}33}
      .wrap{max-width:1260px;margin:0 auto;padding:0 clamp(20px,4vw,56px)}
    `}</style>

    <RegisterModal
      open={modal.open} tipo={modal.tipo} emailInicial={modal.email}
      onClose={() => setModal(m => ({...m, open:false}))}
      onSuccess={() => { setModal(m=>({...m,open:false})); setSent(s=>({...s,[modal.tipo]:true})); }}
    />

    <div style={{ background: bg, color: ink, minHeight: "100vh", transition: "background 0.3s, color 0.3s" }}>

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: isDark ? "rgba(10,10,11,0.88)" : "rgba(250,250,247,0.88)",
        backdropFilter: "blur(16px) saturate(130%)",
        borderBottom: `1px solid ${line}`,
        transition: "background 0.3s",
      }}>
        <div className="wrap" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:68 }}>
          {/* Logo */}
          <a href="#" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <img src="/logo-ailearning.png" alt="aiLearning" style={{ height:36, width:"auto", objectFit:"contain" }}/>

          </a>
          {/* Links desktop */}
          <nav style={{ display:"flex", gap:32, alignItems:"center" }} className="hide-mobile">
            {t.nav.map((l,i) => (
              <a key={i} href={`#${["formacion","consultoria-hero","precios","cursos","faq"][i]}`}
                style={{ color:ink2, textDecoration:"none", fontSize:14, transition:"color 0.2s" }}
                onMouseOver={e=>(e.currentTarget.style.color=ink)}
                onMouseOut={e=>(e.currentTarget.style.color=ink2)}>
                {l}
              </a>
            ))}
          </nav>
          {/* CTA area */}
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {/* Lang toggle */}
            <button onClick={() => setLang(l => l === "es" ? "en" : "es")}
              style={{ background:"transparent", border:`1px solid ${line}`, borderRadius:999, fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:"0.12em", padding:"6px 10px", color:muted, cursor:"pointer", transition:"all 0.2s" }}>
              {lang === "es" ? "EN" : "ES"}
            </button>
            {/* Theme toggle */}
            <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              style={{ background:"transparent", border:`1px solid ${line}`, borderRadius:999, padding:"6px 10px", color:muted, cursor:"pointer", fontSize:14, transition:"all 0.2s" }}
              title={isDark ? "Modo claro" : "Modo oscuro"}>
              {isDark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setModal({open:true,tipo:"f",email:""})}
              style={S.btnInk}>
              {t.navCta} <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <section style={{ padding:"clamp(70px,9vw,120px) 0 0", position:"relative", overflow:"hidden", background: bg }}>
        <ParticleCanvas theme={theme}/>
        <div className="wrap" style={{ position:"relative", zIndex:1 }}>
          {/* Eyebrow */}
          <Reveal>
            <div style={{ ...S.eyebrow, color:muted, marginBottom:24 }}>
              <span style={{ width:18, height:1, background:"currentColor", display:"inline-block" }}/>
              {t.heroEyebrow}
            </div>
          </Reveal>
          {/* H1 */}
          <Reveal delay={0.05}>
            <h1 style={{ ...S.h1, fontSize:"clamp(44px,6.5vw,88px)", maxWidth:"16ch", marginBottom:24 }}>
              {t.heroH1a}<br/>
              {t.heroH1b}<br/>
              <em style={{ fontStyle:"italic", color:blue }}>{t.heroH1c}</em>{" "}{t.heroH1d}{" "}
              <em style={{ fontStyle:"italic", color:orange }}>{t.heroH1e}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize:"clamp(17px,1.4vw,20px)", color:ink2, maxWidth:"62ch", fontWeight:300, lineHeight:1.5, marginBottom:16 }}>
              {t.heroLead}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", color:muted, fontSize:13, marginBottom:48 }}>
              {t.heroMeta.map((m,i) => (
                <span key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {i>0 && <span style={{ width:4, height:4, borderRadius:"50%", background:"currentColor", opacity:0.5 }}/>}
                  {m}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Dual offer cards */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:0 }} className="dual-grid">
            {/* Formación */}
            <Reveal delay={0.16}>
              <article style={{ background:surface, border:`1px solid ${line}`, borderRadius:14, padding:"clamp(28px,3.5vw,44px)", display:"grid", gap:20, position:"relative", transition:"border-color 0.3s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ ...S.eyebrow, color:blue }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.formTag}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:blue, background:blueSoft, padding:"4px 10px", borderRadius:4 }}>{t.formFree}</span>
                </div>
                <h3 style={S.h3}>{t.formH3} <em style={{fontStyle:"italic",fontWeight:300,color:blue}}>Una suscripción, todo el catálogo.</em></h3>
                <p style={{ color:muted, fontSize:15 }}>{t.formSub}</p>
                <ul style={{ display:"grid", gap:10, listStyle:"none" }}>
                  {t.formPoints.map((p,i) => (
                    <li key={i} style={{ fontSize:14, color:ink2, paddingLeft:22, position:"relative" }}>
                      <span style={{ position:"absolute", left:0, top:7, width:12, height:6, borderLeft:`1.5px solid ${blue}`, borderBottom:`1.5px solid ${blue}`, transform:"rotate(-45deg)", display:"inline-block" }}/>
                      {p}
                    </li>
                  ))}
                </ul>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontWeight:300, letterSpacing:"-0.025em", lineHeight:1 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:faint, letterSpacing:"0.12em", verticalAlign:"top", marginTop:4, display:"inline-block" }}>MXN</span>
                    <span style={{ fontSize:"clamp(44px,5vw,56px)", color:ink }}>{t.formPrice}</span>
                  </div>
                  <span style={{ color:muted, fontSize:14 }}>{t.formPriceSub}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:faint }}>{t.formNote}</span>
                </div>
                <div style={{ background:blueSoft, borderLeft:`3px solid ${blue}`, padding:"12px 16px", borderRadius:"0 6px 6px 0", fontSize:14, color:ink2, lineHeight:1.5 }}>
                  <strong style={{ fontWeight:600, color:ink }}>{lang==="es"?"Garantía 14 días:":"14-day guarantee:"}</strong>{" "}{t.formGuarantee.replace("Garantía 14 días:","").replace("14-day guarantee:","")}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button onClick={() => setModal({open:true,tipo:"f",email:""})} style={S.btnBlue}>{t.formCta} <span>→</span></button>
                  <a href="#formacion" style={S.btnGhost}>{t.formCta2}</a>
                </div>
              </article>
            </Reveal>

            {/* Consultoría */}
            <Reveal delay={0.2}>
              <article style={{ background:surface, border:`1px solid ${line}`, borderRadius:14, padding:"clamp(28px,3.5vw,44px)", display:"grid", gap:20, position:"relative" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ ...S.eyebrow, color:orange }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.consTag}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:orange, background:orgSoft, padding:"4px 10px", borderRadius:4 }}>{t.consFree}</span>
                </div>
                <h3 style={S.h3}>{t.consH3} <em style={{fontStyle:"italic",fontWeight:300,color:orange}}>Pago único por proyecto.</em></h3>
                <p style={{ color:muted, fontSize:15 }}>{t.consSub}</p>
                <ul style={{ display:"grid", gap:10, listStyle:"none" }}>
                  {t.consPoints.map((p,i) => (
                    <li key={i} style={{ fontSize:14, color:ink2, paddingLeft:22, position:"relative" }}>
                      <span style={{ position:"absolute", left:0, top:7, width:12, height:6, borderLeft:`1.5px solid ${orange}`, borderBottom:`1.5px solid ${orange}`, transform:"rotate(-45deg)", display:"inline-block" }}/>
                      {p}
                    </li>
                  ))}
                </ul>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontWeight:300, letterSpacing:"-0.025em", lineHeight:1 }}>
                    <span style={{ fontSize:"clamp(36px,4vw,48px)", color:ink }}>{t.consPrice}</span>
                  </div>
                  <span style={{ color:muted, fontSize:14 }}>{t.consPriceSub}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:faint }}>{t.consNote}</span>
                </div>
                <div style={{ background:orgSoft, borderLeft:`3px solid ${orange}`, padding:"12px 16px", borderRadius:"0 6px 6px 0", fontSize:14, color:ink2, lineHeight:1.5 }}>
                  <strong style={{ fontWeight:600, color:ink }}>{lang==="es"?"Garantía 30 días:":"30-day guarantee:"}</strong>{" "}{t.consGuarantee.replace("Garantía 30 días:","").replace("30-day guarantee:","")}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button onClick={() => setModal({open:true,tipo:"b",email:""})} style={S.btnOrange}>{t.consCta} <span>→</span></button>
                  <a href="#casos" style={S.btnGhost}>{t.consCta2}</a>
                </div>
              </article>
            </Reveal>
          </div>

          {/* Stats bar */}
          <Reveal delay={0.24}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderTop:`1px solid ${line}`, borderBottom:`1px solid ${line}`, marginTop:56 }} className="stats-grid">
              {t.stats.map(([n,l],i) => (
                <div key={i} style={{ padding:"28px 0", display:"grid", gap:6, borderLeft: i>0?`1px solid ${line}`:"none" }}>
                  <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:32, fontWeight:300, color:ink, letterSpacing:"-0.02em" }}>{n}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:faint }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FORMACIÓN VALUE LADDER ═══════════════════════════ */}
      <section id="formacion" style={{ padding:"clamp(80px,10vw,140px) 0", background: bg }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom:"clamp(40px,5vw,72px)", display:"grid", gap:16, maxWidth:"72ch" }}>
              <span style={{ ...S.eyebrow, color:blue }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.ladderEyebrow}</span>
              <h2 style={{ ...S.h2, fontSize:"clamp(32px,4.2vw,52px)" }}>
                {t.ladderH2a} <em style={{fontStyle:"italic",color:blue}}>{t.ladderH2b}</em> {t.ladderH2c} <em style={{fontStyle:"italic",color:blue}}>{t.ladderH2d}</em>{t.ladderH2e}
              </h2>
              <p style={{ fontSize:"clamp(17px,1.4vw,19px)", color:ink2, fontWeight:300, lineHeight:1.5 }}>{t.ladderLead}</p>
            </div>
          </Reveal>

          {/* Escaleras */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }} className="dual-grid">
            {/* Formación ladder */}
            <Reveal delay={0.05}>
              <div style={{ border:`1px solid ${line}`, borderRadius:14, padding:"clamp(28px,3.5vw,44px)", display:"grid", gap:0 }}>
                <span style={{ ...S.eyebrow, color:blue, marginBottom:10 }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>Formación</span>
                <h3 style={{ ...S.h3, marginTop:10, marginBottom:8 }}>Aprende <em style={{fontStyle:"italic"}}>paso a paso</em></h3>
                <p style={{ color:muted, fontSize:14, marginBottom:24 }}>Recurrente. Mensual o anual con 2 meses gratis. Cancela cuando quieras.</p>
                {[
                  { step:"01 / FREE",      title:"Explorador",  desc:"Fundamentos, 3 cursos intro y comunidad abierta. Sin tarjeta.", price:"$0", sub:"/siempre" },
                  { step:"02 / ESSENTIAL", title:"Catálogo completo", desc:"Todo el catálogo, sesiones en vivo, certificados verificables.", price:"$699", sub:"MXN/mes" },
                  { step:"03 / PRO",       title:"Pro · con mentoría", desc:"Todo lo anterior + 2 horas de oficina 1:1 al mes + plantillas.", price:"$1,499", sub:"MXN/mes" },
                  { step:"04 / EXECUTIVE", title:"Ejecutivo · equipos", desc:"Hasta 5 licencias, cohortes privadas y reporte de progreso.", price:"$4,900", sub:"MXN/mes" },
                ].map((r,i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:"0 16px", padding:"16px 0", borderTop:`1px solid ${line}`, alignItems:"start" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:blue, paddingTop:3, minWidth:100 }}>{r.step}</span>
                    <div>
                      <h4 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, fontWeight:400, letterSpacing:"-0.015em", color:ink, marginBottom:2 }}>{r.title}</h4>
                      <p style={{ fontSize:13, color:muted }}>{r.desc}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, fontWeight:300, color:ink }}>{r.price}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, display:"block", color:faint, letterSpacing:"0.1em" }}>{r.sub}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:20, marginTop:8, borderTop:`1px solid ${line}` }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:faint }}>Cursos sueltos desde $1,900 MXN</span>
                  <button onClick={() => setModal({open:true,tipo:"f",email:""})} style={S.btnBlue}>{lang==="es"?"Ver planes":"See plans"} <span>→</span></button>
                </div>
              </div>
            </Reveal>

            {/* Consultoría ladder */}
            <Reveal delay={0.1}>
              <div id="consultoria" style={{ border:`1px solid ${line}`, borderRadius:14, padding:"clamp(28px,3.5vw,44px)", display:"grid", gap:0 }}>
                <span style={{ ...S.eyebrow, color:orange, marginBottom:10 }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>Consultoría</span>
                <h3 style={{ ...S.h3, marginTop:10, marginBottom:8 }}>Implementa <em style={{fontStyle:"italic"}}>por proyecto</em></h3>
                <p style={{ color:muted, fontSize:14, marginBottom:24 }}>Pago único. Sin retainers. ROI comprometido en semana 5 o no pagas.</p>
                {[
                  { step:"01 / FREE",   title:"Diagnóstico",       desc:"Mapeo de oportunidades, priorización y propuesta. Sin costo.", price:"$0",    sub:"30 min" },
                  { step:"02 / SPRINT", title:"Piloto dirigido",    desc:"PoC funcional de un flujo con IA. 2 semanas, entregable claro.", price:"$85K",  sub:"MXN · único" },
                  { step:"03 / BUILD",  title:"Implementación",     desc:"Agente en producción en tu stack + capacitación. 30 días.", price:"$120K", sub:"MXN · desde" },
                  { step:"04 / SCALE",  title:"Transformación",     desc:"Portafolio de agentes, gobernanza y adopción en toda la empresa.", price:"Cotización", sub:"" },
                ].map((r,i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:"0 16px", padding:"16px 0", borderTop:`1px solid ${line}`, alignItems:"start" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:orange, paddingTop:3, minWidth:100 }}>{r.step}</span>
                    <div>
                      <h4 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, fontWeight:400, letterSpacing:"-0.015em", color:ink, marginBottom:2 }}>{r.title}</h4>
                      <p style={{ fontSize:13, color:muted }}>{r.desc}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, fontWeight:300, color:ink }}>{r.price}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, display:"block", color:faint, letterSpacing:"0.1em" }}>{r.sub}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:20, marginTop:8, borderTop:`1px solid ${line}` }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:faint }}>Pagas semana 5 contra ROI</span>
                  <button onClick={() => setModal({open:true,tipo:"b",email:""})} style={S.btnOrange}>{lang==="es"?"Agendar diagnóstico":"Schedule diagnosis"} <span>→</span></button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Garantías */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginTop:28 }} className="dual-grid">
            <Reveal delay={0.05}>
              <div style={{ background:blueSoft, borderLeft:`3px solid ${blue}`, padding:24, borderRadius:"0 10px 10px 0", fontSize:14, lineHeight:1.55 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:blue, display:"block", marginBottom:8 }}>{t.guarF}</span>
                <p style={{ color:ink2 }}>{t.guarFText}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background:orgSoft, borderLeft:`3px solid ${orange}`, padding:24, borderRadius:"0 10px 10px 0", fontSize:14, lineHeight:1.55 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:orange, display:"block", marginBottom:8 }}>{t.guarC}</span>
                <p style={{ color:ink2 }}>{t.guarCText}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════ */}
      <section id="precios" style={{ padding:"clamp(80px,10vw,140px) 0", background:surface2 }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom:"clamp(40px,5vw,72px)", textAlign:"center" }}>
              <span style={{ ...S.eyebrow, color:blue, justifyContent:"center", marginBottom:12, display:"flex" }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.pricingEyebrow}</span>
              <h2 style={{ ...S.h2, fontSize:"clamp(32px,4.2vw,52px)", textAlign:"center", marginBottom:16 }}>
                {t.pricingH2a} <em style={{fontStyle:"italic",color:blue}}>{t.pricingH2b}</em>
              </h2>
              <p style={{ fontSize:"clamp(17px,1.4vw,19px)", color:ink2, fontWeight:300, lineHeight:1.5, textAlign:"center", maxWidth:"60ch", margin:"0 auto" }}>{t.pricingLead}</p>
            </div>
          </Reveal>

          {/* Billing toggle */}
          <Reveal>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:40 }}>
              <div style={{ display:"inline-flex", background:surface, border:`1px solid ${line}`, borderRadius:999, padding:4, gap:4 }}>
                {[["monthly",t.monthly],["annual",`${t.annual} `]].map(([k,label]) => (
                  <button key={k} onClick={() => setBilling(k as "monthly"|"annual")}
                    style={{ background: billing===k ? surface2 : "transparent", color: billing===k ? ink : muted, border:"none", padding:"8px 18px", borderRadius:999, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6 }}>
                    {label}
                    {k==="annual" && <span style={{ background:blue, color:"#fff", fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:"0.1em", padding:"2px 6px", borderRadius:4 }}>{t.annualSave}</span>}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Plan cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }} className="plans-grid">
            {t.plans.map((plan, i) => (
              <Reveal key={i} delay={i*0.06}>
                <article style={{
                  background:surface, border:`1px solid ${(plan as any).featured ? blue : line}`,
                  borderRadius:14, padding:"clamp(28px,3vw,40px)", display:"grid", gap:20, alignContent:"start", position:"relative",
                  boxShadow: (plan as any).featured ? `0 20px 60px -30px ${blue}4d` : "none",
                  transition:"border-color 0.3s",
                }}>
                  {(plan as any).ribbon && (
                    <div style={{ position:"absolute", top:-11, left:24, background:blue, color:"#fff", fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", padding:"4px 10px", borderRadius:4 }}>
                      {(plan as any).ribbon}
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:22, fontWeight:400, letterSpacing:"-0.015em", color:ink, marginBottom:6 }}>{plan.name}</div>
                    <p style={{ fontSize:14, color:muted, minHeight:42 }}>{plan.blurb}</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:faint, letterSpacing:"0.12em", alignSelf:"flex-start", marginTop:4 }}>MXN</span>
                    <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(40px,4.5vw,52px)", fontWeight:300, letterSpacing:"-0.025em", lineHeight:1, color:ink }}>
                      {billing==="annual" && (plan as any).priceAnn ? (plan as any).priceAnn : plan.price}
                    </span>
                    <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:muted, fontWeight:400 }}>{plan.per}</span>
                  </div>
                  {billing==="annual" && (plan as any).priceAnn && (
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:faint, letterSpacing:"0.1em", marginTop:-12 }}>Facturado anual · 10 meses al año</p>
                  )}
                  <ul style={{ display:"grid", gap:10, listStyle:"none" }}>
                    {plan.items.map((item,j) => (
                      <li key={j} style={{ fontSize:14, color:ink2, paddingLeft:22, position:"relative" }}>
                        <span style={{ position:"absolute", left:0, top:7, width:12, height:6, borderLeft:`1.5px solid ${blue}`, borderBottom:`1.5px solid ${blue}`, transform:"rotate(-45deg)", display:"inline-block" }}/>
                        {item}
                      </li>
                    ))}
                    {plan.dim.map((item,j) => (
                      <li key={j} style={{ fontSize:14, color:faint, paddingLeft:22, position:"relative" }}>
                        <span style={{ position:"absolute", left:0, top:7, width:12, height:6, borderLeft:`1.5px solid ${faint}`, borderBottom:`1.5px solid ${faint}`, transform:"rotate(-45deg)", display:"inline-block", opacity:0.4 }}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setModal({open:true,tipo:"f",email:""})}
                    style={plan.ctaStyle==="blue" ? S.btnBlue : plan.ctaStyle==="ink" ? S.btnInk : S.btnGhost}>
                    {plan.cta} <span>→</span>
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p style={{ ...S.mono, textAlign:"center", marginTop:40, color:muted }}>{t.pricingNote}</p>
          </Reveal>
        </div>
      </section>

      {/* ══ CONSULTORÍA HERO ═════════════════════════════════ */}
      <section id="consultoria-hero" style={{ padding:"clamp(80px,10vw,140px) 0", background:bg }}>
        <div className="wrap">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }} className="dual-grid">
            <Reveal>
              <div>
                <span style={{ ...S.eyebrow, color:orange, marginBottom:16, display:"flex" }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.consHeroEyebrow}</span>
                <h2 style={{ ...S.h2, fontSize:"clamp(32px,4.2vw,52px)", marginTop:16, marginBottom:20 }}>
                  Del <em style={{fontStyle:"italic",color:orange}}>diagnóstico</em> al <em style={{fontStyle:"italic",color:orange}}>agente en producción</em>. En 30 días.
                </h2>
                <p style={{ fontSize:"clamp(17px,1.4vw,19px)", color:ink2, fontWeight:300, lineHeight:1.5, marginBottom:28 }}>{t.consHeroLead}</p>
                <div style={{ border:`1px solid ${line}`, borderRadius:10, padding:24, marginBottom:28 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:faint, marginBottom:8 }}>{t.consPayTitle}</div>
                  <p style={{ fontSize:15, color:ink2, lineHeight:1.6 }}>
                    <strong style={{ color:orange, fontWeight:600 }}>Pago único por proyecto.</strong>{" "}Sin retainers, sin contratos largos. Pagas en semana 5 contra el ROI medido. Si en 30 días el sistema no ejecuta procesos reales, te reembolsamos todo.
                  </p>
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button onClick={() => setModal({open:true,tipo:"b",email:""})} style={S.btnOrange}>{lang==="es"?"Agendar diagnóstico gratis":"Schedule free diagnosis"} <span>→</span></button>
                  <a href="#casos" style={S.btnGhost}>{lang==="es"?"Ver casos":"See cases"}</a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              {/* Visual proceso */}
              <div style={{ border:`1px solid ${line}`, borderRadius:14, overflow:"hidden" }}>
                {[
                  { n:"01", label:"DIAGNÓSTICO", desc:"Mapeo de oportunidades y ROI. Sin costo.", time:"30 min · Gratis", col:orange },
                  { n:"02", label:"SPRINT",       desc:"PoC funcional de un flujo con IA.", time:"2 semanas", col:orange },
                  { n:"03", label:"BUILD",        desc:"Agente en producción en tu stack.", time:"30 días", col:orange },
                  { n:"04", label:"SCALE",        desc:"Portafolio de agentes y gobernanza.", time:"Cotización", col:faint },
                ].map((row,i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"48px 1fr auto", gap:"0 16px", padding:"20px 24px", borderBottom: i<3 ? `1px solid ${line}` : "none", alignItems:"center" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:"0.1em", color:row.col, fontWeight:500 }}>{row.n}</div>
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:row.col, marginBottom:3 }}>{row.label}</div>
                      <div style={{ fontSize:14, color:ink2 }}>{row.desc}</div>
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:faint, textAlign:"right", whiteSpace:"nowrap" }}>{row.time}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ CURSOS ═══════════════════════════════════════════ */}
      <section id="cursos" style={{ padding:"clamp(80px,10vw,140px) 0", background:surface2 }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom:"clamp(40px,5vw,72px)", display:"grid", gap:16, maxWidth:"72ch" }}>
              <span style={{ ...S.eyebrow, color:blue }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.coursesEyebrow}</span>
              <h2 style={{ ...S.h2, fontSize:"clamp(32px,4.2vw,52px)" }}>
                {t.coursesH2a} <em style={{fontStyle:"italic",color:blue}}>{t.coursesH2b}</em>{t.coursesH2c}
              </h2>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }} className="dual-grid">
            {t.courses.map((c,i) => (
              <Reveal key={i} delay={i*0.06}>
                <article style={{ background:surface, border:`1px solid ${line}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transition:"border-color 0.3s" }}
                  onMouseOver={e=>(e.currentTarget.style.borderColor=line)}
                  onMouseOut={e=>(e.currentTarget.style.borderColor=line)}>
                  <div style={{ aspectRatio:"4/3", background:surface2, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:faint }}>{c.label}</span>
                  </div>
                  <div style={{ padding:24, display:"grid", gap:12 }}>
                    <div style={{ display:"flex", gap:12 }}>
                      {c.meta.map((m,j) => (
                        <span key={j} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:faint }}>{m}</span>
                      ))}
                    </div>
                    <h4 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(18px,1.8vw,22px)", fontWeight:400, letterSpacing:"-0.015em", color:ink }}>{c.title}</h4>
                    <p style={{ fontSize:14, color:muted }}>{c.desc}</p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:`1px solid ${line}` }}>
                      <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:24, fontWeight:300, letterSpacing:"-0.02em", color:ink }}>
                        <small style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:faint, letterSpacing:"0.1em", marginRight:4 }}>MXN</small>{c.price}
                      </div>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:blue }}>Incluido en Pro</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CASO DE ÉXITO ════════════════════════════════════ */}
      <section id="casos" style={{ padding:"clamp(80px,10vw,140px) 0", background:bg }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom:"clamp(40px,5vw,72px)", display:"grid", gap:16, maxWidth:"72ch" }}>
              <span style={{ ...S.eyebrow, color:orange }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.casoEyebrow}</span>
              <h2 style={{ ...S.h2, fontSize:"clamp(32px,4.2vw,52px)" }}>
                Un retailer regional redujo{" "}
                <em style={{fontStyle:"italic",color:orange}}>38% el tiempo de atención</em>{" "}al cliente.
              </h2>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }} className="dual-grid">
            <Reveal>
              <div style={{ border:`1px solid ${line}`, borderRadius:14, padding:"clamp(28px,3.5vw,44px)" }}>
                <p style={{ fontSize:"clamp(17px,1.4vw,19px)", color:ink2, fontWeight:300, lineHeight:1.5, marginBottom:32 }}>
                  Diseñamos un agente LLM conectado a su base de conocimiento interna y CRM. En 6 semanas pasó a producción en 3 canales.
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {t.casoStats.map(([n,l],i) => (
                    <div key={i} style={{ padding:20, background:surface2, borderRadius:10 }}>
                      <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:34, color: i<2?orange:ink, letterSpacing:"-0.02em", fontWeight:300 }}>{n}</div>
                      <div style={{ fontSize:12, color:muted, marginTop:4 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ borderTop:`1px solid ${ink}`, padding:"32px 0" }}>
                <p style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(18px,1.8vw,22px)", fontWeight:300, fontStyle:"italic", color:ink, lineHeight:1.4, marginBottom:24 }}>
                  {t.casoQuote}
                </p>
                <div>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:14, color:ink }}>{t.casoWho}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:faint, marginTop:2 }}>{t.casoRole}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ LOGOS + TESTIMONIOS ══════════════════════════════ */}
      <section style={{ padding:"clamp(60px,8vw,100px) 0", background:surface2 }}>
        <div className="wrap">
          <Reveal>
            <p style={{ ...S.mono, textAlign:"center", marginBottom:32 }}>{t.logosTitle}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:1, border:`1px solid ${line}`, borderRadius:10, overflow:"hidden", marginBottom:"clamp(60px,8vw,100px)" }}>
              {t.logos.map((l,i) => (
                <div key={i} style={{ padding:"24px 16px", display:"flex", alignItems:"center", justifyContent:"center", borderLeft: i>0?`1px solid ${line}`:"none", background:surface }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:faint }}>{l}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }} className="plans-grid">
            {t.testimonials.map((t2,i) => (
              <Reveal key={i} delay={i*0.07}>
                <article style={{ borderTop:`1px solid ${line}`, paddingTop:24 }}>
                  <p style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(16px,1.4vw,19px)", fontWeight:300, fontStyle:"italic", color:ink, lineHeight:1.5, marginBottom:20 }}>{t2.q}</p>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:ink }}>{t2.name}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:faint, marginTop:2 }}>{t2.role}</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════ */}
      <section id="faq" style={{ padding:"clamp(80px,10vw,140px) 0", background:bg }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom:"clamp(40px,5vw,72px)", textAlign:"center" }}>
              <span style={{ ...S.eyebrow, justifyContent:"center", display:"flex", marginBottom:12, color:muted }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.faqEyebrow}</span>
              <h2 style={{ ...S.h2, fontSize:"clamp(32px,4.2vw,52px)", textAlign:"center" }}>
                {t.faqH2a} <em style={{fontStyle:"italic",color:blue}}>{t.faqH2b}</em> {t.faqH2c}
              </h2>
            </div>
          </Reveal>
          <div style={{ maxWidth:820, margin:"0 auto" }}>
            {t.faqs.map(([q,a],i) => (
              <Reveal key={i} delay={i*0.04}>
                <div style={{ borderTop:`1px solid ${line}`, ...(i===t.faqs.length-1?{borderBottom:`1px solid ${line}`}:{}) }}>
                  <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                    style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"24px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:20, fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(16px,1.4vw,20px)", fontWeight:400, letterSpacing:"-0.015em", color:ink, textAlign:"left" }}>
                    {q}
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, color:muted, flexShrink:0, transition:"transform 0.3s", transform:openFaq===i?"rotate(45deg)":"none" }}>+</span>
                  </button>
                  <AnimatePresence>
                    {openFaq===i && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.28}} style={{overflow:"hidden"}}>
                        <p style={{ paddingBottom:24, color:muted, fontSize:15, maxWidth:"60ch", lineHeight:1.65 }}>{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════ */}
      <section id="contacto" style={{ padding:"clamp(80px,10vw,140px) 0", background: isDark?"#0F0E2A":"#1E1E60" }}>
        <div className="wrap">
          <Reveal>
            <div style={{ textAlign:"center", maxWidth:"64ch", margin:"0 auto" }}>
              <span style={{ ...S.eyebrow, color:"rgba(255,255,255,0.45)", justifyContent:"center", display:"flex", marginBottom:16 }}><span style={{width:18,height:1,background:"currentColor",display:"inline-block"}}/>{t.ctaFinalEyebrow}</span>
              <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontWeight:300, letterSpacing:"-0.025em", lineHeight:1.05, fontSize:"clamp(32px,4.2vw,56px)", color:"#fff", marginBottom:16 }}>
                {t.ctaFinalH2} <em style={{fontStyle:"italic",color:"#93b4f8"}}>{lang==="es"?"Elige el tuyo.":"Choose yours."}</em>
              </h2>
              <p style={{ fontSize:"clamp(16px,1.3vw,18px)", color:"rgba(255,255,255,0.55)", lineHeight:1.6, marginBottom:36 }}>{t.ctaFinalSub}</p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={() => setModal({open:true,tipo:"f",email:""})}
                  style={{ ...S.btnBlue, background:"#6E8FEA", boxShadow:"0 0 24px rgba(110,143,234,0.6), 0 0 48px rgba(110,143,234,0.2)" }}>{t.ctaF} <span>→</span></button>
                <button onClick={() => setModal({open:true,tipo:"b",email:""})}
                  style={{ ...S.btnOrange }}>{t.ctaC} <span>→</span></button>
                <a href="https://wa.me/5210000000000"
                  style={{ ...S.btnGhost, color:"rgba(255,255,255,0.6)", borderWidth:"1px", borderStyle:"solid", borderColor:"rgba(255,255,255,0.2)" }}>{t.ctaWA}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer style={{ borderTop:`1px solid ${line}`, padding:"64px 0 32px", background:bg }}>
        <div className="wrap">
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"clamp(24px,4vw,48px)", marginBottom:48 }} className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <img src="/logo-ailearning.png" alt="aiLearning" style={{ height:30, width:"auto", objectFit:"contain" }}/>
  
              </div>
              <p style={{ fontSize:14, color:muted, maxWidth:"38ch", lineHeight:1.6 }}>{t.footDesc}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:16 }}>
                {t.footLegal.map((l,i) => (
                  <a key={i} href={i===1?"/aviso-de-privacidad":i===2?"/terminos-de-uso":i===3?"/politica-de-cookies":"#"}
                    style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:faint, background:surface2, border:`1px solid ${line}`, borderRadius:4, padding:"4px 8px", textDecoration:"none" }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
            {/* Cols */}
            {t.footCols.map((col,i) => (
              <div key={i}>
                <h5 style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:faint, marginBottom:16 }}>{col.title}</h5>
                {col.links.map(([label,href],j) => (
                  <a key={j} href={href} style={{ display:"block", fontSize:14, color:muted, textDecoration:"none", marginBottom:10, transition:"color 0.2s" }}
                    onMouseOver={e=>(e.currentTarget.style.color=ink)}
                    onMouseOut={e=>(e.currentTarget.style.color=muted)}>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${line}`, paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, color:faint }}>{t.footBottom}</span>
            <div style={{ display:"flex", gap:16 }}>
              <a href="/aviso-de-privacidad" style={{ fontSize:12, color:faint, textDecoration:"none" }}>Aviso de privacidad</a>
              <a href="/terminos-de-uso"     style={{ fontSize:12, color:faint, textDecoration:"none" }}>Términos</a>
              <a href="/politica-de-cookies" style={{ fontSize:12, color:faint, textDecoration:"none" }}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>

    {/* Responsive styles */}
    <style>{`
      @media(max-width:860px){
        .hide-mobile{display:none!important}
        .dual-grid{grid-template-columns:1fr!important}
        .plans-grid{grid-template-columns:1fr!important}
        .stats-grid{grid-template-columns:repeat(2,1fr)!important}
        .footer-grid{grid-template-columns:1fr 1fr!important}
      }
      @media(max-width:540px){
        .stats-grid{grid-template-columns:1fr 1fr!important}
        .footer-grid{grid-template-columns:1fr!important}
      }
    `}</style>

    <AvatarVSL/>
    </>
  );
}
