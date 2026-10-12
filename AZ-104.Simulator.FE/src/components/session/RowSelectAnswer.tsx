import { useTheme } from "../../theme/ThemeContext";
import type { PromptOptionsDto } from "../../types/question";
import type { AnswerRowDto } from "../../types/answer";
import { parseMultiValueAnswer } from "../../utils/grading";
import { isRowComplete } from "../../utils/questionShape";
import { QUESTION_FONT, QUESTION_FONT_FEATURES } from "../../theme/fonts";
import { PlaceholderText } from "../PlaceholderText";

interface RowSelectAnswerProps {
  prompts: PromptOptionsDto[];
  value: string[];
  onChange: (next: string[]) => void;
  answerRows?: AnswerRowDto[];
  answeredRowsOnly?: boolean;
  /** Per riga: si bloccano una alla volta, come si correggono. */
  lockedRows?: boolean[];
}

/** Le scelte di una riga, separate da "\n" e in ordine di selezione. */
function chosenLabels(raw: string | undefined): string[] {
  return raw ? raw.split("\n") : [];
}

export function RowSelectAnswer({ prompts, value, onChange, answerRows, answeredRowsOnly, lockedRows }: RowSelectAnswerProps) {
  const { tokens: t } = useTheme();

  // Al massimo limit scelte per riga, come MultipleChoiceAnswer: oltre, la nuova sostituisce la piu' vecchia.
  function pick(rowIndex: number, label: string, limit: number) {
    if (lockedRows?.[rowIndex]) return;
    const current = chosenLabels(value[rowIndex]);
    const next = [...value];
    if (limit === 1) next[rowIndex] = label;
    else next[rowIndex] = (current.includes(label) ? current.filter((l) => l !== label) : [...current, label].slice(-limit)).join("\n");
    onChange(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {prompts.map((row, ri) => {
        const chosen = chosenLabels(value[ri]);
        const rowAnswer = answerRows?.[ri]?.answer;
        const rawCorrect = answeredRowsOnly && !isRowComplete(value[ri], rowAnswer) ? undefined : rowAnswer;
        const correctSet =
          rawCorrect !== undefined ? new Set((parseMultiValueAnswer(rawCorrect) ?? [rawCorrect]).map((s) => s.toLowerCase())) : undefined;
        // Un'API non ancora aggiornata non manda selectCount: nessun tetto, come prima.
        const limit = row.selectCount > 0 ? row.selectCount : row.options.length;
        const single = limit === 1;
        const rowLocked = lockedRows?.[ri] ?? false;
        return (
          <div key={`${row.prompt}-${ri}`} style={{ border: `1px solid ${t.bd2}`, borderRadius: 12, padding: "16px 17px", background: t.sub }}>
            <div style={{ fontSize: 14.5, lineHeight: 1.5, marginBottom: 12, fontFamily: QUESTION_FONT, fontFeatureSettings: QUESTION_FONT_FEATURES }}>
              <PlaceholderText text={row.prompt} />
            </div>
            <div role={single ? "radiogroup" : "group"} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {row.options.map((label) => {
                const sel = chosen.includes(label);
                let bd = sel ? t.ac : t.bd3;
                let bg = sel ? t.acs : t.card;
                let fg = sel ? t.ac : t.tx2;
                let mark = "";
                if (correctSet !== undefined) {
                  if (correctSet.has(label.toLowerCase())) {
                    bd = t.ok; bg = t.okbg; fg = t.ok; mark = "  ✓";
                  } else if (sel) {
                    bd = t.er; bg = t.erbg; fg = t.er; mark = "  ✕";
                  }
                }
                return (
                  <button
                    key={label}
                    onClick={() => pick(ri, label, limit)}
                    role={single ? "radio" : "checkbox"}
                    aria-checked={sel}
                    aria-disabled={rowLocked || undefined}
                    style={{
                      padding: "9px 15px", borderRadius: 9, fontSize: 13.5, fontWeight: 500,
                      border: `1.5px solid ${bd}`, background: bg, color: fg, font: "inherit",
                      cursor: rowLocked ? "default" : "pointer",
                    }}
                  >
                    {label}
                    {mark}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
