# Plan de implementación v3 — aiLearning Hub

**Versión:** 3.0  
**Fecha:** 19 de junio de 2026  
**Reemplaza a:** `plan de implementacion v2.md`  
**Estado del plan:** **GO**  
**Estado del producto actual:** **NO-GO para producción** hasta completar los gates G0–G4  
**Repositorio evaluado:** `/Users/MAC/ailearning`  
**Objetivo:** publicar un hub corporativo rápido, accesible y creíble que conecte con Academia sin duplicar autenticación, pagos ni datos personales.

---

## 0. Decisión ejecutiva

### 0.1 Veredicto

| Decisión | Resultado |
|---|---|
| ¿El plan v3 es ejecutable sin decisiones P0 pendientes? | **Sí — GO** |
| ¿El código actual puede publicarse hoy? | **No — NO-GO** |
| ¿Se puede iniciar implementación inmediatamente? | **Sí, por G0** |

El plan es **GO contundente** porque fija alcance, arquitectura, responsables, dependencias, ruta degradada, métricas, pruebas y rollback. Ninguna integración externa impide construir o publicar el MVP: si Academia no entrega un contrato verificable, el hub muestra contenido aprobado y enlaza a una URL validada; no inventa precios, cuentas, cursos ni testimonios.

### 0.2 Principios no negociables

1. **El hub informa y convierte; Academia registra, autentica, cobra y entrega.**
2. **No se publica información comercial sin una fuente y un aprobador identificados.**
3. **No se envían secretos ni PII desde el navegador a proveedores externos.**
4. **Server-first:** HTML útil sin hidratación masiva; JavaScript solo para interacciones necesarias.
5. **Una experiencia completa en español antes que seis experiencias incompletas.**
6. **Cada fase termina en software desplegable y reversible.**
7. **La complejidad se incorpora por evidencia de necesidad, no por anticipación.**

### 0.3 Alcance cerrado del MVP

**Incluye:**

- `/es`, `/es/academia`, `/es/consultoria`, `/es/contacto`;
- `/es/legal/privacidad`, `/es/legal/terminos`, `/es/legal/cookies`;
- header, footer, selector de idioma preparado, formularios de lead, estados de error y páginas 404/500;
- CTA seguro a Academia, con atribución no sensible;
- SEO técnico, analítica con consentimiento, accesibilidad y presupuestos de rendimiento;
- Railway + Cloudflare, CI/CD, healthcheck, observabilidad y rollback.

**No incluye en el primer release:**

- auth, sesión, checkout, progreso o perfil dentro del hub;
- SSO, Redis, múltiples réplicas o multi-región sin una métrica que lo justifique;
- precios/catálogo dinámicos si Academia no entrega contrato estable;
- `/casos` o claims cuantitativos sin evidencia y permiso;
- `fr`, `de`, `ar`, `zh` sin traducción y revisión humana completas;
- rediseño funcional de los repositorios Academia/Home, que no están presentes en este workspace.

### 0.4 Ruta degradada que evita bloqueos externos

| Dependencia no disponible | Comportamiento seguro del MVP |
|---|---|
| API de catálogo Academia | Ocultar precio; mostrar propuesta de valor aprobada y CTA genérico a Academia |
| `/register` validado | CTA a home de Academia; nunca simular creación de cuenta |
| Testimonios/casos aprobados | Retirar el bloque, sin placeholders ni logos ficticios |
| Fuentes licenciadas/autohospedadas | Usar stack de sistema aprobado; no depender de Google Fonts en build |
| Traducción revisada | Locale no se publica ni entra en sitemap/hreflang |
| Redis | Rate limit en Cloudflare/origen de una sola instancia; añadir Redis solo al escalar |

---

## 1. Evidencia revisada

### 1.1 Estado reproducible del repositorio

| Verificación | Resultado al 19-jun-2026 |
|---|---|
| `npm run build` | **Pasa**; 4 rutas estáticas (`/`, `/_not-found`, `/activar`, `/jornadas2026`) |
| `npm run lint` | **Falla:** 10 errores y 11 warnings |
| Next.js / React | 16.2.2 / 19.2.4 |
| Página principal | Client Component monolítico de ~1,065 líneas |
| Metadata raíz | Sigue como “Create Next App”; `lang="en"` fijo |
| Integración Brevo | Clave `NEXT_PUBLIC_*` usada desde cliente en dos flujos |
| Rutas legales y CTAs | Varias no existen o usan `#`/teléfono placeholder |
| Build offline | No demostrado; `next/font/google` sigue presente |

Los repositorios `academia`, `home` y `ailmx-main` citados por v2 no existen en este workspace. Por tanto, sus hashes, contratos, seguridad y precios se consideran **no verificados** hasta que CI o el responsable de la integración aporte evidencia.

### 1.2 Correcciones técnicas frente a v2

- `unstable_cache` fue reemplazado por `use cache` en Next.js 16. La implementación usará `cacheComponents: true`, `use cache`, `cacheLife` y `cacheTag` solo donde exista datos externos cacheables.
- PPR no se “evalúa” como flag independiente: queda incluido al habilitar Cache Components.
- Node 20 está EOL desde marzo de 2026. La imagen base será **Node 22 LTS**, fijada a digest y actualizada por automatización.
- Railway escala verticalmente hasta límites configurados; las réplicas horizontales son una decisión manual. No se promete autoescalado horizontal.
- El healthcheck de Railway valida el despliegue, pero no monitoriza el servicio de forma continua. Se requiere monitor externo.
- Cloudflare no debe cachear HTML, API o respuestas con cookies de forma indiscriminada. En el MVP solo se cachean assets inmutables y respuestas públicas explícitamente marcadas.
- `numReplicas` no se fija como supuesto universal en el ejemplo base; se define por entorno/región cuando haya necesidad.
- “Build sin red” significa `npm run build` sin acceso a red **después** de instalar dependencias; `npm ci` sí requiere registro o caché.

---

## 2. Bloqueantes mayores y cierre

| ID | Sev. | Bloqueante comprobado | Cierre obligatorio | Evidencia de cierre |
|---|---:|---|---|---|
| B01 | P0 | Clave Brevo accesible desde el cliente | Revocar/rotar clave; eliminar `NEXT_PUBLIC_BREVO_*`; proxy server-side | Escaneo repo + bundle sin clave; prueba de revocación |
| B02 | P0 | PII en query string y autoenvío en `/activar`/`/jornadas2026` | No aceptar nombre/email por URL; formulario POST con consentimiento explícito | E2E confirma URL sin PII y no hay envío automático |
| B03 | P0 | Éxito falso: llamadas a Brevo no comprueban `response.ok` | Validar timeout/status/body; estado recuperable y sin doble envío | Tests 2xx/4xx/429/5xx/timeout |
| B04 | P0 | Precios, garantías, logos, casos y métricas contradictorios/no demostrados | Inventario editorial con fuente, fecha y aprobación; retirar lo no aprobado | Matriz firmada por Producto/Legal |
| B05 | P0 | CTA/legales a 404 o placeholder | Ruta real o CTA oculto; teléfono y enlaces verificados | Crawler interno sin enlaces rotos |
| B06 | P0 | Contrato Academia no verificable desde el workspace | Deep link mínimo validado; catálogo dinámico detrás de feature flag | Contract test contra staging o ruta degradada activa |
| B07 | P1 | Home completamente cliente y JS/motion excesivo | Migrar shell y secciones a Server Components; islas cliente pequeñas | Bundle y React tree auditados |
| B08 | P1 | Lint rojo y efectos con errores React | Corregir 10 errores y 11 warnings; gate de cero regresiones | CI verde |
| B09 | P1 | Metadata, idioma y SEO incorrectos | Layout por locale, metadata/canonical/sitemap reales | Test SEO por ruta publicada |
| B10 | P1 | Fuente remota en build y activos pesados | Fuente local licenciada o sistema; video por intención con poster | Build sin red + auditoría LCP |
| B11 | P1 | Modal sin especificación completa de foco/escape/errores | Dialog accesible, focus trap/restore, Escape, labels, `aria-live` | axe + teclado + lector de pantalla |
| B12 | P1 | v2 sobredimensiona infraestructura inicial | Una réplica y sin Redis; escalar por SLO/uso | ADR y presupuesto mensual |

No se abre G1 mientras B01–B03 sigan abiertos. No se publica G4 mientras B04–B06 sigan abiertos o no esté activa su ruta degradada.

---

## 3. Arquitectura de producto e información

### 3.1 Audiencias y acción primaria

| Audiencia | Necesidad | CTA primario |
|---|---|---|
| Profesional que quiere aprender | Entender oferta y comenzar | “Explorar Academia” |
| Empresa con una oportunidad | Validar capacidad y contactar | “Solicitar diagnóstico” |
| Alumno existente | Entrar a su producto | “Ir a Academia” |
| Prospecto que evalúa confianza | Ver metodología y evidencia | “Conocer cómo trabajamos” |

Cada pantalla tiene un solo CTA visualmente primario. “Academia” y “Consultoría” son rutas claras; el usuario no debe descifrar dos ofertas mezcladas dentro del mismo formulario.

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

Las campañas existentes se mantienen temporalmente en sus URLs, se corrigen por seguridad y se registran para retiro. Ninguna campaña hereda automáticamente claims, formularios o estilos nuevos.

### 3.3 Portada MVP

Header → Hero con elección Academia/Consultoría → propuesta de valor → capacidades verificables → método de trabajo → recursos/campañas vigentes → FAQ aprobada → CTA final → footer legal.

Se eliminan del release: logos inventados, métricas sin fuente, testimonios ficticios, contadores animados sin valor y cualquier garantía que Legal no haya aprobado.

---

## 4. Experiencia y sistema visual

### 4.1 Fuente de verdad

El `Brand Manual aiLearning.html` disponible define la dirección visual. Tokens iniciales:

```css
--ai-blue: #2d88e8;
--ai-blue-deep: #1a5fb4;
--ai-blue-soft: #e6f0fb;
--ink: #0e1b2c;
--ink-2: #1f2d42;
--muted: #6b7484;
--line: #e8e5dd;
--cloud: #f4f2ec;
--paper: #fbfaf6;
--coral: #ff6b47;
--success: #4f7d6c;
--danger: #b42318;
```

Antes de congelarlos se verifican pares de contraste WCAG 2.2 AA. El azul de marca no se asume automáticamente válido para texto pequeño.

### 4.2 Tipografía y densidad

- Preferencia: Space Grotesk / DM Sans / JetBrains Mono **solo si existen archivos licenciados y locales**.
- Fallback de release: stack de sistema; cero descargas de fuentes en build o runtime.
- Texto base móvil y desktop: 16 px; altura de línea 1.5–1.7.
- Longitud: 35–60 caracteres móvil, 60–75 desktop.
- Espaciado: escala 4/8; contenedor máximo 72–80rem.

### 4.3 Componentes mínimos

`Button`, `LinkButton`, `IconButton`, `Container`, `Section`, `Card`, `Badge`, `Header`, `MobileNav`, `Footer`, `LocaleSwitcher`, `FormField`, `InlineError`, `Dialog`, `Toast`, `Accordion`, `AcademyCTA`, `ConsultingLeadForm`.

Cada componente incluye estados normal, hover, focus-visible, pressed, disabled, loading, error y success cuando aplique. Targets táctiles ≥44×44 px y separación ≥8 px.

### 4.4 Movimiento

- 150 ms para feedback, 220 ms para menús, máximo 300 ms para entradas.
- Solo `transform` y `opacity` en animaciones frecuentes.
- Nada esencial depende de hover o movimiento.
- `prefers-reduced-motion` desactiva parallax, conteos y stagger.
- Framer Motion permanece únicamente si una interacción no se resuelve bien con CSS; de lo contrario se elimina de esa ruta.

### 4.5 Estados obligatorios

Loading con espacio reservado; vacío con siguiente acción; error con causa y recuperación; offline/red lenta; éxito explícito; timeout con reintento. Los formularios conservan datos ante un error y enfocan el primer campo inválido.

---

## 5. Arquitectura técnica Next.js 16.2.2

### 5.1 Estructura objetivo

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── academia/page.tsx
│   │   ├── consultoria/page.tsx
│   │   ├── contacto/page.tsx
│   │   └── legal/{privacidad,terminos,cookies}/page.tsx
│   ├── api/
│   │   ├── health/route.ts
│   │   └── leads/route.ts
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/{ui,marketing,forms}/
├── content/es/
├── dictionaries/
├── lib/{academy,analytics,env,i18n,security}/
└── styles/tokens.css
proxy.ts
Dockerfile
railway.json
```

### 5.2 Render y caché

- Server Components por defecto; no usar `"use client"` en páginas completas.
- Client Components solo para menú, dialog, selector, formulario y analítica consentida.
- Activar `cacheComponents: true` después de migrar las rutas y mantener CI verde.
- Para catálogo público: `use cache` + `cacheLife` + `cacheTag`; no usar `unstable_cache`.
- Si el catálogo falla, servir el último snapshot editorial válido o la ruta degradada; nunca precio vacío o viejo sin fecha.
- Con una réplica se acepta caché local. Antes de múltiples réplicas se implementa y prueba un cache handler compartido o se mantiene contenido estático.
- `next/image` con dimensiones/aspect ratio; video sin autoplay pesado, `preload="none"` y reproducción por intención.

### 5.3 Internacionalización

La arquitectura soporta `es`, `en`, `fr`, `de`, `ar`, `zh`, pero el release inicial publica solo `es`. Un locale se activa mediante allowlist de build únicamente cuando cumple:

1. paridad de claves 100%;
2. revisión humana registrada;
3. metadata, legales y mensajes de error traducidos;
4. QA responsive y, para árabe, RTL completo;
5. canonical/hreflang/sitemap actualizados.

No hay fallback silencioso mezclando idiomas. Una ruta de locale no habilitado devuelve 404 o redirige una sola vez según ADR de SEO.

### 5.4 Integración con Academia

Contrato mínimo de navegación:

```text
{ACADEMIA_PUBLIC_URL}/register
  ?locale=es
  &plan=<valor-allowlist-opcional>
  &source=ailearning-hub
  &campaign=<slug-sin-PII>
  &return_to=<ruta-relativa-allowlist>
```

Reglas:

- `ACADEMIA_PUBLIC_URL` se valida al arrancar; solo HTTPS en producción.
- No se envían email, nombre, token o JWT en query string.
- El hub no lee ni escribe sesión de Academia.
- `plan` se omite si no existe contrato de precios firmado.
- `return_to` es relativo y de allowlist; nunca una URL arbitraria.
- Catálogo v1, si existe: JSON versionado con `id`, `slug`, `title`, `price`, `currency`, `interval`, `checkoutUrl`, `updatedAt`; schema runtime y contract tests.

### 5.5 Leads y privacidad

`POST /api/leads` será un Route Handler server-side:

- schema estricto, límite de tamaño y normalización;
- consentimiento explícito, finalidad, versión de aviso, timestamp y locale;
- secreto Brevo solo en servidor;
- timeout, `response.ok`, idempotency key y respuesta genérica;
- protección Origin/CSRF, honeypot y rate limit;
- logs sin cuerpo, email, teléfono ni tokens;
- política de retención y supresión definida por Legal;
- anti-bot adicional solo si métricas muestran abuso.

### 5.6 Seguridad mínima

- CSP por nonce o hashes; sin `unsafe-eval`.
- HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Dependencias y contenedor escaneados; secretos escaneados en repo y bundle.
- Variables tipadas y validadas al arrancar; ejemplo `.env.example` sin valores reales.
- Endpoints con métodos explícitos, límites y errores que no filtren proveedor/configuración.

---

## 6. Infraestructura pragmática

### 6.1 Topología inicial

```text
Usuario
  ↓
Cloudflare — DNS, TLS, WAF, assets estáticos
  ↓
Railway — servicio hub, Node 22, 1 región, 1 réplica
  ├── Brevo API (server-side, leads)
  └── Academia pública (deep links / catálogo opcional)
```

No se crea Postgres ni Redis para el hub en el MVP. Academia conserva su propia infraestructura; integrarla dentro del mismo proyecto Railway es una decisión posterior y requiere acceso a su repositorio, datos, backups y propietario.

### 6.2 Contenedor

- `node:22-slim` fijado a digest; usuario no-root.
- Multi-stage con `npm ci`, `next build` y `output: "standalone"`.
- Copiar `public` y `.next/static` a `.next/standalone`.
- `HOSTNAME=0.0.0.0`; Railway inyecta `PORT`.
- `.dockerignore`, healthcheck, SBOM/scan y límite razonable de imagen.

### 6.3 Railway

`railway.json` usa el schema vigente `https://railway.com/railway.schema.json`, builder `DOCKERFILE`, `/api/health`, timeout 300 s y restart `ON_FAILURE`. La configuración exacta se valida contra el schema en CI.

`/api/health` comprueba que el proceso está listo y devuelve estado/versión/commit, sin secretos. No bloquea por Brevo o Academia: esas dependencias tienen métricas propias y degradación controlada.

### 6.4 Cloudflare

- Cache permanente para `/_next/static/*` y assets con nombre versionado.
- No “cache everything” para HTML, `/api/*`, respuestas con `Set-Cookie` o contenido privado.
- Respetar `Cache-Control`; probar `HIT/MISS/BYPASS` y purga antes de producción.
- WAF/rate limit para `/api/leads`; TLS estricto hacia Railway.

### 6.5 Escalado y costo

Baseline: una región/una réplica. Se escala horizontalmente solo cuando una prueba de carga o telemetría muestre saturación sostenida, incumplimiento de SLO o requisito de disponibilidad. Antes de una segunda réplica se resuelve coherencia de caché y rate limit.

El owner de plataforma configura alerta presupuestaria y revisa semanalmente CPU, RAM, egress y builds. No se afirma ahorro frente a Vercel sin medición comparable de tráfico real.

---

## 7. Rendimiento, accesibilidad y calidad

### 7.1 Presupuestos de release

| Métrica | Gate preproducción móvil |
|---|---:|
| Lighthouse Performance | ≥90 en 3 corridas, usar mediana |
| Lighthouse A11y / SEO / Best Practices | ≥95 / ≥95 / ≥95 |
| LCP lab | ≤2.5 s |
| INP proxy/TBT lab | TBT ≤200 ms |
| CLS | ≤0.10 |
| JavaScript inicial por ruta marketing | ≤150 KB gzip, excepción documentada |
| Imágenes hero | ≤200 KB por variante móvil |
| Errores de consola | 0 |
| Enlaces internos rotos | 0 |

Tras 28 días con volumen suficiente, el SLO de campo es p75 “bueno” para LCP, INP y CLS, segmentado por móvil/desktop y plantilla.

### 7.2 Accesibilidad

WCAG 2.2 AA: skip link, landmarks, headings secuenciales, foco visible, teclado completo, zoom 200/400%, target 44×44, contraste, mensajes no dependientes de color, `aria-live`, alt correcto y reduced motion. Dialogs restauran foco; el menú móvil no atrapa scroll/foco de forma incorrecta.

### 7.3 Matriz mínima de prueba

- Viewports: 360, 390, 768, 1024, 1440; portrait y landscape móvil.
- Navegadores: últimas dos versiones de Chrome/Edge/Firefox y Safari 16.4+.
- Teclado, VoiceOver/Safari y NVDA/Firefox o equivalente disponible.
- Red: Fast 3G, offline, timeout y API 429/500.
- Contenido: texto largo, sin imagen, sin catálogo, consentimiento rechazado.
- E2E: navegación, CTA Academia, formulario lead, legales, 404, error boundary, locale.

---

## 8. Analítica y observabilidad

Eventos mínimos, sin PII:

- `academy_cta_clicked` — route, placement, locale, campaign;
- `consulting_lead_started` / `consulting_lead_completed` — sin campos del formulario;
- `locale_changed`;
- `navigation_error`;
- `web_vital` — plantilla, dispositivo, métrica y valor.

No se carga analítica de marketing antes del consentimiento aplicable. Se documenta taxonomía, owner y retención.

Observabilidad:

- monitor externo de `/api/health` cada minuto;
- alerta por 5xx, latencia p95, fallo de leads, catálogo degradado y presupuesto;
- release y commit en logs/errores;
- dashboards separados para disponibilidad, conversión y CWV;
- runbook con contacto, diagnóstico, mitigación y rollback.

---

## 9. Plan de ejecución y gates

### G0 — Contención (1–2 días)

- Revocar/rotar Brevo y retirar secretos del cliente.
- Desactivar autoenvío por PII en query string.
- Hacer que fallos del proveedor sean fallos reales y recuperables.
- Inventariar claims, precios, logos, CTAs y legales; ocultar lo no probado.
- Registrar baseline de lint/build/bundle/Lighthouse.

**Salida:** B01–B03 cerrados, build verde, sin exposición activa conocida.

### G1 — Fundaciones desplegables (3 días)

- Node 22, standalone Docker, Railway, healthcheck y preview.
- Tokens, layout, metadata, headers, error/404, primitives accesibles.
- CI: lint, typecheck, build, unit, secret scan, schema Railway, container smoke.
- Migrar root a estructura `[locale]` y publicar solo `es`.

**Salida:** shell español navegable en preview, deploy y rollback probados.

### G2 — Producto MVP (4–5 días)

- Portada server-first y rutas Academia/Consultoría/Contacto/Legal.
- Formularios server-side y estados completos.
- Deep link Academia con allowlists y feature flag de catálogo/precios.
- Retirar placeholders y corregir campañas prioritarias.

**Salida:** journey principal completo sin 404, PII en URL ni claims no aprobados.

### G3 — Hardening (3 días)

- Performance, imágenes, video, bundle y movimiento.
- axe, teclado, lectores, responsive, red lenta y fallos externos.
- SEO, sitemap, canonical, consentimiento y analítica.
- Prueba de carga, WAF/rate limit, alertas y runbook.

**Salida:** todos los gates automáticos y manuales verdes.

### G4 — Lanzamiento (1 día + observación)

- Aprobación Producto, Legal, Marca, Tech y QA sobre el mismo commit.
- Deploy a producción con healthcheck.
- Smoke test; observación intensiva 2 horas y seguimiento 24/48 horas.
- Rollback inmediato ante error crítico, pérdida de leads, 5xx sostenido o regresión de seguridad.

**Salida:** MVP estable; revisión a 7 y 30 días.

### G5 — Expansión posterior

Orden recomendado: `en` → `fr/de` → `ar` → `zh`, cada uno con su gate editorial y QA. Catálogo dinámico, casos, SSO, Redis, múltiples regiones y perfil solo entran mediante ADR, owner, métrica objetivo y aceptación.

---

## 10. CI/CD y aceptación

Pipeline de PR:

1. instalación reproducible (`npm ci`);
2. lint sin errores ni warnings nuevos;
3. `tsc --noEmit`;
4. unit/component/contract tests;
5. build Next.js y build Docker;
6. escaneo de secretos, dependencias e imagen;
7. prueba de arranque con `PORT` y healthcheck;
8. E2E + axe en preview;
9. Lighthouse y bundle budget;
10. aprobación requerida por CODEOWNERS.

Protecciones: `main` sin push directo, checks requeridos, un aprobador técnico y uno de producto/contenido para cambios visibles. El mismo artefacto aprobado se promueve a producción; no se reconstruye con código distinto.

### Definition of Done del release

- [ ] B01–B12 cerrados o con ruta degradada aceptada para B04–B06;
- [ ] build, lint, types, tests, escaneos y E2E verdes;
- [ ] cero secretos/PII en bundle, URL y logs;
- [ ] cero enlaces internos rotos y cero placeholders;
- [ ] precios/claims/testimonios con evidencia o ausentes;
- [ ] journey Academia y lead probado en éxito, rechazo, timeout y reintento;
- [ ] WCAG 2.2 AA y presupuestos de rendimiento cumplidos;
- [ ] SEO y legales aprobados para cada locale publicado;
- [ ] healthcheck, monitor, alertas, dashboard y guardia activos;
- [ ] rollback ejecutado con éxito en staging/preproducción;
- [ ] commit, aprobadores y acta de GO registrados.

---

## 11. RACI operativo

| Entregable | R | A | C |
|---|---|---|---|
| UX, UI y sistema visual | Diseño + Frontend | Producto | Marca + A11y |
| Contenido, precios y claims | Contenido/Producto | Dirección | Legal + Academia |
| Next.js, rendimiento, SEO | Frontend | Tech Lead | QA |
| Leads y seguridad | Backend/Frontend | Tech Lead | Legal + Seguridad |
| Contrato Academia | Owner Academia | Tech Lead | Producto + QA |
| Railway/Cloudflare/CI | Plataforma | Tech Lead | Seguridad + Finanzas |
| Release | QA | Producto | Tech + Legal + Operaciones |

Ninguna tarea puede tener “equipo” como único responsable: al iniciar G0 se asigna una persona nominal a cada rol A y R.

---

## 12. Riesgos, disparadores y respuesta

| Riesgo | Disparador | Respuesta |
|---|---|---|
| Academia no entrega contrato | Sin staging/schema al cierre de G1 | Ruta degradada; ocultar planes/precios |
| Contenido legal/comercial no aprobado | Sin evidencia al cierre de G2 | Retirar bloque/claim; no frena el shell |
| Leads fallan | Error >2% o proveedor degradado | Reintento seguro, alerta y canal alterno aprobado |
| JS/LCP excede presupuesto | Gate G3 rojo | Eliminar motion/video/islas; aplazar función no crítica |
| Caché sirve contenido incorrecto | Precio/locale inconsistente | Desactivar catálogo dinámico y purgar caché |
| Costo Railway crece | >80% del presupuesto mensual | Analizar builds/egress/compute; no escalar por intuición |
| Segunda réplica inconsistente | Sesión/rate-limit/cache divergen | No escalar hasta cache/rate limit compartidos |
| Traducción degrada confianza | QA o revisor rechaza locale | Mantener locale fuera de allowlist e índice |

---

## 13. Registro de decisiones cerrado

| Decisión | v3 |
|---|---|
| Rol del hub | Marketing y captación; sin auth/checkout |
| Locale de primer release | Español |
| Fuente comercial | Academia/Producto con evidencia; si falta, se oculta |
| Registro | Siempre en Academia mediante deep link validado |
| Leads | Route Handler server-side; nunca Brevo desde navegador |
| Next.js | Server-first + Cache Components solo con uso explícito |
| Runtime | Node 22 LTS |
| Deploy | Railway standalone, una región/una réplica |
| CDN/WAF | Cloudflare con caché selectiva |
| Redis/Postgres del hub | No en MVP |
| Dark mode | Fuera del MVP; light-first accesible |
| Motion | Mínimo, semántico y reducible |
| Escalado | Por telemetría y prueba de carga |

---

## 14. Fuentes normativas y técnicas

- Documentación local de Next.js 16.2.2: `node_modules/next/dist/docs/` — prevalece para implementación.
- Next.js 16, Cache Components y reemplazo de `unstable_cache`: <https://nextjs.org/docs/app/getting-started/cache-components>
- Self-hosting Next.js: <https://nextjs.org/docs/app/guides/self-hosting>
- Node.js EOL: <https://nodejs.org/about/eol>
- Railway config as code: <https://docs.railway.com/config-as-code/reference>
- Railway healthchecks: <https://docs.railway.com/guides/healthchecks-and-restarts>
- Railway scaling: <https://docs.railway.com/reference/scaling>
- Cloudflare cache behavior: <https://developers.cloudflare.com/cache/concepts/default-cache-behavior/>
- Brand Manual local: `Brand Manual aiLearning.html`.

---

## 15. Declaración final

**GO para iniciar G0 inmediatamente.** El plan ya no depende de supuestos sobre repositorios externos, precios, SSO, Redis, seis traducciones o autoescalado. El lanzamiento será GO únicamente cuando G0–G4 y la Definition of Done estén verdes sobre el mismo commit. Hasta entonces, cualquier deploy público es **NO-GO**.
