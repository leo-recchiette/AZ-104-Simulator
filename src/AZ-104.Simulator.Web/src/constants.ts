import type { DrawMode } from "./types/question";

/** Scala e soglia dell'esame reale: si supera con 700 su 1000. */
export const MAX_SCORE = 1000;
export const PASS_MARK_SCORE = 700;

/** Come si scrive un vendor: la chiave e' il nome della sua cartella. Senza voce, il nome con l'iniziale maiuscola. */
export const VENDOR_LABELS: Record<string, string> = { hashicorp: "HashiCorp", microsoft: "Microsoft" };

/** Default dei setup: la Practice serve a coprire il bank, la Simulation a riprodurre l'esame. */
export const PRACTICE_DEFAULT_DRAW_MODE: DrawMode = "least_seen";
export const SIMULATION_DEFAULT_DRAW_MODE: DrawMode = "random";
