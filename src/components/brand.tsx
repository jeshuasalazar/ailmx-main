import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className="brand" href="/es" aria-label="aiLearning, inicio" style={inverse ? { color: "white" } : undefined}>
      <span className="brand-mark" aria-hidden="true">ai</span>
      <span>aiLearning</span>
    </Link>
  );
}
