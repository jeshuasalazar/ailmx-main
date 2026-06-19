import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("redirige la raíz y permite recorrer el MVP", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Menos ruido");
  await page.getByRole("link", { name: "Conocer Consultoría" }).click();
  await expect(page).toHaveURL(/\/es\/consultoria$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("No empieces por la herramienta");
});

test("la portada no tiene violaciones axe detectables", async ({ page }) => {
  await page.goto("/es");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("los parámetros personales no precargan campañas", async ({ page }) => {
  await page.goto("/activar?nombre=Ana&email=ana@example.com");
  await expect(page.getByText("Sin datos personales en la URL")).toBeVisible();
  await expect(page.locator("input")).toHaveCount(0);
});
