import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de privacidad de aiLearning conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).",
};

export default function Privacidad() {
  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "64px 24px 96px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.7,
        color: "#1f2d42",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: 8 }}>
        Aviso de Privacidad
      </h1>
      <p style={{ color: "#6b7484", marginBottom: 32 }}>
        Última actualización: 19 de junio de 2026
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 28 }}>
        1. Responsable
      </h2>
      <p>
        aiLearning es responsable del tratamiento de tus datos personales. Para
        cualquier asunto relacionado con este aviso puedes escribirnos a{" "}
        <a href="mailto:hola@ailearning.mx">hola@ailearning.mx</a>.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 28 }}>
        2. Datos que recabamos
      </h2>
      <p>
        Recabamos los datos que nos proporcionas de forma voluntaria a través de
        nuestros formularios: nombre, correo electrónico y, opcionalmente,
        número de WhatsApp y país.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 28 }}>
        3. Finalidades
      </h2>
      <p>
        Utilizamos tus datos para: darte acceso a los recursos y contenidos
        solicitados, contactarte respecto a nuestros servicios de formación y
        consultoría, y enviarte comunicaciones relacionadas. No compartimos tus
        datos con terceros con fines de mercadotecnia ajenos a aiLearning.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 28 }}>
        4. Derechos ARCO
      </h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de Acceso,
        Rectificación, Cancelación u Oposición (ARCO), así como revocar tu
        consentimiento, escribiendo a{" "}
        <a href="mailto:hola@ailearning.mx">hola@ailearning.mx</a>.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 28 }}>
        5. Conservación y seguridad
      </h2>
      <p>
        Conservamos tus datos únicamente durante el tiempo necesario para las
        finalidades descritas y aplicamos medidas de seguridad razonables para
        protegerlos. Este aviso se rige por la Ley Federal de Protección de
        Datos Personales en Posesión de los Particulares (LFPDPPP).
      </p>

      <p style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: "#2d88e8", textDecoration: "none" }}>
          ← Volver al inicio
        </Link>
      </p>
    </main>
  );
}
