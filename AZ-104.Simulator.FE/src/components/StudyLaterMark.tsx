import { useTheme } from "../theme/ThemeContext";

/** Segnalibro pieno o vuoto: lo stesso disegno nel bottone della domanda e negli elenchi. */
export function BookmarkIcon({ filled, size = 12 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-6-4.5L6 21z" />
    </svg>
  );
}

/** Le domande da studiare dopo la sessione, uguale in sessione, risultati e storico. */
export function StudyLaterMark() {
  const { tokens: t } = useTheme();
  return (
    <span
      role="img"
      aria-label="Saved to study later"
      title="Saved to study later"
      style={{ flex: "none", display: "inline-flex", color: t.ac }}
    >
      <BookmarkIcon filled />
    </span>
  );
}
