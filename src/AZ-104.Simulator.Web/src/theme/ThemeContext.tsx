import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LIGHT, DARK, VENDOR_TOKENS, type ThemeTokens } from "./tokens";

type ThemeName = "light" | "dark";

const STORAGE_KEY = "az104-theme";

interface ThemeContextValue {
  theme: ThemeName;
  tokens: ThemeTokens;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeName | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function paintBody(tokens: ThemeTokens) {
  document.body.style.background = tokens.bg;
  document.body.style.color = tokens.tx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => readStoredTheme() ?? "light");
  const tokens = theme === "dark" ? DARK : LIGHT;

  useEffect(() => {
    paintBody(tokens);
  }, [tokens]);

  function toggleTheme() {
    const next: ThemeName = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage non disponibile: il tema resta comunque valido per la sessione corrente.
    }
    setTheme(next);
  }

  return <ThemeContext.Provider value={{ theme, tokens, toggleTheme }}>{children}</ThemeContext.Provider>;
}

/** Nelle pagine di una certificazione: i colori del suo vendor sopra il tema (VENDOR_TOKENS). */
export function VendorTheme({ vendor, children }: { vendor: string; children: ReactNode }) {
  const base = useTheme();
  const vendorTokens = VENDOR_TOKENS[vendor]?.[base.theme];
  const value = useMemo(() => (vendorTokens ? { ...base, tokens: { ...base.tokens, ...vendorTokens } } : base), [base, vendorTokens]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve essere usato dentro un ThemeProvider");
  return ctx;
}
