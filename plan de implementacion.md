# Plan maestro de actualización — aiLearning Hub

**Versión:** 1.0  
**Fecha:** 19 de junio de 2026  
**Estado:** propuesto para validación  
**Repositorio principal:** `jeshuasalazar/ailmx-main`  
**Repositorios relacionados:** `jeshuasalazar/academia`, `jeshuasalazar/home`  
**Objetivo:** transformar `ailearning.mx` en el hub corporativo de aiLearning, consistente con la marca, rápido, accesible, multilingüe y conectado de forma segura con Academia.

---

## 1. Resultado esperado

Al finalizar, aiLearning tendrá una puerta de entrada corporativa que:

- explica con claridad sus dos líneas principales: **Academia** y **Consultoría**;
- dirige a cada audiencia hacia una acción primaria inequívoca;
- permite navegar en español, inglés, francés, alemán, árabe y chino;
- conecta el registro y la compra con Academia sin duplicar cuentas ni exponer secretos;
- usa un único sistema visual derivado del Brand Manual;
- conserva movimiento expresivo, pero ligero, coherente y accesible;
- cumple presupuestos medibles de rendimiento, accesibilidad, SEO y seguridad;
- puede evolucionar sin volver a concentrar toda la experiencia en un solo archivo.

Este documento define el trabajo. No autoriza despliegues, commits ni cambios de producción.

---

## 2. Fuentes analizadas y jerarquía de decisión

| Fuente | Revisión analizada | Uso en el plan |
|---|---:|---|
| `ailmx-main` | `f6127b5` | Estado real del hub, Next.js 16.2.2 y deuda actual |
| `academia` | `d78228e` | Registro, autenticación, catálogo, membresías y checkout |
| `home` | `e554747` | Contrato de seis locales, diccionarios, RTL y selector de idioma |
| `Brand Manual aiLearning.html` | copia local y copia de Academia | Fuente principal de identidad visual |
| UI/UX Pro Max | `b7e3af8` | Accesibilidad, interacción, movimiento, rendimiento y QA |
| Documentación local de Next.js | `node_modules/next/dist/docs/` | Convenciones de Next.js 16; prevalece sobre patrones antiguos |

### Orden de precedencia

1. Seguridad, privacidad y accesibilidad.
2. Brand Manual aiLearning.
3. Necesidades de negocio y contenido aprobado.
4. Reglas de UI/UX Pro Max.
5. Preferencias estéticas existentes en los tres repositorios.

UI/UX Pro Max recomendó el patrón **Trust & Authority**, con excelente rendimiento y accesibilidad. Se adopta ese patrón de información —credenciales, casos, métricas y CTA claro—, pero **no** su paleta ni tipografías sugeridas: la identidad de marca manda.

### Limitación del Brand Manual disponible

El HTML contiene tokens, estilos y estructura visual, pero referencia archivos ausentes (`src/data.jsx`, `src/sections-1.jsx`, `src/sections-2.jsx`, `src/sections-3.jsx` y `src/app.jsx`). Antes de cerrar textos, reglas de voz y usos del logotipo se debe recuperar la versión autocontenida o esos archivos. No se deben inventar reglas faltantes.

---

## 3. Diagnóstico ejecutivo

### 3.1 Lo que ya funciona

- Stack moderno: Next.js 16.2.2, React 19.2.4, TypeScript y Tailwind CSS 4.
- El build de producción compila y prerenderiza `/`, `/activar` y `/jornadas2026`.
- Existe una propuesta comercial extensa en español e inglés.
- Academia ya dispone de registro, login, cursos, progreso, comunidad, Stripe y membresías.
- `home` ya resuelve los seis locales requeridos: `es`, `en`, `fr`, `de`, `ar`, `zh`.
- Hay activos de marca y contenido reutilizable.

### 3.2 Hallazgos críticos

| Prioridad | Hallazgo | Impacto |
|---|---|---|
| P0 | Brevo se consume desde el navegador con `NEXT_PUBLIC_BREVO_API_KEY` | Una clave privada podría quedar expuesta en el bundle; abuso y fuga de datos |
| P0 | Academia permite CORS general, usa JWT en `localStorage` y contempla un secreto JWT por defecto | Aumenta superficie de XSS, CSRF y configuración insegura |
| P0 | Precios inconsistentes | Hub muestra `$699`, `$1,499` y otros planes; Academia publica `$299/$2,990` |
| P1 | `src/app/page.tsx` es un Client Component de 1,065 líneas | Hidrata casi toda la portada y dificulta rendimiento, pruebas y mantenimiento |
| P1 | Uso extensivo de estilos inline, colores y tipografías ad hoc | La UI no sigue un sistema único y se separa del Brand Manual |
| P1 | Solo existen traducciones completas para `es` y `en` | Faltan `fr`, `de`, `ar`, `zh`, rutas localizadas y experiencia RTL |
| P1 | Varios CTA apuntan a rutas inexistentes | `/diagnostico`, `/cursos`, `/casos`, `/contacto` y páginas legales pueden terminar en 404 |
| P1 | El registro del hub no crea una cuenta de Academia | La promesa “comenzar gratis” no tiene una continuidad transaccional clara |
| P1 | Metadata aún dice “Create Next App” y el documento usa `lang="en"` fijo | Daño a SEO, accesibilidad y credibilidad |
| P2 | Movimiento repartido entre Framer Motion, canvas y CSS continuo | Ritmo desigual, mayor JS y riesgo de jank o mareo |
| P2 | Imágenes con `<img>`, video pesado y fuentes remotas | Riesgo de LCP/CLS y fallos de build sin red |
| P2 | ESLint falla | Línea base: 10 errores y 11 advertencias |
| P2 | Jornadas usa emojis como iconos y estilos propios dorados | Fragmentación de marca y accesibilidad irregular |

### 3.3 Decisiones que deben cerrarse antes de construir

1. Aprobar catálogo, moneda, precios, garantías y planes definitivos.
2. Confirmar URL de producción de Academia; el código usará `ACADEMIA_URL`, nunca una URL dispersa.
3. Definir si la cuenta gratuita requiere solo email o nombre, email y contraseña.
4. Definir propietario editorial y aprobadores de cada idioma.
5. Recuperar el Brand Manual completo y los archivos fuente referenciados.
6. Confirmar pruebas, métricas y testimonios reales; retirar placeholders y enlaces `#`.
7. Decidir si el modo oscuro sale en v1. Recomendación: lanzamiento **light-first**, con tokens preparados y modo oscuro solo después de validar contraste.

---

## 4. Visión de producto e información

### 4.1 Audiencias

- Persona que quiere aprender IA y entrar a Academia.
- Líder de equipo que busca capacitación corporativa.
- Empresa que necesita consultoría e implementación.
- Alumno existente que quiere volver a su panel.
- Socio, instructor o prospecto que necesita validar autoridad y contactar.

### 4.2 Arquitectura de información propuesta

```text
/[locale]
├── /academia
│   ├── catálogo destacado
│   ├── membresías
│   └── acceso / registro externo
├── /consultoria
├── /soluciones
├── /casos
├── /recursos
├── /empresa
├── /contacto
└── /legal
    ├── privacidad
    ├── terminos
    └── cookies
```

Las campañas `/activar` y `/jornadas2026` se conservarán mediante redirects compatibles y después se migrarán a `/(campaigns)/[locale]/...` con la misma identidad.

### 4.3 Portada del hub

Orden recomendado:

1. Header: propuesta corporativa, navegación, idioma, “Entrar” y CTA “Explorar Academia”.
2. Hero: una frase de posicionamiento y dos caminos —aprender o implementar—.
3. Prueba de autoridad: cifras verificadas, clientes y credenciales.
4. Bento sobrio de capacidades: Academia, equipos y consultoría.
5. Academia: catálogo real, modalidad, membresías y acceso.
6. Consultoría: problemas, proceso, entregables y diagnóstico.
7. Caso de estudio verificable.
8. Recursos y eventos.
9. FAQ segmentada.
10. CTA final y footer legal completo.

Debe existir un solo CTA primario por bloque. “Entrar a Academia” y “Crear cuenta” no deben abrir el mismo modal ambiguo.

---

## 5. Sistema de diseño aiLearning

### 5.1 Tokens de marca obligatorios

```css
--ai-blue: #2D88E8;
--ai-blue-deep: #1A5FB4;
--ai-blue-soft: #E6F0FB;
--ink: #0E1B2C;
--ink-2: #1F2D42;
--mute: #6B7484;
--line: #E8E5DD;
--line-soft: #F0EDE5;
--cloud: #F4F2EC;
--paper: #FBFAF6;
--white: #FFFFFF;
--coral: #FF6B47;
--sage: #6B9080;
```

- Primario: azul aiLearning para navegación, foco y CTA principal.
- Coral: acento secundario y consultoría; nunca competir con el CTA primario.
- Sage: éxito o estados positivos.
- Ink/Paper/Cloud: superficies y texto.
- No usar morados AI genéricos, dorados de campaña, gradientes neón ni colores crudos en componentes.

### 5.2 Tipografía

- Display: **Space Grotesk**, 600 para títulos.
- Cuerpo e interfaz: **DM Sans**, 400–700.
- Etiquetas, datos y eyebrows: **JetBrains Mono**, 400–600.
- Eliminar Fraunces, Inter, Geist y `system-ui` como voces visibles no justificadas.
- Servir fuentes con `next/font`; preferir archivos locales para builds reproducibles.
- Para árabe y chino definir fallback localizado compatible —por ejemplo Noto Sans Arabic y Noto Sans SC—, conservando escala, peso y ritmo de marca.

### 5.3 Escalas

- Espaciado base: 4/8 px; niveles recomendados `4, 8, 12, 16, 24, 32, 48, 64, 80`.
- Radios: `6, 8, 14, 999` según control, tarjeta y pill.
- Contenedor: ancho máximo consistente entre 72 y 80rem.
- Texto corrido: 60–75 caracteres en escritorio y 35–60 en móvil.
- Capas: `base 0`, `sticky 10`, `dropdown 20`, `overlay 40`, `modal 50`, `toast 60`.

### 5.4 Componentes mínimos

- `Button`, `LinkButton`, `IconButton`.
- `Container`, `Section`, `Stack`, `Grid`.
- `Card`, `Metric`, `Badge`, `LogoCloud`.
- `Header`, `MobileNav`, `Footer`, `LanguageSwitcher`.
- `AcademyCourseCard`, `ConsultingServiceCard`, `CaseStudyCard`.
- `Accordion`, `Modal`, `FormField`, `InlineError`, `Toast`.
- `MotionReveal` y `ReducedMotionBoundary` como únicas abstracciones de entrada.

Cada componente tendrá variantes explícitas, estados hover/focus/pressed/disabled, navegación por teclado y pruebas de contraste.

### 5.5 Movimiento en armonía

| Token | Duración | Uso |
|---|---:|---|
| `motion-fast` | 150 ms | hover, foco, pressed |
| `motion-base` | 220 ms | menús, acordeones, cambios de estado |
| `motion-slow` | 300 ms | entrada de sección o modal |
| `motion-exit` | 140–200 ms | salida; 60–70% de la entrada |

- Animar solo `transform` y `opacity` en el camino crítico.
- Máximo 1–2 elementos protagonistas animados por vista.
- Evitar animaciones infinitas decorativas, canvas continuo y `height: auto` cuando provoque reflow.
- Entradas con `ease-out`; salidas más rápidas; sin esperas que bloqueen interacción.
- `prefers-reduced-motion: reduce` debe eliminar parallax, conteos, stagger y autoanimación.
- Video/avatar se carga bajo intención o fuera del camino crítico, nunca como requisito para entender el hero.

---

## 6. Arquitectura técnica objetivo

### 6.1 Server-first en Next.js 16

- Mover páginas y secciones estáticas a Server Components.
- Mantener Client Components pequeños para idioma, menú, acordeón, formularios y motion puntual.
- No colocar `"use client"` en la página completa.
- Pasar al cliente solo las claves de traducción y campos que realmente utiliza.
- Cargar modal, video/avatar y experiencias pesadas con `next/dynamic` cuando exista intención.
- Usar `<Link>` para navegación interna y `<Image>` con dimensiones/reserva de espacio.
- Implementar `loading.tsx`, `error.tsx`, `not-found.tsx` y `global-error.tsx` accesibles.

### 6.2 Estructura propuesta

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── academia/page.tsx
│   │   ├── consultoria/page.tsx
│   │   ├── casos/page.tsx
│   │   ├── recursos/page.tsx
│   │   ├── contacto/page.tsx
│   │   └── legal/...
│   ├── api/leads/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── opengraph-image.tsx
├── components/
│   ├── ui/
│   ├── marketing/
│   └── academy/
├── dictionaries/
├── lib/
│   ├── academy.ts
│   ├── env.ts
│   ├── i18n.ts
│   └── analytics.ts
└── styles/tokens.css
proxy.ts
```

En Next.js 16 la convención correcta es `proxy.ts`, no `middleware.ts`.

### 6.3 Contenido y fuente de verdad

- No mantener precios, cursos, métricas y testimonios como grandes objetos dentro de `page.tsx`.
- Producto debe nombrar un propietario único del catálogo.
- Recomendación: Academia expone un contrato público versionado para planes/cursos y el hub lo consume desde Server Components con caché y último valor válido.
- La publicación debe fallar si faltan precio, moneda, vigencia, idioma o URL de checkout.
- Testimonios y cifras requieren evidencia, permiso y fecha de verificación.

---

## 7. Internacionalización de seis idiomas

### 7.1 Contrato

```ts
const locales = ["es", "en", "fr", "de", "ar", "zh"] as const;
const defaultLocale = "es";
```

- Rutas por subpath: `/es`, `/en`, `/fr`, `/de`, `/ar`, `/zh`.
- `proxy.ts` negocia `Accept-Language` solo cuando la URL no contiene locale.
- Persistir preferencia explícita en cookie; no sobreescribirla en visitas futuras.
- Cargar diccionarios con importación dinámica y `server-only`.
- Generar todas las rutas públicas con `generateStaticParams`.
- Locale inválido devuelve 404, no fallback silencioso.
- Usar `Intl.NumberFormat`, `Intl.DateTimeFormat` y moneda declarada.

### 7.2 RTL y tipografía localizada

- `dir="rtl"` para árabe y `dir="ltr"` para el resto.
- Usar propiedades CSS lógicas: `margin-inline`, `padding-inline`, `inset-inline-start`.
- Reflejar flechas direccionales, no logotipos ni iconos universales.
- Probar orden de foco, dropdown de idioma, navegación móvil y formularios en RTL.
- Evitar mayúsculas forzadas y tracking amplio en árabe/chino.

### 7.3 Flujo editorial

1. Español es el texto maestro aprobado.
2. Inglés es traducción humana revisada.
3. Francés, alemán, árabe y chino pasan traducción, revisión nativa y QA visual.
4. CI valida que todos los diccionarios tengan las mismas claves.
5. Los contenidos sin traducción se marcan con idioma original; no se mezclan silenciosamente.

### 7.4 SEO internacional

- Metadata y Open Graph por locale.
- Canonical por página e `hreflang` para los seis idiomas más `x-default`.
- Sitemap con alternates.
- Título, descripción, FAQ y datos estructurados traducidos.
- `html lang` y `dir` correctos desde el render del servidor, sin redirect por JavaScript.

---

## 8. Conexión con Academia

### 8.1 Arquitectura recomendada

- Hub público: `https://ailearning.mx/[locale]/...`.
- App educativa: variable `ACADEMIA_URL`, idealmente `https://academia.ailearning.mx`.
- No embeber Academia en iframe.
- No copiar JWT ni `localStorage` entre aplicaciones.
- El hub presenta; Academia registra, autentica, cobra y entrega contenido.

### 8.2 Contrato de navegación v1

CTA del hub:

```text
{ACADEMIA_URL}/register
  ?locale=es
  &plan=free|monthly|annual|team
  &source=ailearning-hub
  &campaign=<utm_campaign>
  &return_to=<ruta-permitida>
```

Academia debe:

- crear rutas reales `/register` y `/login` en lugar de depender solo de un modal/hash;
- aceptar únicamente planes conocidos y `return_to` de una allowlist;
- conservar UTM/referral sin incluir PII en la URL;
- mostrar onboarding en el locale recibido;
- devolver al hub o al panel con una ruta validada;
- emitir eventos `registration_started`, `registration_completed` y `checkout_completed`.

### 8.3 Autenticación y seguridad

Antes de implementar SSO:

- exigir `JWT_SECRET` fuerte en producción y eliminar fallback;
- migrar sesión de `localStorage` a cookie `HttpOnly`, `Secure`, `SameSite` apropiada;
- limitar CORS a dominios aprobados;
- eliminar `unsafe-eval` y reducir `unsafe-inline` en CSP;
- añadir protección CSRF, rate limiting por ruta y rotación de sesión;
- validar inputs y respuestas; nunca confiar en `plan`, `locale` o `return_to` del cliente.

SSO es fase posterior. Si se requiere, usar OIDC/OAuth 2.1 con Authorization Code + PKCE o un proveedor común. No diseñar un SSO casero con JWT en query string.

### 8.4 Registro y CRM

- Eliminar llamadas de navegador a Brevo.
- Mover captación a `POST /api/leads` o Server Action con secreto solo de servidor.
- Validar con esquema, consentimiento explícito, rate limit y protección anti-bot.
- Separar “lead de consultoría” de “cuenta de Academia”.
- No crear contactos ni enviar email si Brevo responde error; presentar recuperación clara.
- Registrar consentimiento, versión del aviso, fecha, fuente y locale.

### 8.5 Planes y checkout

- Resolver primero la discrepancia `$699/$1,499` vs `$299/$2,990`.
- Academia será fuente de verdad para precio, moneda, intervalo y Stripe Price ID.
- Hub no recibe claves Stripe ni crea suscripciones.
- CTA de compra dirige a Academia; Academia crea Checkout y procesa webhook firmado.
- Añadir idempotencia de webhook, auditoría y pruebas de éxito, cancelación y renovación.
- Eliminar endpoints mock del entorno de producción.

### 8.6 Evolución de integración

| Nivel | Alcance | Recomendación |
|---|---|---|
| 1 | Deep links seguros, locale, plan y atribución | Lanzamiento inicial |
| 2 | Catálogo/precios públicos consumidos server-side | Misma versión si el contrato queda estable |
| 3 | SSO y sesión compartida mediante estándar | Después de endurecer auth |
| 4 | Perfil/progreso resumido en el hub | Solo con caso de negocio y revisión de privacidad |

---

## 9. Rendimiento y Core Web Vitals

### Presupuestos de salida

| Métrica | Objetivo móvil p75 |
|---|---:|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.10 |
| TTFB | ≤ 800 ms |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility/SEO/Best Practices | ≥ 95 |
| JS inicial propio del hub | ≤ 170 KB gzip, revisar por ruta |

### Acciones

- Extraer el hero y contenido estático de la frontera cliente.
- Cargar Framer Motion solo en islas donde sea indispensable; preferir CSS para estados simples.
- Reemplazar canvas continuo por arte estático o activado bajo intención.
- Optimizar logo e imágenes con `<Image>`, tamaños y AVIF/WebP.
- Entregar poster de video optimizado; no precargar video completo.
- Autohospedar fuentes y cargar solo pesos usados.
- Evitar imports barrel de iconos; importar Lucide de forma directa o validar optimización del paquete.
- Reservar espacio para todo contenido asíncrono.
- Añadir `useReportWebVitals` y panel de datos reales por locale/dispositivo.
- Analizar bundle en CI y bloquear regresiones mayores al presupuesto acordado.

---

## 10. Accesibilidad y calidad de interacción

- WCAG 2.2 AA como mínimo.
- Contraste 4.5:1 para texto normal y 3:1 para texto grande/componentes.
- Skip link, landmarks, jerarquía de headings y foco visible.
- Objetivos táctiles mínimos de 44×44 px y separación suficiente.
- Menú, selector de idioma, modales y acordeones utilizables con teclado.
- Cierre de modal con Escape, focus trap y retorno de foco al disparador.
- Formularios con label visible, ayuda, errores junto al campo y resumen accesible.
- Mensajes asíncronos con `aria-live`; estados loading/disabled/success/error.
- Iconos SVG consistentes; no emojis como controles estructurales.
- Imágenes informativas con alt; decorativas con alt vacío.
- Probar zoom 200%, navegación sin mouse, lector de pantalla y reduced motion.

---

## 11. SEO, analítica y observabilidad

### SEO

- Metadata real de aiLearning por ruta y locale.
- `Organization`, `WebSite`, `Course`, `Service`, `FAQPage` y `BreadcrumbList` solo con datos visibles y válidos.
- `sitemap.xml`, `robots.txt`, canonical, hreflang y OG localizados.
- No indexar rutas de campaña obsoletas, auth ni parámetros de atribución.

### Analítica respetuosa de privacidad

Taxonomía mínima:

- `nav_academy_click`
- `academy_registration_start`
- `academy_registration_complete`
- `academy_checkout_start`
- `academy_checkout_complete`
- `consulting_lead_start`
- `consulting_lead_complete`
- `language_changed`
- `case_study_viewed`

Cada evento incluye locale, ruta, placement y campaign; nunca nombre, email, JWT o texto libre. Consent Mode y política de cookies deben estar resueltos antes de marketing tags.

### Observabilidad

- Errores de cliente y servidor con release y locale.
- Tasa de error de leads, auth y checkout.
- Funnel hub → registro → checkout.
- Core Web Vitals reales por plantilla.
- Alertas para discrepancia o indisponibilidad del catálogo de Academia.

---

## 12. Plan de ejecución por fases

### Fase 0 — Alineación y contención (2–3 días)

- [ ] Congelar precios y claims hasta aprobación.
- [ ] Rotar cualquier clave Brevo que haya sido expuesta y retirar `NEXT_PUBLIC_BREVO_API_KEY`.
- [ ] Confirmar dominio de Academia y propietarios.
- [ ] Recuperar Brand Manual completo.
- [ ] Documentar línea base Lighthouse, bundle, errores y funnel.
- [ ] Crear ADR para dominios, i18n, auth y fuente de precios.

**Salida:** decisiones P0 firmadas y secretos fuera del cliente.

### Fase 1 — Fundaciones de marca y arquitectura (semana 1)

- [ ] Crear tokens, tipografía y primitives.
- [ ] Migrar layout global y metadata.
- [ ] Crear estructura `[locale]`, diccionarios server-only y `proxy.ts`.
- [ ] Implementar selector accesible y RTL.
- [ ] Añadir pruebas de paridad de claves.
- [ ] Corregir ESLint a cero errores.

**Salida:** shell corporativo en seis idiomas, sin contenido duplicado en cliente.

### Fase 2 — Hub corporativo (semanas 2–3)

- [ ] Dividir portada en Server Components por sección.
- [ ] Implementar navegación, hero, autoridad, Academia, Consultoría, casos, recursos, FAQ y footer.
- [ ] Crear rutas reales para páginas profundas y legales.
- [ ] Sustituir placeholders por contenido aprobado.
- [ ] Normalizar campañas heredadas o definir redirects.
- [ ] Aplicar sistema de movimiento y reduced motion.

**Salida:** hub navegable, responsive y fiel a marca.

### Fase 3 — Integración con Academia (semanas 3–4)

- [ ] Crear contrato de URLs y variables de entorno.
- [ ] Implementar `/register` y `/login` localizados en Academia.
- [ ] Propagar locale, plan y atribución validada.
- [ ] Unificar catálogo y precios.
- [ ] Mover Brevo al servidor.
- [ ] Endurecer cookies, CORS, CSP, JWT, CSRF y rate limiting.
- [ ] Probar Stripe y webhooks en sandbox.

**Salida:** recorrido completo hub → cuenta → checkout → panel.

### Fase 4 — Contenido multilingüe y SEO (semanas 4–5)

- [ ] Aprobar español e inglés.
- [ ] Traducir y revisar francés, alemán, árabe y chino.
- [ ] Validar RTL y expansión de texto.
- [ ] Generar metadata, hreflang, sitemap, OG y schema por idioma.
- [ ] Añadir páginas de error y estados vacíos localizados.

**Salida:** seis locales completos, indexables y equivalentes.

### Fase 5 — Rendimiento, accesibilidad y QA (semana 6)

- [ ] Optimizar imágenes, video, fuentes, imports y bundles.
- [ ] Ejecutar Lighthouse, axe, teclado y lectores de pantalla.
- [ ] Probar 375, 768, 1024 y 1440 px, más paisaje móvil.
- [ ] Probar red lenta, errores API y Academia caída.
- [ ] Añadir E2E de CTAs, locale, registro y checkout.
- [ ] Cerrar presupuestos y cero errores de consola.

**Salida:** release candidate que cumple la definición de terminado.

### Fase 6 — Lanzamiento controlado (2–3 días)

- [ ] Preview con aprobación de marca, legal, producto y seguridad.
- [ ] Canary o porcentaje reducido de tráfico.
- [ ] Monitorear CWV, errores y conversión 24–48 horas.
- [ ] Rollback documentado y probado.
- [ ] Liberación total y reporte de resultados a 7 y 30 días.

---

## 13. Matriz de responsabilidad

| Entregable | Responsable | Aprobadores |
|---|---|---|
| Posicionamiento, claims y precios | Producto/Negocio | Dirección + Legal |
| Tokens y componentes | Diseño + Frontend | Marca + Accesibilidad |
| Next.js, i18n y rendimiento | Frontend | Tech Lead |
| Auth, API, Stripe y catálogo | Backend Academia | Seguridad + Producto |
| Traducciones | Contenido/Localization | Revisor nativo + Marca |
| Privacidad, cookies y términos | Legal | Dirección |
| QA y release | QA/Tech Lead | Producto + Operaciones |

---

## 14. Estrategia de pruebas

### Automatizadas

- Unitarias: locale, diccionarios, formatos, URLs de Academia y validadores.
- Componentes: botones, selector, acordeón, modal y formularios.
- Contrato: planes/cursos del API de Academia.
- Integración: lead server-side, registro, sesión y checkout sandbox.
- E2E: seis locales, RTL, CTA por placement, auth y retorno de Stripe.
- Accesibilidad: axe sobre plantillas principales.
- Visuales: 375/768/1024/1440, light y dark si aplica, LTR/RTL.

### Gates de CI

- `npm run lint` sin errores ni warnings nuevos.
- `npm run build` exitoso sin depender de red si las fuentes quedan locales.
- TypeScript estricto sin `any` evasivo.
- Diccionarios con 100% de paridad.
- Sin secretos detectados en repo o bundle.
- Lighthouse y bundle dentro de presupuesto.
- E2E críticos y contrato de Academia en verde.

---

## 15. Definición de terminado

La actualización se considera terminada cuando:

- [ ] las seis rutas de idioma funcionan y árabe usa RTL correcto;
- [ ] no hay secretos ni claves privadas en el cliente;
- [ ] precios y planes coinciden entre hub, Academia y Stripe;
- [ ] todos los CTA tienen destino real y atribución verificable;
- [ ] registro, login, checkout, cancelación y retorno fueron probados end-to-end;
- [ ] el sistema visual usa tokens del Brand Manual y componentes compartidos;
- [ ] no hay claims, testimonios ni métricas sin aprobar;
- [ ] Lighthouse y Core Web Vitals cumplen los objetivos;
- [ ] WCAG 2.2 AA y reduced motion fueron validados;
- [ ] metadata, canonical, hreflang, sitemap y OG están completos;
- [ ] CI no presenta errores de lint, tipos, build, tests o secretos;
- [ ] existe rollback probado, monitoreo activo y responsables de guardia.

---

## 16. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Brand Manual incompleto | Recuperar fuentes antes de aprobar diseño final |
| Traducciones literales o inconsistentes | Glosario, memoria de traducción y revisión nativa |
| Academia no soporta rutas/locale | Entregar contrato v1 antes de enlazar CTAs públicos |
| Cambios de precio rompen el hub | Fuente de verdad única y contrato versionado |
| SSO amplía demasiado el alcance | Lanzar deep links primero; SSO solo con estándar y threat model |
| Movimiento degrada móviles | Presupuesto, reduced motion y carga por intención |
| Migración rompe campañas existentes | Inventario, redirects y pruebas de enlaces entrantes |
| Datos personales en analítica | Esquema de eventos sin PII y revisión legal |

---

## 17. Primer sprint recomendado

1. Rotar/retirar Brevo del cliente.
2. Aprobar tabla única de planes y precios.
3. Recuperar el Brand Manual completo.
4. Crear ADR de dominios y contrato `ACADEMIA_URL`.
5. Crear `tokens.css`, fuentes de marca y primitives.
6. Implementar `[locale]`, `proxy.ts`, diccionarios y RTL.
7. Convertir el hero y header a server-first.
8. Corregir rutas rotas y metadata.
9. Dejar lint en verde.
10. Medir de nuevo bundle, Lighthouse y conversión base.

Este orden elimina primero los riesgos que podrían invalidar el rediseño y deja una base estable para ejecutar el resto del plan.
