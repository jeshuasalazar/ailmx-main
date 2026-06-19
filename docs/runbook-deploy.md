# Runbook de despliegue y rollback

## Preparación

1. Confirmar `npm ci && npm run check` sobre el commit que se desplegará.
2. Configurar en Railway `BREVO_API_KEY`, `BREVO_LIST_ID_F`, `BREVO_LIST_ID_B`, `ACADEMIA_PUBLIC_URL` y `NEXT_PUBLIC_SITE_URL`.
3. Validar que ningún secreto use el prefijo `NEXT_PUBLIC_`.
4. Construir el contenedor y comprobar que `/api/health` responde 200.

## Publicación

1. Conectar el repositorio a Railway con builder Dockerfile.
2. Desplegar primero en preview y ejecutar navegación, legales, enlace a Academia y un lead controlado.
3. Promover el mismo commit a producción.
4. En Cloudflare usar TLS estricto, proxy DNS y caché solo para `/_next/static/*`.
5. Configurar un monitor externo de `/api/health` cada minuto y alertas de 5xx, latencia y fallos del endpoint de leads.

## Rollback

Ante 5xx sostenido, pérdida de leads o una regresión de seguridad: Railway → Deployments → último deployment sano → Redeploy. Objetivo operativo: menos de cinco minutos. Verificar `/api/health`, portada, enlace a Academia y formulario después del rollback.
