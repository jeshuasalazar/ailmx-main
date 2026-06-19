"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUBTITLES = [
  { from: 0,  to: 3,  text: "¡Hola! En aiLearning te enseñamos a construir agentes de IA" },
  { from: 3,  to: 6,  text: "para escalar tu impacto profesional." },
  { from: 6,  to: 10, text: "¿Tienes un negocio? Apliquemos nuestro Protocolo de Eficiencia Exponencial..." },
  { from: 10, to: 14, text: "...y detectaremos la fuga de dinero en tu operación." },
  { from: 14, to: 16, text: "Empieza hoy. Sin costo." },
];


export function AvatarVSL() {
  const [open, setOpen]       = useState(false);
  const [muted, setMuted]     = useState(true);
  const [currentTime, setCT]  = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [ended, setEnded]     = useState(false);
  const videoRef              = useRef<HTMLVideoElement>(null);

  // Auto-abrir 5s desktop
  useEffect(() => {
    if (sessionStorage.getItem("vsl_seen")) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const t = setTimeout(() => { setOpen(true); sessionStorage.setItem("vsl_seen","1"); }, 5000);
    return () => clearTimeout(t);
  }, []);

  // Controlar play/pause según estado open
  // El video SIEMPRE está en el DOM — solo cambiamos play/pause
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      v.currentTime = 0;
      v.muted = true;
      // Reset de UI al abrir: sincroniza React con el elemento <video> (sistema externo)
      /* eslint-disable react-hooks/set-state-in-effect */
      setMuted(true);
      setCT(0);
      setEnded(false);
      setShowCTA(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [open]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen  = useCallback(() => setOpen(true), []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0;
    setCT(t);
    if (t >= 10) setShowCTA(true);
  }, []);

  const duration = 16;
  const progress = Math.min((currentTime / duration) * 100, 100);
  const activeSub = SUBTITLES.find(s => currentTime >= s.from && currentTime < s.to);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">

      {/* VIDEO — siempre en el DOM, nunca desmontado */}
      {/* Posicionado fuera de pantalla cuando está cerrado */}
      <div style={{
        position: "absolute",
        bottom: 0, right: 0,
        width: 300,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.4,0.64,1)",
        transformOrigin: "bottom right",
        borderRadius: 16,
        overflow: "hidden",
        background: "#05080e",
        border: open ? "1px solid rgba(255,255,255,0.07)" : "none",
        boxShadow: open ? "0 32px 72px rgba(0,0,0,0.8),0 0 0 1px rgba(43,127,224,0.12)" : "none",
      }}>
        {/* VIDEO CONTAINER */}
        <div style={{ position:"relative", height:420, overflow:"hidden", background:"#000" }}>
          
          {/* EL VIDEO — atributo muted nativo, siempre montado */}
          <video
            ref={videoRef}
            src="/Bienvenida_Home_720p.mp4"
            playsInline
            muted
            preload="auto"
            style={{
              position:"absolute", inset:0,
              width:"100%", height:"100%",
              objectFit:"cover", objectPosition:"center 8%",
              cursor:"pointer",
            }}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setEnded(true)}
            onClick={toggleMute}
          />

          {/* Gradiente inferior */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"45%",
            background:"linear-gradient(to top,rgba(5,8,14,0.92),rgba(5,8,14,0.5) 55%,transparent)",
            pointerEvents:"none" }}/>

          {/* Barra progreso */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
            background:"rgba(255,255,255,0.08)", pointerEvents:"none" }}>
            <div style={{ height:"100%", width:`${progress}%`,
              background:"#2B7FE0", transition:"width 0.25s linear" }}/>
          </div>

          {/* Header */}
          <div style={{ position:"absolute", top:12, left:12, right:12,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,
                background:"linear-gradient(135deg,#0d1826,#1a3050)",
                border:"1.5px solid rgba(43,127,224,0.45)",
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="11" r="7" fill="#2B7FE0" opacity="0.9"/>
                  <path d="M4 28 C4 20 28 20 28 28" fill="#2B7FE0" opacity="0.65"/>
                  <circle cx="16" cy="11" r="3.5" fill="white" opacity="0.95"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:11,fontWeight:700,color:"#fff",margin:0,lineHeight:1 }}>
                  Jeshua · aiLearning
                </p>
                <div style={{ display:"flex",alignItems:"center",gap:4,marginTop:2 }}>
                  <span style={{ width:4,height:4,borderRadius:"50%",background:"#4ade80",display:"inline-block" }}/>
                  <span style={{ fontSize:9,color:"rgba(255,255,255,0.4)" }}>En vivo</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex",gap:4 }}>
              <button onClick={toggleMute} style={{
                width:28,height:28,borderRadius:"50%",border:"none",cursor:"pointer",
                background: muted ? "rgba(239,68,68,0.85)" : "rgba(255,255,255,0.15)",
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                  {muted
                    ? <><path d="M1 3.5h2L5.5 1v10L3 8.5H1V3.5z"/><path d="M7.5 4L10 6.5M10 4L7.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/></>
                    : <><path d="M1 3.5h2L5.5 1v10L3 8.5H1V3.5z"/><path d="M7.5 3c1.5 1 1.5 5 0 6M9 2c2.2 1.4 2.2 6.6 0 8" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none"/></>
                  }
                </svg>
              </button>
              <button onClick={handleClose} style={{
                width:28,height:28,borderRadius:"50%",border:"none",cursor:"pointer",
                background:"rgba(255,255,255,0.12)",
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Subtítulo activo */}
          <div style={{ position:"absolute", bottom:10, left:10, right:10,
            display:"flex", justifyContent:"center", pointerEvents:"none" }}>
            {activeSub && (
              <p style={{ margin:0, textAlign:"center", fontSize:12, fontWeight:500,
                color:"#fff", background:"rgba(0,0,0,0.62)",
                borderRadius:6, padding:"4px 10px", lineHeight:1.5, maxWidth:"92%" }}>
                {activeSub.text}
              </p>
            )}
          </div>

          {/* Hint mute */}
          {muted && currentTime < 2 && (
            <div style={{ position:"absolute", bottom:50, left:0, right:0,
              display:"flex", justifyContent:"center", pointerEvents:"none" }}>
              <div style={{ background:"rgba(0,0,0,0.55)", borderRadius:100, padding:"4px 12px" }}>
                <p style={{ margin:0, fontSize:10, color:"#fff" }}>🔇 Toca para escuchar</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {(showCTA || ended) && (
          <div style={{ display:"flex", flexDirection:"column", gap:8, padding:"12px 16px",
            borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <a href="/diagnostico" style={{
              display:"block", textAlign:"center", borderRadius:12, padding:"11px 0",
              fontSize:13, fontWeight:700, color:"#fff", textDecoration:"none",
              background:"#2B7FE0",
              boxShadow:"0 0 18px rgba(43,127,224,0.5),0 4px 12px rgba(43,127,224,0.2)" }}>
              $0 · Agendar Protocolo (15 min)
            </a>
            <a href="/cursos" style={{
              display:"block", textAlign:"center", borderRadius:12, padding:"9px 0",
              fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.5)",
              textDecoration:"none", border:"1px solid rgba(255,255,255,0.1)" }}>
              Ver Cursos de Formación
            </a>
          </div>
        )}
      </div>

      {/* ── BURBUJA (solo cuando cerrado) ── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale:0, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            exit={{ scale:0, opacity:0 }}
            transition={{ type:"spring", stiffness:300, damping:24 }}>

            {/* Globo texto */}
            <motion.div
              initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:2 }}
              style={{ position:"absolute", bottom:78, right:0,
                background:"#0d1826", border:"1px solid rgba(43,127,224,0.25)",
                borderRadius:12, padding:"8px 12px", whiteSpace:"nowrap",
                pointerEvents:"none",
                boxShadow:"0 4px 20px rgba(0,0,0,0.55)" }}>
              <p style={{ fontSize:11,fontWeight:600,color:"#fff",margin:0,lineHeight:1.4 }}>
                ¿Dueño de negocio?
              </p>
              <p style={{ fontSize:10,color:"rgba(255,255,255,0.5)",margin:0 }}>
                Tengo algo para ti 👇
              </p>
              <div style={{ position:"absolute", bottom:-5, right:20,
                width:9,height:9,transform:"rotate(45deg)",background:"#0d1826",
                borderRight:"1px solid rgba(43,127,224,0.25)",
                borderBottom:"1px solid rgba(43,127,224,0.25)" }}/>
            </motion.div>

            {/* Botón circular */}
            <motion.button onClick={handleOpen} whileTap={{ scale:0.93 }}
              style={{ position:"relative", width:68, height:68,
                border:"none", cursor:"pointer", padding:0, background:"transparent" }}>
              <motion.div style={{ position:"absolute", inset:-5, borderRadius:"50%",
                border:"2px solid rgba(43,127,224,0.4)" }}
                animate={{ scale:[1,1.2,1], opacity:[0.6,0,0.6] }}
                transition={{ duration:2.6, repeat:Infinity }}/>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%", overflow:"hidden",
                boxShadow:"0 0 0 2.5px rgba(43,127,224,0.6),0 8px 28px rgba(0,0,0,0.65)" }}>
                <video src="/Bienvenida_Home_720p.mp4"
                  style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 8%" }}
                  autoPlay loop muted playsInline preload="metadata"/>
                <div style={{ position:"absolute",inset:0,background:"rgba(5,8,14,0.3)",
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ width:24,height:24,borderRadius:"50%",
                    background:"rgba(43,127,224,0.92)",
                    display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <svg width="9" height="11" viewBox="0 0 9 11" fill="white">
                      <path d="M1 1L8 5.5L1 10V1Z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <span style={{ position:"absolute",top:-1,right:-1,
                width:16,height:16,borderRadius:"50%",
                background:"#05080e",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <motion.span style={{ width:9,height:9,borderRadius:"50%",background:"#4ade80",display:"block" }}
                  animate={{ scale:[1,1.4,1],opacity:[1,0.3,1] }}
                  transition={{ duration:1.6,repeat:Infinity }}/>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
