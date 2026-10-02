import type { QuestionDto } from "./question";

/** Cio' che il client manda a PUT /api/sessions/current: la sessione in corso, senza il testo delle domande. */
export interface SaveActiveSessionDto {
  mode: "practice" | "exam";
  /** Nell'ordine di presentazione: per i gruppi non coincide con l'ordine dei numeri. */
  questionNumbers: number[];
  answers: Record<number, string[]>;
  /** Indici (in questionNumbers) delle domande marcate per la revisione. */
  flaggedIndexes: number[];
  currentIndex: number;
  timeLimitSeconds: number | null;
  autoReveal: boolean;
  /** Practice a oltranza: questionNumbers sono solo le domande proposte finora. */
  openEnded: boolean;
  /** Practice: percentuale dell'esame aggiornata a ogni risposta. */
  liveScore: boolean;
  /** ISO 8601, entrambi dall'orologio di questo client: la differenza e' il tempo gia' giocato. */
  startedAt: string;
  savedAt: string;
}

/** Quello che torna da GET: lo stato salvato, con le domande gia' ricostruite e in ordine. */
export interface ActiveSessionDto extends Omit<SaveActiveSessionDto, "questionNumbers"> {
  questions: QuestionDto[];
}
