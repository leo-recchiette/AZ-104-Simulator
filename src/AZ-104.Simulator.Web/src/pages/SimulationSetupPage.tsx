import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { useSession } from "../session/SessionContext";
import { getExam } from "../api/questions";
import { ApiError } from "../api/client";
import type { DrawMode } from "../types/question";
import { FloatingThemeToggle } from "../components/FloatingThemeToggle";
import { EmptyBankDialog } from "../components/EmptyBankDialog";
import { ResumeSessionBanner } from "../components/ResumeSessionBanner";
import { DrawModeToggle } from "../components/DrawModeToggle";
import {
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMIT_MINUTES,
  EXAM_TIME_LIMIT_SECONDS,
  PASS_MARK_PERCENT,
  SIMULATION_DEFAULT_DRAW_MODE,
} from "../constants";

/** Le condizioni d'esame sono fisse: qui si sceglie solo come pescare. */
const RULES = [
  { label: "Questions", value: `${EXAM_QUESTION_COUNT}, a scenario series counts as one` },
  { label: "Time limit", value: `${EXAM_TIME_LIMIT_MINUTES} minutes` },
  { label: "Solutions", value: "After you submit" },
  { label: "Passing score", value: `${PASS_MARK_PERCENT}%` },
];

export function SimulationSetupPage() {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const { dispatch } = useSession();

  const [drawMode, setDrawMode] = useState<DrawMode>(SIMULATION_DEFAULT_DRAW_MODE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyBank, setEmptyBank] = useState(false);

  async function handleStart() {
    setError(null);
    setLoading(true);
    try {
      const questions = await getExam(EXAM_QUESTION_COUNT, drawMode);
      // 200 con []: question bank vuoto, non un errore dell'API.
      if (questions.length === 0) {
        setEmptyBank(true);
        setLoading(false);
        return;
      }
      dispatch({ type: "START_SESSION", mode: "exam", drawMode, questions, timeLimitSeconds: EXAM_TIME_LIMIT_SECONDS });
      navigate("/session");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossibile caricare le domande.");
      setLoading(false);
    }
  }

  return (
    <>
      <FloatingThemeToggle />
      {emptyBank && <EmptyBankDialog onClose={() => setEmptyBank(false)} />}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 620, background: t.card, border: `1px solid ${t.bd}`, borderRadius: 16, padding: "34px 32px", boxShadow: `0 2px 10px ${t.sh}` }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", padding: 0, color: t.mu, fontSize: 13, marginBottom: 18, font: "inherit" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 28, margin: "0 0 6px" }}>
            Simulation
          </h2>
          <p style={{ margin: "0 0 28px", color: t.mu, fontSize: 14.5 }}>
            Exam conditions: a fixed set of questions against the clock, nothing revealed until you submit.
          </p>

          <ResumeSessionBanner style={{ marginBottom: 26 }} />

          {RULES.map((rule) => (
            <div key={rule.label} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, padding: "12px 0", borderTop: `1px solid ${t.bd2}` }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{rule.label}</div>
              <div style={{ fontSize: 13.5, color: t.tx2, textAlign: "right" }}>{rule.value}</div>
            </div>
          ))}

          <DrawModeToggle value={drawMode} onChange={setDrawMode} />

          {error && <p style={{ margin: "0 0 12px", color: t.er, fontSize: 14 }}>{error}</p>}

          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              width: "100%", marginTop: 12, padding: 15, border: "none", borderRadius: 11,
              background: t.ac, color: "#fff", fontSize: 15.5, fontWeight: 600, font: "inherit",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Loading..." : `Start simulation · ${EXAM_QUESTION_COUNT} questions · ${EXAM_TIME_LIMIT_MINUTES} min`}
          </button>
        </div>
      </div>
    </>
  );
}
