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
            <a href="/es/academia">Academia</a>
            <a href="/es/consultoria">Consultoría</a>
            <a href="/es/contacto">Contacto</a>
          </nav>
          <nav className="footer-links" aria-label="Información legal">
            <strong>Legal</strong>
            <a href="/es/legal/privacidad">Privacidad</a>
            <a href="/es/legal/terminos">Términos</a>
            <a href="/es/legal/cookies">Cookies</a>
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
