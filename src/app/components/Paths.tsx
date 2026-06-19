"use client";
import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

function FlowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W = c.offsetWidth, H = 64;
    c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
    const N = [
      { x: W*.14, y:H*.5, lbl:"WA",  sub:"WhatsApp", col:"#25D366" },
      { x: W*.5,  y:H*.5, lbl:"n8n", sub:"n8n",      col:"#EA4B35" },
      { x: W*.86, y:H*.5, lbl:"CRM", sub:"CRM",       col:"#2B7FE0" },
    ];
    let t = 0; let raf: number;
    const tick = () => {
      ctx.clearRect(0,0,W,H); t += .016;
      N.forEach((n,i) => {
        if (i < 2) {
          const nx = N[i+1];
          ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(nx.x,nx.y);
          ctx.strokeStyle="rgba(255,255,255,.05)"; ctx.lineWidth=1; ctx.stroke();
          const p = (t*.44+i*.5)%1;
          const px = n.x+(nx.x-n.x)*p;
          const g = ctx.createRadialGradient(px,n.y,0,px,n.y,9);
          g.addColorStop(0,i===0?"rgba(37,211,102,.9)":"rgba(43,127,224,.9)");
          g.addColorStop(1,"rgba(0,0,0,0)");
          ctx.beginPath(); ctx.arc(px,n.y,4,0,Math.PI*2);
          ctx.fillStyle=g; ctx.fill();
        }
      });
      N.forEach(n => {
        const pulse=(Math.sin(t*1.3)+1)*.5;
        ctx.beginPath(); ctx.arc(n.x,n.y,14+pulse*3,0,Math.PI*2);
        ctx.fillStyle=n.col+"12"; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x,n.y,10,0,Math.PI*2);
        ctx.fillStyle=n.col+"1a"; ctx.strokeStyle=n.col+"55";
        ctx.lineWidth=.8; ctx.fill(); ctx.stroke();
        ctx.font="700 7px Inter,sans-serif"; ctx.fillStyle=n.col;
        ctx.textAlign="center"; ctx.fillText(n.lbl,n.x,n.y+2.5);
        ctx.font="400 7px Inter,sans-serif"; ctx.fillStyle="rgba(255,255,255,.3)";
        ctx.fillText(n.sub,n.x,n.y+20);
      });
      raf=requestAnimationFrame(tick);
    };
    tick(); return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} className="w-full" style={{height:64}}/>;
}

function Guarantee() {
  return (
    <div className="rounded-xl p-[14px] mt-3" style={{
      background:"linear-gradient(135deg,rgba(192,94,26,.07),rgba(5,8,14,.96))",
      border:"1px solid rgba(192,94,26,.22)",
      boxShadow:"inset 0 1px 0 rgba(255,255,255,.03)",
    }}>
      <div style={{height:1,marginBottom:10,background:"linear-gradient(to right,transparent,rgba(192,94,26,.6),transparent)"}}/>
      <div className="flex items-center gap-[6px] mb-[6px]">
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 .8l1.1 2.4L9 3.7l-2 1.8.5 2.7L5 7.1 2.5 8.2 3 5.5 1 3.7l2.9-.5z" fill="#c05e1a"/></svg>
        <span className="text-[9px] font-[700] tracking-[.1em] uppercase text-[#c05e1a]">Garantía de riesgo cero</span>
      </div>
      <div className="text-[13px] font-[700] text-white leading-[1.3] mb-[5px]">Tu Primer Agente Operando. O No Pagas.</div>
      <div className="text-[11px] leading-[1.5]" style={{color:"rgba(255,255,255,.3)"}}>
        Si en 30 días no ejecuta el flujo, la implementación corre por nuestra cuenta.
      </div>
    </div>
  );
}

function Integrations() {
  const items = ["Make","n8n","WhatsApp","HubSpot","Mercado Pago","Calendly","OpenAI",
                 "Make","n8n","WhatsApp","HubSpot","Mercado Pago","Calendly","OpenAI"];
  return (
    <div className="overflow-hidden mt-3"
      style={{maskImage:"linear-gradient(to right,transparent,black 10%,black 90%,transparent)"}}>
      <motion.div className="flex gap-6 whitespace-nowrap"
        animate={{x:["0%","-50%"]}} transition={{duration:26,repeat:Infinity,ease:"linear"}}>
        {items.map((n,i)=>(
          <span key={i} className="text-[9px] font-[600] uppercase tracking-[.1em] flex-shrink-0"
            style={{color:"rgba(255,255,255,.16)"}}>
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Row({num,title,desc,color,i,right}:{
  num:string;title:string;desc:string;color:"f"|"b";i:number;right?:boolean
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inv = useInView(ref,{once:true,margin:"-16px"});
  return (
    <motion.div ref={ref}
      initial={{opacity:0,x:right?8:-8}}
      animate={inv?{opacity:1,x:0}:{}}
      transition={{duration:.35,delay:i*.05,ease:[.4,0,.2,1]}}
      className={`flex items-baseline gap-[10px] py-[.55rem] border-b border-white/[.04] last:border-0 ${right?"flex-row-reverse text-right":""}`}>
      <span className="flex-shrink-0 font-syne text-[.58rem] font-[800] tabular-nums"
        style={{color:color==="f"?"#2B7FE0":"#c05e1a",opacity:.25,minWidth:14}}>
        {num}
      </span>
      <p className="text-[12.5px] leading-[1.45]">
        <span className="font-[600] text-white">{title} </span>
        <span style={{color:"rgba(255,255,255,.35)"}}>{desc}</span>
      </p>
    </motion.div>
  );
}

export function Paths() {
  const sRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target:sRef,offset:["start end","end start"]});
  const aY = useTransform(scrollYProgress,[0,1],[40,-40]);
  const bY = useTransform(scrollYProgress,[0,1],[55,-25]);
  const aS = useTransform(scrollYProgress,[0,.5,1],[.97,1.02,.98]);
  const bS = useTransform(scrollYProgress,[0,.5,1],[.95,1.0,.97]);

  return (
    <div ref={sRef} className="grid grid-cols-1 sm:grid-cols-2 bg-[#05080e]">

      {/* ── FORMACIÓN ── */}
      <div className="relative overflow-hidden border-b sm:border-b-0 sm:border-r border-white/[.05]"
        style={{minHeight:640}}>

        <motion.div style={{y:aY,scale:aS}}
          className="absolute bottom-0 right-0 w-[44%] pointer-events-none origin-bottom z-0"
          aria-hidden="true">
          <div className="absolute inset-0 z-10" style={{background:"linear-gradient(to left,transparent 28%,#05080e 88%)"}}/>
          <div className="absolute inset-0 z-10" style={{background:"linear-gradient(to top,#05080e 0%,transparent 24%)"}}/>
        </motion.div>
        <div className="absolute bottom-0 right-0 w-[45%] h-[45%] pointer-events-none z-0"
          style={{background:"radial-gradient(ellipse at 75% 100%,rgba(43,127,224,.07),transparent 65%)"}}/>

        <div className="relative z-10 p-7 sm:p-9 flex flex-col justify-between" style={{minHeight:640}}>
          <div>
            <div className="inline-flex items-center gap-[7px] mb-4 px-[10px] py-[4px] rounded-full text-[9px] font-[700] tracking-[.11em] uppercase"
              style={{background:"rgba(43,127,224,.1)",border:"1px solid rgba(43,127,224,.17)",color:"rgba(43,127,224,.82)"}}>
              <motion.span className="w-[4px] h-[4px] rounded-full bg-[#2B7FE0]"
                animate={{opacity:[1,.3,1],scale:[1,.6,1]}}
                transition={{duration:2.4,repeat:Infinity}}/>
              Formación profesional
            </div>

            <motion.h2
              initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:.5,ease:[.4,0,.2,1]}}
              className="font-syne font-[800] text-white leading-[1.04] tracking-[-1.8px] mb-3"
              style={{fontSize:"clamp(1.75rem,2.6vw,2.3rem)"}}>
              Domina la <span className="text-[#2B7FE0]">Ingeniería</span><br/>de Agentes.
            </motion.h2>

            <p className="text-[13px] leading-[1.65] mb-5" style={{color:"rgba(255,255,255,.38)",maxWidth:280}}>
              De cero a arquitecto de sistemas IA. Proyectos reales desde el primer día.
            </p>

            <div className="flex items-center gap-7 mb-5 pb-5 border-b border-white/[.06]">
              {[["50+","Profesionales"],["4.9★","Rating"],["100%","ROI medible"]].map(([v,l])=>(
                <div key={l}>
                  <div className="font-syne text-[1.25rem] font-[800] text-white tracking-[-1px] leading-none">{v}</div>
                  <div className="text-[10px] mt-[3px]" style={{color:"rgba(255,255,255,.3)"}}>{l}</div>
                </div>
              ))}
            </div>

            <div>
              {[
                ["01","Empieza hoy, gratis.","Minicurso de 1h. Tu primer agente operando."],
                ["02","Proyectos reales.","n8n, Make y agentes IA en producción."],
                ["03","Comunidad activa.","Sesiones en vivo. Feedback real cada semana."],
                ["04","Escala a tu ritmo.","Suscripción mensual. Sin contratos anuales."],
              ].map(([n,t,d],i)=>(
                <Row key={n} num={n} title={t} desc={d} color="f" i={i}/>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex">
                {["JS","MR","KL","AL"].map((av,i)=>(
                  <div key={av} className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[8px] font-[700] text-[#6ab0f5]"
                    style={{marginLeft:i===0?0:-7,zIndex:4-i,border:"2px solid #05080e",background:"rgba(43,127,224,.17)"}}>
                    {av}
                  </div>
                ))}
                <div className="absolute -bottom-[3px] -right-[3px] w-[12px] h-[12px] rounded-full flex items-center justify-center z-20 bg-[#2B7FE0]">
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1.5 3.5L3 5L5.5 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <span className="text-[11px]" style={{color:"rgba(255,255,255,.3)"}}>
                <strong style={{color:"rgba(255,255,255,.6)",fontWeight:600}}>+50 profesionales</strong> ya construyen
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <button className="font-dm text-white font-[700] text-[13px] px-6 py-[11px] rounded-full border-none cursor-pointer active:scale-[.97] transition-transform"
                style={{background:"#2B7FE0",boxShadow:"0 0 20px rgba(43,127,224,.55),0 0 40px rgba(43,127,224,.18)"}}
                onClick={()=>location.href="/aprende/gratis"}>
                Empezar gratis →
              </button>
              <a href="/cursos" className="text-[12px] font-[500] no-underline"
                style={{color:"rgba(43,127,224,.5)"}}>
                Ver planes →
              </a>
            </div>
            <Integrations/>
          </div>
        </div>
      </div>

      {/* ── EMPRESAS ── */}
      <div className="relative overflow-hidden" style={{minHeight:640}}>

        <motion.div style={{y:bY,scale:bS}}
          className="absolute bottom-0 left-0 w-[44%] pointer-events-none origin-bottom z-0"
          aria-hidden="true">
          <div className="absolute inset-0 z-10" style={{background:"linear-gradient(to right,transparent 28%,#05080e 88%)"}}/>
          <div className="absolute inset-0 z-10" style={{background:"linear-gradient(to top,#05080e 0%,transparent 24%)"}}/>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-[45%] h-[45%] pointer-events-none z-0"
          style={{background:"radial-gradient(ellipse at 25% 100%,rgba(192,94,26,.07),transparent 65%)"}}/>

        <div className="relative z-10 p-7 sm:p-9 flex flex-col justify-between sm:items-end" style={{minHeight:640}}>
          <div className="sm:text-right w-full sm:max-w-[340px]">
            <div className="inline-flex items-center gap-[7px] mb-4 px-[10px] py-[4px] rounded-full text-[9px] font-[700] tracking-[.11em] uppercase"
              style={{background:"rgba(192,94,26,.08)",border:"1px solid rgba(192,94,26,.17)",color:"rgba(192,94,26,.82)"}}>
              <motion.span className="w-[4px] h-[4px] rounded-full bg-[#c05e1a]"
                animate={{opacity:[1,.3,1],scale:[1,.6,1]}}
                transition={{duration:2.4,repeat:Infinity,delay:1}}/>
              Soluciones empresariales
            </div>

            <motion.h2
              initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:.5,delay:.07,ease:[.4,0,.2,1]}}
              className="font-syne font-[800] text-white leading-[1.04] tracking-[-1.8px] mb-3"
              style={{fontSize:"clamp(1.75rem,2.6vw,2.3rem)"}}>
              Tu fuerza de trabajo<br/>autónoma. <span className="text-[#c05e1a]">Tú</span> diriges.
            </motion.h2>

            <p className="text-[13px] leading-[1.65] mb-5" style={{color:"rgba(255,255,255,.38)"}}>
              Agentes IA que operan 24/7 — sin contrataciones, sin microgestión.
            </p>

            <div className="flex items-center gap-7 mb-5 pb-5 border-b border-white/[.06] sm:justify-end">
              {[["30d","Primer agente"],["10x","ROI promedio"],["0","Intervenciones"]].map(([v,l])=>(
                <div key={l} className="sm:text-right">
                  <div className="font-syne text-[1.25rem] font-[800] text-white tracking-[-1px] leading-none">{v}</div>
                  <div className="text-[10px] mt-[3px]" style={{color:"rgba(255,255,255,.3)"}}>{l}</div>
                </div>
              ))}
            </div>

            <div>
              {[
                ["01","Diagnóstico gratuito.","Mapa de ROI en 45 min. Sin compromiso."],
                ["02","Implementación real.","Agentes en producción, no presentaciones."],
              ].map(([n,t,d],i)=>(
                <Row key={n} num={n} title={t} desc={d} color="b" i={i} right/>
              ))}
            </div>

            <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:.4,delay:.1}}
              className="rounded-xl overflow-hidden my-3"
              style={{border:"1px solid rgba(255,255,255,.07)",background:"rgba(255,255,255,.02)"}}>
              <FlowCanvas/>
              <div className="px-3 pb-[6px] flex items-center justify-between">
                <span className="text-[9px]" style={{color:"rgba(255,255,255,.2)"}}>WA → n8n → CRM</span>
                <motion.span className="text-[9px] font-[700] text-[#4ade80]"
                  animate={{opacity:[1,.4,1]}} transition={{duration:1.7,repeat:Infinity}}>
                  ● 1.5s · 0 intervenciones
                </motion.span>
              </div>
            </motion.div>

            <div>
              {[
                ["03","Tu stack actual.","WA, CRM, Calendly, MP. Sin migraciones."],
                ["04","30 días o es gratis.","Garantía de ejecución operativa real."],
              ].map(([n,t,d],i)=>(
                <Row key={n} num={n} title={t} desc={d} color="b" i={i+2} right/>
              ))}
            </div>

            <Guarantee/>
          </div>

          <div className="sm:text-right w-full mt-5">
            <div className="flex items-center gap-3 mb-4 sm:justify-end">
              <div className="relative flex">
                {["ES","JG","ST"].map((av,i)=>(
                  <div key={av} className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[8px] font-[700] text-[#e8915a]"
                    style={{marginLeft:i===0?0:-7,zIndex:3-i,border:"2px solid #05080e",background:"rgba(192,94,26,.17)"}}>
                    {av}
                  </div>
                ))}
                <div className="absolute -bottom-[3px] -right-[3px] w-[12px] h-[12px] rounded-full flex items-center justify-center z-20 bg-[#c05e1a]">
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1.5 3.5L3 5L5.5 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <span className="text-[11px]" style={{color:"rgba(255,255,255,.3)"}}>
                <strong style={{color:"rgba(255,255,255,.6)",fontWeight:600}}>8 empresas</strong> ya automatizadas
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap sm:justify-end mb-3">
              <button className="font-dm text-white font-[700] text-[13px] px-6 py-[11px] rounded-full border-none cursor-pointer active:scale-[.97] transition-transform"
                style={{background:"#c05e1a",boxShadow:"0 0 20px rgba(192,94,26,.55),0 0 40px rgba(192,94,26,.18)"}}
                onClick={()=>location.href="/diagnostico"}>
                Agendar diagnóstico →
              </button>
              <a href="/casos" className="text-[12px] font-[500] no-underline"
                style={{color:"rgba(192,94,26,.5)"}}>
                Ver casos →
              </a>
            </div>
            <Integrations/>
          </div>
        </div>
      </div>

    </div>
  );
}
