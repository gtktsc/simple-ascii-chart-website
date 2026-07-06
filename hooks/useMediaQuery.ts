"use client";

import { useEffect, useState } from "react";

export const MOBILE_NAV_QUERY = "(max-width: 720px)";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setMatches(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
