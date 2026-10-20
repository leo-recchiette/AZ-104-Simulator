import { useTheme } from "../../theme/ThemeContext";

export function WrongBadge() {
  const { tokens: t } = useTheme();
  return (
    <span
      title="Answered incorrectly"
      style={{
        flex: "none", fontSize: 10.5, lineHeight: 1, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
        padding: "3px 7px", borderRadius: 6, color: t.er, background: t.erbg, border: `1px solid ${t.erbd}`,
      }}
    >
      Wrong
    </span>
  );
}
