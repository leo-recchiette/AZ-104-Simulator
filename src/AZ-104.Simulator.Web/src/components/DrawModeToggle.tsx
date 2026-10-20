import { useTheme } from "../theme/ThemeContext";
import type { DrawMode } from "../types/question";

/** Riga dei setup: acceso pesca prima le domande viste meno, spento pesca a caso. */
export function DrawModeToggle({ value, onChange }: { value: DrawMode; onChange: (next: DrawMode) => void }) {
  const { tokens: t } = useTheme();
  const on = value === "least_seen";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 0", borderTop: `1px solid ${t.bd2}` }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Least-seen questions first</div>
        <div style={{ fontSize: 12.5, color: t.fa, marginTop: 2 }}>
          {on
            ? "Draws first from the questions your saved sessions have shown least"
            : "Every question has the same chance, whatever came up in past sessions"}
        </div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label="Least-seen questions first"
        onClick={() => onChange(on ? "random" : "least_seen")}
        style={{
          width: 52, height: 30, borderRadius: 16, border: `1px solid ${on ? t.ac : t.bd3}`,
          background: on ? t.ac : t.track, position: "relative", padding: 0, transition: "background .18s",
          flexShrink: 0,
        }}
      >
        <span style={{ position: "absolute", top: 3, left: on ? 26 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)", transition: "left .18s" }} />
      </button>
    </div>
  );
}
