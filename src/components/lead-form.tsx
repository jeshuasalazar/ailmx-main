"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function LeadForm({ source = "consultoria" }: { source?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const firstInvalid = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) {
      firstInvalid.current?.focus();
      return;
    }
    setState("loading");
    setMessage("Enviando tu solicitud…");
    const data = new FormData(form);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source,
          tipo: "b",
          nombre: data.get("nombre"),
          email: data.get("email"),
          whatsapp: data.get("telefono"),
          pais: data.get("empresa"),
          mensaje: data.get("mensaje"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(response.status === 429 ? "rate" : "upstream");
      setState("success");
      setMessage("Recibimos tu solicitud. Te responderemos por correo.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "La conexión tardó demasiado. Revisa tu red e intenta de nuevo."
          : error instanceof Error && error.message === "rate"
            ? "Recibimos varios intentos. Espera un momento antes de reintentar."
            : "No pudimos enviar la solicitud. Tus datos siguen en el formulario; inténtalo de nuevo."
      );
    } finally {
      window.clearTimeout(timer);
    }
  }

  return (
    <form className="form-card form-grid" onSubmit={submit} noValidate={false}>
      <div className="field">
        <label htmlFor="nombre">Nombre completo</label>
        <input ref={firstInvalid} id="nombre" name="nombre" autoComplete="name" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="email">Correo de trabajo</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="telefono">Teléfono <span className="field-hint">(opcional)</span></label>
        <input id="telefono" name="telefono" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="empresa">Empresa <span className="field-hint">(opcional)</span></label>
        <input id="empresa" name="empresa" autoComplete="organization" />
      </div>
      <div className="field field-full">
        <label htmlFor="mensaje">¿Qué te gustaría resolver?</label>
        <textarea id="mensaje" name="mensaje" maxLength={1200} required />
        <p className="field-hint">No incluyas información confidencial.</p>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="checkbox">
        <input type="checkbox" name="consent" required />
        <span>Acepto que aiLearning use estos datos para responder mi solicitud, de acuerdo con el <Link href="/es/legal/privacidad">aviso de privacidad</Link>.</span>
      </label>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={state === "loading"}>
          {state === "loading" ? <LoaderCircle size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
          {state === "loading" ? "Enviando" : "Enviar solicitud"}
        </button>
        <p className={`form-status ${state}`} role="status" aria-live="polite">{message}</p>
      </div>
    </form>
  );
}
