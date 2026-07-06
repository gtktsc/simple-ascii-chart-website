"use client";

import Image from "next/image";
import { useSitePreferences } from "./SiteProviders";

type AboutDemoImageProps = {
  alt: string;
};

export default function AboutDemoImage({ alt }: AboutDemoImageProps) {
  const { theme } = useSitePreferences();
  const src =
    theme === "dark" ? "/about-demo-dark.gif" : "/about-demo-light.gif";

  return (
    <Image
      alt={alt}
      className="about-demo-image"
      height={360}
      loading="eager"
      src={src}
      unoptimized
      width={640}
    />
  );
}
