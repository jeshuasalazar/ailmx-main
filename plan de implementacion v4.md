# Plan de implementación v4 — aiLearning Hub

**Versión:** 4.0
**Fecha:** 19 de junio de 2026
**Reemplaza a:** `plan de implementacion v3.md`
**Estado del plan:** **GO CONTUNDENTE**
**Estado del producto actual:** **NO-GO para producción** hasta cerrar G0–G4
**Repositorio evaluado:** `/Users/MAC/ailearning` (auditado en vivo el 19-jun-2026)
**Objetivo:** publicar un hub corporativo rápido, accesible y creíble que convierta y enlace a Academia sin duplicar auth, pagos ni PII, desplegable y reversible en Railway.

---

## 0. Decisión ejecutiva

### 0.1 Veredicto

| Pregunta | Resultado |
|---|---|
| ¿El plan v4 es ejecutable sin decisiones P0 pendientes? | **Sí — GO** |
| ¿El código actual puede publicarse hoy? | **No — NO-GO** |
| ¿Se puede iniciar implementación inmediatamente? | **Sí, por G0** |
| ¿v4 cierra los huecos de ejecución que dejó v3? | **Sí** |

**Qué hace a v4 un Go contundente frente a v3:** v3 fijó alcance y gates pero dejó sin especificar los artefactos de despliegue, el contrato de variables, las rutas server-side, la infraestructura de CI inexistente y la asignación nominal de responsables. v4 entrega esos artefactos como contenido concreto y convierte cada gate en tareas atómicas con criterio de aceptación verificable. No queda ninguna “decisión por tomar”: queda solo trabajo por ejecutar.

### 0.2 Ajustes aplicados en v4 (cierre del Go)

| # | Hueco en v3 | Ajuste en v4 |
|---|---|---|
| A1 | CI “requerida” pero **no existe ningún runner, test ni workflow** en el repo | WBS crea Vitest + Playwright + GitHub Actions desde cero (T-13…T-16) |
| A2 | `output: "standalone"` ausente en `next.config.ts` (Docker standalone imposible) | Config concreta provista (§5.1) como tarea T-30 |
| A3 | Dockerfile, `railway.json`, `.env.example` solo descritos en prosa | Contenido literal provisto (§6.2–6.4) listo para commit |
| A4 | `/api/leads` y proxy Brevo sin firma ni esquema | Spec de Route Handler + Zod + idempotencia (§5.5) |
| A5 | RACI por “equipos” sin persona; bloquea arranque | Modelo operador único + IA-asistido con dueños nominales (§11) |
| A6 | Acoplamiento Vercel (`.vercel/`, `vercel.svg`) contradice deploy Railway | Tarea de desacople T-31 |
| A7 | Gates en días sin tareas atómicas ni dependencias | WBS de 42 tareas con ID, dependencia, criterio de aceptación (§9) |
| A8 | Runbook de deploy Railway ausente | Runbook paso a paso + rollback (§10) |

### 0.3 Principios no negociables

1. El hub informa y convierte; Academia registra, autentica, cobra y entrega.
2. No se publica información comercial sin fuente y aprobador identificados.
3. No se envían secretos ni PII desde el navegador a terceros.
4. Server-first: HTML útil sin hidratación masiva; JS solo para interacción necesaria.
5. Una experiencia completa en español antes que seis incompletas.
6. Cada fase termina en software desplegable y reversible.
7. La complejidad entra por evidencia de necesidad, no por anticipación.

### 0.4 Alcance cerrado del MVP

**Incluye:** `/es`, `/es/academia`, `/es/consultoria`, `/es/contacto`, `/es/legal/{privacidad,terminos,cookies}`; header, footer, selector de idioma preparado, formularios de lead server-side, estados de error y 404/500; CTA seguro a Academia con atribución no sensible; SEO técnico, analítica con consentimiento, accesibilidad, presupuestos de rendimiento; Railway + Cloudflare, CI/CD, healthcheck, observabilidad y rollback.

**No incluye en el primer release:** auth/sesión/checkout/progreso/perfil en el hub; SSO, Redis, multi-réplica o multi-región sin métrica; precios/catálogo dinámicos sin contrato estable; `/casos` o claims cuantitativos sin evidencia; `fr/de/ar/zh` sin traducción y revisión humana; rediseño de repos Academia/Home (no presentes en el workspace).

### 0.5 Ruta degradada (evita bloqueos externos)

| Dependencia no disponible | Comportamiento seguro |
|---|---|
| API catálogo Academia | Ocultar precio; propuesta de valor aprobada + CTA genérico |
| `/register` validado | CTA a home de Academia; nunca simular cuenta |
| Testimonios/casos aprobados | Retirar bloque; sin placeholders ni logos ficticios |
| Fuentes licenciadas locales | Stack de sistema; sin Google Fonts en build |
| Traducción revisada | Locale fuera de allowlist, sitemap y hreflang |
| Redis | Rate limit en Cloudflare/origen de una instancia |

---

## 1. Evidencia revisada (verificada en vivo)

### 1.1 Estado reproducible del repositorio (19-jun-2026)

| Verificación | Resultado confirmado |
|---|---|
| `npm run build` | Pasa; 4 rutas (`/`, `/_not-found`, `/activar`, `/jornadas2026`) |
| `npx eslint .` | **Falla: 10 errores, 11 warnings** (confirmado) |
| Next.js / React | `16.2.2` / `19.2.4` (confirmado en `package.json`) |
| `src/app/page.tsx` | **1065 líneas, `"use client"` monolítico** (confirmado) |
| `src/app/layout.tsx` | `title: "Create Next App"`, `lang="en"`, `next/font/google` (Geist) (confirmado) |
| Brevo en cliente | `NEXT_PUBLIC_BREVO_API_KEY` usado en `RegisterModal.tsx` y `activar/page.tsx` (confirmado) |
| PII en URL | `activar` y `jornadas2026` leen `nombre`/`email` de `window.location.search`; `activar` **autoenvía** vía `autoActivate()` (confirmado) |
| `response.ok` | **Ausente**; `fetch` a Brevo sin verificación de status, en `try{}catch{}` vacío (confirmado) |
| `next.config.ts` | Vacío; **sin `output: "standalone"`** (confirmado) |
| Acople Vercel | `.vercel/`, `public/vercel.svg`, `.next/` versionado presentes (confirmado) |
| Infra de test/CI | **Inexistente** (sin Vitest/Playwright/Actions) (confirmado) |

Los repos `academia`, `home`, `ailmx-main` citados por v2 **no existen** en este workspace; sus contratos, seguridad y precios siguen **no verificados**.

### 1.2 Correcciones técnicas heredadas y mantenidas

- `unstable_cache` → `use cache` (Next 16). Usar `cacheComponents: true`, `use cache`, `cacheLife`, `cacheTag` solo donde haya datos externos cacheables.
- PPR queda incluido al habilitar Cache Components (no es flag aparte).
- Node 20 EOL (mar-2026) → imagen base **Node 22 LTS** fijada a digest.
- Railway escala vertical; horizontal es decisión manual. No se promete autoescalado horizontal.
- Healthcheck de Railway valida el deploy, no monitoriza continuo → monitor externo obligatorio.
- Cloudflare no cachea HTML/API/respuestas con cookies; solo assets inmutables y públicos marcados.
- “Build sin red” = `npm run build` sin red **tras** instalar deps; `npm ci` sí requiere registro/caché.

---

## 2. Bloqueantes mayores y cierre

### 2.1 Heredados de v3 (reconfirmados)

| ID | Sev. | Bloqueante | Cierre obligatorio | Evidencia de cierre |
|---|---:|---|---|---|
| B01 | P0 | Clave Brevo accesible desde cliente | Revocar/rotar; eliminar `NEXT_PUBLIC_BREVO_*`; proxy server-side | Repo+bundle sin clave; prueba de revocación |
| B02 | P0 | PII en query string + autoenvío en `/activar`,`/jornadas2026` | No aceptar nombre/email por URL; POST con consentimiento | E2E: URL sin PII, sin envío automático |
| B03 | P0 | Éxito falso: Brevo sin `response.ok` | Validar timeout/status/body; estado recuperable, sin doble envío | Tests 2xx/4xx/429/5xx/timeout |
| B04 | P0 | Precios/garantías/logos/casos/métricas no demostrados | Inventario editorial con fuente, fecha, aprobación; retirar lo no aprobado | Matriz firmada Producto/Legal |
| B05 | P0 | CTA/legales a 404 o placeholder | Ruta real o CTA oculto; teléfono y enlaces verificados | Crawler interno sin enlaces rotos |
| B06 | P0 | Contrato Academia no verificable | Deep link mínimo validado; catálogo tras feature flag | Contract test o ruta degradada activa |
| B07 | P1 | Home 100% cliente, JS/motion excesivo | Migrar shell y secciones a Server Components; islas pequeñas | Bundle y React tree auditados |
| B08 | P1 | Lint rojo + efectos con errores React | Corregir 10 errores y 11 warnings; gate cero regresiones | CI verde |
| B09 | P1 | Metadata/idioma/SEO incorrectos | Layout por locale; metadata/canonical/sitemap reales | Test SEO por ruta |
| B10 | P1 | Fuente remota en build + activos pesados | Fuente local/sistema; video por intención con poster | Build sin red + auditoría LCP |
| B11 | P1 | Modal sin foco/escape/errores | Dialog accesible, focus trap/restore, Escape, labels, `aria-live` | axe + teclado + lector |
| B12 | P1 | Sobredimensión de infra inicial | Una réplica, sin Redis; escalar por SLO/uso | ADR + presupuesto mensual |

### 2.2 Nuevos bloqueantes detectados en v4

| ID | Sev. | Bloqueante | Cierre obligatorio | Evidencia de cierre |
|---|---:|---|---|---|
| B13 | P0 | **No existe infraestructura de test ni CI**; el plan depende de gates automáticos inexistentes | Crear Vitest + Playwright + GitHub Actions antes de G2 | Pipeline ejecuta y bloquea merge |
| B14 | P0 | **`next.config.ts` sin `output:"standalone"`**: Dockerfile del plan no arranca | Añadir config standalone + `cacheComponents` por fase | `docker run` sirve `/api/health` |
| B15 | P1 | **RACI sin persona**: arranque imposible con “equipo” como responsable | Modelo operador único + IA; dueño nominal por rol A/R | §11 con nombres asignados |
| B16 | P1 | **Acople Vercel** (`.vercel/`, `vercel.svg`, `.next/` versionado) | Eliminar artefactos Vercel; `.gitignore` correcto | Repo sin rastros Vercel; deploy solo Railway |
| B17 | P2 | `lucide-react ^1.7.0` y versiones futuras sin lockstep verificado | Auditoría de deps + pin reproducible | `npm ci` reproducible + scan limpio |
| B18 | P2 | `Bienvenida_Home_720p.mp4` y PNG pesados sin presupuesto | Comprimir/poster/`preload="none"`; presupuesto por activo | Auditoría peso ≤ presupuesto §7.1 |

**Gating:** no se abre G1 con B01–B03 abiertos. No se abre G2 con B13–B14 abiertos. No se publica G4 con B04–B06 abiertos ni su ruta degradada inactiva.

---

## 3. Arquitectura de producto e información

### 3.1 Audiencias y acción primaria

| Audiencia | Necesidad | CTA primario |
|---|---|---|
| Profesional que aprende | Entender oferta y empezar | “Explorar Academia” |
| Empresa con oportunidad | Validar capacidad y contactar | “Solicitar diagnóstico” |
| Alumno existente | Entrar a su producto | “Ir a Academia” |
| Prospecto que evalúa | Ver método y evidencia | “Conocer cómo trabajamos” |

Una sola CTA visualmente primaria por pantalla. Academia y Consultoría son rutas separadas; nunca dos ofertas mezcladas en un formulario.

### 3.2 Navegación MVP

```text
/
└── redirección 308 → /es
    ├── /es
    ├── /es/academia
    ├── /es/consultoria
    ├── /es/contacto
    └── /es/legal
        ├── /privacidad
        ├── /terminos
        └── /cookies
```

Campañas existentes (`/activar`, `/jornadas2026`) se mantienen temporalmente, se corrigen por seguridad (B01–B03) y se registran para retiro. No heredan claims, formularios ni estilos nuevos automáticamente.

### 3.3 Portada MVP

Header → Hero con elección Academia/Consultoría → propuesta de valor → capacidades verificables → método → recursos/campañas vigentes → FAQ aprobada → CTA final → footer legal. Se eliminan del release: logos inventados, métricas sin fuente, testimonios ficticios, contadores sin valor y garantías no aprobadas por Legal.

---

## 4. Experiencia y sistema visual

### 4.1 Tokens (de `Brand Manual aiLearning.html`)

```css
--ai-blue: #2d88e8;  --ai-blue-deep: #1a5fb4;  --ai-blue-soft: #e6f0fb;
--ink: #0e1b2c;      --ink-2: #1f2d42;         --muted: #6b7484;
--line: #e8e5dd;     --cloud: #f4f2ec;         --paper: #fbfaf6;
--coral: #ff6b47;    --success: #4f7d6c;       --danger: #b42318;
```

Verificar pares de contraste WCAG 2.2 AA antes de congelar. El azul de marca no se asume válido para texto pequeño.

### 4.2 Tipografía y densidad

- Space Grotesk / DM Sans / JetBrains Mono **solo con archivos licenciados locales**; si no, stack de sistema, cero descargas en build/runtime.
- Texto base 16 px; line-height 1.5–1.7; longitud 35–60 (móvil) / 60–75 (desktop); escala 4/8; contenedor 72–80rem.

### 4.3 Componentes mínimos

`Button`, `LinkButton`, `IconButton`, `Container`, `Section`, `Card`, `Badge`, `Header`, `MobileNav`, `Footer`, `LocaleSwitcher`, `FormField`, `InlineError`, `Dialog`, `Toast`, `Accordion`, `AcademyCTA`, `ConsultingLeadForm`. Estados: normal/hover/focus-visible/pressed/disabled/loading/error/success. Targets ≥44×44 px, separación ≥8 px.

### 4.4 Movimiento

150 ms feedback / 220 ms menús / ≤300 ms entradas. Solo `transform`/`opacity`. Nada esencial depende de hover o movimiento. `prefers-reduced-motion` desactiva parallax/conteos/stagger. Framer Motion solo si CSS no resuelve la interacción.

### 4.5 Estados obligatorios

Loading con espacio reservado; vacío con siguiente acción; error con causa y recuperación; offline/red lenta; éxito explícito; timeout con reintento. Formularios conservan datos ante error y enfocan el primer campo inválido.

---

## 5. Arquitectura técnica Next.js 16.2.2

### 5.1 Estructura objetivo + config

```text
src/
├── app/
│   ├── [locale]/{layout,page}.tsx
│   │   ├── academia/page.tsx
│   │   ├── consultoria/page.tsx
│   │   ├── contacto/page.tsx
│   │   └── legal/{privacidad,terminos,cookies}/page.tsx
│   ├── api/{health,leads}/route.ts
│   ├── error.tsx · global-error.tsx · not-found.tsx · robots.ts · sitemap.ts
├── components/{ui,marketing,forms}/
├── content/es/  · dictionaries/  · lib/{academy,analytics,env,i18n,security}/
└── styles/tokens.css
middleware.ts · Dockerfile · railway.json · .env.example
```

`next.config.ts` objetivo (cierra B14):

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // cacheComponents: true  → activar en G2 tras migrar rutas y CI verde
};
export default nextConfig;
```

### 5.2 Render y caché

Server Components por defecto; sin `"use client"` en páginas completas. Client solo para menú, dialog, selector, formulario, analítica consentida. `cacheComponents: true` tras migrar rutas con CI verde. Catálogo público: `use cache` + `cacheLife` + `cacheTag`; nunca `unstable_cache`. Si el catálogo falla, servir último snapshot editorial fechado o ruta degradada. Una réplica → caché local aceptable; antes de multi-réplica, cache handler compartido probado. `next/image` con dimensiones; video `preload="none"`, sin autoplay pesado.

### 5.3 Internacionalización

Arquitectura soporta `es,en,fr,de,ar,zh`; release publica solo `es`. Allowlist de build activa un locale solo con: paridad de claves 100%, revisión humana registrada, metadata/legales/errores traducidos, QA responsive (+RTL para árabe), canonical/hreflang/sitemap. Sin fallback que mezcle idiomas. Locale no habilitado → 404 o una sola redirección por ADR de SEO.

### 5.4 Integración con Academia

```text
{ACADEMIA_PUBLIC_URL}/register
  ?locale=es
  &plan=<allowlist-opcional>
  &source=ailearning-hub
  &campaign=<slug-sin-PII>
  &return_to=<ruta-relativa-allowlist>
```

Reglas: `ACADEMIA_PUBLIC_URL` validada al arrancar, solo HTTPS en prod; nunca email/nombre/token/JWT en query; el hub no lee/escribe sesión de Academia; `plan` se omite sin contrato firmado; `return_to` relativo y de allowlist. Catálogo v1 (si existe): JSON versionado con `id,slug,title,price,currency,interval,checkoutUrl,updatedAt`; schema runtime + contract tests.

### 5.5 Leads y privacidad — `POST /api/leads`

Route Handler server-side:

- Schema estricto (Zod), límite de tamaño, normalización.
- Consentimiento explícito + finalidad + versión de aviso + timestamp + locale.
- Secreto Brevo solo en servidor (`BREVO_API_KEY`, sin `NEXT_PUBLIC_`).
- `timeout` (AbortController), verificación `response.ok`, idempotency key, respuesta genérica.
- Protección Origin/CSRF, honeypot, rate limit.
- Logs sin cuerpo/email/teléfono/token.
- Retención y supresión definidas por Legal; anti-bot extra solo si hay abuso medido.

Contrato de respuesta: `200 {ok:true}` | `400 {error:"validation"}` | `429 {error:"rate_limited"}` | `502 {error:"upstream"}`. El cliente nunca recibe el status del proveedor.

### 5.6 Seguridad mínima

CSP por nonce/hashes, sin `unsafe-eval`; HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. Dependencias y contenedor escaneados; secretos escaneados en repo y bundle. Variables tipadas y validadas al arrancar (`lib/env`); `.env.example` sin valores reales. Endpoints con métodos explícitos, límites y errores que no filtren proveedor/config.

### 5.7 `.env.example` (cierra parte de B14)

```bash
# Servidor (NUNCA NEXT_PUBLIC)
BREVO_API_KEY=
BREVO_LIST_ID=
ACADEMIA_PUBLIC_URL=https://academia.ejemplo.com
# Público (seguro en cliente)
NEXT_PUBLIC_SITE_URL=https://ailearning.ejemplo.com
NEXT_PUBLIC_ANALYTICS_ID=
# Runtime
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

---

## 6. Infraestructura pragmática

### 6.1 Topología inicial

```text
Usuario → Cloudflare (DNS, TLS, WAF, assets) → Railway (hub, Node 22, 1 región, 1 réplica)
                                                  ├── Brevo API (server-side, leads)
                                                  └── Academia pública (deep links / catálogo opcional)
```

Sin Postgres ni Redis para el hub en MVP. Integrar Academia en el mismo proyecto Railway es decisión posterior con acceso a su repo/datos/backups/propietario.

### 6.2 Dockerfile (literal, multi-stage standalone)

```dockerfile
# 1. deps
FROM node:22-slim@sha256:<pin> AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. build
FROM node:22-slim@sha256:<pin> AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. runner
FROM node:22-slim@sha256:<pin> AS runner
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

Requiere `output:"standalone"` (§5.1) y `.dockerignore` (`node_modules`, `.next`, `.git`, `.vercel`).

### 6.3 `railway.json` (literal)

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": { "builder": "DOCKERFILE", "dockerfilePath": "Dockerfile" },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3,
    "numReplicas": 1
  }
}
```

`/api/health` devuelve `{status,version,commit}` sin secretos; no bloquea por Brevo/Academia (degradación controlada con métricas propias).

### 6.4 Cloudflare

Cache permanente para `/_next/static/*` y assets versionados. Nunca “cache everything” para HTML, `/api/*`, `Set-Cookie` o privado. Respetar `Cache-Control`; probar `HIT/MISS/BYPASS` y purga antes de prod. WAF/rate limit para `/api/leads`; TLS estricto hacia Railway.

### 6.5 Escalado y costo

Baseline una región/una réplica. Escalar horizontal solo con prueba de carga/telemetría que muestre saturación sostenida, incumplimiento de SLO o requisito de disponibilidad; antes resolver coherencia de caché y rate limit. Alerta presupuestaria + revisión semanal de CPU/RAM/egress/builds. No se afirma ahorro vs Vercel sin medición comparable.

---

## 7. Rendimiento, accesibilidad y calidad

### 7.1 Presupuestos de release

| Métrica | Gate preprod móvil |
|---|---:|
| Lighthouse Performance | ≥90 (mediana de 3) |
| LH A11y / SEO / Best Practices | ≥95 / ≥95 / ≥95 |
| LCP lab | ≤2.5 s |
| TBT lab (proxy INP) | ≤200 ms |
| CLS | ≤0.10 |
| JS inicial por ruta marketing | ≤150 KB gzip (excepción documentada) |
| Imagen hero | ≤200 KB por variante móvil |
| Video (`Bienvenida_Home_720p.mp4`) | poster + `preload="none"`; presupuesto definido |
| Errores de consola | 0 |
| Enlaces internos rotos | 0 |

Tras 28 días con volumen, SLO de campo p75 “bueno” en LCP/INP/CLS, segmentado por dispositivo y plantilla.

### 7.2 Accesibilidad

WCAG 2.2 AA: skip link, landmarks, headings secuenciales, foco visible, teclado completo, zoom 200/400%, target 44×44, contraste, mensajes no solo por color, `aria-live`, alt correcto, reduced motion. Dialogs restauran foco; menú móvil no atrapa scroll/foco indebido.

### 7.3 Matriz mínima de prueba

Viewports 360/390/768/1024/1440 + landscape móvil. Navegadores: últimas dos de Chrome/Edge/Firefox y Safari 16.4+. Teclado, VoiceOver/Safari, NVDA/Firefox. Red Fast 3G/offline/timeout/API 429-500. Contenido: texto largo, sin imagen, sin catálogo, consentimiento rechazado. E2E: navegación, CTA Academia, lead, legales, 404, error boundary, locale.

---

## 8. Analítica y observabilidad

Eventos sin PII: `academy_cta_clicked` (route,placement,locale,campaign); `consulting_lead_started`/`consulting_lead_completed` (sin campos); `locale_changed`; `navigation_error`; `web_vital` (plantilla,dispositivo,métrica,valor). No cargar analítica de marketing antes del consentimiento. Documentar taxonomía, owner, retención.

Observabilidad: monitor externo de `/api/health` cada minuto; alerta por 5xx, latencia p95, fallo de leads, catálogo degradado y presupuesto; release/commit en logs; dashboards de disponibilidad/conversión/CWV; runbook con contacto, diagnóstico, mitigación, rollback.

---

## 9. WBS — Desglose ejecutable de tareas

Convención: `T-NN` · **Dep** = depende de · **AC** = criterio de aceptación · **B** = bloqueante que cierra.

### G0 — Contención (1–2 días) · cierra B01–B05 parcial

| ID | Tarea | Dep | AC | B |
|---|---|---|---|---|
| T-01 | Revocar/rotar clave Brevo en panel Brevo | — | Clave vieja inválida (401 al probarla) | B01 |
| T-02 | Eliminar `NEXT_PUBLIC_BREVO_*` de `RegisterModal.tsx` y `activar/page.tsx` | T-01 | `grep -r NEXT_PUBLIC_BREVO src/` vacío | B01 |
| T-03 | Quitar lectura de `nombre`/`email` de query y `autoActivate()` en `activar`/`jornadas2026` | — | E2E: URL con `?email=` no precarga ni envía | B02 |
| T-04 | Stub temporal: formularios apuntan a `/api/leads` (placeholder 200) | T-02 | Sin fetch directo a `api.brevo.com` en `src/` | B01,B03 |
| T-05 | Inventario editorial: claims/precios/logos/CTAs/legales → fuente+fecha+aprobador | — | Matriz CSV/MD; ítems no aprobados marcados “ocultar” | B04,B05 |
| T-06 | Registrar baseline lint/build/bundle/Lighthouse | — | Archivo `baseline.md` con números actuales | B08 |

**Salida G0:** B01–B03 cerrados, build verde, sin exposición activa conocida.

### G1 — Fundaciones desplegables (3 días) · cierra B14,B16,B09 parcial

| ID | Tarea | Dep | AC | B |
|---|---|---|---|---|
| T-10 | `next.config.ts` con `output:"standalone"` + flags base | — | `npm run build` genera `.next/standalone/server.js` | B14 |
| T-11 | Crear `Dockerfile` (§6.2) + `.dockerignore` | T-10 | `docker build` ok; imagen < límite | B14 |
| T-12 | Crear `railway.json` (§6.3) + validar contra schema | T-11 | `docker run` responde `/api/health` 200 | B14 |
| T-13 | Configurar Vitest (unit/component) | — | `npm test` ejecuta y pasa ≥1 test | B13 |
| T-14 | Configurar Playwright (E2E) | — | `npx playwright test` corre en preview | B13 |
| T-15 | Añadir axe-core a E2E | T-14 | Test axe falla ante violación inyectada | B11 |
| T-16 | GitHub Actions: ci.yml (lint→types→test→build→docker→secret scan→schema→lighthouse) | T-13,T-14 | PR muestra checks; merge bloqueado si rojo | B13 |
| T-17 | Migrar root a `app/[locale]/` y publicar solo `es`; `middleware.ts` 308 `/`→`/es` | — | `/` redirige 308; `/es` renderiza SSR | B09 |
| T-18 | `layout.tsx` por locale: metadata real, `lang="es"`, canonical | T-17 | `<title>` ≠ “Create Next App”; `lang="es"` | B09 |
| T-19 | `lib/env`: validación tipada de variables al arrancar | — | Arranque falla si falta `BREVO_API_KEY` | B14 |
| T-20 | Eliminar acople Vercel: `.vercel/`, `vercel.svg`; `.gitignore` `.next/` | — | `grep -ri vercel` sin rastros funcionales | B16 |
| T-21 | `error.tsx`, `global-error.tsx`, `not-found.tsx`, primitives accesibles | T-17 | 404/500 renderizan; axe limpio | B11 |

**Salida G1:** shell español navegable en preview; deploy y rollback probados en Railway.

### G2 — Producto MVP (4–5 días) · cierra B01–B07,B10,B11

| ID | Tarea | Dep | AC | B |
|---|---|---|---|---|
| T-30 | `POST /api/leads` (Zod, timeout, `response.ok`, idempotencia, honeypot, rate limit) | T-19 | Tests 2xx/400/429/502/timeout verdes | B01,B03 |
| T-31 | Reconectar formularios a `/api/leads`; estados loading/error/success/timeout | T-30 | E2E lead: éxito, rechazo, timeout, reintento | B02,B03 |
| T-32 | Migrar `page.tsx` (1065 líneas) a Server Components + islas cliente mínimas | T-17 | `"use client"` solo en menú/dialog/form/selector | B07 |
| T-33 | Corregir 10 errores + 11 warnings de lint (incl. `set-state-in-effect`, `any`, `<img>`) | T-32 | `npx eslint .` → 0/0 | B08 |
| T-34 | `Dialog` accesible (focus trap/restore, Escape, labels, `aria-live`) | T-32 | axe + teclado + lector ok | B11 |
| T-35 | Reemplazar `next/font/google` por fuente local/sistema | — | Build sin red ok; sin request a fonts.googleapis | B10 |
| T-36 | `<img>`→`next/image`; comprimir PNG/MP4; poster + `preload="none"` | T-32 | Activos ≤ presupuesto §7.1 | B10,B18 |
| T-37 | Rutas `academia`, `consultoria`, `contacto`, `legal/*` con contenido aprobado | T-05,T-18 | Crawler interno sin 404 ni placeholder | B04,B05 |
| T-38 | Deep link Academia con allowlists + feature flag catálogo/precios | — | Contract test o ruta degradada activa | B06 |
| T-39 | Retirar placeholders y corregir campañas prioritarias | T-05 | Sin claims no aprobados; teléfonos reales | B04,B05 |

**Salida G2:** journey principal completo sin 404, sin PII en URL, sin claims no aprobados.

### G3 — Hardening (3 días) · cierra B12 y gates de calidad

| ID | Tarea | Dep | AC | B |
|---|---|---|---|---|
| T-50 | Performance: bundle ≤150 KB, motion reducible, video por intención | T-36 | Lighthouse ≥90; budget verde | B07,B10 |
| T-51 | A11y full: axe, teclado, lectores, zoom 200/400%, responsive matriz §7.3 | T-34 | LH A11y ≥95; 0 violaciones axe | B11 |
| T-52 | SEO: `sitemap.ts`, `robots.ts`, canonical, hreflang (solo `es`) | T-18 | Test SEO por ruta verde | B09 |
| T-53 | Analítica con consentimiento + eventos §8 | T-31 | Sin analítica pre-consentimiento (verificado) | — |
| T-54 | CSP nonce + HSTS + headers seguridad; scan secretos/deps/imagen | T-11 | Headers presentes; scan limpio | B17 |
| T-55 | Prueba de carga + WAF/rate limit Cloudflare + alertas + runbook | T-12 | Runbook publicado; alertas disparan en test | B12 |
| T-56 | ADR infra (1 réplica, sin Redis) + presupuesto mensual | — | ADR aprobado; alerta presupuesto activa | B12 |

**Salida G3:** todos los gates automáticos y manuales verdes.

### G4 — Lanzamiento (1 día + observación)

| ID | Tarea | Dep | AC |
|---|---|---|---|
| T-60 | Aprobación Producto/Legal/Marca/Tech/QA sobre el mismo commit | G3 | Acta de GO firmada |
| T-61 | Deploy a producción Railway con healthcheck (§10) | T-60 | `/api/health` 200; smoke verde |
| T-62 | Smoke test prod + observación intensiva 2 h + seguimiento 24/48 h | T-61 | Sin 5xx sostenido; leads OK |
| T-63 | Ensayo de rollback en preprod antes del GO | G3 | Rollback < 5 min verificado |

**Salida G4:** MVP estable; revisión a 7 y 30 días.

### G5 — Expansión posterior

Orden: `en`→`fr/de`→`ar`→`zh`, cada uno con gate editorial+QA. Catálogo dinámico, casos, SSO, Redis, multi-región y perfil solo por ADR + owner + métrica objetivo + aceptación.

---

## 10. Runbook de deploy Railway

```bash
# 0. Pre-requisitos: G0–G3 verdes sobre el mismo commit; secretos en Railway, no en repo
# 1. Variables en Railway (Settings → Variables):
#    BREVO_API_KEY, BREVO_LIST_ID, ACADEMIA_PUBLIC_URL,
#    NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_ANALYTICS_ID
# 2. Conectar repo o railway up; builder = DOCKERFILE (railway.json)
# 3. Verificar build standalone:
npm run build && test -f .next/standalone/server.js
# 4. Smoke local del contenedor:
docker build -t ailearning . && docker run -p 3000:3000 --env-file .env ailearning
curl -fsS localhost:3000/api/health   # espera {status:"ok",...}
# 5. Deploy a entorno preview → smoke → promover el MISMO artefacto a producción
# 6. Cloudflare: DNS proxied, TLS strict, cache solo /_next/static/*, WAF en /api/leads
# 7. Post-deploy: monitor externo de /api/health cada minuto; alertas 5xx/p95/leads/presupuesto
```

Rollback: Railway → Deployments → seleccionar deployment previo sano → **Redeploy**. Disparadores: 5xx sostenido, pérdida de leads, regresión de seguridad, error crítico. Objetivo: < 5 min, ensayado en T-63.

---

## 11. RACI operativo (modelo operador único + IA)

> v3 asignaba “equipos” inexistentes y bloqueaba el arranque (B15). v4 colapsa a un operador principal (**Sus**, dueño del repo) asistido por IA, con aprobadores nominales externos donde Legal/Marca lo exijan. Si el equipo crece, reasignar R/A por nombre antes de delegar.

| Entregable | R (ejecuta) | A (aprueba) | C (consulta) |
|---|---|---|---|
| UX/UI/sistema visual | Sus + IA | Sus | Brand Manual, A11y checklist |
| Contenido/precios/claims | Sus | Sus (rol Producto) | **Legal externo**, Academia |
| Next.js/rendimiento/SEO | Sus + IA | Sus (rol Tech) | CI gates |
| Leads y seguridad | Sus + IA | Sus (rol Tech) | **Legal**, secret scan |
| Contrato Academia | Owner Academia | Sus | QA contract test |
| Railway/Cloudflare/CI | Sus + IA | Sus | Alerta presupuesto |
| Release (GO) | Sus (rol QA) | Sus (rol Producto) | Legal + checklist DoD |

Regla: ninguna tarea con “equipo” como único responsable. Items que requieren juicio legal real (privacidad, retención, claims) **no** se autoaprueban: requieren validación legal humana antes de G4.

---

## 12. CI/CD y aceptación

Pipeline de PR (T-16): `npm ci` → lint 0/0 → `tsc --noEmit` → unit/component/contract → build Next + build Docker → scan secretos/deps/imagen → arranque con `PORT` + healthcheck → E2E + axe en preview → Lighthouse + bundle budget → aprobación CODEOWNERS. `main` sin push directo; mismo artefacto aprobado se promueve a prod.

### Definition of Done del release

- [ ] B01–B18 cerrados o con ruta degradada aceptada (B04–B06)
- [ ] build, lint, types, tests, escaneos y E2E verdes
- [ ] cero secretos/PII en bundle, URL y logs
- [ ] cero enlaces internos rotos y cero placeholders
- [ ] precios/claims/testimonios con evidencia o ausentes
- [ ] journey Academia y lead probado: éxito, rechazo, timeout, reintento
- [ ] WCAG 2.2 AA y presupuestos de rendimiento cumplidos
- [ ] SEO y legales aprobados para cada locale publicado
- [ ] healthcheck, monitor, alertas, dashboard y guardia activos
- [ ] rollback ejecutado con éxito en preprod
- [ ] commit, aprobadores y acta de GO registrados

---

## 13. Riesgos, disparadores y respuesta

| Riesgo | Disparador | Respuesta |
|---|---|---|
| Academia no entrega contrato | Sin staging/schema al cierre de G1 | Ruta degradada; ocultar planes/precios |
| Contenido legal/comercial no aprobado | Sin evidencia al cierre de G2 | Retirar bloque/claim; no frena el shell |
| Leads fallan | Error >2% o proveedor degradado | Reintento seguro, alerta, canal alterno aprobado |
| JS/LCP excede presupuesto | Gate G3 rojo | Eliminar motion/video/islas; aplazar no crítico |
| Caché sirve contenido incorrecto | Precio/locale inconsistente | Desactivar catálogo dinámico y purgar caché |
| Costo Railway crece | >80% del presupuesto mensual | Analizar builds/egress/compute; no escalar por intuición |
| Segunda réplica inconsistente | Sesión/rate-limit/cache divergen | No escalar hasta cache/rate limit compartidos |
| Traducción degrada confianza | QA o revisor rechaza locale | Locale fuera de allowlist e índice |
| CI inexistente bloquea gates | G2 sin pipeline | Priorizar T-13…T-16 antes de cualquier feature |

---

## 14. Registro de decisiones cerrado

| Decisión | v4 |
|---|---|
| Rol del hub | Marketing y captación; sin auth/checkout |
| Locale primer release | Español |
| Fuente comercial | Academia/Producto con evidencia; si falta, se oculta |
| Registro | Siempre en Academia vía deep link validado |
| Leads | Route Handler server-side; nunca Brevo desde navegador |
| Next.js | Server-first + Cache Components solo con uso explícito |
| Runtime | Node 22 LTS, imagen `node:22-slim` a digest |
| Deploy | Railway standalone, una región/una réplica |
| CDN/WAF | Cloudflare con caché selectiva |
| Redis/Postgres del hub | No en MVP |
| Test/CI | Vitest + Playwright + GitHub Actions, creados en G1 |
| Modelo de equipo | Operador único + IA; aprobación legal humana donde aplique |
| Dark mode | Fuera del MVP; light-first accesible |
| Motion | Mínimo, semántico, reducible |
| Escalado | Por telemetría y prueba de carga |

---

## 15. Fuentes normativas y técnicas

- Next.js 16.2.2 local: `node_modules/next/dist/docs/` — prevalece.
- Cache Components / reemplazo `unstable_cache`: <https://nextjs.org/docs/app/getting-started/cache-components>
- Self-hosting Next.js: <https://nextjs.org/docs/app/guides/self-hosting>
- Node.js EOL: <https://nodejs.org/about/eol>
- Railway config as code: <https://docs.railway.com/config-as-code/reference>
- Railway healthchecks: <https://docs.railway.com/guides/healthchecks-and-restarts>
- Railway scaling: <https://docs.railway.com/reference/scaling>
- Cloudflare cache: <https://developers.cloudflare.com/cache/concepts/default-cache-behavior/>
- Brand Manual local: `Brand Manual aiLearning.html`.

---

## 16. Declaración final

**GO CONTUNDENTE para iniciar G0 inmediatamente.** v4 elimina toda decisión pendiente: entrega artefactos de deploy (Dockerfile, `railway.json`, `.env.example`, `next.config`), crea la infraestructura de CI/test que v3 daba por hecha, asigna responsables nominales y convierte cada gate en tareas atómicas con criterio de aceptación. El lanzamiento será GO solo cuando G0–G4 y la Definition of Done estén verdes sobre el mismo commit. Hasta entonces, cualquier deploy público es **NO-GO**.
