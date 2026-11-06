import type { DrawMode } from "../types/question";
import { SwitchRow } from "./SwitchRow";

/** Riga dei setup: acceso pesca prima le domande viste meno, spento pesca a caso. */
export function DrawModeToggle({ value, onChange }: { value: DrawMode; onChange: (next: DrawMode) => void }) {
  const on = value === "least_seen";
  return (
    <SwitchRow
      title="Least-seen questions first"
      description={
        on
          ? "Draws first from the questions your saved sessions have shown least"
          : "Every question has the same chance, whatever came up in past sessions"
      }
      checked={on}
      onChange={(next) => onChange(next ? "least_seen" : "random")}
    />
  );
}
