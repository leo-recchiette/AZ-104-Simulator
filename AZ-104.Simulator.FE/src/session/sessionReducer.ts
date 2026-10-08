import type { DrawMode, QuestionDto } from "../types/question";
import type { AnswerCheckResultDto, ExamScoreDto } from "../types/answer";
import { leadingUnitSize } from "../utils/groups";

export type SessionMode = "practice" | "exam";

export interface SessionState {
  mode: SessionMode | null;
  questions: QuestionDto[];
  currentIndex: number;
  /** Per questionNumber. */
  answers: Record<number, string[]>;
  /** Se una entry esiste, la domanda e' stata rivelata. */
  checkResults: Record<number, AnswerCheckResultDto>;
  /** Per indice in questions, non per questionNumber. */
  flags: Record<number, boolean>;
  timeLimitSeconds: number | null;
  /** Sempre false in Simulation. */
  autoReveal: boolean;
  /** Practice a oltranza: questions cresce di un'unita' alla volta, si valuta solo cio' che ha risposta. */
  openEnded: boolean;
  /** Le domande ancora da proporre a oltranza. null dopo un ripristino: non si salva, va ripescato. */
  pool: QuestionDto[] | null;
  /**
   * Percentuale che darebbe l'invio adesso, nell'header. Solo con autoReveal: senza, svelerebbe le
   * risposte prima della soluzione. Sempre false in Simulation.
   */
  liveScore: boolean;
  /** Scelto nel setup; la Practice a oltranza lo riusa per ripescare il bank dopo un ripristino. */
  drawMode: DrawMode;
  startedAt: number | null;
  status: "idle" | "in-progress" | "finished";
  score: ExamScoreDto | null;
  /** Congelato all'invio: la pagina risultati non lo ricalcola. */
  timeUsedSeconds: number | null;
  /** Esito del salvataggio nello storico da mostrare nei risultati; null se e' andato bene. */
  historyOutcome: "discarded" | "failed" | null;
}

export type SessionAction =
  | { type: "START_SESSION"; mode: SessionMode; drawMode: DrawMode; questions: QuestionDto[]; timeLimitSeconds: number | null; autoReveal?: boolean; openEnded?: boolean; liveScore?: boolean }
  | { type: "RESTORE_SESSION"; state: SessionState }
  | { type: "SET_ANSWER"; questionNumber: number; answer: string[] }
  | { type: "GO_NEXT" }
  | { type: "GO_PREVIOUS" }
  | { type: "GO_TO"; index: number }
  | { type: "SET_POOL"; questions: QuestionDto[] }
  | { type: "SET_CHECK_RESULT"; questionNumber: number; result: AnswerCheckResultDto }
  | { type: "SET_AUTO_REVEAL"; autoReveal: boolean }
  | { type: "SET_LIVE_SCORE"; liveScore: boolean }
  | { type: "TOGGLE_FLAG"; index: number }
  /** questions: quelle valutate. A oltranza sono meno di quelle proposte. */
  | { type: "FINISH_SESSION"; score: ExamScoreDto; timeUsedSeconds: number; questions: QuestionDto[] }
  | { type: "SET_HISTORY_OUTCOME"; outcome: "discarded" | "failed" }
  | { type: "RESET" };

export const initialSessionState: SessionState = {
  mode: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  checkResults: {},
  flags: {},
  timeLimitSeconds: null,
  autoReveal: false,
  openEnded: false,
  pool: null,
  liveScore: false,
  drawMode: "random",
  startedAt: null,
  status: "idle",
  score: null,
  timeUsedSeconds: null,
  historyOutcome: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "START_SESSION": {
      const openEnded = action.mode === "practice" && !!action.openEnded;
      // A oltranza arriva l'intero bank: si parte dalla prima unita', il resto aspetta nel pool.
      const shown = openEnded ? leadingUnitSize(action.questions) : action.questions.length;
      return {
        ...initialSessionState,
        mode: action.mode,
        questions: action.questions.slice(0, shown),
        timeLimitSeconds: action.timeLimitSeconds,
        autoReveal: action.mode === "practice" && !!action.autoReveal,
        openEnded,
        pool: openEnded ? action.questions.slice(shown) : null,
        liveScore: action.mode === "practice" && !!action.autoReveal && !!action.liveScore,
        drawMode: action.drawMode,
        startedAt: Date.now(),
        status: "in-progress",
      };
    }

    case "RESTORE_SESSION":
      return action.state;

    case "SET_ANSWER": {
      // Una rivelazione non sopravvive a un cambio di risposta.
      const checkResults = { ...state.checkResults };
      delete checkResults[action.questionNumber];
      return {
        ...state,
        answers: { ...state.answers, [action.questionNumber]: action.answer },
        checkResults,
      };
    }

    case "GO_NEXT": {
      const atEnd = state.currentIndex === state.questions.length - 1;
      if (atEnd && state.openEnded && state.pool?.length) {
        const size = leadingUnitSize(state.pool);
        return {
          ...state,
          questions: [...state.questions, ...state.pool.slice(0, size)],
          pool: state.pool.slice(size),
          currentIndex: state.questions.length,
        };
      }
      return { ...state, currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1) };
    }

    case "GO_PREVIOUS":
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };

    case "GO_TO":
      return { ...state, currentIndex: Math.min(Math.max(action.index, 0), state.questions.length - 1) };

    // Il bank ripescato contiene anche le domande gia' proposte: non devono tornare, e nemmeno
    // un'altra variante di una gia' proposta (il ripescaggio puo' sceglierne una diversa).
    case "SET_POOL": {
      const shown = new Set(state.questions.map((q) => q.number));
      const shownVariants = new Set(state.questions.map((q) => q.variantGroup).filter(Boolean));
      return {
        ...state,
        pool: action.questions.filter(
          (q) => !shown.has(q.number) && !(q.variantGroup && shownVariants.has(q.variantGroup)),
        ),
      };
    }

    // Il punteggio live non sopravvive all'auto-reveal spento.
    case "SET_AUTO_REVEAL": {
      const autoReveal = state.mode === "practice" && action.autoReveal;
      return { ...state, autoReveal, liveScore: autoReveal && state.liveScore };
    }

    case "SET_LIVE_SCORE":
      return { ...state, liveScore: state.autoReveal && action.liveScore };

    case "SET_CHECK_RESULT":
      return {
        ...state,
        checkResults: { ...state.checkResults, [action.questionNumber]: action.result },
      };

    case "TOGGLE_FLAG":
      return {
        ...state,
        flags: { ...state.flags, [action.index]: !state.flags[action.index] },
      };

    case "FINISH_SESSION":
      return {
        ...state,
        status: "finished",
        questions: action.questions,
        // Gli indici si riferivano alle domande proposte, non a quelle valutate.
        currentIndex: 0,
        flags: {},
        score: action.score,
        timeUsedSeconds: action.timeUsedSeconds,
      };

    // Puo' arrivare a SessionPage gia' smontata: il context vive sopra le rotte.
    case "SET_HISTORY_OUTCOME":
      return { ...state, historyOutcome: action.outcome };

    case "RESET":
      return initialSessionState;

    default:
      return state;
  }
}
