import { ThemeProvider, useTheme } from "next-themes";
import { createContext, useContext, useMemo } from "react";

const THEME_VALUES = ["partner-light", "partner-dark"] as const;

export type AppTheme = (typeof THEME_VALUES)[number];

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="partner-light"
      enableSystem={false}
      themes={[...THEME_VALUES]}
    >
      <ThemeBridge>{children}</ThemeBridge>
    </ThemeProvider>
  );
}

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  const value = useMemo<ThemeContextValue>(() => ({
    theme: (theme as AppTheme | undefined) ?? "partner-light",
    setTheme: (nextTheme) => setTheme(nextTheme),
  }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used inside <AppThemeProvider>");
  }
  return context;
}
