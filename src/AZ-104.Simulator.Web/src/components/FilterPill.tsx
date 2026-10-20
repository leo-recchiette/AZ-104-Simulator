import { useTheme } from "../theme/ThemeContext";

/** Filtro a pillola sopra un elenco di domande: review di fine sessione e storico. */
export function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  const { tokens: t } = useTheme();
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "8px 15px", borderRadius: 999, font: "inherit", fontSize: 13.5, fontWeight: 600,
        border: `1px solid ${active ? "transparent" : t.bd3}`,
        background: active ? t.ac : t.card, color: active ? "#fff" : t.tx2,
      }}
    >
      {label}
    </button>
  );
}
