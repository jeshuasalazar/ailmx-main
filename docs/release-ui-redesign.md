# Evidencia del rediseño UI

Fecha: 22 de junio de 2026

SHA base: `740148a`

Rutas: `/es`, `/es/academia`, `/es/consultoria`, `/es/contacto`

## G0 — Precondiciones

- Contrato de leads: resuelto como **País** en label, `name`, JSON, Zod y atributo Brevo `COUNTRY`.
- Claims cuantitativos, precios, testimonios, logos y garantías sin fuente: omitidos.
- Inventario de assets: `public/jornadas2026/guia.pdf` se conserva por uso directo; `Alien_sf.png`, `Owl_sf.png`, `Bienvenida_Home_720p.mp4`, `logo-ailearning.png` y el duplicado `public/guia-jornadas2026.pdf` se retiraron tras confirmar cero referencias y hash duplicado en el PDF.
- Aprobación nominal de textos legales: **pendiente de responsable humano**; continúa como gate explícito para GO comercial.

## G1–G2 — Sistema e implementación

- Tokens semánticos, foco visible de 3 px, targets de 44 px o más, reduced motion y safe areas.
- Header con estado activo, menú accesible, Escape, devolución de foco y navegación táctil.
- Navegación documental con anchors y Popover nativo para evitar hidratar React en páginas informativas; el formulario queda como única isla cliente.
- Hero SSR y contenido esencial sin dependencia de efectos ni librerías nuevas.
- Formulario con labels visibles, autocomplete, errores por campo, foco en primer error, preservación de datos y estados 400, 429, 5xx, timeout y éxito.
- Campañas, legales, descarga, redirect raíz, 404 y Academia incluidas en regresión.

## G3 — Evidencia automatizada

- `npm run check`: lint, tipos, 8 unitarias y build standalone.
- `npm run test:e2e`: Chromium, Firefox, WebKit y Pixel 7; axe en las cuatro rutas objetivo.
- Responsive: 13 viewports entre 320×568 y 2560×1440 sin overflow horizontal.
- Verificación visual manual en 390×844 y 1440×900: jerarquía, contenido, navegación y formulario sin solapamientos.
- CSP: nonce distinto por documento, scripts hidratados en los tres motores y `upgrade-insecure-requests` solo cuando la solicitud original es HTTPS.
- Auditoría DevTools/Lighthouse controlada: pendiente porque el servidor Chrome DevTools MCP no está configurado en este entorno.
- Safari/iOS y Android físicos: pendiente de smoke en dispositivos reales.

## G4 — Operación

- Docker standalone, usuario no root, `/api/health`, `railway.json` y rollback documentados.
- Requiere registrar el URL/deployment ID, smoke de preview, aprobación nominal y observación de 30 minutos al ejecutar el despliegue.

No se declara GO comercial mientras los puntos humanos y de entorno anteriores sigan pendientes.
