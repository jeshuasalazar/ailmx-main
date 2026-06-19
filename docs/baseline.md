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
