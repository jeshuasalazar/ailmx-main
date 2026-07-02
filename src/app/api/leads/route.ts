import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_384;
const TIMEOUT_MS = 8_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

const leadSchema = z.object({
  source: z.string().trim().min(1).max(80).regex(/^[\p{L}\p{N} ._/-]+$/u),
  tipo: z.enum(["f", "b"]).default("b"),
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  whatsapp: z.string().trim().max(40).optional().default(""),
  pais: z.string().trim().max(100).optional().default(""),
  mensaje: z.string().trim().max(1200).optional().default(""),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(""),
}).strict();

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const completed = new Map<string, number>();

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
}

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string, now = Date.now()) {
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_MAX;
}

function validOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    return originUrl.host === requestUrl.host;
  } catch {
    return false;
  }
}

function idempotencyKey(email: string, source: string) {
  const slot = Math.floor(Date.now() / 300_000);
  return createHash("sha256").update(`${email}:${source}:${slot}`).digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] || character);
}

async function postBrevo(path: string, body: object) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`https://api.brevo.com/v3/${path}`, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": apiKey },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  if (!validOrigin(request)) return json({ error: "validation" }, 400);
  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (declaredLength > MAX_BODY_BYTES) return json({ error: "validation" }, 400);
  if (isRateLimited(clientKey(request))) return json({ error: "rate_limited" }, 429);

  let raw: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return json({ error: "validation" }, 400);
    raw = JSON.parse(text);
  } catch {
    return json({ error: "validation" }, 400);
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) return json({ error: "validation" }, 400);
  const lead = parsed.data;
  if (lead.website) return json({ ok: true });

  const key = idempotencyKey(lead.email, lead.source);
  const prior = completed.get(key);
  if (prior && prior > Date.now() - 300_000) return json({ ok: true });

  const listId = Number(lead.tipo === "b" ? process.env.BREVO_LIST_ID_B || "4" : process.env.BREVO_LIST_ID_F || "3");
  const [firstName, ...lastName] = lead.nombre.split(/\s+/);
  const upstreamOk = await postBrevo("contacts", {
    email: lead.email,
    updateEnabled: true,
    listIds: [listId],
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: lastName.join(" "),
      WHATSAPP: lead.whatsapp,
      COUNTRY: lead.pais,
      FUENTE: lead.source,
      TIPO: lead.tipo === "b" ? "Consultoria" : "Formacion",
      CONSENT_AT: new Date().toISOString(),
    },
  });

  if (!upstreamOk) return json({ error: "upstream" }, 502);

  if (lead.tipo === "b" && lead.mensaje) {
    const notificationOk = await postBrevo("smtp/email", {
      sender: {
        name: process.env.BREVO_SENDER_NAME || "aiLearning",
        email: process.env.BREVO_SENDER_EMAIL || "hola@ailearning.mx",
      },
      to: [{ email: process.env.LEADS_NOTIFICATION_EMAIL || "hola@ailearning.mx", name: "aiLearning" }],
      replyTo: { email: lead.email, name: lead.nombre },
      subject: "Nueva solicitud de consultoría — aiLearning",
      htmlContent: `<h1>Nueva solicitud de consultoría</h1><p><strong>Nombre:</strong> ${escapeHtml(lead.nombre)}</p><p><strong>País:</strong> ${escapeHtml(lead.pais || "No indicado")}</p><p><strong>Mensaje:</strong></p><p>${escapeHtml(lead.mensaje).replace(/\n/g, "<br>")}</p>`,
    });
    if (!notificationOk) return json({ error: "upstream" }, 502);
  }

  completed.set(key, Date.now());
  return json({ ok: true });
}

export function GET() { return json({ error: "method_not_allowed" }, 405); }
