import type { DrawMode, QuestionDto } from "./question";

export interface AnswerSubmissionDto {
  questionNumber: number;
  userAnswers: string[];
}

export interface AnswerRowDto {
  prompt: string | null;
  answer: string;
}

export interface QuestionAnswerDto {
  number: number;
  explanation: string;
  answerText: string;
  note: string | null;
  correctLetters: string[];
  answerRows: AnswerRowDto[];
  /** Solo dopo la rivelazione. */
  images: string[];
}

export interface AnswerCheckResultDto {
  questionNumber: number;
  userAnswers: string[];
  correctAnswer: QuestionAnswerDto | null;
}

export interface ExamScoreDto {
  /** Su MAX_SCORE. */
  score: number;
}

export interface SaveExamAttemptDto {
  mode: "practice" | "exam";
  drawMode: DrawMode;
  questionCount: number;
  score: number;
  /** ISO 8601. */
  startTime: string;
  /** ISO 8601. */
  endTime: string;
  /** Tutte le domande, in ordine, anche quelle lasciate in bianco. */
  answers: AnswerSubmissionDto[];
  /** Numeri di domanda. */
  studyLaterQuestions: number[];
}

export interface ExamAttemptDto {
  id: number;
  mode: "practice" | "exam";
  /** "random" anche per i tentativi salvati prima che si potesse scegliere: si pescava sempre a caso. */
  drawMode: DrawMode;
  questionCount: number;
  score: number;
  startTime: string;
  endTime: string;
  completedAt: string;
}

/** question e correctAnswer sono null se la domanda non esiste piu' dopo un reimport. */
export interface AttemptAnswerDto {
  questionNumber: number;
  userAnswers: string[];
  question: QuestionDto | null;
  correctAnswer: QuestionAnswerDto | null;
  studyLater: boolean;
}

export interface ExamAttemptDetailDto {
  attempt: ExamAttemptDto;
  answers: AttemptAnswerDto[];
}
