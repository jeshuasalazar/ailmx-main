"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";
type FieldName = "nombre" | "email" | "pais" | "mensaje" | "consent";

const fieldMessages: Record<FieldName, string> = {
  nombre: "Escribe tu nombre completo.",
  email: "Escribe un correo válido.",
  pais: "",
  mensaje: "Cuéntanos brevemente qué te gustaría resolver.",
  consent: "Necesitamos tu consentimiento para responder la solicitud.",
};

export function LeadForm({ source = "consultoria" }: { source?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const firstInvalid = useRef<HTMLInputElement>(null);

  function validate(form: HTMLFormElement) {
    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const name of ["nombre", "email", "mensaje", "consent"] as FieldName[]) {
      const control = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
      if (control && !control.validity.valid) nextErrors[name] = fieldMessages[name];
    }
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return Object.keys(nextErrors).length === 0;
  }

  function validateField(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const control = event.currentTarget;
    const name = control.name as FieldName;
    if (!(name in fieldMessages)) return;
    const nextMessage = control.validity.valid ? undefined : fieldMessages[name];
    setErrors((current) => ({ ...current, [name]: nextMessage }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validate(form)) return;
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
          pais: data.get("pais"),
          mensaje: data.get("mensaje"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(response.status === 400 ? "validation" : response.status === 429 ? "rate" : "upstream");
      setState("success");
      setMessage("Recibimos tu solicitud. Te responderemos por correo.");
      setErrors({});
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "La conexión tardó demasiado. Revisa tu red e intenta de nuevo."
          : error instanceof Error && error.message === "validation"
            ? "Revisa los datos marcados e intenta de nuevo."
          : error instanceof Error && error.message === "rate"
            ? "Recibimos varios intentos. Espera un momento antes de reintentar."
            : "No pudimos enviar la solicitud. Tus datos siguen en el formulario; inténtalo de nuevo."
      );
    } finally {
      window.clearTimeout(timer);
    }
  }

  return (
    <form className="form-card form-grid" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="nombre">Nombre completo</label>
        <input ref={firstInvalid} id="nombre" name="nombre" autoComplete="name" required minLength={2} aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? "nombre-error" : undefined} onBlur={validateField} />
        {errors.nombre && <p className="field-error" id="nombre-error" role="alert">{errors.nombre}</p>}
      </div>
      <div className="field">
        <label htmlFor="email">Correo de trabajo</label>
        <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onBlur={validateField} />
        {errors.email && <p className="field-error" id="email-error" role="alert">{errors.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="telefono">Teléfono <span className="field-hint">(opcional)</span></label>
        <input id="telefono" name="telefono" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="pais">País <span className="field-hint">(opcional)</span></label>
        <input id="pais" name="pais" autoComplete="country-name" />
      </div>
      <div className="field field-full">
        <label htmlFor="mensaje">¿Qué te gustaría resolver?</label>
        <textarea id="mensaje" name="mensaje" maxLength={1200} required aria-invalid={Boolean(errors.mensaje)} aria-describedby={errors.mensaje ? "mensaje-error mensaje-hint" : "mensaje-hint"} onBlur={validateField} />
        {errors.mensaje && <p className="field-error" id="mensaje-error" role="alert">{errors.mensaje}</p>}
        <p className="field-hint" id="mensaje-hint">No incluyas información confidencial.</p>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="checkbox">
        <input type="checkbox" name="consent" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} onChange={() => setErrors((current) => ({ ...current, consent: undefined }))} />
        <span>Acepto que aiLearning use estos datos para responder mi solicitud, de acuerdo con el <a href="/es/legal/privacidad">aviso de privacidad</a>.</span>
      </label>
      {errors.consent && <p className="field-error field-full" id="consent-error" role="alert">{errors.consent}</p>}
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
