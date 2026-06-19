import { afterEach, describe, expect, it } from "vitest";
import { buildAcademyUrl } from "./academy";

describe("buildAcademyUrl", () => {
  const previous = process.env.ACADEMIA_PUBLIC_URL;
  afterEach(() => { process.env.ACADEMIA_PUBLIC_URL = previous; });

  it("genera un deep link sin PII", () => {
    process.env.ACADEMIA_PUBLIC_URL = "https://academia.example.com";
    const url = new URL(buildAcademyUrl({ locale: "es", source: "ailearning-hub", campaign: "home" }));
    expect(url.origin).toBe("https://academia.example.com");
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("locale")).toBe("es");
    expect(url.search).not.toMatch(/email|nombre|token|jwt/i);
  });

  it("descarta atribución que no pertenece a la allowlist", () => {
    const url = new URL(buildAcademyUrl({ locale: "es", source: "bad?email=x" }));
    expect(url.searchParams.has("source")).toBe(false);
  });
});
