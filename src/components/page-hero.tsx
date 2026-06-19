import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  description,
  tone = "blue",
  asideTitle,
  items,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "blue" | "coral";
  asideTitle: string;
  items: string[];
  cta?: { label: string; href: string; external?: boolean };
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-grid">
        <div className="page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="title">{title}</h1>
          <p className="subtitle">{description}</p>
          {cta && (
            <Link className="button button-primary" style={{ marginTop: "2rem" }} href={cta.href} target={cta.external ? "_blank" : undefined} rel={cta.external ? "noreferrer" : undefined}>
              {cta.label}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          )}
        </div>
        <aside className={`page-hero-aside ${tone}`}>
          <p className="mono">EN ESTA RUTA</p>
          <h2>{asideTitle}</h2>
          <ul className="aside-list">
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>
      </div>
    </section>
  );
}
