import { useEffect, useCallback, useRef } from "react";
import { useThemeContext } from "./useTheme";

const THEME_STYLE_ID = "epub-theme-override";

const THEME_DEFINITIONS = {
  light: {
    body: {
      background: "#ffffff",
      color: "#0f172a",
      lineHeight: 1.7,
      fontFamily:
        "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
    },
    h1: { fontWeight: "700", letterSpacing: "0.02em" },
    "p, li": { margin: "0 0 1em" },
  },
  dark: {
    body: {
      background: "#111827",
      color: "#e5e7eb",
      lineHeight: 1.7,
      fontFamily:
        "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
    },
    a: { color: "#93c5fd" },
    h1: { fontWeight: "700", letterSpacing: "0.02em" },
    "p, li": { margin: "0 0 1em" },
  },
};

const IFRAME_CSS = {
  dark: `* { color: #e5e7eb !important; background-color: transparent !important; }
         body { background: #111827 !important; }
         a { color: #93c5fd !important; }`,
  light: `* { color: #0f172a !important; background-color: transparent !important; }
          body { background: #ffffff !important; }
          a { color: #2563eb !important; }`,
};

function applyThemeToContents(rendition, isDark) {
  try {
    rendition.getContents().forEach((content) => {
      const doc = content?.document;
      if (!doc) return;

      if (doc.body) {
        doc.body.style.background = isDark ? "#111827" : "#ffffff";
      }

      let styleEl = doc.getElementById(THEME_STYLE_ID);
      if (!styleEl) {
        styleEl = doc.createElement("style");
        styleEl.id = THEME_STYLE_ID;
        doc.head?.appendChild(styleEl);
      }
      styleEl.textContent = isDark ? IFRAME_CSS.dark : IFRAME_CSS.light;
    });
  } catch {
    // Silently ignore if iframe contents are not accessible
  }
}

const useEpubTheme = (renditionRef) => {
  const { theme } = useThemeContext();

  const resolveTheme = useCallback(() => {
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }, [theme]);

  const resolvedThemeRef = useRef(resolveTheme());

  const registerThemes = useCallback((rendition) => {
    rendition.themes.register("light", THEME_DEFINITIONS.light);
    rendition.themes.register("dark", THEME_DEFINITIONS.dark);
    rendition.themes.fontSize("110%");
  }, []);

  useEffect(() => {
    resolvedThemeRef.current = resolveTheme();
    const rendition = renditionRef.current;
    if (!rendition) return;

    const isDark = resolvedThemeRef.current === "dark";
    rendition.themes.select(resolvedThemeRef.current);
    applyThemeToContents(rendition, isDark);
  }, [resolveTheme, renditionRef]);

  const applyCurrentTheme = useCallback(
    (rendition) => {
      const isDark = resolvedThemeRef.current === "dark";
      rendition.themes.select(resolvedThemeRef.current);
      applyThemeToContents(rendition, isDark);
    },
    [],
  );

  return {
    resolvedTheme: resolvedThemeRef,
    registerThemes,
    applyCurrentTheme,
  };
};

export default useEpubTheme;
