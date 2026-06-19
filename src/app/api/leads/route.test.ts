import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function request(body: unknown, ip = crypto.randomUUID()) {
  return new NextRequest("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const validLead = { source: "test", tipo: "b", nombre: "Ana García", email: "ana@example.com", mensaje: "Automatizar una tarea", consent: true };

describe("POST /api/leads", () => {
  beforeEach(() => { process.env.BREVO_API_KEY = "server-secret"; });
  afterEach(() => { delete process.env.BREVO_API_KEY; });

  it("rechaza payloads incompletos", async () => {
    const response = await POST(request({ email: "no-es-correo" }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "validation" });
  });

  it("acepta un lead cuando el proveedor responde 2xx", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 201 })));
    const response = await POST(request(validLead));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("devuelve un error genérico cuando falla el proveedor", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    const response = await POST(request({ ...validLead, email: "otra@example.com" }));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "upstream" });
  });

  it("limita ráfagas por dirección", async () => {
    const ip = "192.0.2.44";
    for (let index = 0; index < 5; index += 1) await POST(request({}, ip));
    const response = await POST(request({}, ip));
    expect(response.status).toBe(429);
  });
});
