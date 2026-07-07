"use client";

import {
  IconButton,
  Inline,
  MoonIcon,
  SunIcon,
  type InlineProps,
} from "@pixxl-tools/components";
import messages from "../messages/en.json";
import { useSitePreferences, type Theme } from "./SiteProviders";

type NavControlsProps = {
  justify?: InlineProps["justify"];
};

export default function NavControls({ justify = "end" }: NavControlsProps) {
  const { setTheme, theme } = useSitePreferences();
  const themeTarget: Theme = theme === "dark" ? "light" : "dark";
  const label =
    themeTarget === "dark"
      ? messages.theme.switchToDark
      : messages.theme.switchToLight;

  const handleThemeToggle = () => {
    setTheme(themeTarget);
  };

  return (
    <Inline gap="sm" justify={justify} wrap={false}>
      <IconButton
        label={label}
        onClick={handleThemeToggle}
        pressed={theme === "dark"}
        size="sm"
        title={theme === "dark" ? messages.theme.darkMode : messages.theme.lightMode}
        variant="outline"
      >
        {themeTarget === "dark" ? <MoonIcon size="sm" /> : <SunIcon size="sm" />}
      </IconButton>
    </Inline>
  );
}
