import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const targetRoutes = [
  ["/es", "Menos ruido"],
  ["/es/academia", "Aprender IA"],
  ["/es/consultoria", "No empieces por la herramienta"],
  ["/es/contacto", "Una buena conversación"],
] as const;

test("redirige la raíz y permite recorrer el journey principal", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
  await page.getByRole("link", { name: "Conocer Consultoría" }).click();
  await expect(page).toHaveURL(/\/es\/consultoria$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("No empieces por la herramienta");
  await page.getByRole("link", { name: "Solicitar diagnóstico" }).first().click();
  await expect(page).toHaveURL(/\/es\/contacto$/);
});

for (const [path, heading] of targetRoutes) {
  test(`${path} renderiza contenido esencial y pasa axe`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("el menú móvil gestiona estado, Escape y foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/es");
  const toggle = page.getByRole("button", { name: "Abrir menú" });
  await toggle.click();
  const mobileNavigation = page.locator("#mobile-navigation");
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Academia" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
  await expect(mobileNavigation).toBeHidden();
});

test("legales, campañas, descarga y 404 permanecen disponibles", async ({ page }) => {
  for (const path of ["/es/legal/privacidad", "/es/legal/terminos", "/es/legal/cookies", "/activar", "/jornadas2026"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  const pdf = await page.request.get("/jornadas2026/guia.pdf");
  expect(pdf.ok()).toBeTruthy();
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  const missing = await page.goto("/es/ruta-inexistente");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Esta ruta no existe." })).toBeVisible();
});

test("los parámetros personales no precargan campañas", async ({ page }) => {
  await page.goto("/activar?nombre=Ana&email=ana@example.com");
  await expect(page.getByText("Sin datos personales en la URL")).toBeVisible();
  await expect(page.locator("input")).toHaveCount(0);
});

test("el formulario valida, preserva datos ante error y confirma éxito", async ({ page }) => {
  await page.goto("/es/contacto");
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.getByLabel("Nombre completo")).toBeFocused();
  await expect(page.getByText("Escribe tu nombre completo.")).toBeVisible();

  await page.getByLabel("Nombre completo").fill("Ana García");
  await page.getByLabel("Correo de trabajo").fill("ana@example.com");
  await page.locator("#pais").fill("México");
  await page.getByLabel("¿Qué te gustaría resolver?").fill("Automatizar una tarea repetitiva");
  await page.getByRole("checkbox").check();

  await page.route("**/api/leads", async (route) => route.fulfill({ status: 502, contentType: "application/json", body: '{"error":"upstream"}' }));
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.getByRole("status")).toContainText("Tus datos siguen en el formulario");
  await expect(page.getByLabel("Correo de trabajo")).toHaveValue("ana@example.com");

  await page.unroute("**/api/leads");
  await page.route("**/api/leads", async (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.getByRole("status")).toContainText("Recibimos tu solicitud");
  await expect(page.getByLabel("Correo de trabajo")).toHaveValue("");
});

test("el formulario explica rate limit y validación del servidor", async ({ page }) => {
  await page.goto("/es/contacto");
  await page.getByLabel("Nombre completo").fill("Ana García");
  await page.getByLabel("Correo de trabajo").fill("ana@example.com");
  await page.getByLabel("¿Qué te gustaría resolver?").fill("Una tarea");
  await page.getByRole("checkbox").check();
  await page.route("**/api/leads", async (route) => route.fulfill({ status: 429, contentType: "application/json", body: '{"error":"rate_limited"}' }));
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.getByRole("status")).toContainText("Espera un momento");
  await page.unroute("**/api/leads");
  await page.route("**/api/leads", async (route) => route.fulfill({ status: 400, contentType: "application/json", body: '{"error":"validation"}' }));
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.getByRole("status")).toContainText("Revisa los datos marcados");
});

test("la matriz responsive no produce overflow horizontal", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "La matriz exhaustiva se ejecuta una vez en Chromium.");
  const viewports = [
    [320, 568], [360, 640], [390, 844], [430, 932], [667, 375], [932, 430],
    [768, 1024], [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [2560, 1440],
  ] as const;
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto("/es");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, `overflow en ${width}x${height}`).toBe(false);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});
