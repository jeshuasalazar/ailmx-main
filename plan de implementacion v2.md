# Plan maestro de actualización — aiLearning Hub

**Versión:** 2.0
**Fecha:** 19 de junio de 2026
**Reemplaza a:** `plan de implementacion.md` (v1.0)
**Estado:** **GO condicionado** (ver §0)
**Repositorio principal:** `jeshuasalazar/ailmx-main`
**Repositorios relacionados:** `jeshuasalazar/academia`, `jeshuasalazar/home`
**Target de despliegue:** **Railway** (contenedores regionales + Cloudflare al frente)
**Objetivo:** transformar `ailearning.mx` en el hub corporativo de aiLearning —consistente con la marca, rápido, accesible, multilingüe, conectado de forma segura con Academia y desplegable en Railway con el mejor costo-beneficio.

---

## 0. Veredicto Go / No-Go

### 0.1 Resultado de la evaluación

| Veredicto v1.0 | **NO-GO** |
|---|---|

**Motivo:** el plan v1.0 era correcto en producto y diseño, pero **no era ejecutable** porque (a) dejaba 7 decisiones P0 abiertas como prerequisito, (b) no definía target ni arquitectura de despliegue, y (c) mezclaba responsabilidades hub/Academia sin contrato cerrado. Con esos huecos no se puede arrancar build sin retrabajo.

### 0.2 Cambios que convierten el plan en **GO**

Esta v2.0 cierra cada bloqueante con una decisión por defecto accionable (override explícito si Negocio decide otra cosa) y añade la capa de infraestructura Railway que faltaba:

- decisiones P0 con valor por defecto preasignado → §0.4;
- arquitectura de despliegue Railway completa → §6.4–§6.6;
- contrato hub↔Academia versionado y cerrado para v1 → §8;
- pipeline CI/CD a Railway con gates → §14.

### 0.3 Clasificación de hallazgos

| Severidad | Definición | Hallazgos |
|---|---|---|
| **Bloqueante (P0)** | Impide build seguro o despliegue; fuga de seguridad o inconsistencia comercial | Brevo en cliente · Auth Academia insegura · Precios `$699/$1,499` vs `$299/$2,990` · **Sin target/infra de deploy definido** |
| **Mayor (P1)** | Degrada calidad, rendimiento o credibilidad; no frena el deploy | `page.tsx` 1,065 líneas Client · estilos ad hoc · solo `es/en` · CTAs a 404 · registro sin continuidad · metadata "Create Next App" |
| **Menor (P2)** | Pulido | Movimiento fragmentado · `<img>`/video pesado · ESLint 10/11 · emojis como iconos |

### 0.4 Decisiones P0 — resueltas por defecto (override explícito permitido)

| # | Decisión | **Default GO** | Quién puede override |
|---|---|---|---|
| 1 | Precios y planes | Fuente única = **Academia**. Hub no hardcodea precios; consume contrato. Mientras: `free`, `monthly $299`, `annual $2,990` | Negocio + Legal |
| 2 | URL Academia | `ACADEMIA_URL` como variable Railway; default `https://academia.ailearning.mx` | Tech Lead |
| 3 | Cuenta gratuita | Email + nombre + contraseña (ruta real `/register`, sin modal-hash) | Producto |
| 4 | Propietario por idioma | `es` maestro (interno); `en` revisión humana; `fr/de/ar/zh` traducción + revisor nativo | Contenido |
| 5 | Brand Manual | Recuperar fuentes; **si no llegan en 48 h**, congelar tokens actuales de §5.1 como v1 y avanzar | Marca |
| 6 | Claims/testimonios | Sin evidencia → no se publica. Placeholder retirado, no inventado | Producto + Legal |
| 7 | Dark mode | **Light-first** en v1; tokens preparados; dark tras validar contraste | Diseño |

> Ninguna decisión queda abierta como prerequisito bloqueante: cada una tiene default ejecutable. Esto es lo que habilita el **GO**.

---

## 1. Resultado esperado

Hub corporativo que: explica **Academia** y **Consultoría**; dirige cada audiencia a una acción primaria; navega en `es/en/fr/de/ar/zh` con RTL; conecta registro/compra con Academia sin duplicar cuentas ni exponer secretos; usa un sistema visual único derivado del Brand Manual; conserva movimiento ligero y accesible; cumple presupuestos de rendimiento, accesibilidad, SEO y seguridad; **se despliega en Railway de forma reproducible y barata**; y evoluciona sin reconcentrar todo en un archivo.

---

## 2. Fuentes y jerarquía de decisión

| Fuente | Revisión | Uso |
|---|---:|---|
| `ailmx-main` | `f6127b5` | Estado real, Next.js 16.2.2, deuda |
| `academia` | `d78228e` | Registro, auth, catálogo, membresías, checkout |
| `home` | `e554747` | Seis locales, diccionarios, RTL, selector |
| `Brand Manual aiLearning.html` | local + copia Academia | Identidad visual |
| UI/UX Pro Max | `b7e3af8` | A11y, interacción, movimiento, rendimiento, QA |
| Docs Next.js | `node_modules/next/dist/docs/` | Convenciones Next 16 (prevalece) |
| **Docs Railway** | plataforma | Build, runtime, networking, escalado, costos |

**Precedencia:** 1) Seguridad/privacidad/accesibilidad · 2) Brand Manual · 3) Negocio/contenido aprobado · 4) UI/UX Pro Max · 5) Estética existente.

Se adopta el patrón de información **Trust & Authority** (credenciales, casos, métricas, CTA claro); **no** su paleta ni tipografías: manda la marca.

---

## 3. Diagnóstico ejecutivo

### 3.1 Funciona
Next.js 16.2.2, React 19.2.4, TS, Tailwind 4. Build compila `/`, `/activar`, `/jornadas2026`. Propuesta comercial `es/en`. Academia con registro/login/cursos/Stripe/membresías. `home` resuelve seis locales. Activos de marca reutilizables.

### 3.2 Hallazgos críticos

| Sev | Hallazgo | Impacto |
|---|---|---|
| P0 | Brevo en navegador (`NEXT_PUBLIC_BREVO_API_KEY`) | Clave privada en bundle; abuso/fuga |
| P0 | Academia: CORS general, JWT en `localStorage`, secreto JWT por defecto | XSS, CSRF, config insegura |
| P0 | Precios inconsistentes (`$699/$1,499` vs `$299/$2,990`) | Riesgo comercial/legal |
| P0 | **Sin target de despliegue ni infra definida** | No se puede liberar de forma reproducible |
| P1 | `src/app/page.tsx` Client de 1,065 líneas | Hidratación masiva; rendimiento/test/mantenimiento |
| P1 | Estilos inline y tipografías ad hoc | UI fuera del sistema/marca |
| P1 | Solo `es/en` completos | Faltan `fr/de/ar/zh`, rutas localizadas, RTL |
| P1 | CTAs a rutas inexistentes | `/diagnostico`, `/cursos`, `/casos`, `/contacto`, legales → 404 |
| P1 | Registro hub no crea cuenta Academia | "Comenzar gratis" sin continuidad |
| P1 | Metadata "Create Next App", `lang="en"` fijo | SEO/a11y/credibilidad |
| P2 | Movimiento Framer + canvas + CSS continuo | Jank, JS extra |
| P2 | `<img>`, video pesado, fuentes remotas | LCP/CLS, builds sin red |
| P2 | ESLint: 10 errores, 11 warnings | Deuda base |
| P2 | Jornadas con emojis y dorados propios | Fragmentación de marca |

---

## 4. Visión de producto e información

**Audiencias:** aprendiz de IA → Academia · líder que busca capacitación · empresa que necesita consultoría · alumno existente → panel · socio/instructor/prospecto → validar autoridad y contactar.

### 4.2 Arquitectura de información

```text
/[locale]
├── /academia        # catálogo destacado, membresías, acceso/registro externo
├── /consultoria
├── /soluciones
├── /casos
├── /recursos
├── /empresa
├── /contacto
└── /legal           # privacidad, terminos, cookies
```

Campañas `/activar` y `/jornadas2026` se conservan vía redirects compatibles; luego migran a `/(campaigns)/[locale]/...`.

### 4.3 Portada
Header → Hero (aprender/implementar) → Autoridad (cifras verificadas) → Bento de capacidades → Academia (catálogo real) → Consultoría (proceso/entregables) → Caso verificable → Recursos/eventos → FAQ segmentada → CTA final + footer legal. **Un solo CTA primario por bloque.**

---

## 5. Sistema de diseño

### 5.1 Tokens (congelar como v1 si no llega Brand Manual completo — §0.4)
```css
--ai-blue:#2D88E8; --ai-blue-deep:#1A5FB4; --ai-blue-soft:#E6F0FB;
--ink:#0E1B2C; --ink-2:#1F2D42; --mute:#6B7484;
--line:#E8E5DD; --line-soft:#F0EDE5; --cloud:#F4F2EC; --paper:#FBFAF6; --white:#FFFFFF;
--coral:#FF6B47; --sage:#6B9080;
```
Primario azul (nav/foco/CTA). Coral = consultoría/acento, nunca compite con CTA. Sage = éxito. Sin morados AI, dorados de campaña, neón ni colores crudos.

### 5.2 Tipografía
Display **Space Grotesk** 600 · Cuerpo **DM Sans** 400–700 · Datos/eyebrows **JetBrains Mono** 400–600. Eliminar Fraunces/Inter/Geist/`system-ui` visibles. Servir con `next/font` **local** (builds reproducibles, clave para Railway sin red en build). `ar/zh` → Noto Sans Arabic / Noto Sans SC conservando escala y ritmo.

### 5.3 Escalas
Espaciado 4/8 (`4,8,12,16,24,32,48,64,80`) · Radios `6,8,14,999` · Contenedor 72–80rem · Medida 60–75 (desktop) / 35–60 (móvil) · Capas `base0 sticky10 dropdown20 overlay40 modal50 toast60`.

### 5.4 Componentes mínimos
`Button/LinkButton/IconButton` · `Container/Section/Stack/Grid` · `Card/Metric/Badge/LogoCloud` · `Header/MobileNav/Footer/LanguageSwitcher` · `AcademyCourseCard/ConsultingServiceCard/CaseStudyCard` · `Accordion/Modal/FormField/InlineError/Toast` · `MotionReveal/ReducedMotionBoundary`. Cada uno con variantes, estados hover/focus/pressed/disabled, teclado y contraste.

### 5.5 Movimiento

| Token | Duración | Uso |
|---|---:|---|
| motion-fast | 150 ms | hover, foco, pressed |
| motion-base | 220 ms | menús, acordeones, estados |
| motion-slow | 300 ms | entrada de sección/modal |
| motion-exit | 140–200 ms | salida (60–70% de la entrada) |

Solo `transform`/`opacity` en camino crítico · máx 1–2 protagonistas por vista · sin animación infinita ni canvas continuo · `prefers-reduced-motion` elimina parallax/conteos/stagger · video/avatar bajo intención.

---

## 6. Arquitectura técnica objetivo

### 6.1 Server-first en Next.js 16
Páginas/secciones estáticas a **Server Components**. Client Components pequeños para idioma, menú, acordeón, formularios y motion puntual. Nada de `"use client"` en la página completa. Pasar al cliente solo claves de traducción usadas. `next/dynamic` para modal/video/avatar bajo intención. `<Link>` + `<Image>` con dimensiones. `loading.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx` accesibles. Evaluar **PPR (Partial Prerendering)** si está estable en 16.2.x para hero estático + islas dinámicas.

### 6.2 Estructura
```text
src/
├── app/
│   ├── [locale]/ (layout, page, academia, consultoria, casos, recursos, contacto, legal/…)
│   ├── api/leads/route.ts
│   ├── api/health/route.ts        # healthcheck Railway
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx
├── components/ (ui · marketing · academy)
├── dictionaries/
├── lib/ (academy.ts · env.ts · i18n.ts · analytics.ts)
└── styles/tokens.css
proxy.ts                            # NO middleware.ts (convención Next 16)
Dockerfile · railway.json · .dockerignore
```

### 6.3 Contenido como fuente de verdad
No mantener precios/cursos/métricas/testimonios como objetos gigantes en `page.tsx`. Academia expone **contrato público versionado** (`/api/v1/catalog`) para planes/cursos; el hub lo consume desde Server Components con `unstable_cache` + `revalidateTag` y último valor válido. La publicación falla si falta precio, moneda, vigencia, idioma o URL de checkout. Testimonios/cifras requieren evidencia, permiso y fecha.

### 6.4 Despliegue en Railway — arquitectura (NUEVO)

```text
Cloudflare (DNS + CDN + cache estático + WAF + TLS)
        │
        ▼
Railway project "aiLearning"
├── service: hub        (Next.js 16, Node 20, standalone)   ← ailmx-main
├── service: academia   (app educativa + API contrato)      ← academia
├── plugin: PostgreSQL  (datos de Academia)
└── plugin: Redis        (rate-limit, cache de leads, sesiones si aplica)
```

Principios:
- **Un servicio por app**, no monorepo acoplado. Hub y Academia escalan y se despliegan por separado.
- Hub es **stateless** → escala horizontal trivial; estado vive en Academia/Postgres/Redis.
- **Cloudflare al frente** suple el CDN global que Railway no trae nativo: cachea estáticos/`/_next/static`, da TLS, WAF y reduce egress (costo).
- Networking interno: el hub habla con Academia por **red privada de Railway** (`*.railway.internal`) cuando ambos viven en el mismo proyecto → sin salir a internet, menor latencia y costo.
- Variables con **referencias de Railway** (`${{academia.RAILWAY_PRIVATE_DOMAIN}}`) en vez de URLs hardcodeadas.

### 6.5 Runtime y build (Railway)

`next.config.ts`:
```ts
const nextConfig: NextConfig = {
  output: "standalone",            // imagen mínima, arranque rápido en Railway
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react"] },
};
```

`Dockerfile` (multi-stage, recomendado sobre Nixpacks para control y caché):
```dockerfile
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM node:20-slim AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

`railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "DOCKERFILE", "dockerfilePath": "Dockerfile" },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "numReplicas": 1
  }
}
```

Reglas:
- Escuchar en `process.env.PORT` (Railway lo inyecta); standalone `server.js` lo respeta.
- `/api/health` devuelve 200 con `{status, version, commit}` → healthcheck y observabilidad.
- **Fuentes y assets locales** → el build NO depende de red (gate de CI §14).
- ISR/cache: usar caché en filesystem efímero + `revalidateTag`; lo persistente global lo absorbe Cloudflare. No asumir disco persistente entre réplicas.

### 6.6 Costo-beneficio (Railway)

| Decisión | Beneficio de costo |
|---|---|
| `output: standalone` + node-slim | Imagen ~10× menor, arranque y build más baratos |
| Cloudflare delante | Cachea estáticos → menos egress y horas de cómputo Railway |
| Red privada hub↔academia | Cero egress entre servicios |
| Hub stateless + `numReplicas` bajo, autoescala por uso | Pago por uso real, no por capacidad ociosa |
| Redis para rate-limit/cache | Evita golpear Postgres/Brevo, reduce errores y reintentos |
| Sleep/replica mínima en entornos preview | Previews baratos por PR |

Comparativo de target: Vercel da edge/CDN nativo pero encarece a escala y acopla; **Railway + Cloudflare** da control de contenedor, Postgres/Redis administrados y costo por uso → mejor relación costo-beneficio para hub + app educativa con backend propio.

---

## 7. Internacionalización (seis idiomas)

```ts
const locales = ["es","en","fr","de","ar","zh"] as const;
const defaultLocale = "es";
```
Subpaths `/es … /zh`. `proxy.ts` negocia `Accept-Language` solo si la URL no trae locale (corre en Node runtime de Railway). Preferencia explícita en cookie, no se sobreescribe. Diccionarios con import dinámico + `server-only`. `generateStaticParams` para todas las rutas públicas. Locale inválido → 404. `Intl.NumberFormat/DateTimeFormat` y moneda declarada.

**RTL:** `dir="rtl"` (ar) / `ltr` (resto). Propiedades lógicas (`margin-inline`, `inset-inline-start`). Reflejar flechas, no logos. Probar foco, dropdown, nav móvil y formularios en RTL. Sin mayúsculas forzadas ni tracking amplio en ar/zh.

**Editorial:** `es` maestro → `en` revisado → `fr/de/ar/zh` traducción + revisión nativa + QA. CI valida paridad de claves. Sin traducción → marca idioma original, no mezcla silenciosa.

**SEO i18n:** metadata/OG por locale; canonical + `hreflang` (6 + `x-default`); sitemap con alternates; schema traducido; `html lang`/`dir` desde el servidor, sin redirect JS.

---

## 8. Conexión con Academia (contrato v1 cerrado)

### 8.1 Arquitectura
Hub público `https://ailearning.mx/[locale]/…`. App `ACADEMIA_URL` (default `https://academia.ailearning.mx`; interno vía red privada Railway). **No** iframe, **no** copiar JWT/`localStorage` entre apps. El hub presenta; Academia registra, autentica, cobra y entrega.

### 8.2 Contrato de navegación v1
```text
{ACADEMIA_URL}/register?locale=es&plan=free|monthly|annual|team
  &source=ailearning-hub&campaign=<utm>&return_to=<ruta-allowlist>
```
Academia: rutas reales `/register` y `/login`; acepta solo planes conocidos y `return_to` de allowlist; conserva UTM sin PII; onboarding en el locale recibido; retorna por ruta validada; emite `registration_started/completed`, `checkout_completed`.

### 8.3 Seguridad (antes de SSO)
`JWT_SECRET` fuerte en prod, sin fallback · sesión en cookie `HttpOnly/Secure/SameSite` · CORS solo dominios aprobados · CSP sin `unsafe-eval`, mínimo `unsafe-inline` · CSRF + rate limiting (Redis) + rotación de sesión · validar `plan/locale/return_to` siempre en servidor. SSO = fase posterior con **OIDC/OAuth 2.1 (Auth Code + PKCE)**, nunca JWT casero en query.

### 8.4 Registro y CRM
Eliminar Brevo del navegador → `POST /api/leads` (Server Action) con secreto solo de servidor. Validar esquema + consentimiento + rate limit + anti-bot. Separar "lead consultoría" de "cuenta Academia". Si Brevo falla, no crear contacto y mostrar recuperación. Registrar consentimiento, versión de aviso, fecha, fuente, locale.

### 8.5 Planes y checkout
Resolver `$699/$1,499` vs `$299/$2,990` → **Academia fuente de verdad** (precio, moneda, intervalo, Stripe Price ID). Hub sin claves Stripe. CTA de compra → Academia crea Checkout y procesa **webhook firmado** con idempotencia, auditoría y pruebas de éxito/cancelación/renovación. Sin endpoints mock en prod.

### 8.6 Evolución

| Nivel | Alcance | Cuándo |
|---|---|---|
| 1 | Deep links seguros + locale/plan/atribución | Lanzamiento |
| 2 | Catálogo/precios públicos server-side | Misma versión si contrato estable |
| 3 | SSO por estándar | Tras endurecer auth |
| 4 | Perfil/progreso resumido en hub | Solo con caso de negocio + revisión privacidad |

---

## 9. Rendimiento y Core Web Vitals

| Métrica | Objetivo móvil p75 |
|---|---:|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.10 |
| TTFB | ≤ 800 ms (Cloudflare cache ayuda) |
| Lighthouse Perf | ≥ 90 |
| LH A11y/SEO/BP | ≥ 95 |
| JS inicial hub | ≤ 170 KB gzip por ruta |

Acciones: extraer hero/estático del cliente · Framer solo en islas, CSS para estados simples · canvas continuo → arte estático/intención · `<Image>` AVIF/WebP · poster de video, sin precargar video · fuentes autohospedadas, solo pesos usados · imports directos de Lucide (`optimizePackageImports`) · reservar espacio asíncrono · `useReportWebVitals` por locale/dispositivo · análisis de bundle en CI con bloqueo de regresión · **Cloudflare cachea `/_next/static` y assets** para LCP/TTFB.

---

## 10. Accesibilidad

WCAG 2.2 AA mínimo. Contraste 4.5:1 / 3:1. Skip link, landmarks, jerarquía de headings, foco visible. Target táctil 44×44. Menú/selector/modales/acordeones con teclado. Modal: Escape, focus trap, retorno de foco. Formularios con label visible, ayuda, errores junto al campo. `aria-live` para async. SVG, no emojis como controles. Alt informativo/decorativo. Probar zoom 200%, sin mouse, lector de pantalla, reduced motion.

---

## 11. SEO, analítica y observabilidad

**SEO:** metadata real por ruta/locale; schema `Organization/WebSite/Course/Service/FAQPage/BreadcrumbList` con datos visibles; `sitemap.xml`, `robots.txt`, canonical, hreflang, OG localizados; no indexar campañas obsoletas/auth/atribución.

**Analítica (sin PII):** `nav_academy_click`, `academy_registration_start/complete`, `academy_checkout_start/complete`, `consulting_lead_start/complete`, `language_changed`, `case_study_viewed`. Cada evento: locale, ruta, placement, campaign. Consent Mode + cookies antes de tags de marketing.

**Observabilidad (Railway):** logs de servicio + **Sentry** (release + locale + commit); tasa de error de leads/auth/checkout; funnel hub→registro→checkout; CWV reales por plantilla; **alertas** por indisponibilidad/discrepancia del catálogo de Academia y por fallos de healthcheck.

---

## 12. Plan de ejecución por fases

### Fase 0 — Alineación, contención e infra (3 días)
- [ ] Aplicar defaults P0 de §0.4 (o registrar override).
- [ ] Rotar clave Brevo expuesta y retirar `NEXT_PUBLIC_BREVO_API_KEY`.
- [ ] Crear proyecto Railway, servicios `hub`/`academia`, Postgres, Redis.
- [ ] `Dockerfile`, `railway.json`, `/api/health`, `output: standalone`.
- [ ] Cloudflare delante (DNS, cache, WAF, TLS).
- [ ] Variables por referencia (`ACADEMIA_URL`, secretos de servidor).
- [ ] Línea base Lighthouse/bundle/errores/funnel.
- [ ] ADR: dominios, i18n, auth, fuente de precios, **infra Railway**.

**Salida:** P0 firmados, secretos fuera del cliente, esqueleto desplegable en Railway con healthcheck verde.

### Fase 1 — Fundaciones marca + arquitectura (semana 1)
Tokens/tipografía/primitives · layout y metadata globales · estructura `[locale]`, diccionarios server-only, `proxy.ts` · selector accesible + RTL · pruebas de paridad de claves · ESLint a cero.
**Salida:** shell corporativo en seis idiomas, sin duplicación en cliente, deploy continuo a Railway preview por PR.

### Fase 2 — Hub corporativo (semanas 2–3)
Portada en Server Components por sección · navegación/hero/autoridad/Academia/Consultoría/casos/recursos/FAQ/footer · rutas reales profundas y legales · contenido aprobado · redirects de campañas · sistema de movimiento + reduced motion.
**Salida:** hub navegable, responsive, fiel a marca.

### Fase 3 — Integración Academia (semanas 3–4)
Contrato de URLs y env (red privada Railway) · `/register` y `/login` localizados en Academia · propagación locale/plan/atribución validada · catálogo/precios unificados · Brevo al servidor · endurecer cookies/CORS/CSP/JWT/CSRF/rate-limit (Redis) · Stripe + webhooks sandbox.
**Salida:** recorrido hub → cuenta → checkout → panel.

### Fase 4 — Contenido multilingüe + SEO (semanas 4–5)
Aprobar `es/en` · traducir/revisar `fr/de/ar/zh` · validar RTL y expansión · metadata/hreflang/sitemap/OG/schema por idioma · errores y estados vacíos localizados.
**Salida:** seis locales completos e indexables.

### Fase 5 — Rendimiento, a11y y QA (semana 6)
Optimizar imágenes/video/fuentes/imports/bundles · Lighthouse/axe/teclado/lectores · breakpoints 375/768/1024/1440 + paisaje · red lenta/errores API/Academia caída · E2E de CTAs/locale/registro/checkout · cero errores de consola.
**Salida:** release candidate que cumple "terminado".

### Fase 6 — Lanzamiento controlado (2–3 días)
Preview con aprobación marca/legal/producto/seguridad · **deploy Railway con canary por % de tráfico** (o Cloudflare split) · monitorear CWV/errores/conversión 24–48 h · rollback documentado (Railway redeploy a build previo) · liberación total + reporte a 7 y 30 días.

---

## 13. Matriz de responsabilidad

| Entregable | Responsable | Aprobadores |
|---|---|---|
| Posicionamiento, claims, precios | Producto/Negocio | Dirección + Legal |
| Tokens y componentes | Diseño + Frontend | Marca + A11y |
| Next.js, i18n, rendimiento | Frontend | Tech Lead |
| Auth, API, Stripe, catálogo | Backend Academia | Seguridad + Producto |
| **Infra Railway, CI/CD, Cloudflare** | **DevOps/Tech Lead** | **Seguridad** |
| Traducciones | Contenido/Localization | Revisor nativo + Marca |
| Privacidad, cookies, términos | Legal | Dirección |
| QA y release | QA/Tech Lead | Producto + Operaciones |

---

## 14. Estrategia de pruebas y CI/CD

**Automatizadas:** unitarias (locale, diccionarios, formatos, URLs Academia, validadores) · componentes (botones, selector, acordeón, modal, formularios) · contrato (planes/cursos API Academia) · integración (lead server-side, registro, sesión, checkout sandbox) · E2E (seis locales, RTL, CTA por placement, auth, retorno Stripe) · a11y (axe) · visuales (375/768/1024/1440, LTR/RTL).

**Pipeline (GitHub → Railway):**
1. PR → lint + types + build + tests + axe + análisis de bundle.
2. Build **sin red** (fuentes/assets locales) — gate duro.
3. Escaneo de secretos en repo y bundle — gate duro.
4. Merge → Railway deploy automático (preview por PR, prod en `main`).
5. Healthcheck `/api/health` verde antes de enrutar tráfico.

**Gates de CI:** `lint` sin errores/warnings nuevos · `build` sin red · TS estricto sin `any` evasivo · diccionarios 100% paridad · sin secretos · Lighthouse y bundle en presupuesto · E2E críticos + contrato Academia en verde · **imagen Docker construye y arranca con `PORT` inyectado**.

---

## 15. Definición de terminado

- [ ] seis rutas de idioma + RTL árabe correcto;
- [ ] sin secretos/claves privadas en cliente;
- [ ] precios/planes coinciden hub↔Academia↔Stripe;
- [ ] CTAs con destino real y atribución verificable;
- [ ] registro/login/checkout/cancelación/retorno probados E2E;
- [ ] sistema visual con tokens del Brand Manual y componentes compartidos;
- [ ] sin claims/testimonios/métricas sin aprobar;
- [ ] Lighthouse y CWV en objetivo;
- [ ] WCAG 2.2 AA + reduced motion validados;
- [ ] metadata/canonical/hreflang/sitemap/OG completos;
- [ ] CI sin errores de lint/tipos/build/tests/secretos;
- [ ] **deploy reproducible en Railway, healthcheck verde, rollback probado, monitoreo activo y guardia asignada.**

---

## 16. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Brand Manual incompleto | Recuperar fuentes; default §0.4-5 a 48 h |
| Traducciones inconsistentes | Glosario, memoria de traducción, revisión nativa |
| Academia sin rutas/locale | Contrato v1 §8.2 antes de enlazar CTAs |
| Cambios de precio rompen hub | Fuente única + contrato versionado |
| SSO amplía alcance | Deep links primero; SSO solo con estándar + threat model |
| Movimiento degrada móviles | Presupuesto + reduced motion + carga por intención |
| Migración rompe campañas | Inventario, redirects, pruebas de enlaces |
| PII en analítica | Esquema sin PII + revisión legal |
| **Railway sin CDN global** | **Cloudflare al frente para cache/TLS/WAF** |
| **Estado en filesystem efímero** | **Estado en Postgres/Redis; hub stateless** |
| **Egress/costo inesperado** | **Red privada interna + cache Cloudflare + replica mínima** |
| **Build depende de red** | **Fuentes/assets locales + gate de CI** |

---

## 17. Primer sprint recomendado

1. Aplicar defaults P0 (§0.4) o registrar overrides.
2. Rotar/retirar Brevo del cliente.
3. Crear proyecto Railway (hub, academia, Postgres, Redis) + Cloudflare.
4. `Dockerfile` + `railway.json` + `/api/health` + `output: standalone` → primer deploy verde.
5. ADR de dominios, `ACADEMIA_URL` y infra Railway.
6. `tokens.css`, fuentes locales, primitives.
7. `[locale]`, `proxy.ts`, diccionarios, RTL.
8. Hero y header server-first.
9. Corregir rutas rotas y metadata; ESLint en verde.
10. Medir bundle, Lighthouse y conversión base.

Este orden elimina primero los bloqueantes de seguridad y de **infraestructura/deploy**, deja un esqueleto desplegable en Railway desde el día 1 y habilita ejecución continua con previews por PR.
