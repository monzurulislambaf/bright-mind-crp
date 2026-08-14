"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ThemeName = "bright" | "bright-dark";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "bm-theme";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ThemeName {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "bright" || stored === "bright-dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "bright-dark"
    : "bright";
}

function getServerSnapshot(): ThemeName {
  return "bright";
}

function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme =
    theme === "bright-dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  // After hydration, re-apply the persisted/system theme so the toggle state
  // and the page colours can never diverge (e.g. if the inline init script in
  // the root layout was skipped or ran before localStorage was readable).
  useEffect(() => {
    applyTheme(getSnapshot());
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    // Read the live value (localStorage/system) rather than the possibly
    // stale `theme` closure, so rapid clicks always alternate correctly.
    setTheme(getSnapshot() === "bright" ? "bright-dark" : "bright");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, mounted }),
    [theme, setTheme, toggleTheme, mounted]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
