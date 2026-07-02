import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "aiLearning",
    short_name: "aiLearning",
    description:
      "Formación práctica y consultoría para convertir la inteligencia artificial en capacidades que tu equipo pueda usar.",
    start_url: "/es",
    display: "standalone",
    lang: "es",
    background_color: "#fbfaf6",
    theme_color: "#174f97",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
