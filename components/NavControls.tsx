"use client";

import { IconButton, MoonIcon, SunIcon } from "@pixxl-tools/components";
import { useSitePreferences, type Theme } from "./SiteProviders";

export default function NavControls() {
  const { setTheme, theme } = useSitePreferences();
  const themeTarget: Theme = theme === "dark" ? "light" : "dark";
  const label =
    themeTarget === "dark" ? "Switch to dark mode" : "Switch to light mode";

  const handleThemeToggle = () => {
    setTheme(themeTarget);
  };

  return (
    <IconButton
      label={label}
      onClick={handleThemeToggle}
      pressed={theme === "dark"}
      size="sm"
      title={theme === "dark" ? "Dark mode" : "Light mode"}
      variant="outline"
    >
      {themeTarget === "dark" ? <MoonIcon size="sm" /> : <SunIcon size="sm" />}
    </IconButton>
  );
}
