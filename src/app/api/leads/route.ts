import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
   /api/leads — proxy server-side a Brevo
   - Secreto solo en servidor (BREVO_API_KEY, sin NEXT_PUBLIC)
   - Validación estricta + timeout + verificación response.ok
   - Respuesta genérica; nunca expone el status del proveedor
   ───────────────────────────────────────────────────────────── */

const BREVO_KEY = process.env.BREVO_API_KEY || "";
const LIST_F = parseInt(process.env.BREVO_LIST_ID_F || "3", 10);
const LIST_B = parseInt(process.env.BREVO_LIST_ID_B || "4", 10);
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "hola@ailearning.mx";
const SENDER_NAME = process.env.BREVO_SENDER_NAME || "aiLearning";
const TIMEOUT_MS = 8000;

type Tipo = "f" | "b";

interface LeadPayload {
  source: string;
  tipo?: Tipo;
  nombre: string;
  email: string;
  whatsapp?: string;
  pais?: string;
  fuente?: string;
  consent: boolean;
  website?: string; // honeypot
}

const EMAIL_TEMPLATES: Record<Tipo, { subject: string; html: (n: string) => string }> = {
  f: {
    subject: "¡Bienvenido a aiLearning! Tu acceso al minicurso está listo 🚀",
    html: (nombre) => `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#05080e;color:#fff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0d1826,#1a3050);padding:32px;text-align:center">
          <div style="font-size:28px;font-weight:900;letter-spacing:-1px">ai<span style="color:#2B7FE0">Learning</span></div>
        </div>
        <div style="padding:32px">
          <h1 style="font-size:22px;font-weight:800;margin:0 0 8px">¡Hola, ${nombre}! 👋</h1>
          <p style="color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px">Tu registro fue exitoso. En menos de 1 hora puedes tener tu primer agente de IA funcionando.</p>
          <a href="https://ailearning.mx" style="display:block;text-align:center;background:#2B7FE0;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:700">Iniciar minicurso →</a>
        </div>
      </div>`,
  },
  b: {
    subject: "Tu diagnóstico está reservado — aiLearning",
    html: (nombre) => `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#05080e;color:#fff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1a0d00,#3a1a00);padding:32px;text-align:center">
          <div style="font-size:28px;font-weight:900;letter-spacing:-1px">ai<span style="color:#c05e1a">Learning</span></div>
        </div>
        <div style="padding:32px">
          <h1 style="font-size:22px;font-weight:800;margin:0 0 8px">¡Hola, ${nombre}! 👋</h1>
          <p style="color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px">Recibimos tu solicitud. En las próximas horas te contactamos para agendar tu diagnóstico gratuito.</p>
        </div>
      </div>`,
  },
};

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

function sanitize(v: unknown, max = 120): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function brevoFetch(url: string, body: unknown): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": BREVO_KEY },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    // 2xx ok; 4xx contacto duplicado (204/400) se considera no fatal salvo auth
    if (res.ok) return true;
    if (res.status === 400) return true; // contacto ya existe / actualizado
    return false;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  // Protección de origen básica
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let data: LeadPayload;
  try {
    data = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: si viene relleno, fingir éxito sin hacer nada
  if (sanitize(data.website)) return NextResponse.json({ ok: true });

  const nombre = sanitize(data.nombre);
  const email = sanitize(data.email, 254).toLowerCase();
  const tipo: Tipo = data.tipo === "b" ? "b" : "f";

  if (nombre.length < 2 || !isEmail(email)) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  if (data.consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }
  if (!BREVO_KEY) {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  const [firstName, ...rest] = nombre.split(/\s+/);
  const contactOk = await brevoFetch("https://api.brevo.com/v3/contacts", {
    email,
    updateEnabled: true,
    listIds: [tipo === "b" ? LIST_B : LIST_F],
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: rest.join(" "),
      WHATSAPP: sanitize(data.whatsapp, 40),
      SMS: sanitize(data.whatsapp, 40),
      COUNTRY: sanitize(data.pais, 60),
      FUENTE: sanitize(data.fuente, 80) || sanitize(data.source, 80) || "Hub",
      TIPO: tipo === "b" ? "Empresas" : "Formacion",
      CONSENT_AT: new Date().toISOString(),
    },
  });

  if (!contactOk) {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  // Email de bienvenida: best-effort, no bloquea el éxito del lead
  const tpl = EMAIL_TEMPLATES[tipo];
  await brevoFetch("https://api.brevo.com/v3/smtp/email", {
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    to: [{ email, name: nombre }],
    subject: tpl.subject,
    htmlContent: tpl.html(firstName),
  });

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
