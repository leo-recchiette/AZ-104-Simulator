import { createContext, useContext, useEffect, useRef, useState, useReducer, type Dispatch, type ReactNode } from "react";
import { initialSessionState, sessionReducer, type SessionAction, type SessionState } from "./sessionReducer";
import { deleteActiveSession, getActiveSession, saveActiveSession } from "../api/sessions";
import type { ActiveSessionDto, SaveActiveSessionDto } from "../types/session";

interface SessionContextValue {
  state: SessionState;
  dispatch: Dispatch<SessionAction>;
  /** Le rotte protette devono aspettare, altrimenti un reload rimanda alla home. */
  restoring: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const SAVE_DEBOUNCE_MS = 600;

function hasAnyAnswer(state: SessionState): boolean {
  return Object.values(state.answers).some((answer) => answer.some((value) => value && value.trim() !== ""));
}

function toSaveDto(state: SessionState): SaveActiveSessionDto | null {
  if (state.mode === null || state.startedAt === null || state.questions.length === 0) return null;
  return {
    mode: state.mode,
    questionNumbers: state.questions.map((q) => q.number),
    answers: state.answers,
    flaggedIndexes: Object.entries(state.flags)
      .filter(([, on]) => on)
      .map(([index]) => Number(index)),
    studyLaterQuestions: Object.entries(state.studyLater)
      .filter(([, on]) => on)
      .map(([number]) => Number(number)),
    currentIndex: state.currentIndex,
    timeLimitSeconds: state.timeLimitSeconds,
    autoReveal: state.autoReveal,
    openEnded: state.openEnded,
    liveScore: state.liveScore,
    drawMode: state.drawMode,
    startedAt: new Date(state.startedAt).toISOString(),
    // In pausa il tempo giocato si e' fermato a pausedAt, non adesso.
    savedAt: new Date(state.pausedAt ?? Date.now()).toISOString(),
  };
}

function fromDto(dto: ActiveSessionDto): SessionState {
  const flags: Record<number, boolean> = {};
  for (const index of dto.flaggedIndexes) flags[index] = true;
  const studyLater: Record<number, boolean> = {};
  // Un'API non ancora aggiornata non lo manda.
  for (const number of dto.studyLaterQuestions ?? []) studyLater[number] = true;

  // savedAt - startedAt e' il tempo giocato: riancorato ad adesso, l'app chiusa non consuma tempo.
  const playedMs = Math.max(0, new Date(dto.savedAt).getTime() - new Date(dto.startedAt).getTime());
  const now = Date.now();

  return {
    ...initialSessionState,
    mode: dto.mode,
    questions: dto.questions,
    currentIndex: Math.min(dto.currentIndex, Math.max(0, dto.questions.length - 1)),
    answers: dto.answers,
    flags,
    studyLater,
    timeLimitSeconds: dto.timeLimitSeconds,
    autoReveal: dto.autoReveal,
    openEnded: dto.openEnded,
    liveScore: dto.autoReveal && dto.liveScore,
    drawMode: dto.drawMode,
    startedAt: now - playedMs,
    // Col tempo contato si riparte in pausa: un reload a pagina incustodita (un tab ricaricato al
    // risveglio del portatile) non deve far correre il timer finche' non si torna davvero.
    pausedAt: dto.timeLimitSeconds !== null ? now : null,
    status: "in-progress",
  };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  const [restoring, setRestoring] = useState(true);
  const stateRef = useRef(state);
  stateRef.current = state;
  // Una sessione appena ripristinata non va risalvata ne' cancellata.
  const hadSessionRef = useRef(false);
  const savedOnceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    getActiveSession()
      .then((dto) => {
        if (cancelled || !dto || dto.questions.length === 0) return;
        // Prima di segnarla come presente: se fromDto fallisse, la pulizia qui sotto la cancellerebbe.
        const restored = fromDto(dto);
        hadSessionRef.current = true;
        savedOnceRef.current = true;
        dispatch({ type: "RESTORE_SESSION", state: restored });
      })
      .catch((err) => console.error("Impossibile recuperare la sessione in corso:", err))
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (restoring || state.status !== "in-progress") return;
    hadSessionRef.current = true;

    // Senza risposte non si salva, tranne una sessione gia' salvata e poi svuotata: la PUT la cancella.
    if (!hasAnyAnswer(state) && !savedOnceRef.current) return;

    const dto = toSaveDto(state);
    if (!dto) return;
    const timer = setTimeout(() => {
      savedOnceRef.current = hasAnyAnswer(state);
      saveActiveSession(dto).catch((err) => console.error("Impossibile salvare la sessione in corso:", err));
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state, restoring]);

  // Pagina che si chiude o va in background: niente debounce, e keepalive per completare la richiesta.
  useEffect(() => {
    if (state.status !== "in-progress") return;

    function flush() {
      if (!hasAnyAnswer(stateRef.current) && !savedOnceRef.current) return;
      const dto = toSaveDto(stateRef.current);
      if (!dto) return;
      saveActiveSession(dto, true).catch(() => {
      });
    }
    function handleVisibility() {
      if (document.visibilityState === "hidden") flush();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [state.status]);

  // Sessione inviata o abbandonata: la riga va tolta.
  useEffect(() => {
    if (restoring || !hadSessionRef.current || state.status === "in-progress") return;
    hadSessionRef.current = false;
    savedOnceRef.current = false;
    deleteActiveSession().catch((err) => console.error("Impossibile cancellare la sessione in corso:", err));
  }, [state.status, restoring]);

  return <SessionContext.Provider value={{ state, dispatch, restoring }}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession deve essere usato dentro un SessionProvider");
  return ctx;
}
