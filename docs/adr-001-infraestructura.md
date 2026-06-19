# ADR-001 — Infraestructura inicial del hub

Estado: aceptado  
Fecha: 19 de junio de 2026

## Decisión

Desplegar el hub como contenedor standalone de Next.js sobre Railway, en una región y una réplica, detrás de Cloudflare. No añadir base de datos ni Redis al MVP. Academia continúa como sistema separado para registro, autenticación, contenido y pagos.

## Razones

El hub sirve contenido público y recibe un volumen acotado de leads. Una réplica reduce costo y complejidad; el rate limit en memoria es una contención inicial, no una solución multi-réplica. Antes de escalar se medirán CPU, memoria, latencia p95, errores 5xx y volumen de solicitudes.

## Consecuencias

- El despliegue usa `output: "standalone"`, Docker y `/api/health`.
- La escala horizontal exige un rate limit compartido y revisión de coherencia de caché.
- Cloudflare debe cachear únicamente activos públicos inmutables, nunca `/api/*` ni HTML con estado.
- Configurar en Railway una alerta de presupuesto y revisar semanalmente CPU, RAM, egress y builds.
