import { useEffect, useState } from "react";
import { getScore } from "../api/results";
import type { AnswerSubmissionDto } from "../types/answer";

// Debounce: le hotspot si compilano una riga alla volta.
const LIVE_SCORE_DELAY_MS = 400;

/**
 * La percentuale che darebbe l'invio adesso: stessa getScore e stesse submission di handleFinish,
 * cosi' non puo' divergere dal risultato finale. null = niente da valutare o disattivato. Dato
 * derivato, non stato di sessione: fuori dal SessionContext e mai salvato.
 */
export function useLiveScore(submissions: AnswerSubmissionDto[] | null): number | null {
  const [percentage, setPercentage] = useState<number | null>(null);
  const active = submissions !== null && submissions.length > 0;

  useEffect(() => {
    if (!submissions || submissions.length === 0) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      getScore(submissions)
        .then((score) => {
          if (!cancelled) setPercentage(score.percentage);
        })
        .catch((err) => console.error("Impossibile aggiornare il punteggio:", err));
    }, LIVE_SCORE_DELAY_MS);
    // Una risposta arrivata in ritardo non deve sovrascrivere quella di una submission piu' recente.
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [submissions]);

  return active ? percentage : null;
}
