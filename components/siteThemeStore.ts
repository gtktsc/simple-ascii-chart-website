export const THEME_COOKIE_NAME = "theme";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type Theme = "light" | "dark";

const themeListeners = new Set<() => void>();
let currentTheme: Theme = "light";

export const isTheme = (value: string | null | undefined): value is Theme =>
  value === "light" || value === "dark";

const getSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${THEME_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

const readCookieTheme = (): Theme | null => {
  const cookieTheme = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${THEME_COOKIE_NAME}=`))
    ?.split("=")[1];

  return isTheme(cookieTheme) ? cookieTheme : null;
};

export const readPreferredTheme = (): Theme => {
  const storedTheme = localStorage.getItem(THEME_COOKIE_NAME);

  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return readCookieTheme() ?? getSystemTheme();
};

const emitThemeChange = () => {
  themeListeners.forEach((listener) => listener());
};

export const subscribeToTheme = (listener: () => void) => {
  themeListeners.add(listener);

  return () => {
    themeListeners.delete(listener);
  };
};

export const getThemeSnapshot = () => currentTheme;
export const getServerThemeSnapshot = (): Theme => "light";

export const applyTheme = (nextTheme: Theme, persist = false) => {
  currentTheme = nextTheme;

  if (persist) {
    localStorage.setItem(THEME_COOKIE_NAME, nextTheme);
    setCookie(THEME_COOKIE_NAME, nextTheme);
  }

  emitThemeChange();
};
