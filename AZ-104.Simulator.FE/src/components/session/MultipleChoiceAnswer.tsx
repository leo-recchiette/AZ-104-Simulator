import { useTheme } from "../../theme/ThemeContext";
import type { OptionDto } from "../../types/question";
import { gradeMultipleChoice } from "../../utils/grading";

interface MultipleChoiceAnswerProps {
  options: OptionDto[];
  /** Quante lettere si possono scegliere: 1 = radio. */
  selectCount: number;
  value: string[];
  onChange: (next: string[]) => void;
  /** Solo dopo la rivelazione. */
  correctLetters?: string[];
  locked?: boolean;
}

/**
 * Al massimo selectCount scelte: senza tetto, scegliere tutte le opzioni prenderebbe sempre ogni
 * punto, perche' le lettere in piu' non tolgono nulla. Oltre il tetto la nuova scelta sostituisce
 * la piu' vecchia: value e' in ordine di selezione.
 */
export function MultipleChoiceAnswer({ options, selectCount, value, onChange, correctLetters, locked }: MultipleChoiceAnswerProps) {
  const { tokens: t } = useTheme();
  const revealed = correctLetters !== undefined;
  const grades = revealed ? gradeMultipleChoice(value, correctLetters, options.map((o) => o.letter)) : null;
  // Un'API non ancora aggiornata non manda selectCount: nessun tetto, come prima.
  const limit = selectCount > 0 ? selectCount : options.length;
  const single = limit === 1;

  function choose(letter: string) {
    if (locked) return;
    if (single) {
      onChange([letter]);
      return;
    }
    onChange(value.includes(letter) ? value.filter((l) => l !== letter) : [...value, letter].slice(-limit));
  }

  return (
    <div role={single ? "radiogroup" : "group"} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 10 }}>
      {options.map((option) => {
        const grade = grades?.find((g) => g.letter === option.letter);
        const sel = value.includes(option.letter);
        let bd = sel ? t.ac : t.bd;
        let bg = sel ? t.acs : t.card;
        let mark = "";
        let markFg = t.ok;
        if (grade) {
          if (grade.correct) {
            bd = t.ok;
            bg = t.okbg;
            mark = grade.selected ? "Correct" : "Missed";
          } else if (grade.selected) {
            bd = t.er;
            bg = t.erbg;
            mark = "Incorrect";
            markFg = t.er;
          }
        }
        return (
          <button
            key={option.letter}
            onClick={() => choose(option.letter)}
            role={single ? "radio" : "checkbox"}
            aria-checked={sel}
            // aria-disabled: "disabled" farebbe decidere i colori allo user agent.
            aria-disabled={locked || undefined}
            style={{
              display: "flex", alignItems: "flex-start", gap: 14, textAlign: "left",
              padding: "15px 17px", borderRadius: 11, border: `1.5px solid ${bd}`, background: bg,
              color: "inherit", transition: "border-color .15s, background .15s", font: "inherit",
              cursor: locked ? "default" : "pointer",
            }}
          >
            <span
              style={{
                flex: "none", width: 26, height: 26, borderRadius: single ? 999 : 7, display: "grid", placeItems: "center",
                fontSize: 12.5, fontWeight: 700, background: sel ? t.ac : t.card, color: sel ? "#fff" : t.mu,
                border: `1.5px solid ${sel ? t.ac : t.bd3}`,
              }}
            >
              {option.letter}
            </span>
            <span style={{ fontSize: 15, lineHeight: 1.5, paddingTop: 3 }}>{option.text}</span>
            {mark && (
              <span style={{ flex: "none", marginLeft: "auto", fontSize: 13, fontWeight: 600, color: markFg, paddingTop: 4 }}>
                {mark}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
