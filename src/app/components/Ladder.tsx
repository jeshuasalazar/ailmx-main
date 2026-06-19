"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LadderType = "f" | "b";

/* ─── Contador compartido ─────────────────────────────────── */
function useCountdown(seconds: number) {
  const [secs, setSecs] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s-1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs/60)).padStart(2,"0");
  const ss = String(secs%60).padStart(2,"0");
  return { secs, mm, ss, urgent: secs < 120 };
}

/* ─── Datos con precios tachados ─────────────────────────── */
const DATA = {
  f: [
    {
      step:"01 — Gratis", price:"$0", name:"Minicurso IA",
      desc:"El punto de entrada perfecto. Sin tarjeta, sin compromiso. Crea tu primer agente de IA en menos de una hora usando herramientas sin código.",
      items:["Acceso inmediato al minicurso","Tu primer agente funcionando","Introducción a n8n y Make","Comunidad de entrada gratuita"],
      href:"/aprende/gratis", cta:"Comenzar gratis →",
      discount: null,
    },
    {
      step:"02 — Entry", price:"$397", originalPrice:"$497", name:"Curso completo",
      desc:"Automatización práctica con n8n y Make. Proyectos reales que puedes usar en tu trabajo o negocio desde el primer día.",
      items:["8 módulos de automatización real","Proyectos descargables","Acceso de por vida","Soporte por email"],
      href:"/cursos", cta:"Aprovechar oferta →",
      discount: "20% OFF · Solo hoy",
    },
    {
      step:"03 — Mid", price:"$549/mes", originalPrice:"$699/mes", name:"Suscripción",
      desc:"Acceso ilimitado a todos los cursos, sesiones en vivo mensuales y una comunidad activa de constructores de IA.",
      items:["Todos los cursos desbloqueados","Sesiones en vivo mensuales","Comunidad privada","Nuevos cursos cada mes"],
      href:"/suscripcion", cta:"Suscribirme con descuento →",
      discount: "1er mes con 21% OFF",
    },
    {
      step:"04 — High", price:"Desde $15K", originalPrice: null, name:"Mentoría 1:1",
      desc:"Acompañamiento personalizado para lanzar tu propio negocio o producto con IA. Para quienes van en serio.",
      items:["12 sesiones privadas 1:1","Revisión de tu modelo de negocio","Estrategia de lanzamiento","Acceso directo por WhatsApp"],
      href:"/mentoria", cta:"Agendar llamada →",
      discount: null,
    },
  ],
  b: [
    {
      step:"01 — Gratis", price:"$0", name:"Diagnóstico",
      desc:"15 minutos. Identificamos los procesos que más dinero te cuestan y te mostramos dónde la IA genera ROI inmediato.",
      items:["Llamada de 15 minutos","Análisis de procesos clave","Mapa de automatización potencial","Sin compromiso de compra"],
      href:"/diagnostico", cta:"$0 · Agendar diagnóstico →",
      discount: null,
    },
    {
      step:"02 — Entry", price:"$2,900", originalPrice:"$3,500", name:"Workshop",
      desc:"Un día intensivo donde implementamos tu primer agente de ventas. Sales con algo funcionando, no con un plan.",
      items:["Workshop de 1 día (remoto o presencial)","Agente de ventas configurado","Integración con WhatsApp o CRM","30 días de soporte básico"],
      href:"/workshop", cta:"Reservar workshop →",
      discount: "17% OFF · Cupo limitado",
    },
    {
      step:"03 — Mid", price:"$6,500", originalPrice:"$8,000", name:"Paquete Starter",
      desc:"Implementación completa de 1 agente estratégico más automatización de 2 procesos clave. Resultados medibles en 30 días.",
      items:["1 agente IA implementado","2 flujos de automatización","Integración con tus herramientas","30 días soporte dedicado"],
      href:"/starter", cta:"Aprovechar precio →",
      discount: "19% OFF · Esta semana",
    },
    {
      step:"04 — High", price:"Desde $25K", originalPrice: null, name:"Consultoría completa",
      desc:"Transformación total del backoffice y ventas. Agentes, automatización y estrategia de IA diseñados a la medida de tu empresa.",
      items:["Diagnóstico profundo 360°","3-5 agentes implementados","Automatización completa de ventas","6 meses de soporte estratégico"],
      href:"/consultoria", cta:"Agendar llamada →",
      discount: null,
    },
  ],
};

export function Ladder() {
  const [tab, setTab]   = useState<LadderType>("f");
  const [step, setStep] = useState(0);
  const { secs, mm, ss, urgent } = useCountdown(600);
  const data    = DATA[tab];
  const current = data[step];
  const hasDiscount = !!current.discount;

  function switchTab(t: LadderType) { setTab(t); setStep(0); }

  const accentColor = tab === "f" ? "#2B7FE0" : "#c07040";
  const btnBg       = tab === "f" ? "#2B7FE0" : "#b85c1a";
  const stepActive  = tab === "f"
    ? "bg-[rgba(43,127,224,0.1)] border-[rgba(43,127,224,0.2)]"
    : "bg-[rgba(192,94,26,0.1)] border-[rgba(192,94,26,0.2)]";
  const numActive   = tab === "f"
    ? "bg-[rgba(43,127,224,0.15)] text-[#6ab0f5] border-[rgba(43,127,224,0.25)]"
    : "bg-[rgba(192,94,26,0.15)] text-[#e8915a] border-[rgba(192,94,26,0.25)]";

  return (
    <section className="px-4 sm:px-10 py-10 bg-[#05080e]">

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-[9px] font-[700] tracking-[0.16em] uppercase mb-[0.35rem] text-[#2B7FE0]">
          Escalera de valor
        </div>
        <h2 className="font-syne text-[1.4rem] sm:text-[1.5rem] font-[800] text-white tracking-[-0.75px] mb-[0.25rem]">
          Empieza gratis. Salta cuando estés listo.
        </h2>
        <p className="text-[12px] text-white/20">Haz clic en cada nivel para explorar qué incluye.</p>
      </div>

      {/* Contador urgencia — entre header y tabs */}
      <div className="max-w-[960px] mx-auto mb-5">
        <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-4"
          style={{
            background: urgent ? "rgba(239,68,68,0.08)" : "rgba(43,127,224,0.06)",
            border: `1px solid ${urgent ? "rgba(239,68,68,0.25)" : "rgba(43,127,224,0.15)"}`,
          }}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-[16px] flex-shrink-0">{urgent ? "⚡" : "🎁"}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-[700] text-white m-0 leading-tight">
                {urgent ? "¡Última oportunidad!" : "Oferta especial activa"}
              </p>
              <p className="text-[10px] m-0 truncate" style={{ color:"rgba(255,255,255,0.4)" }}>
                Agenda hoy y recibe gratis la{" "}
                <span style={{ color: urgent ? "#f87171" : "#6ab0f5" }}>
                  Guía n8n (valor $497 MXN)
                </span>
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-syne font-[800] tabular-nums"
              style={{
                fontSize:"1.4rem", letterSpacing:"-1px",
                color: urgent ? "#f87171" : "#fff",
                fontFamily:"monospace",
              }}>
              {mm}:{ss}
            </div>
            <p className="text-[9px] m-0" style={{ color:"rgba(255,255,255,0.3)" }}>
              tiempo restante
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-[8px] mb-6">
        {(["f","b"] as LadderType[]).map(t => (
          <button key={t} onClick={() => switchTab(t)}
            className={`px-[18px] py-[6px] rounded-full text-[11px] font-[600] border cursor-pointer transition-all duration-[220ms] font-dm
              ${tab === t
                ? t==="f" ? "bg-[#2B7FE0] text-white border-[#2B7FE0]" : "bg-[#b85c1a] text-white border-[#b85c1a]"
                : "bg-transparent text-white/28 border-white/[0.1]"}`}>
            {t === "f" ? "Formación" : "Empresas"}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 sm:gap-8 max-w-[960px] mx-auto">

        {/* Nav steps */}
        <div className="flex flex-col gap-[6px]">
          {data.map((d, i) => (
            <button key={d.step} onClick={() => setStep(i)}
              className={`flex items-start gap-[12px] p-[0.85rem] rounded-[10px] border cursor-pointer text-left transition-all duration-[220ms] w-full
                ${i === step ? stepActive : "bg-transparent border-transparent hover:bg-white/[0.04]"}`}>
              <div className={`min-w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-[700] flex-shrink-0 border
                ${i < step
                  ? "bg-[rgba(43,127,224,0.08)] text-[rgba(43,127,224,0.4)] border-[rgba(43,127,224,0.12)]"
                  : i === step ? numActive
                  : "bg-white/[0.05] text-white/25 border-white/[0.08]"}`}>
                {i < step ? "✓" : String(i+1).padStart(2,"0")}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[9px] font-[700] tracking-[0.08em] uppercase mb-[2px]`}
                  style={{ color: i === step ? accentColor : "rgba(255,255,255,0.3)" }}>
                  {d.step}
                </div>
                <div className={`font-syne text-[13px] font-[700] mb-[1px] ${i === step ? "text-white" : "text-white/50"}`}>
                  {d.name}
                </div>
                <div className="flex items-center gap-[5px]">
                  <div className="text-[11px] text-white/30">{d.price}</div>
                  {"originalPrice" in d && d.originalPrice && (
                    <div className="text-[10px] line-through text-white/20">{d.originalPrice}</div>
                  )}
                  {"discount" in d && d.discount && (
                    <div className="text-[9px] font-[700] px-[5px] py-[1px] rounded-full"
                      style={{ background:"rgba(74,222,128,0.12)", color:"#4ade80" }}>
                      {d.discount.split("·")[0].trim()}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div key={`${tab}-${step}`}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.25 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6 sm:p-7 flex flex-col gap-4">

            <div>
              <div className="text-[9px] font-[700] tracking-[0.12em] uppercase mb-[0.35rem]"
                style={{ color: accentColor }}>
                {current.step}
              </div>

              {/* Precio con tachado si hay descuento */}
              <div className="flex items-baseline gap-3 mb-[0.2rem]">
                <div className="font-syne text-[1.9rem] font-[800] text-white tracking-[-1px] leading-none">
                  {current.price}
                </div>
                {"originalPrice" in current && current.originalPrice && (
                  <div className="font-syne text-[1.1rem] font-[600] line-through"
                    style={{ color:"rgba(255,255,255,0.25)" }}>
                    {current.originalPrice}
                  </div>
                )}
              </div>

              <div className="font-syne text-[1rem] font-[700] text-white/65 mb-2">{current.name}</div>

              {/* Badge de descuento */}
              {"discount" in current && current.discount && (
                <div className="inline-flex items-center gap-[5px] rounded-full px-3 py-[4px] mb-2"
                  style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.25)" }}>
                  <span className="text-[9px] font-[700] text-[#4ade80]">🏷 {current.discount}</span>
                </div>
              )}
            </div>

            <p className="text-[13px] text-white/40 leading-[1.6]">{current.desc}</p>

            <div className="flex flex-col gap-[7px]">
              {current.items.map(item => (
                <div key={item} className="flex items-center gap-[8px] text-[12px] text-white/60">
                  <span className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                    style={{ background: accentColor }}/>
                  {item}
                </div>
              ))}
            </div>

            {/* Regalo si aplica descuento */}
            {"discount" in current && current.discount && (
              <div className="rounded-xl px-3 py-[10px]"
                style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)" }}>
                <p className="text-[10px] font-[700] text-[#4ade80] m-0 mb-[3px]">
                  🎁 Incluye al tomar acción ahora:
                </p>
                <p className="text-[11px] text-white m-0" style={{ color:"rgba(255,255,255,0.6)" }}>
                  Guía de Automatización con n8n
                  <span className="ml-2 line-through text-white/25">$497 MXN</span>
                  <span className="ml-1 font-[700] text-[#4ade80]">GRATIS</span>
                </p>
              </div>
            )}

            {/* Contador mini si hay urgencia */}
            {hasDiscount && (
              <div className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{
                  background: urgent ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${urgent ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`,
                }}>
                <span className="text-[10px]" style={{ color:"rgba(255,255,255,0.4)" }}>
                  {urgent ? "⚡ Precio sube en:" : "⏱ Oferta expira en:"}
                </span>
                <span className="font-[700] tabular-nums"
                  style={{
                    fontSize:12, fontFamily:"monospace",
                    color: urgent ? "#f87171" : "#fff",
                  }}>
                  {mm}:{ss}
                </span>
              </div>
            )}

            <div className="flex gap-[8px] mt-auto flex-wrap">
              <button className="text-white border-none px-[22px] py-[10px] rounded-full text-[12px] font-[700] cursor-pointer hover:opacity-90 transition-opacity font-dm"
                style={{ background: urgent && hasDiscount ? "#ef4444" : btnBg }}
                onClick={() => location.href = current.href}>
                {current.cta}
              </button>
              {step < data.length - 1 && (
                <button className="bg-transparent text-white/35 border border-white/[0.12] px-[18px] py-[10px] rounded-full text-[12px] cursor-pointer hover:bg-white/[0.04] transition-colors font-dm"
                  onClick={() => setStep(step + 1)}>
                  Ver siguiente nivel
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-center mt-4 text-[11px] text-white/15">
        ¿Ya sabes qué necesitas?{" "}
        <a href="/contacto" className="text-white/38 underline underline-offset-[3px] font-[500]">
          Salta al nivel que te conviene →
        </a>
      </p>
    </section>
  );
}
