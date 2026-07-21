"use client";

import { PixxlProvider } from "@pixxl-tools/components";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { PIXEL_SITE_LOCALE } from "../lib/siteConstants";
import messages from "../messages/en.json";
import type { Theme } from "./siteThemeStore";
import { usePersistentLibraryVersion } from "./usePersistentLibraryVersion";
import { usePersistentTheme } from "./usePersistentTheme";

export type { Theme } from "./siteThemeStore";

type SitePreferences = {
  libraryVersion: string;
  setLibraryVersion: (version: string) => void;
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

type SiteProvidersProps = {
  children: ReactNode;
};

const SitePreferencesContext = createContext<SitePreferences | null>(null);

export function SiteProviders({ children }: SiteProvidersProps) {
  const { libraryVersion, setLibraryVersion } = usePersistentLibraryVersion();
  const { setTheme, theme } = usePersistentTheme();

  const preferences = useMemo<SitePreferences>(
    () => ({
      libraryVersion,
      setLibraryVersion,
      setTheme,
      theme,
    }),
    [libraryVersion, setLibraryVersion, setTheme, theme],
  );

  return (
    <SitePreferencesContext.Provider value={preferences}>
      <PixxlProvider
        direction="ltr"
        locale={PIXEL_SITE_LOCALE}
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
    throw new Error(messages.sitePreferences.errors.missingProvider);
  }

  return context;
}
