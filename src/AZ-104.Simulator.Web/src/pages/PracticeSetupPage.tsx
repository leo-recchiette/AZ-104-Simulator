import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { useSession } from "../session/SessionContext";
import { getExam } from "../api/questions";
import { ApiError } from "../api/client";
import { FloatingThemeToggle } from "../components/FloatingThemeToggle";
import { EmptyBankDialog } from "../components/EmptyBankDialog";
import { ResumeSessionBanner } from "../components/ResumeSessionBanner";
import { DrawModeToggle } from "../components/DrawModeToggle";
import { SwitchRow } from "../components/SwitchRow";
import type { DrawMode } from "../types/question";
import type { CertificationDto } from "../types/certification";
import { PRACTICE_DEFAULT_DRAW_MODE } from "../constants";
import { HEADING_FONT } from "../theme/fonts";

const COUNT_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80];
const MINUTE_OPTIONS = [15, 30, 45, 60, 90, 120];

const LENGTH_OPTIONS = [
  { openEnded: false, title: "Fixed number", text: "Pick how many questions before you start." },
  { openEnded: true, title: "Open-ended", text: "Stop whenever you like: only the questions you answer are scored." },
];

export function PracticeSetupPage() {
  const certification = useOutletContext<CertificationDto>();
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const { dispatch } = useSession();

  const [openEnded, setOpenEnded] = useState(false);
  const [count, setCount] = useState(20);
  const [drawMode, setDrawMode] = useState<DrawMode>(PRACTICE_DEFAULT_DRAW_MODE);
  const [timed, setTimed] = useState(false);
  const [autoReveal, setAutoReveal] = useState(false);
  const [liveScore, setLiveScore] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyBank, setEmptyBank] = useState(false);

  // Il punteggio live svelerebbe le risposte prima della soluzione: senza auto-reveal si spegne.
  // Il punteggio live svela le risposte: senza auto-reveal si spegne anche lui.
  function changeAutoReveal(next: boolean) {
    setAutoReveal(next);
    if (!next) setLiveScore(false);
  }

  async function handleStart() {
    setError(null);
    setLoading(true);
    try {
      // A oltranza serve l'intero bank: si propone un'unita' alla volta.
      const questions = await getExam(certification.id, openEnded ? certification.questionCount : count, drawMode);
      // 200 con []: question bank vuoto, non un errore dell'API.
      if (questions.length === 0) {
        setEmptyBank(true);
        setLoading(false);
        return;
      }
      dispatch({ type: "START_SESSION", certificationId: certification.id, mode: "practice", drawMode, questions, timeLimitSeconds: timed ? minutes * 60 : null, autoReveal, openEnded, liveScore });
      navigate(`/${certification.id}/session`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load the questions.");
      setLoading(false);
    }
  }

  const startLabel = loading
    ? "Loading..."
    : `Start ${openEnded ? "open-ended session" : `${count} questions`}${timed ? ` · ${minutes} min` : " · untimed"}`;

  return (
    <>
      <FloatingThemeToggle />
      {emptyBank && <EmptyBankDialog onClose={() => setEmptyBank(false)} />}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 620, background: t.card, border: `1px solid ${t.bd}`, borderRadius: 16, padding: "34px 32px", boxShadow: `0 2px 10px ${t.sh}` }}>
          <button onClick={() => navigate(`/${certification.id}`)} style={{ background: "none", border: "none", padding: 0, color: t.mu, fontSize: 13, marginBottom: 18 }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: HEADING_FONT, fontWeight: 600, fontSize: 28, margin: "0 0 6px" }}>
            Practice session
          </h2>
          <p style={{ margin: "0 0 28px", color: t.mu, fontSize: 14.5 }}>
            Nothing is scored until you submit. Solutions stay available throughout.
          </p>

          <ResumeSessionBanner style={{ marginBottom: 26 }} />

          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>How many questions?</div>
          <div role="radiogroup" aria-label="Session length" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: openEnded ? 28 : 14 }}>
            {LENGTH_OPTIONS.map((option) => {
              const on = openEnded === option.openEnded;
              return (
                <button
                  key={option.title}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setOpenEnded(option.openEnded)}
                  style={{
                    textAlign: "left", padding: "13px 15px", borderRadius: 11,
                    border: `1px solid ${on ? t.ac : t.bd3}`, background: on ? t.acs : t.card,
                  }}
                >
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: on ? t.ac : t.tx }}>{option.title}</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: t.mu, marginTop: 3 }}>{option.text}</div>
                </button>
              );
            })}
          </div>

          {!openEnded && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {COUNT_OPTIONS.filter((n) => n <= certification.questionCount).map((n) => {
                const on = count === n;
                return (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    style={{
                      padding: "9px 16px", borderRadius: 9, fontSize: 14, fontWeight: 500,
                      border: `1px solid ${on ? t.ac : t.bd3}`, background: on ? t.acs : t.card, color: on ? t.ac : t.tx2,
                    }}
                  >
                    {n} questions
                  </button>
                );
              })}
            </div>
          )}

          <DrawModeToggle value={drawMode} onChange={setDrawMode} />

          <SwitchRow title="Time limit" description="Maximum 120 minutes" checked={timed} onChange={setTimed} />

          {timed && (
            <div style={{ padding: "4px 0 20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {MINUTE_OPTIONS.map((m) => {
                  const on = minutes === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setMinutes(m)}
                      style={{
                        padding: "8px 14px", borderRadius: 9, fontSize: 13.5, fontWeight: 500,
                        border: `1px solid ${on ? t.ac : t.bd3}`, background: on ? t.acs : t.card, color: on ? t.ac : t.tx2,
                      }}
                    >
                      {m} min
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <SwitchRow
            title="Reveal the solution automatically"
            description={'Shown as soon as you answer, instead of waiting for "Show solution"'}
            checked={autoReveal}
            onChange={changeAutoReveal}
          />

          <SwitchRow
            title="Live score"
            description={
              !autoReveal
                ? "Available with automatic reveal turned on"
                : openEnded
                  ? "What you'd score if you finished now, counting only the questions you answered"
                  : "What you'd score if you submitted now: unanswered questions count as zero"
            }
            checked={liveScore}
            onChange={setLiveScore}
            disabled={!autoReveal}
          />

          {error && <p style={{ margin: "0 0 12px", color: t.er, fontSize: 14 }}>{error}</p>}

          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              width: "100%", marginTop: 12, padding: 15, border: "none", borderRadius: 11,
              background: t.ac, color: "#fff", fontSize: 15.5, fontWeight: 600,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {startLabel}
          </button>
        </div>
      </div>
    </>
  );
}
