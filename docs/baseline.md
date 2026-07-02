# Baseline técnico

## Antes de la implementación v3/v4

- Next.js 16.2.2 / React 19.2.4.
- Portada monolítica de más de 1,000 líneas, completamente cliente.
- 10 errores y 11 warnings de lint registrados por el plan v4.
- Sin rutas `/es`, navegación MVP, CI, Vitest ni Playwright.
- Clave Brevo y PII expuestas en flujos cliente históricos.
- Metadata genérica, fuentes remotas y artefactos de Vercel.

## Gate del release

Los valores finales se obtienen mediante `npm run check` y `npm run test:e2e`. El pipeline exige lint sin errores, typecheck, pruebas unitarias, build standalone y E2E con axe. Lighthouse y métricas de campo se registran en preproducción, porque un número local sin red/dispositivo controlados no es comparable.

## Candidato de rediseño — 22 de junio de 2026

- Next.js 16.2.9 / React 19.2.4 / Tailwind CSS 4.2.2.
- Cuatro rutas objetivo renderizadas en servidor con dos islas cliente: navegación y formulario.
- Contrato del lead alineado como `pais` → `COUNTRY`; el contrato histórico `empresa` se rechaza.
- CSP con nonce por solicitud, sin `unsafe-inline` para scripts y sin relajación de `connect-src`.
- 8 pruebas unitarias y suite E2E en Chromium, Firefox, WebKit y Pixel 7.
- Matriz automatizada de overflow desde 320×568 hasta 2560×1440.
- Assets públicos reducidos a la guía de campaña utilizada; se retiraron 7.3 MB aproximados sin referencias y un PDF duplicado.
