import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { Inter } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ailearning.mx";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#174f97",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "aiLearning — IA que se convierte en trabajo real",
    template: "%s · aiLearning",
  },
  description:
    "Formación práctica y consultoría para convertir la inteligencia artificial en capacidades que tu equipo pueda usar.",
  applicationName: "aiLearning",
  alternates: {
    languages: { es: "/es", "x-default": "/es" },
  },
  openGraph: {
    title: "aiLearning — IA que se convierte en trabajo real",
    description: "Formación práctica y consultoría en inteligencia artificial aplicada.",
    locale: "es_MX",
    type: "website",
    siteName: "aiLearning",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "aiLearning — IA que se convierte en trabajo real",
    description: "Formación práctica y consultoría en inteligencia artificial aplicada.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
