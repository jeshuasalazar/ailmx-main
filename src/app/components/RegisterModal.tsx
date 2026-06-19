"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAISES = [
  "México","Colombia","Argentina","España","Chile","Perú","Ecuador",
  "Guatemala","Venezuela","Bolivia","Honduras","Paraguay","Uruguay",
  "Costa Rica","Panamá","Otro",
];

const FUENTES = [
  "Redes sociales","Recomendación","Google","YouTube","Otro",
];

interface RegisterModalProps {
  open: boolean;
  tipo: "f" | "b";
  emailInicial: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegisterModal({ open, tipo, emailInicial, onClose, onSuccess }: RegisterModalProps) {
  const [step, setStep]     = useState<"form"|"success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const firstRef            = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nombre: "", whatsapp: "", email: emailInicial,
    pais: "México", fuente: "",
  });

  useEffect(() => {
    if (open) {
      setStep("form");
      setError("");
      setForm(f => ({ ...f, email: emailInicial }));
      setTimeout(() => firstRef.current?.focus(), 200);
    }
  }, [open, emailInicial]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) {
      setError("Nombre y correo son obligatorios."); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "Hero ailearning.mx",
          tipo,
          nombre: form.nombre,
          email: form.email,
          whatsapp: form.whatsapp,
          pais: form.pais,
          fuente: form.fuente,
          consent: true,
        }),
      });
      if (!res.ok) {
        setError("No pudimos completar tu registro. Intenta de nuevo en un momento.");
        return;
      }
      setStep("success");
      setTimeout(() => { onSuccess(); }, 2200);
    } catch {
      setError("Ocurrió un error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const accent = tipo === "f" ? "#2B7FE0" : "#c05e1a";
  const accentBg = tipo === "f" ? "rgba(43,127,224,0.1)" : "rgba(192,94,26,0.08)";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998]"
            style={{ background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)" }}/>

          {/* Modal */}
          <motion.div
            initial={{ opacity:0, scale:0.94, y:16 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.94, y:16 }}
            transition={{ type:"spring", stiffness:340, damping:30 }}
            className="fixed z-[9999] inset-x-4 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[440px]"
            style={{ top:"50%", transform:"translate(-50%,-50%)", borderRadius:20,
              background:"#080d18",
              border:"1px solid rgba(255,255,255,0.08)",
              boxShadow:"0 32px 80px rgba(0,0,0,0.8)" }}>

            {step === "form" ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-7 pb-5">
                  <div>
                    <div className="text-[9px] font-[700] tracking-[0.12em] uppercase mb-[3px]"
                      style={{ color: accent }}>
                      {tipo === "f" ? "🎓 Formación profesional" : "🏢 Soluciones empresariales"}
                    </div>
                    <h2 className="font-syne text-[1.2rem] font-[800] text-white leading-tight tracking-[-0.5px] m-0">
                      {tipo === "f" ? "Crea tu cuenta gratis" : "Solicita tu diagnóstico"}
                    </h2>
                    <p className="text-[11px] mt-[3px] m-0" style={{ color:"rgba(255,255,255,0.35)" }}>
                      {tipo === "f"
                        ? "Acceso inmediato al minicurso. Sin tarjeta."
                        : "Te contactamos en menos de 24h."}
                    </p>
                  </div>
                  <button onClick={onClose}
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0"
                    style={{ background:"rgba(255,255,255,0.07)" }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 1.5L9.5 9.5M9.5 1.5L1.5 9.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"0 28px" }}/>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-7 pb-7 pt-2 flex flex-col gap-[14px]">

                  {/* Nombre */}
                  <div>
                    <label className="text-[10px] font-[600] text-white/50 mb-[5px] block">
                      Nombre completo *
                    </label>
                    <input ref={firstRef}
                      type="text" required placeholder="Ej. Juan García"
                      value={form.nombre} onChange={set("nombre")}
                      className="w-full rounded-xl text-[13px] text-white outline-none transition-all"
                      style={{ background:"rgba(255,255,255,0.05)",
                        border:`1px solid rgba(255,255,255,0.1)`,
                        padding:"10px 14px",
                        fontFamily:"inherit" }}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}/>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-[600] text-white/50 mb-[5px] block">
                      Correo electrónico *
                    </label>
                    <input type="email" required placeholder="tu@correo.com"
                      value={form.email} onChange={set("email")}
                      className="w-full rounded-xl text-[13px] text-white outline-none transition-all"
                      style={{ background:"rgba(255,255,255,0.05)",
                        border:"1px solid rgba(255,255,255,0.1)",
                        padding:"10px 14px",
                        fontFamily:"inherit" }}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}/>
                  </div>

                  {/* WhatsApp + País en grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-[600] text-white/50 mb-[5px] block">
                        WhatsApp
                      </label>
                      <input type="tel" placeholder="+52 55 1234 5678"
                        value={form.whatsapp} onChange={set("whatsapp")}
                        className="w-full rounded-xl text-[13px] text-white outline-none transition-all"
                        style={{ background:"rgba(255,255,255,0.05)",
                          border:"1px solid rgba(255,255,255,0.1)",
                          padding:"10px 14px",
                          fontFamily:"inherit" }}
                        onFocus={e => e.target.style.borderColor = accent}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}/>
                    </div>
                    <div>
                      <label className="text-[10px] font-[600] text-white/50 mb-[5px] block">
                        País
                      </label>
                      <select value={form.pais} onChange={set("pais")}
                        className="w-full rounded-xl text-[13px] text-white outline-none cursor-pointer"
                        style={{ background:"#0d1520",
                          border:"1px solid rgba(255,255,255,0.1)",
                          padding:"10px 14px",
                          fontFamily:"inherit",
                          appearance:"none" }}>
                        {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* ¿Cómo nos conociste? */}
                  <div>
                    <label className="text-[10px] font-[600] text-white/50 mb-[5px] block">
                      ¿Cómo nos conociste?
                    </label>
                    <select value={form.fuente} onChange={set("fuente")}
                      className="w-full rounded-xl text-[13px] outline-none cursor-pointer"
                      style={{ background:"#0d1520",
                        border:"1px solid rgba(255,255,255,0.1)",
                        padding:"10px 14px",
                        fontFamily:"inherit",
                        color: form.fuente ? "#fff" : "rgba(255,255,255,0.35)",
                        appearance:"none" }}>
                      <option value="">Selecciona una opción</option>
                      {FUENTES.map(f => <option key={f} value={f} style={{color:"#fff"}}>{f}</option>)}
                    </select>
                  </div>

                  {error && (
                    <p className="text-[11px] text-[#f87171] m-0 text-center">{error}</p>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="w-full rounded-xl text-[13px] font-[700] text-white border-none cursor-pointer transition-all mt-1"
                    style={{
                      background: loading ? "rgba(255,255,255,0.1)" : accent,
                      padding:"13px 0",
                      borderRadius: 999,
                      boxShadow: loading ? "none" : `0 0 28px ${accent}77, 0 0 56px ${accent}33`,
                      opacity: loading ? 0.7 : 1,
                      transition: "all 0.25s",
                    }}>
                    {loading
                      ? "Creando tu cuenta…"
                      : tipo === "f"
                        ? "Crear cuenta y acceder →"
                        : "Solicitar diagnóstico gratuito →"}
                  </button>

                  <p className="text-[9px] text-center m-0" style={{ color:"rgba(255,255,255,0.2)" }}>
                    Sin spam. Tus datos están seguros.{" "}
                    <a href="/privacidad" style={{ color:"rgba(255,255,255,0.35)" }}
                      className="underline underline-offset-2">Aviso de privacidad</a>.
                  </p>
                </form>
              </>
            ) : (
              /* Success */
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                className="px-6 py-10 flex flex-col items-center text-center gap-4">
                <motion.div
                  initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ type:"spring", stiffness:300, damping:20, delay:0.1 }}
                  className="w-[64px] h-[64px] rounded-full flex items-center justify-center"
                  style={{ background: accentBg, border:`2px solid ${accent}` }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14L11 20L23 8" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
                <div>
                  <h3 className="font-syne text-[1.2rem] font-[800] text-white m-0 mb-[6px]">
                    ¡Listo, {form.nombre.split(" ")[0]}!
                  </h3>
                  <p className="text-[12px] m-0" style={{ color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>
                    {tipo === "f"
                      ? "Revisa tu correo — te enviamos el acceso al minicurso ahora mismo."
                      : "Recibimos tu solicitud. Te contactamos en menos de 24h por WhatsApp y correo."}
                  </p>
                </div>
                <div className="w-full rounded-xl px-4 py-3 text-left"
                  style={{ background: accentBg, border:`1px solid ${accent}33` }}>
                  <p className="text-[11px] font-[600] text-white m-0 mb-[2px]">
                    {tipo === "f" ? "📧 Revisa tu bandeja de entrada" : "📲 Pendiente de contacto"}
                  </p>
                  <p className="text-[10px] m-0" style={{ color:"rgba(255,255,255,0.4)" }}>
                    {form.email}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
