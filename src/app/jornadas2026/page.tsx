'use client';
import { useState } from 'react';

export default function Jornadas2026() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [prefilled] = useState(false);
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState<'form'|'direct'|'success'>('form');
  const PDF_URL = '/jornadas2026/guia.pdf';

  async function handleSubmit() {
    setError('');
    if (!nombre || nombre.trim().split(/\s+/).length < 2) { setError('Escribe tu nombre y apellido.'); return; }
    if (!email || !email.includes('@')) { setError('Ingresa un correo válido.'); return; }
    if (!consent) { setError('Necesitamos tu autorización.'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: 'Guia Jornadas AMCP 2026', tipo: 'f', nombre, email, consent: true }),
      });
      setSending(false);
      if (res.ok) setState('success');
      else setError('No pudimos enviar la guía ahora. Usa la descarga directa abajo.');
    } catch {
      setSending(false);
      setError('Error de conexión. Usa la descarga directa abajo.');
    }
  }

  return (
    <>
      <style>{`
        .jw *{box-sizing:border-box;margin:0;padding:0}
        .jw{font-family:system-ui,sans-serif;background:#060E1F;color:#F5F0E8;min-height:100vh}
        .jnav{padding:18px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(201,168,76,.1)}
        .jlogo{font-size:22px;font-weight:900;color:#C9A84C;letter-spacing:.06em}
        .jbadge{font-size:11px;color:rgba(201,168,76,.7);background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.2);border-radius:100px;padding:5px 14px}
        .jhero{display:flex;align-items:center;justify-content:center;padding:52px 24px 36px;text-align:center}
        .jhero-in{max-width:640px;display:flex;flex-direction:column;align-items:center;gap:22px}
        .jtag{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);border-radius:100px;padding:7px 16px;font-size:12px;font-weight:500;color:#C9A84C}
        .jbook{width:100px;height:132px;background:linear-gradient(135deg,#0D1B3E,#1A3A6B);border-radius:3px 10px 10px 3px;box-shadow:-3px 0 0 #0a1628,0 16px 40px rgba(0,0,0,.6),0 0 0 1px rgba(201,168,76,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:16px 12px;animation:jfloat 4s ease-in-out infinite}
        @keyframes jfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .jbook-logo{font-size:14px;font-weight:900;color:#C9A84C;letter-spacing:.1em}
        .jbook-line{width:30px;height:1px;background:rgba(201,168,76,.4)}
        .jbook-txt{font-size:7px;font-weight:600;color:rgba(245,240,232,.7);text-align:center;line-height:1.4}
        .jh1{font-size:clamp(38px,7vw,66px);font-weight:900;line-height:.95;letter-spacing:-.02em;color:#F5F0E8}
        .jh1 span{color:#C9A84C}
        .jsub{font-size:16px;font-weight:300;color:rgba(245,240,232,.5);line-height:1.65;max-width:480px}
        .jchips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
        .jchip{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:100px;padding:6px 12px;font-size:12px;color:rgba(245,240,232,.5)}
        .jfsec{padding:0 24px 52px}
        .jcard{max-width:460px;margin:0 auto;background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.2);border-radius:18px;padding:32px 28px;position:relative;overflow:hidden}
        .jcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#C9A84C,transparent)}
        .jctitle{font-size:19px;font-weight:700;margin-bottom:5px}
        .jcsub{font-size:13px;color:rgba(245,240,232,.5);margin-bottom:20px;line-height:1.5}
        .jpre{display:flex;align-items:center;gap:8px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:8px;padding:9px 12px;font-size:12px;color:#10B981;margin-bottom:14px}
        .jfield{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
        .jlabel{font-size:11px;font-weight:600;color:rgba(245,240,232,.5);letter-spacing:.07em;text-transform:uppercase}
        .jinput{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:9px;padding:12px 15px;font-size:15px;color:#F5F0E8;outline:none;width:100%;transition:border-color .2s}
        .jinput:focus{border-color:#C9A84C}
        .jinput::placeholder{color:rgba(245,240,232,.2)}
        .jinput.pre{border-color:rgba(16,185,129,.4);background:rgba(16,185,129,.05)}
        .jconsent{display:flex;align-items:flex-start;gap:9px;margin:18px 0;cursor:pointer}
        .jconsent input{width:17px;height:17px;flex-shrink:0;margin-top:2px;accent-color:#C9A84C}
        .jctxt{font-size:11.5px;color:rgba(245,240,232,.45);line-height:1.55}
        .jctxt a{color:#C9A84C;text-decoration:none}
        .jbtn{width:100%;padding:15px;border-radius:11px;background:#C9A84C;color:#0D0D0D;font-size:15px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 4px 18px rgba(201,168,76,.3);transition:all .2s}
        .jbtn:hover{background:#E8C96A}
        .jbtn:disabled{opacity:.5;cursor:not-allowed}
        .jskip{text-align:center;margin-top:13px;font-size:12px;color:rgba(245,240,232,.4)}
        .jskip a{color:#C9A84C;text-decoration:none;font-weight:500}
        .jdirect{display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;padding:8px 0}
        .jgreet{font-size:30px;font-weight:900;color:#C9A84C}
        .jdlbtn{display:inline-flex;align-items:center;gap:9px;background:#10B981;color:#fff;padding:14px 26px;border-radius:11px;font-size:14px;font-weight:600;text-decoration:none;box-shadow:0 4px 18px rgba(16,185,129,.3);transition:all .2s}
        .jdlbtn:hover{transform:translateY(-1px)}
        .jsecbtn{background:transparent;color:#C9A84C;padding:11px 22px;border-radius:11px;font-size:13px;font-weight:500;border:1.5px solid rgba(201,168,76,.3);cursor:pointer;transition:all .2s}
        .jsecbtn:hover{background:rgba(201,168,76,.1)}
        .jsuccess{display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;padding:16px 0}
        .jsuccess-title{font-size:32px;font-weight:900;color:#10B981}
        .jfooter{padding:18px 40px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;font-size:11px;color:rgba(245,240,232,.2);flex-wrap:wrap;gap:6px}
        @media(max-width:600px){.jnav,.jfooter{padding:14px 18px}.jhero{padding:36px 18px 28px}.jcard{padding:24px 18px}}
      `}</style>
      <div className="jw">
        <nav className="jnav">
          <div className="jlogo">aiLearning</div>
          <div className="jbadge">Jornadas AMCP · 8 Mayo 2026</div>
        </nav>
        <div className="jhero">
          <div className="jhero-in">
            <div className="jtag">✦ Exclusivo para asistentes AMCP 2026</div>
            <div className="jbook">
              <div className="jbook-logo">aiLearning</div>
              <div className="jbook-line"/>
              <div className="jbook-txt">DESARROLLA TU NEGOCIO DIGITAL CON IA</div>
              <div className="jbook-line"/>
            </div>
            <h1 className="jh1">Tu guía para arrancar<br/><span>en 24 horas</span></h1>
            <p className="jsub">El resumen completo del <strong style={{color:'#F5F0E8'}}>8 de mayo</strong> — herramientas, pasos y recursos para digitalizar tu despacho con IA.</p>
            <div className="jchips">
              {['🌐 Landing page','🤖 Agente IA','📊 CRM','📢 Meta Ads','⚡ 8 horas'].map(c=><div key={c} className="jchip">{c}</div>)}
            </div>
          </div>
        </div>
        <div className="jfsec">
          <div className="jcard">
            {state==='direct' && (
              <div className="jdirect">
                <div style={{fontSize:'48px'}}>👋</div>
                <div className="jgreet">¡Hola, {nombre.split(' ')[0]}!</div>
                <p style={{fontSize:'14px',color:'rgba(245,240,232,.5)',lineHeight:'1.6',maxWidth:'320px'}}>Ya te tenemos identificado. Tu guía está lista para descargar.</p>
                <a href={PDF_URL} className="jdlbtn" download>📥 Descargar guía ahora</a>
                <button className="jsecbtn" onClick={()=>setState('form')}>📩 También envíamela por correo</button>
              </div>
            )}
            {state==='form' && (
              <>
                {prefilled && <div className="jpre"><span>✓</span><span>Tus datos fueron reconocidos automáticamente</span></div>}
                <div className="jctitle">{prefilled?`¡Hola ${nombre.split(' ')[0]}! Confirma tu correo`:'Descarga la guía gratis'}</div>
                <div className="jcsub">{prefilled?'Solo falta tu correo para enviarte la guía.':'Recíbela en segundos. Sin spam, solo valor.'}</div>
                <div className="jfield">
                  <label className="jlabel">Nombre completo</label>
                  <input className={`jinput${prefilled?' pre':''}`} type="text" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ana García López"/>
                </div>
                <div className="jfield">
                  <label className="jlabel">Correo electrónico</label>
                  <input className={`jinput${email&&prefilled?' pre':''}`} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"/>
                </div>
                <label className="jconsent">
                  <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>
                  <span className="jctxt">Acepto recibir la guía y contenido de <strong>aiLearning</strong>. Puedo cancelar respondiendo STOP. Datos protegidos conforme a la <a href="/privacidad">LFPDPPP</a>.</span>
                </label>
                {error && <p style={{color:'#E74C3C',fontSize:'12px',textAlign:'center',margin:'0 0 10px'}} role="alert">{error}</p>}
                <button className="jbtn" onClick={handleSubmit} disabled={sending}>
                  {sending?'Enviando...':<><span>Quiero mi guía gratis</span><span>→</span></>}
                </button>
                <div className="jskip">¿Solo el PDF? <a href={PDF_URL} download>Descarga directa aquí</a></div>
              </>
            )}
            {state==='success' && (
              <div className="jsuccess">
                <div style={{fontSize:'48px'}}>🎉</div>
                <div className="jsuccess-title">¡Listo!</div>
                <p style={{fontSize:'14px',color:'rgba(245,240,232,.5)',lineHeight:'1.6',maxWidth:'320px'}}>Revisa tu bandeja de entrada. También puedes descargar el PDF directamente.</p>
                <a href={PDF_URL} className="jdlbtn" download>📥 Descargar PDF ahora</a>
              </div>
            )}
          </div>
        </div>
        <footer className="jfooter">
          <span>© 2026 aiLearning · ailearning.mx</span>
          <span>Jornadas del Estudiante AMCP · 8 de Mayo 2026</span>
        </footer>
      </div>
    </>
  );
}
