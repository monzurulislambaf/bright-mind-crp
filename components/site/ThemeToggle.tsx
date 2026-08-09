"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/site/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "bright-dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-ghost btn-square btn-sm ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {mounted ? (
        isDark ? (
          <SunIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MoonIcon className="h-5 w-5" aria-hidden="true" />
        )
      ) : (
        <span className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
