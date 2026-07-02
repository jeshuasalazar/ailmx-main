// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LeadForm } from "./lead-form";

describe("LeadForm", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra una recuperación clara cuando la solicitud expira", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_url: string, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    })));
    render(<LeadForm />);

    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Ana García" } });
    fireEvent.change(screen.getByLabelText("Correo de trabajo"), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText("¿Qué te gustaría resolver?"), { target: { value: "Una tarea repetitiva" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

    await act(async () => vi.advanceTimersByTimeAsync(10_000));
    expect(screen.getByRole("status")).toHaveTextContent("La conexión tardó demasiado");
    expect(screen.getByLabelText("Correo de trabajo")).toHaveValue("ana@example.com");
  });
});
