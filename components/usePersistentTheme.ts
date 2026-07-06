"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  readPreferredTheme,
  subscribeToTheme,
  type Theme,
} from "./siteThemeStore";

export function usePersistentTheme() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyTheme(readPreferredTheme());
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme, true);
  }, []);

  return { setTheme, theme };
}
