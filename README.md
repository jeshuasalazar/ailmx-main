# aiLearning Hub

Hub público de aiLearning para Academia, Consultoría, contacto y campañas. Está construido con Next.js 16 App Router, React 19 y Tailwind CSS 4, con despliegue standalone en Railway.

## Desarrollo

Requiere Node.js 22 y npm.

```bash
npm ci
npm run dev
```

La aplicación queda disponible en `http://localhost:3000/es`.

## Verificación

```bash
npm run check
npm run test:e2e
```

`check` ejecuta lint, TypeScript, pruebas unitarias y build. La suite E2E cubre Chromium, Firefox, WebKit y un viewport móvil, incluyendo axe, navegación, campañas, formulario y matriz responsive.

## Configuración

Copia las variables descritas en `.env.example` al entorno local o a Railway. Las credenciales de Brevo son exclusivamente de servidor y nunca deben usar el prefijo `NEXT_PUBLIC_`.

## Despliegue

Railway construye el `Dockerfile` y verifica `/api/health`. El procedimiento de publicación y rollback está en `docs/runbook-deploy.md`.
