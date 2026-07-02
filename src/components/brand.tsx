export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`brand${inverse ? " brand-inverse" : ""}`} href="/es" aria-label="aiLearning, inicio">
      <span className="brand-mark" aria-hidden="true">ai</span>
      <span>aiLearning</span>
    </a>
  );
}
