'use client';
import { useState, useEffect } from 'react';

export default function Activar() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail]   = useState('');
  const [prefilled, setPrefilled] = useState(false);
  const [consent, setConsent]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [state, setState]         = useState<'form'|'success'>('form');
  const [counter, setCounter]     = useState(0);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pN = decodeURIComponent(p.get('nombre') || '').trim();
    const pE = decodeURIComponent(p.get('email')  || '').trim();
    if (pN.length > 1)    { setNombre(pN); setPrefilled(true); }
    if (pE.includes('@')) { setEmail(pE);  setConsent(true); }
    if (pN.length > 1 && pE.includes('@')) { autoActivate(pN, pE); }
    let n = 0; const target = 209;
    const t = setInterval(() => { n = Math.min(n + 6, target); setCounter(n); if (n >= target) clearInterval(t); }, 40);
    return () => clearInterval(t);
  }, []);

  async function autoActivate(name: string, emailAddr: string) {
    await registerLead(name, emailAddr);
    setState('success');
  }

  async function handleSubmit() {
    if (!nombre || nombre.trim().split(/\s+/).length < 2) { alert('Escribe tu nombre y apellido.'); return; }
    if (!email || !email.includes('@')) { alert('Ingresa un correo válido.'); return; }
    if (!consent) { alert('Necesitamos tu autorización para activar tu acceso.'); return; }
    setSending(true);
    await registerLead(nombre, email);
    setState('success');
    setSending(false);
  }

  async function registerLead(name: string, emailAddr: string) {
    try {
      const [firstName, ...rest] = name.split(' ');
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY || '' },
        body: JSON.stringify({ email: emailAddr, attributes: { NOMBRE: firstName, APELLIDO: rest.join(' '), FUENTE: 'Activar 60 dias AMCP 2026', ACCESO_60_DIAS: 'pendiente' }, listIds: [parseInt(process.env.NEXT_PUBLIC_BREVO_LIST_ID || '0')], updateEnabled: true })
      });
    } catch {}
  }

  const firstName = nombre.split(' ')[0] || 'campeón';

  return (
    <>
      <style>{`
        .av *{box-sizing:border-box;margin:0;padding:0}
        .av{font-family:system-ui,sans-serif;background:#060E1F;color:#F5F0E8;min-height:100vh;-webkit-font-smoothing:antialiased}
        .av-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(201,168,76,.1) 0%,transparent 60%),#060E1F}
        .av-wrap{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column}
        .av-nav{padding:18px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(201,168,76,.1)}
        .av-logo{font-size:22px;font-weight:900;color:#C9A84C;letter-spacing:.06em}
        .av-badge{font-size:11px;color:rgba(201,168,76,.7);background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.2);border-radius:100px;padding:5px 14px}
        .av-hero{flex:1;display:flex;align-items:center;justify-content:center;padding:52px 24px 0;text-align:center}
        .av-hero-in{max-width:660px;display:flex;flex-direction:column;align-items:center;gap:24px}
        .av-tag{background:rgba(39,174,96,.12);border:1px solid rgba(39,174,96,.3);border-radius:100px;padding:7px 18px;font-size:12px;font-weight:600;color:#27AE60;display:flex;align-items:center;gap:8px}
        .av-dot{width:7px;height:7px;border-radius:50%;background:#27AE60;animation:av-blink 1.5s infinite}
        @keyframes av-blink{0%,100%{opacity:1}50%{opacity:.3}}
        .av-h1{font-size:clamp(36px,7vw,66px);font-weight:900;line-height:.95;letter-spacing:-.02em}
        .av-h1 span{color:#C9A84C}
        .av-sub{font-size:16px;font-weight:300;color:rgba(245,240,232,.5);line-height:1.65;max-width:500px}
        .av-features{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%;max-width:580px}
        .av-feat{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:18px 16px;text-align:center;display:flex;flex-direction:column;gap:8px}
        .av-feat-icon{font-size:26px}
        .av-feat-title{font-size:13px;font-weight:600;color:#F5F0E8}
        .av-feat-desc{font-size:11px;color:rgba(245,240,232,.4);line-height:1.4}
        .av-social{display:flex;align-items:center;gap:10px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.15);border-radius:100px;padding:8px 18px}
        .av-social-avatars{display:flex}
        .av-avatar{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#1A3A6B,#C9A84C);border:2px solid #060E1F;margin-left:-6px;font-size:10px;display:flex;align-items:center;justify-content:center;font-weight:700;color:white}
        .av-avatar:first-child{margin-left:0}
        .av-social-text{font-size:12px;color:rgba(245,240,232,.6)}
        .av-social-text strong{color:#C9A84C}
        .av-fsec{padding:32px 24px 52px}
        .av-card{max-width:480px;margin:0 auto;background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.25);border-radius:20px;padding:36px 32px;position:relative;overflow:hidden;box-shadow:0 0 60px rgba(0,0,0,.4)}
        .av-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#27AE60,#C9A84C,#27AE60,transparent)}
        .av-timer{display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(231,76,60,.1);border:1px solid rgba(231,76,60,.25);border-radius:8px;padding:9px 14px;font-size:12px;color:#E74C3C;font-weight:600;margin-bottom:20px}
        .av-ctitle{font-size:22px;font-weight:700;margin-bottom:6px;text-align:center}
        .av-csub{font-size:13px;color:rgba(245,240,232,.5);margin-bottom:24px;line-height:1.5;text-align:center}
        .av-pre{display:flex;align-items:center;gap:8px;background:rgba(39,174,96,.1);border:1px solid rgba(39,174,96,.3);border-radius:8px;padding:9px 12px;font-size:12px;color:#27AE60;margin-bottom:14px}
        .av-field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
        .av-label{font-size:11px;font-weight:600;color:rgba(245,240,232,.5);letter-spacing:.07em;text-transform:uppercase}
        .av-input{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:9px;padding:13px 15px;font-size:15px;color:#F5F0E8;outline:none;width:100%;transition:border-color .2s}
        .av-input:focus{border-color:#C9A84C}
        .av-input::placeholder{color:rgba(245,240,232,.2)}
        .av-input.pre{border-color:rgba(39,174,96,.4);background:rgba(39,174,96,.05)}
        .av-consent{display:flex;align-items:flex-start;gap:9px;margin:18px 0;cursor:pointer}
        .av-consent input{width:17px;height:17px;flex-shrink:0;margin-top:2px;accent-color:#27AE60}
        .av-ctxt{font-size:11.5px;color:rgba(245,240,232,.4);line-height:1.55}
        .av-ctxt a{color:#C9A84C;text-decoration:none}
        .av-btn{width:100%;padding:16px;border-radius:12px;background:linear-gradient(135deg,#27AE60,#1E8449);color:#fff;font-size:16px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 4px 20px rgba(39,174,96,.35);transition:all .2s}
        .av-btn:hover{box-shadow:0 6px 28px rgba(39,174,96,.5);transform:translateY(-1px)}
        .av-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .av-secure{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:11px;color:rgba(245,240,232,.3)}
        .av-success{display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;padding:12px 0}
        .av-success-ring{width:80px;height:80px;border-radius:50%;background:rgba(39,174,96,.15);border:3px solid #27AE60;display:flex;align-items:center;justify-content:center;font-size:36px;animation:av-pop .4s ease}
        @keyframes av-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
        .av-success-title{font-size:28px;font-weight:900;color:#27AE60}
        .av-success-name{font-size:20px;font-weight:700;color:#F5F0E8}
        .av-success-sub{font-size:14px;color:rgba(245,240,232,.5);line-height:1.65;max-width:360px}
        .av-steps-mini{display:flex;flex-direction:column;gap:10px;width:100%;text-align:left}
        .av-step-mini{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:12px 16px}
        .av-step-mini-num{width:24px;height:24px;border-radius:50%;background:#27AE60;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .av-step-mini-txt{font-size:13px;color:rgba(245,240,232,.7)}
        .av-step-mini-txt strong{color:#F5F0E8}
        .av-footer{padding:18px 40px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;font-size:11px;color:rgba(245,240,232,.2);flex-wrap:wrap;gap:6px}
        @media(max-width:600px){.av-nav,.av-footer{padding:14px 18px}.av-hero{padding:36px 18px 0}.av-fsec{padding:24px 18px 40px}.av-card{padding:24px 18px}.av-features{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="av">
        <div className="av-bg"/>
        <div className="av-wrap">
          <nav className="av-nav">
            <div className="av-logo">aiLearning</div>
            <div className="av-badge">Acceso exclusivo · AMCP 2026</div>
          </nav>

          <section className="av-hero">
            <div className="av-hero-in">
              <div className="av-tag"><span className="av-dot"/>Acceso limitado — solo asistentes del 8 de mayo</div>
              <h1 className="av-h1">Activa tus<br/><span>60 días gratis</span><br/>en aiLearning</h1>
              <p className="av-sub">La plataforma donde construirás tu despacho digital paso a paso — con herramientas ya configuradas, plantillas listas y acompañamiento real.</p>
              <div className="av-features">
                {[['🤖','IA para contadores','Herramientas ya configuradas para tu despacho'],['📋','Plantillas listas','Contratos, propuestas y flujos de trabajo'],['🎯','Plan de acción','De 0 a tu primer cliente digital en 30 días'],['👥','Comunidad','Red de contadores que ya digitalizaron'],['📊','Dashboard','Métricas de tu despacho en tiempo real'],['🎓','Certificación','Contador Digital certificado por aiLearning']].map(([icon,title,desc])=>(
                  <div key={title} className="av-feat"><div className="av-feat-icon">{icon}</div><div className="av-feat-title">{title}</div><div className="av-feat-desc">{desc}</div></div>
                ))}
              </div>
              <div className="av-social">
                <div className="av-social-avatars">
                  {['JV','AB','RM','CL','MG'].map((i,idx)=><div key={idx} className="av-avatar">{i}</div>)}
                </div>
                <div className="av-social-text"><strong>{counter}+</strong> asistentes ya activaron su acceso</div>
              </div>
            </div>
          </section>

          <section className="av-fsec">
            <div className="av-card">
              {state==='form' && (
                <>
                  <div className="av-timer">⏰ Oferta válida 72 horas desde el evento</div>
                  <div className="av-ctitle">{prefilled ? `¡Hola, ${firstName}!` : 'Activa tu acceso ahora'}</div>
                  <div className="av-csub">{prefilled ? 'Confirma tu correo y te reservamos tu lugar.' : 'Te contactamos en menos de 24 horas para darte acceso.'}</div>
                  {prefilled && <div className="av-pre"><span>✓</span><span>Identificado como asistente del evento AMCP</span></div>}
                  <div className="av-field">
                    <label className="av-label">Nombre completo</label>
                    <input className={`av-input${prefilled?' pre':''}`} type="text" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ana García López"/>
                  </div>
                  <div className="av-field">
                    <label className="av-label">Correo electrónico</label>
                    <input className={`av-input${email&&prefilled?' pre':''}`} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"/>
                  </div>
                  <label className="av-consent">
                    <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>
                    <span className="av-ctxt">Acepto que aiLearning me contacte para activar mi acceso. Datos protegidos conforme a la <a href="/privacidad">LFPDPPP</a>. Puedo cancelar en cualquier momento.</span>
                  </label>
                  <button className="av-btn" onClick={handleSubmit} disabled={sending}>
                    {sending?'Activando...':'🚀 Activar mis 60 días gratis'}
                  </button>
                  <div className="av-secure">🔒 Sin tarjeta de crédito requerida</div>
                </>
              )}
              {state==='success' && (
                <div className="av-success">
                  <div className="av-success-ring">✓</div>
                  <div className="av-success-title">¡Acceso reservado!</div>
                  <div className="av-success-name">¡{firstName}, ya estás en la lista!</div>
                  <p className="av-success-sub">Recibirás un correo en <strong style={{color:'#F5F0E8'}}>menos de 24 horas</strong> con las instrucciones para ingresar a la plataforma.</p>
                  <div className="av-steps-mini">
                    {[['1','Revisa tu correo','Busca un mensaje de ailearning.mx'],['2','Crea tu cuenta','Con la contraseña que te enviemos'],['3','Completa tu perfil','Para personalizar tu experiencia'],['4','Empieza el día 1','Tu primer módulo ya estará listo']].map(([n,t,d])=>(
                      <div key={n} className="av-step-mini"><div className="av-step-mini-num">{n}</div><div className="av-step-mini-txt"><strong>{t}</strong> — {d}</div></div>
                    ))}
                  </div>
                  <p style={{fontSize:'12px',color:'rgba(245,240,232,.3)'}}>¿No llega el correo? Escríbenos a hola@ailearning.mx</p>
                </div>
              )}
            </div>
          </section>

          <footer className="av-footer">
            <span>© 2026 aiLearning · ailearning.mx</span>
            <span>Jornadas del Estudiante AMCP · 8 de Mayo 2026</span>
            <a href="/privacidad" style={{color:'inherit',textDecoration:'none'}}>Aviso de Privacidad</a>
          </footer>
        </div>
      </div>
    </>
  );
}
