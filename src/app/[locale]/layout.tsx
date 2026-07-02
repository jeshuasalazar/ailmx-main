import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  const pathname = (await headers()).get("x-pathname") || "/es";

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader pathname={pathname} />
      <main id="contenido">{children}</main>
      <SiteFooter />
    </>
  );
}
