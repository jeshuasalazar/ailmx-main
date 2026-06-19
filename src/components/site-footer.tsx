import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand inverse />
            <p>Convertimos la inteligencia artificial en capacidades que las personas y los equipos pueden usar.</p>
          </div>
          <nav className="footer-links" aria-label="Oferta">
            <strong>Explora</strong>
            <Link href="/es/academia">Academia</Link>
            <Link href="/es/consultoria">Consultoría</Link>
            <Link href="/es/contacto">Contacto</Link>
          </nav>
          <nav className="footer-links" aria-label="Información legal">
            <strong>Legal</strong>
            <Link href="/es/legal/privacidad">Privacidad</Link>
            <Link href="/es/legal/terminos">Términos</Link>
            <Link href="/es/legal/cookies">Cookies</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} aiLearning</span>
          <span>Hecho en México · Disponible en español</span>
        </div>
      </div>
    </footer>
  );
}
