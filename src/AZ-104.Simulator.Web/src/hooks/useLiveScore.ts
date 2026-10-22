import { useEffect, useState } from "react";
import { getScore } from "../api/results";
import type { AnswerSubmissionDto } from "../types/answer";

// Debounce: le hotspot si compilano una riga alla volta.
const LIVE_SCORE_DELAY_MS = 400;

/**
 * Il punteggio che darebbe l'invio adesso: stessa getScore e stesse submission di handleFinish,
 * cosi' non puo' divergere. null = niente da valutare o disattivato. Mai nel SessionContext.
 */
export function useLiveScore(submissions: AnswerSubmissionDto[] | null): number | null {
  const [score, setScore] = useState<number | null>(null);
  const active = submissions !== null && submissions.length > 0;

  useEffect(() => {
    if (!submissions || submissions.length === 0) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      getScore(submissions)
        .then((result) => {
          if (!cancelled) setScore(result.score);
        })
        .catch((err) => console.error("Impossibile aggiornare il punteggio:", err));
    }, LIVE_SCORE_DELAY_MS);
    // Una risposta arrivata in ritardo non deve sovrascrivere quella di una submission piu' recente.
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [submissions]);

  return active ? score : null;
}
