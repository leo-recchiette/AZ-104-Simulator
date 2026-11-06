/** I pulsanti larghi affiancati in fondo a dialoghi e risultati. */
export function wideButtonStyle(border: string, bg: string, fg: string) {
  return {
    flex: 1, minWidth: 160, padding: 14, borderRadius: 11, border, background: bg,
    fontSize: 14.5, fontWeight: 600, color: fg,
  } as const;
}
