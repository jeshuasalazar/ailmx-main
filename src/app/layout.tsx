import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ailearning.mx";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "aiLearning — IA que se convierte en trabajo real",
    template: "%s · aiLearning",
  },
  description:
    "Formación práctica y consultoría para convertir la inteligencia artificial en capacidades que tu equipo pueda usar.",
  applicationName: "aiLearning",
  openGraph: {
    title: "aiLearning — IA que se convierte en trabajo real",
    description: "Formación práctica y consultoría en inteligencia artificial aplicada.",
    locale: "es_MX",
    type: "website",
    siteName: "aiLearning",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
