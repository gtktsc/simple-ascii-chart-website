"use client";

import { PixxlProvider } from "@pixxl-tools/components";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const THEME_COOKIE_NAME = "theme";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export type Theme = "light" | "dark";

type SitePreferences = {
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

type SiteProvidersProps = {
  children: ReactNode;
};

const SitePreferencesContext = createContext<SitePreferences | null>(null);
const themeListeners = new Set<() => void>();
let currentTheme: Theme = "light";

const isTheme = (value: string | null | undefined): value is Theme =>
  value === "light" || value === "dark";

const getSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`;
};

const readCookieTheme = (): Theme | null => {
  const cookieTheme = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${THEME_COOKIE_NAME}=`))
    ?.split("=")[1];

  return isTheme(cookieTheme) ? cookieTheme : null;
};

const readPreferredTheme = (): Theme => {
  const storedTheme = localStorage.getItem(THEME_COOKIE_NAME);

  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return readCookieTheme() ?? getSystemTheme();
};

const emitThemeChange = () => {
  themeListeners.forEach((listener) => listener());
};

const subscribeToTheme = (listener: () => void) => {
  themeListeners.add(listener);

  return () => {
    themeListeners.delete(listener);
  };
};

const getThemeSnapshot = () => currentTheme;
const getServerThemeSnapshot = (): Theme => "light";

const applyTheme = (nextTheme: Theme, persist = false) => {
  currentTheme = nextTheme;

  if (persist) {
    localStorage.setItem(THEME_COOKIE_NAME, nextTheme);
    setCookie(THEME_COOKIE_NAME, nextTheme);
  }

  emitThemeChange();
};

export function SiteProviders({ children }: SiteProvidersProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyTheme(readPreferredTheme());
  }, []);

  const preferences = useMemo<SitePreferences>(
    () => ({
      setTheme: (nextTheme) => {
        applyTheme(nextTheme, true);
      },
      theme,
    }),
    [theme],
  );

  return (
    <SitePreferencesContext.Provider value={preferences}>
      <PixxlProvider
        direction="ltr"
        locale="en-US"
        theme={theme}
        themeAttribute="data-theme"
      >
        {children}
      </PixxlProvider>
    </SitePreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  const context = useContext(SitePreferencesContext);

  if (!context) {
    throw new Error("useSitePreferences must be used inside SiteProviders");
  }

  return context;
}
