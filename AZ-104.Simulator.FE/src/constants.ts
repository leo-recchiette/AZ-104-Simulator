import type { DrawMode } from "./types/question";

/** EXAM_QUESTION_COUNT conta unita', non domande: un gruppo torna intero e le domande sono di piu'. */
export const EXAM_QUESTION_COUNT = 54;
export const EXAM_TIME_LIMIT_MINUTES = 100;
export const EXAM_TIME_LIMIT_SECONDS = EXAM_TIME_LIMIT_MINUTES * 60;

/** Soglia di superamento: combacia con quella reale dell'esame AZ-104 (700/1000). */
export const PASS_MARK_PERCENT = 70;

export const MAX_QUESTION_COUNT = 584;

/** Default dei setup: la Practice serve a coprire il bank, la Simulation a riprodurre l'esame. */
export const PRACTICE_DEFAULT_DRAW_MODE: DrawMode = "least_seen";
export const SIMULATION_DEFAULT_DRAW_MODE: DrawMode = "random";
