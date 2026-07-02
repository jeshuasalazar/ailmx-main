import { Brand } from "./brand";

const links = [
  ["Academia", "/es/academia"],
  ["Consultoría", "/es/consultoria"],
  ["Contacto", "/es/contacto"],
] as const;

function MenuIcon() {
  return <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
}

function CloseIcon() {
  return <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function SiteHeader({ pathname }: { pathname: string }) {
  const current = (href: string) => pathname === href ? "page" as const : undefined;

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(([label, href]) => <a key={href} href={href} aria-current={current(href)}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <span className="locale-label" aria-label="Idioma actual: español">ES</span>
          <a className="button button-primary" href="/es/contacto">Hablemos</a>
          <button className="menu-toggle" type="button" popoverTarget="mobile-navigation" aria-label="Abrir menú">
            <MenuIcon />
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegación móvil" popover="auto">
        <div className="mobile-nav-head">
          <span className="mono">NAVEGACIÓN</span>
          <button className="menu-toggle" type="button" popoverTarget="mobile-navigation" popoverTargetAction="hide" aria-label="Cerrar menú"><CloseIcon /></button>
        </div>
        {links.map(([label, href], index) => <a key={href} href={href} aria-current={current(href)} autoFocus={index === 0}>{label}</a>)}
        <a href="/es/contacto">Hablemos</a>
      </nav>
    </header>
  );
}
