import type { ReactNode } from "react";
import { useTheme } from "../theme/ThemeContext";

/** Riga dei setup: titolo e descrizione a sinistra, interruttore a destra. */
export function SwitchRow({ title, description, checked, onChange, disabled = false }: {
  title: string;
  description: ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  const { tokens: t } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 0", borderTop: `1px solid ${t.bd2}`, opacity: disabled ? 0.55 : 1 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: t.fa, marginTop: 2 }}>{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          width: 52, height: 30, borderRadius: 16, border: `1px solid ${checked ? t.ac : t.bd3}`,
          background: checked ? t.ac : t.track, position: "relative", padding: 0, transition: "background .18s",
          flexShrink: 0, cursor: disabled ? "default" : "pointer",
        }}
      >
        <span style={{ position: "absolute", top: 3, left: checked ? 26 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)", transition: "left .18s" }} />
      </button>
    </div>
  );
}
