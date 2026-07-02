import { ImageResponse } from "next/og";

export const alt = "aiLearning — IA que se convierte en trabajo real";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#174f97",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              color: "#174f97",
              borderRadius: "50% 50% 50% 8px",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            ai
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em" }}>aiLearning</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              maxWidth: 900,
            }}
          >
            Menos ruido. Más capacidad.
          </div>
          <div style={{ fontSize: 32, color: "#cfe0f5", maxWidth: 880 }}>
            Formación práctica y consultoría en inteligencia artificial aplicada.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.4)",
            paddingTop: 24,
            fontSize: 24,
            color: "#cfe0f5",
          }}
        >
          <div>ailearning.mx</div>
          <div>HUMANO → SISTEMA → RESULTADO</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
