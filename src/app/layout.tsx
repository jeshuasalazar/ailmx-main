import type { Metadata } from "next";
import "./globals.css";

// Stack de sistema: cero descargas de fuentes en build/runtime (cierra B10).
const fontVars = {
  "--font-geist-sans":
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  "--font-geist-mono":
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
} as React.CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ailearning.mx"),
  title: {
    default: "aiLearning — Formación y consultoría en IA aplicada",
    template: "%s · aiLearning",
  },
  description:
    "Aprende a construir agentes de IA o implementa IA en tu empresa. Formación y consultoría en español, con resultados verificables.",
  openGraph: {
    title: "aiLearning — IA aplicada para profesionales y empresas",
    description:
      "Formación y consultoría en IA aplicada. Empieza gratis; sube de nivel solo si ves valor.",
    locale: "es_MX",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" style={fontVars}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
