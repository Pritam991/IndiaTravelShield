import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IndiaTravelShield",
    short_name: "TravelShield",
    description:
      "Travel guides, entry requirements and logistics for international visitors to India.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0b6b57",
    icons: [{ src: "/logo.png", type: "image/png" }],
  };
}
