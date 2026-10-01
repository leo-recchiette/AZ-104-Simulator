import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../session/SessionContext";
import { useTheme } from "../theme/ThemeContext";
import { useElapsedTime } from "../hooks/useElapsedTime";
import { checkAnswers, getScore, saveAttempt } from "../api/results";
import { getExam } from "../api/questions";
import { ApiError } from "../api/client";
import { QuestionCard } from "../components/session/QuestionCard";
import { GroupNav } from "../components/session/GroupNav";
import { QuestionNavigator } from "../components/session/QuestionNavigator";
import { groupMembers, sessionUnits, unitsAnswered, unitsStarted } from "../utils/groups";
import { isAnswerStarted } from "../utils/questionShape";
import { OptionsMenu } from "../components/OptionsMenu";
import { HEADER_GRADIENT } from "../theme/tokens";
import { MAX_QUESTION_COUNT } from "../constants";

// Non token del tema: stanno sul banner blu, uguale in light e dark.
const CLOCK_OK = "#3ddc84";
const CLOCK_WARN = "#ffd23f";
const CLOCK_DANGER = "#ff6b6b";
const WARN_FRACTION = 1 / 3;
const DANGER_FRACTION = 0.1;
// Debounce: le hotspot si compilano una riga alla volta.
const AUTO_REVEAL_DELAY_MS = 400;
// Riferimento stabile: un [] nuovo a ogni render rilancerebbe l'effetto dell'auto-reveal.
const NO_ANSWER: string[] = [];

function fmt(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SessionPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();
  const { theme, tokens: t } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [paused, setPaused] = useState(false);
  // null = chiuso. Aperto "unanswered" quando si arriva dal riepilogo cercando i buchi.
  const [navFilter, setNavFilter] = useState<null | "all" | "unanswered">(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firedRef = useRef(false);
  // Evita di ricreare handleFinish a ogni tick.
  const elapsedSecRef = useRef(0);

  const question = state.questions[state.currentIndex];
  const value = useMemo(
    () => (question ? (state.answers[question.number] ?? NO_ANSWER) : NO_ANSWER),
    [question, state.answers],
  );
  const total = state.questions.length;
  const isPractice = state.mode === "practice";

  // I conteggi mostrati vanno per unita': un gruppo di sotto-domande conta come una.
  const units = useMemo(() => sessionUnits(state.questions), [state.questions]);
  const unitAnswered = useMemo(
    () => unitsAnswered(state.questions, units, state.answers),
    [state.questions, units, state.answers],
  );
  const unitStarted = useMemo(
    () => unitsStarted(state.questions, units, state.answers),
    [state.questions, units, state.answers],
  );

  const handleFinish = useCallback(async () => {
    // A numero fisso tutte, anche senza risposta: quelle omesse non conterebbero nel denominatore.
    // A oltranza solo le unita' cominciate, ma intere: le parti lasciate in bianco valgono zero.
    const scored = state.openEnded
      ? state.questions.filter((_, i) => unitStarted[units.unitOf[i]])
      : state.questions;
    // A oltranza senza risposte non c'e' niente da valutare: la sessione si scarta.
    if (scored.length === 0) {
      dispatch({ type: "RESET" });
      navigate("/");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const submissions = scored.map((q) => ({
        questionNumber: q.number,
        userAnswers: state.answers[q.number] ?? [],
      }));
      const score = await getScore(submissions);
      dispatch({ type: "FINISH_SESSION", score, timeUsedSeconds: elapsedSecRef.current, questions: scored });
      navigate("/results");

      // Una sessione senza alcuna risposta non va nello storico. Il salvataggio e' best-effort.
      const answeredAnything = submissions.some((s) => s.userAnswers.some((a) => a.trim() !== ""));

      if (!answeredAnything) {
        dispatch({ type: "SET_HISTORY_OUTCOME", outcome: "discarded" });
      } else if (state.mode && state.startedAt) {
        const endTime = new Date();
        // Dal tempo giocato, non da startedAt: le pause non devono allungare la durata.
        const startTime = new Date(endTime.getTime() - elapsedSecRef.current * 1000);
        saveAttempt({
          mode: state.mode,
          questionCount: scored.length,
          percentage: score.percentage,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          answers: submissions,
        }).catch((err) => {
          console.error("Impossibile salvare il tentativo nello storico:", err);
          dispatch({ type: "SET_HISTORY_OUTCOME", outcome: "failed" });
        });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossibile calcolare il punteggio.");
      setSubmitting(false);
    }
  }, [dispatch, navigate, state.answers, state.questions, state.mode, state.startedAt, state.openEnded, units, unitStarted]);

  const elapsedMs = useElapsedTime(state.startedAt, paused);
  const elapsedSec = Math.floor(elapsedMs / 1000);
  elapsedSecRef.current = elapsedSec;
  const limit = state.timeLimitSeconds;
  const remaining = limit ? Math.max(0, limit - elapsedSec) : 0;

  useEffect(() => {
    if (!limit) return;
    if (remaining === 0 && !firedRef.current) {
      firedRef.current = true;
      handleFinish();
    }
  }, [remaining, limit, handleFinish]);

  useEffect(() => {
    if (!question) navigate("/", { replace: true });
  }, [question, navigate]);

  // SET_ANSWER cancella il checkResult, quindi cambiare risposta rilancia l'auto-reveal.
  useEffect(() => {
    if (!isPractice || !state.autoReveal || !question) return;
    if (state.checkResults[question.number]) return;
    if (!isAnswerStarted(question, value)) return;

    const questionNumber = question.number;
    const timer = setTimeout(() => {
      checkAnswers([{ questionNumber, userAnswers: value }])
        .then(([result]) => {
          if (result) dispatch({ type: "SET_CHECK_RESULT", questionNumber, result });
        })
        .catch((err) => console.error("Auto-reveal non riuscito:", err));
    }, AUTO_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isPractice, state.autoReveal, state.checkResults, question, value, dispatch]);

  if (!question) return null;

  async function handleReveal() {
    const [result] = await checkAnswers([{ questionNumber: question.number, userAnswers: value }]);
    dispatch({ type: "SET_CHECK_RESULT", questionNumber: question.number, result });
  }

  const totalUnits = units.members.length;
  const currentUnit = units.unitOf[state.currentIndex] ?? 0;
  const answeredCount = unitAnswered.filter(Boolean).length;
  // Chiude anche il riepilogo, altrimenti il salto non si vedrebbe.
  function goToQuestion(index: number) {
    dispatch({ type: "GO_TO", index });
    setShowConfirm(false);
    setNavFilter(null);
  }

  const flagCount = Object.values(state.flags).filter(Boolean).length;
  const flagged = !!state.flags[state.currentIndex];
  const isLast = state.currentIndex === total - 1;
  const bankExhausted = state.openEnded && state.pool !== null && state.pool.length === 0;
  const scoredUnits = unitStarted.filter(Boolean).length;
  const nothingToScore = state.openEnded && scoredUnits === 0;

  async function handleNext() {
    if (!isLast) {
      dispatch({ type: "GO_NEXT" });
      return;
    }
    if (!state.openEnded || bankExhausted) {
      setShowConfirm(true);
      return;
    }
    // Il pool non si salva: dopo un ripristino si ripesca il bank, il reducer scarta le domande gia' viste.
    if (state.pool === null) {
      setError(null);
      setLoadingMore(true);
      try {
        dispatch({ type: "SET_POOL", questions: await getExam(MAX_QUESTION_COUNT) });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Impossibile caricare altre domande.");
        return;
      } finally {
        setLoadingMore(false);
      }
    }
    dispatch({ type: "GO_NEXT" });
  }

  let nextLabel = "Next →";
  if (loadingMore) nextLabel = "Loading...";
  else if (isLast && (!state.openEnded || bankExhausted)) nextLabel = "Review & submit";

  let confirmText = "Once submitted you cannot change your answers. Unanswered questions score zero.";
  if (nothingToScore) confirmText = "You haven't answered any question yet, so there's nothing to score.";
  else if (state.openEnded) {
    confirmText =
      "Only the questions you answered are scored: the ones you skipped are left out. Blank parts of a question you started still score zero.";
  }

  const timerCaption = limit ? "Time remaining" : "Elapsed";
  const timeLabel = fmt(limit ? remaining : elapsedSec);
  // Soglie in frazione del limite, non minuti fissi, per valere con qualunque durata.
  let clockColor = CLOCK_OK;
  if (limit) {
    if (remaining <= limit * DANGER_FRACTION) clockColor = CLOCK_DANGER;
    else if (remaining <= limit * WARN_FRACTION) clockColor = CLOCK_WARN;
  }
  const timeColor = clockColor === CLOCK_OK ? "#ffffff" : clockColor;
  // A oltranza non c'e' un totale verso cui avanzare: senza limite di tempo la barra resta vuota.
  let timePct = 0;
  if (limit) timePct = (elapsedSec / limit) * 100;
  else if (!state.openEnded) timePct = (answeredCount / totalUnits) * 100;

  const members = groupMembers(state.questions, state.currentIndex);
  const card = (
    <QuestionCard
      key={question.number}
      question={question}
      value={value}
      onChange={(next) => dispatch({ type: "SET_ANSWER", questionNumber: question.number, answer: next })}
      flagged={flagged}
      onToggleFlag={() => dispatch({ type: "TOGGLE_FLAG", index: state.currentIndex })}
      isPractice={isPractice}
      autoReveal={state.autoReveal}
      checkResult={state.checkResults[question.number]}
      onReveal={handleReveal}
      // A oltranza uscire e' il modo normale di finire: si passa dal riepilogo, non dall'avviso.
      onRequestExit={() => (state.openEnded ? setShowConfirm(true) : setShowExitConfirm(true))}
    />
  );
  const questionCard = members.length === 0 ? card : (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 16 }}>
      <GroupNav
        members={members}
        currentIndex={state.currentIndex}
        answers={state.answers}
        onSelect={(index) => dispatch({ type: "GO_TO", index })}
      />
      {/* minWidth 0: altrimenti il flex item non si restringe. */}
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>{card}</div>
    </div>
  );

  const modeChipBg = isPractice ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.92)";
  const modeChipFg = isPractice ? "#fff" : "#0b3fae";
  const modeLabel = isPractice ? "Practice" : "Simulation";
  const headerGradient = theme === "dark" ? HEADER_GRADIENT.dark : HEADER_GRADIENT.light;

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* zIndex: il popover di Options deve uscire sopra l'area che scorre. */}
      <div style={{ flexShrink: 0, position: "relative", zIndex: 5, background: headerGradient, backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,.18)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "14px 24px 12px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            {/* La sessione resta in-progress: la home la ripropone con "Resume". */}
            <button
              onClick={() => navigate("/")}
              title="Back to the home page"
              style={{
                // "font" e' una shorthand: va prima di size/weight.
                font: "inherit", fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap",
                color: "#fff", background: "none", border: "none", padding: 0, cursor: "pointer",
              }}
            >
              AZ-104
            </button>
            <span style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600, padding: "4px 8px", borderRadius: 6, background: modeChipBg, color: modeChipFg }}>
              {modeLabel}
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 12.5, color: "#e4e7ee" }}>{timerCaption}</span>
            <span style={{ fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: timeColor }}>{timeLabel}</span>
          </div>
          {limit !== null && (
            <button
              onClick={() => setPaused(true)}
              aria-label="Pause the session"
              style={headerButtonStyle}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Pause
            </button>
          )}
          <div style={{ width: 1, height: 22, background: "rgba(255,255,255,.3)" }} />
          <div style={{ fontSize: 13.5, color: "#e4e7ee", fontVariantNumeric: "tabular-nums" }}>
            Question <strong style={{ color: "#fff" }}>{currentUnit + 1}</strong>
            {!state.openEnded && ` of ${totalUnits}`}
          </div>
          <OptionsMenu
            variant="onDark"
            autoReveal={
              isPractice
                ? { value: state.autoReveal, onChange: (next) => dispatch({ type: "SET_AUTO_REVEAL", autoReveal: next }) }
                : undefined
            }
          />
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,.25)" }}>
          <div style={{ height: "100%", width: `${timePct}%`, background: clockColor, transition: "width 1s linear" }} />
        </div>
      </div>

      {/* minHeight 0: altrimenti lo scroll torna sulla pagina. */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%", padding: "22px 24px" }}>
          {error && <p style={{ margin: "0 0 20px", color: t.er, fontSize: 14 }}>{error}</p>}

          {showConfirm ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
              <div style={{ width: "100%", maxWidth: 560, background: t.card, border: `1px solid ${t.bd}`, borderRadius: 16, padding: "34px 32px", boxShadow: `0 2px 10px ${t.sh}` }}>
                <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 27, margin: "0 0 8px" }}>
                  {state.openEnded ? "Finish this session?" : "Submit your exam?"}
                </h2>
                <p style={{ margin: "0 0 24px", color: t.mu, fontSize: 14.5, lineHeight: 1.55 }}>
                  {confirmText}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, background: t.bd2, border: `1px solid ${t.bd2}`, borderRadius: 12, overflow: "hidden", marginBottom: 26 }}>
                  {state.openEnded ? (
                    <>
                      <SummaryRow label="Questions to be scored" value={String(scoredUnits)} fg={t.tx} />
                      <SummaryRow label="Skipped (not scored)" value={String(totalUnits - scoredUnits)} fg={t.tx} />
                    </>
                  ) : (
                    <>
                      <SummaryRow label="Questions answered" value={`${answeredCount} / ${totalUnits}`} fg={t.tx} />
                      <SummaryRow label="Unanswered" value={String(totalUnits - answeredCount)} fg={totalUnits - answeredCount ? t.er : t.tx} />
                    </>
                  )}
                  <SummaryRow label="Flagged for review" value={String(flagCount)} fg={flagCount ? t.warn : t.tx} />
                  <SummaryRow label="Time used" value={fmt(elapsedSec)} fg={t.tx} />
                </div>
                {totalUnits - answeredCount > 0 && (
                  <button
                    onClick={() => setNavFilter("unanswered")}
                    style={{
                      display: "block", width: "100%", padding: 13, borderRadius: 11, marginBottom: 12,
                      border: `1.5px solid ${t.erbd}`, background: t.erbg, color: t.er,
                      fontSize: 14, fontWeight: 600,
                    }}
                  >
                    Find the unanswered questions
                  </button>
                )}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => setShowConfirm(false)} style={wideButtonStyle(`1px solid ${t.bd3}`, t.card, t.tx2)}>
                    Keep working
                  </button>
                  <button onClick={handleFinish} disabled={submitting} style={wideButtonStyle("none", t.ac, "#fff")}>
                    {submitting ? "Submitting..." : nothingToScore ? "Discard session" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            questionCard
          )}
        </div>
      </div>

      <QuestionNavigator
        open={navFilter !== null}
        focusUnanswered={navFilter === "unanswered"}
        questions={state.questions}
        units={units}
        unitAnswered={unitAnswered}
        answers={state.answers}
        flags={state.flags}
        currentIndex={state.currentIndex}
        onOpen={() => setNavFilter("all")}
        onClose={() => setNavFilter(null)}
        onSelect={goToQuestion}
      />

      {/* Sopra header e modali: in pausa la domanda non deve restare leggibile. */}
      {paused && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="paused-title"
          style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(10,12,16,.82)", backdropFilter: "blur(6px)" }}
        >
          <div style={{ width: "100%", maxWidth: 460, background: t.card, border: `1px solid ${t.bd}`, borderRadius: 16, padding: "30px 28px", boxShadow: "0 10px 30px rgba(0,0,0,.25)", textAlign: "center" }}>
            <h2 id="paused-title" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 23, margin: "0 0 8px" }}>
              Sessione in pausa
            </h2>
            <p style={{ margin: "0 0 20px", color: t.mu, fontSize: 14.5, lineHeight: 1.55 }}>
              Il tempo è fermo e la domanda è nascosta. Riprendi quando vuoi: le risposte già date
              restano salvate.
            </p>
            <div style={{ fontSize: 12.5, color: t.fa, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600 }}>
              {timerCaption}
            </div>
            <div style={{ fontSize: 34, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: t.tx, margin: "4px 0 24px" }}>
              {timeLabel}
            </div>
            <button
              onClick={() => setPaused(false)}
              style={{ width: "100%", padding: 14, borderRadius: 11, border: "none", background: t.ac, fontSize: 14.5, fontWeight: 600, color: "#fff", font: "inherit" }}
            >
              Riprendi
            </button>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(10,12,16,.5)" }}>
          <div style={{ width: "100%", maxWidth: 480, background: t.card, border: `1px solid ${t.bd}`, borderRadius: 16, padding: "30px 28px", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
            <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 23, margin: "0 0 8px" }}>
              Uscire ora?
            </h2>
            <p style={{ margin: "0 0 24px", color: t.mu, fontSize: 14.5, lineHeight: 1.55 }}>
              L'esame verrà terminato subito. Tutte le domande senza risposta saranno contrassegnate come tali e
              contate come errate.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setShowExitConfirm(false)} style={wideButtonStyle(`1px solid ${t.bd3}`, t.card, t.tx2)}>
                Annulla
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  handleFinish();
                }}
                disabled={submitting}
                style={wideButtonStyle("none", "#e5484d", "#fff")}
              >
                Esci e invia
              </button>
            </div>
          </div>
        </div>
      )}

      {!showConfirm && (
        <div style={{ flexShrink: 0, background: t.head, backdropFilter: "blur(8px)", borderTop: `1px solid ${t.bd}` }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => dispatch({ type: "GO_PREVIOUS" })}
              disabled={state.currentIndex === 0}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 10,
                border: `1px solid ${t.bd3}`, background: t.card, fontSize: 14.5, fontWeight: 500, font: "inherit",
                color: state.currentIndex === 0 ? t.dis : t.tx2, opacity: state.currentIndex === 0 ? 0.55 : 1,
              }}
            >
              ← Previous
            </button>
            <div style={{ flex: 1, textAlign: "center", fontSize: 12.5, color: t.fa }}>
              {answeredCount}{!state.openEnded && ` of ${totalUnits}`} answered{flagCount ? ` · ${flagCount} flagged` : ""}
            </div>
            <button
              onClick={handleNext}
              disabled={loadingMore}
              style={{ ...primaryButtonStyle(t.ac), opacity: loadingMore ? 0.8 : 1 }}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, fg }: { label: string; value: string; fg: string }) {
  const { tokens: t } = useTheme();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: t.card }}>
      <span style={{ fontSize: 14, color: t.tx2 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: fg }}>{value}</span>
    </div>
  );
}

const headerButtonStyle = {
  display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,.35)", background: "rgba(255,255,255,.12)",
  color: "#fff", fontSize: 12.5, fontWeight: 600, font: "inherit", whiteSpace: "nowrap",
} as const;

function primaryButtonStyle(ac: string) {
  return {
    display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 10, border: "none",
    background: ac, color: "#fff", fontSize: 14.5, fontWeight: 600, font: "inherit",
  } as const;
}

function wideButtonStyle(border: string, bg: string, fg: string) {
  return {
    flex: 1, minWidth: 150, padding: 14, borderRadius: 11, border, background: bg,
    fontSize: 14.5, fontWeight: 600, color: fg, font: "inherit",
  } as const;
}
