"use client";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <html lang="es"><body><main className="not-found" role="alert"><div><h1>Ocurrió un error inesperado.</h1><button className="button button-primary" type="button" onClick={() => reset()}>Reintentar</button></div></main></body></html>; }
