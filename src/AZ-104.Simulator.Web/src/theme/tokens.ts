export interface ThemeTokens {
  bg: string;
  card: string;
  bd: string;
  bd2: string;
  bd3: string;
  tx: string;
  tx2: string;
  mu: string;
  fa: string;
  fa2: string;
  ac: string;
  acs: string;
  ok: string;
  okbg: string;
  okbd: string;
  er: string;
  erbg: string;
  erbd: string;
  sub: string;
  sh: string;
  head: string;
  track: string;
  dis: string;
  warn: string;
  warnbg: string;
  warnbd: string;
  /** Banner dell'header di sessione, risultati e storico. */
  header: string;
  /** Sfondo decorativo del catalogo e della pagina della certificazione. */
  modeBg: string;
  /** Titolo della pagina della certificazione. */
  hero: string;
  /** I due aloni sfocati dietro la pagina della certificazione. */
  glowA: string;
  glowB: string;
}

export const LIGHT: ThemeTokens = {
  bg: "#f4f3ef", card: "#ffffff", bd: "#e3e1dc", bd2: "#eeece7", bd3: "#ddd9d2",
  tx: "#17181a", tx2: "#3d4147", mu: "#6b6f76", fa: "#8a8f97", fa2: "#9aa0a7",
  ac: "#1f6feb", acs: "#eaf1fe", ok: "#147a4b", okbg: "#f2faf6", okbd: "#cfe6da",
  er: "#b3261e", erbg: "#fdf5f4", erbd: "#f0d4d1", sub: "#fbfaf8",
  sh: "rgba(20,22,26,.06)", head: "rgba(244,243,239,.94)", track: "#e7e5e0", dis: "#b9bcc1",
  warn: "#7a5c00", warnbg: "#fdf6e3", warnbd: "#e0a800",
  header: "linear-gradient(135deg,#2b7cf6,#0b3fae)",
  modeBg:
    "radial-gradient(circle at 10% -10%, rgba(0,120,212,.10), transparent 45%), radial-gradient(circle at 100% 15%, rgba(80,230,255,.10), transparent 40%)",
  hero: "linear-gradient(90deg,#0078d4,#50e6ff)",
  glowA: "rgba(0,120,212,.32)",
  glowB: "rgba(80,230,255,.18)",
};

export const DARK: ThemeTokens = {
  bg: "#141517", card: "#1c1e21", bd: "#2c2f34", bd2: "#26292d", bd3: "#3a3e44",
  tx: "#f0efec", tx2: "#c9ccd1", mu: "#9aa0a7", fa: "#82878e", fa2: "#71767d",
  ac: "#5b9bff", acs: "#16283f", ok: "#4cc38a", okbg: "#12241b", okbd: "#22503a",
  er: "#f0736a", erbg: "#2a1614", erbd: "#5a2620", sub: "#1f2225",
  sh: "rgba(0,0,0,.45)", head: "rgba(20,21,23,.94)", track: "#2c2f34", dis: "#5a5f66",
  warn: "#e8c46a", warnbg: "#2a2313", warnbd: "#7a6420",
  header: "linear-gradient(135deg,#123a7a,#061638)",
  modeBg:
    "radial-gradient(circle at 10% -10%, rgba(0,120,212,.16), transparent 45%), radial-gradient(circle at 100% 15%, rgba(80,230,255,.08), transparent 40%)",
  hero: "linear-gradient(90deg,#0078d4,#50e6ff)",
  glowA: "rgba(0,120,212,.32)",
  glowB: "rgba(80,230,255,.18)",
};

type VendorTokens = Pick<ThemeTokens, "ac" | "acs" | "header" | "modeBg" | "hero" | "glowA" | "glowB">;

/**
 * I colori di un vendor sopra il tema, nelle pagine delle sue certificazioni (vedi VendorTheme). La chiave e' il
 * nome della cartella del vendor; senza voce restano quelli di base, i blu di Azure.
 */
export const VENDOR_TOKENS: Record<string, { light: VendorTokens; dark: VendorTokens }> = {
  // Il viola di Terraform.
  hashicorp: {
    light: {
      ac: "#7b42bc",
      acs: "#f3ecfb",
      header: "linear-gradient(135deg,#8f5ad6,#4c1d95)",
      modeBg:
        "radial-gradient(circle at 10% -10%, rgba(123,66,188,.12), transparent 45%), radial-gradient(circle at 100% 15%, rgba(186,140,255,.12), transparent 40%)",
      hero: "linear-gradient(90deg,#7b42bc,#c39bff)",
      glowA: "rgba(123,66,188,.32)",
      glowB: "rgba(186,140,255,.20)",
    },
    dark: {
      ac: "#a77be0",
      acs: "#2a1d3d",
      header: "linear-gradient(135deg,#3b1d6e,#170a33)",
      modeBg:
        "radial-gradient(circle at 10% -10%, rgba(123,66,188,.20), transparent 45%), radial-gradient(circle at 100% 15%, rgba(186,140,255,.08), transparent 40%)",
      hero: "linear-gradient(90deg,#9a63dc,#c39bff)",
      glowA: "rgba(123,66,188,.32)",
      glowB: "rgba(186,140,255,.18)",
    },
  },
};
