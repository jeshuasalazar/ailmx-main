"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";

const links = [
  ["Academia", "/es/academia"],
  ["Consultoría", "/es/consultoria"],
  ["Contacto", "/es/contacto"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="nav-actions">
          <span className="locale-label" aria-label="Idioma actual: español">ES</span>
          <Link className="button button-primary" href="/es/contacto">Hablemos</Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegación móvil" hidden={!open}>
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href="/es/contacto" onClick={() => setOpen(false)}>Hablemos</Link>
      </nav>
    </header>
  );
}
