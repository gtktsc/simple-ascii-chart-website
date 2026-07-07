import type { MetadataRoute } from "next";
import messages from "../messages/en.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#111923",
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "/android-chrome-192x192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/android-chrome-512x512.png",
        type: "image/png",
      },
    ],
    name: messages.metadata.applicationName,
    short_name: messages.metadata.manifestShortName,
    theme_color: "#111923",
  };
}
