import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { getAllAttempts } from "../api/results";
import type { ExamAttemptDto } from "../types/answer";
import { FloatingThemeToggle } from "../components/FloatingThemeToggle";
import { ResumeSessionBanner } from "../components/ResumeSessionBanner";
import { ProgressChart } from "../components/ProgressChart";
import { EXAM_QUESTION_COUNT, EXAM_TIME_LIMIT_MINUTES, MAX_SCORE, PASS_MARK_SCORE } from "../constants";
import { MODE_BG_GRADIENT } from "../theme/tokens";
import { formatDateShort } from "../utils/format";
import badgeUrl from "../assets/microsoft-certified-associate-badge.png";

/** Sessioni recenti: la loro media dice dove sei adesso. */
const RECENT_COUNT = 5;

export function ModeSelectPage() {
  const navigate = useNavigate();
  const { theme, tokens: t } = useTheme();
  const [history, setHistory] = useState<ExamAttemptDto[]>([]);
  // Periodo zoomato nel grafico: null = tutto. Vale anche per le statistiche.
  const [range, setRange] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Pannello "best effort": se lo storico non si carica, la pagina resta comunque utilizzabile.
    getAllAttempts()
      .then(setHistory)
      .catch((err) => console.error("Impossibile caricare lo storico dei tentativi:", err));
  }, []);

  const modeBgGrad = theme === "dark" ? MODE_BG_GRADIENT.dark : MODE_BG_GRADIENT.light;

  const shown = useMemo(() => (range ? history.slice(range[0], range[1] + 1) : history), [history, range]);

  // Solo le Simulation: in Practice le soluzioni sono a portata di mano e il numero di domande varia.
  const stats = useMemo(() => {
    const scores = shown.filter((h) => h.mode === "exam").map((h) => h.score);
    if (scores.length === 0) return null;
    const recentCount = Math.min(RECENT_COUNT, scores.length);
    let streak = 0;
    for (let i = scores.length - 1; i >= 0 && scores[i] >= PASS_MARK_SCORE; i--) streak++;
    return {
      worst: Math.min(...scores),
      best: Math.max(...scores),
      recent: Math.round(average(scores.slice(-recentCount))),
      recentCount,
      streak,
    };
  }, [shown]);
  const recentCount = stats?.recentCount ?? RECENT_COUNT;

  return (
    <>
      <FloatingThemeToggle />
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: `${modeBgGrad}, ${t.bg}` }}>
        <div style={{ position: "absolute", top: -180, left: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,120,212,.32), transparent 70%)", filter: "blur(10px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -220, right: -160, width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, rgba(80,230,255,.18), transparent 70%)", filter: "blur(10px)", pointerEvents: "none" }} />
        <div style={{ width: "100%", maxWidth: 760, position: "relative" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, marginBottom: 36 }}>
            <div style={{ flex: "1 1 340px" }}>
              <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: t.fa, fontWeight: 600 }}>
                Microsoft Certified: Azure Administrator Associate
              </div>
              <h1 style={{
                fontFamily: "Roboto, 'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 46, lineHeight: 1.1,
                margin: "14px 0 10px", letterSpacing: "-.01em", background: "linear-gradient(90deg,#0078d4,#50e6ff)",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}>
                AZ-104 Simulator
              </h1>
              <p style={{ margin: 0, color: t.mu, fontSize: 16, lineHeight: 1.55, maxWidth: "52ch" }}>
                Question bank of 584 items. Choose how you want to work: practise at your own pace with solutions
                available, or sit a timed simulation under exam conditions.
              </p>
            </div>
            <img
              src={badgeUrl}
              alt="Microsoft Certified: Azure Administrator Associate"
              width={128}
              height={128}
              style={{ flexShrink: 0, display: "block" }}
            />
          </div>

          <ResumeSessionBanner />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            <button
              onClick={() => navigate("/practice/setup")}
              style={{
                textAlign: "left", background: t.card, border: `1px solid ${t.bd}`, borderRadius: 14,
                padding: "26px 24px 24px", boxShadow: `0 1px 2px ${t.sh}`, color: "inherit",
                transition: "box-shadow .18s, border-color .18s, transform .18s", font: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: t.acs, color: t.ac, display: "grid", placeItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H7a1 1 0 0 0 0 2h12a1 1 0 1 1 0 2H6a2 2 0 0 1-2-2V4Zm2 0v13.09A2 2 0 0 1 7 17h12V4H6Z" />
                    <path d="M9 2h4v8l-2-1.4L9 10V2Z" />
                  </svg>
                </span>
                <span style={{ fontSize: 19, fontWeight: 600 }}>Practice</span>
              </div>
              <p style={{ margin: 0, color: t.mu, fontSize: 14, lineHeight: 1.5 }}>
                Pick how many questions you want and whether to run a clock. Reveal the correct answer and the
                explanation on any question.
              </p>
            </button>

            <button
              onClick={() => navigate("/simulation/setup")}
              style={{
                textAlign: "left", background: t.card, border: `1px solid ${t.bd}`, borderRadius: 14,
                padding: "26px 24px 24px", boxShadow: `0 1px 2px ${t.sh}`, color: "inherit",
                transition: "box-shadow .18s, border-color .18s, transform .18s", font: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: t.tx, color: t.card, display: "grid", placeItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
                    <path d="M8.8 11.6 6 21l6-3 6 3-2.8-9.4 1.7-1.2-2.9.6-2 1.8-2-1.8-2.9-.6 1.7 1.2Z" />
                  </svg>
                </span>
                <span style={{ fontSize: 19, fontWeight: 600 }}>Simulation</span>
              </div>
              <p style={{ margin: 0, color: t.mu, fontSize: 14, lineHeight: 1.5 }}>
                {`${EXAM_QUESTION_COUNT} questions, ${EXAM_TIME_LIMIT_MINUTES} minutes on the clock, no solutions until you submit.`}
              </p>
            </button>
          </div>

          <p style={{ margin: "28px 0 0", fontSize: 12.5, color: t.fa2 }}>
            Passing score {PASS_MARK_SCORE} out of {MAX_SCORE}. One point per correct component, no deductions for wrong answers.
          </p>

          {history.length > 0 && (
            <div style={{ marginTop: 32, background: t.card, border: `1px solid ${t.bd}`, borderRadius: 14, padding: "24px 26px", boxShadow: `0 1px 2px ${t.sh}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600, color: t.fa }}>
                  Your progress
                </div>
                <button
                  onClick={() => navigate("/history")}
                  style={{
                    marginLeft: "auto", padding: "7px 13px", borderRadius: 999, border: `1px solid ${t.bd3}`,
                    background: t.card, color: t.tx2, font: "inherit", fontSize: 13, fontWeight: 600,
                  }}
                >
                  View history ({history.length})
                </button>
              </div>
              {range && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "-4px 0 14px", fontSize: 12.5, color: t.mu }}>
                  <span>
                    Sessions {range[0] + 1}–{range[1] + 1} of {history.length} · {formatDateShort(shown[0].endTime)} –{" "}
                    {formatDateShort(shown[shown.length - 1].endTime)}
                  </span>
                  <button
                    onClick={() => setRange(null)}
                    style={{ background: "none", border: "none", padding: 0, color: t.ac, font: "inherit", fontSize: 12.5, fontWeight: 600 }}
                  >
                    Reset zoom
                  </button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: 14, marginBottom: 10 }}>
                {/* Senza Simulation nel periodo il trattino e' neutro: rosso o verde sembrerebbe un valore. */}
                <StatTile label="Worst Simulation score" value={stats ? String(stats.worst) : "—"} color={stats ? t.er : t.fa} />
                <StatTile label="Best Simulation score" value={stats ? String(stats.best) : "—"} color={stats ? t.ok : t.fa} />
                <StatTile
                  label={recentCount === 1 ? "Last Simulation" : `Last ${recentCount} Simulations average`}
                  title={recentCount === 1 ? "Score of the only Simulation in this period" : `Average of the last ${recentCount} Simulations`}
                  value={stats ? String(stats.recent) : "—"}
                  color={!stats ? t.fa : stats.recent >= PASS_MARK_SCORE ? t.ok : t.er}
                />
                <StatTile
                  label="Passed in a row"
                  title={`Consecutive Simulations at or above ${PASS_MARK_SCORE}, up to the latest`}
                  value={stats ? String(stats.streak) : "—"}
                  color={!stats ? t.fa : stats.streak ? t.ok : t.mu}
                />
              </div>
              <div style={{ fontSize: 11.5, color: t.fa, marginBottom: 22 }}>
                {stats ? "Simulation sessions only · the chart shows every session" : "No Simulation in this period · the chart shows every session"}
              </div>
              <ProgressChart attempts={history} range={range} onRangeChange={setRange} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatTile({ label, value, color, title }: { label: string; value: string; color: string; title?: string }) {
  const { tokens: t } = useTheme();
  return (
    <div title={title}>
      <div style={{ fontSize: 11.5, color: t.mu, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</div>
    </div>
  );
}

const average = (xs: number[]) => xs.reduce((sum, x) => sum + x, 0) / xs.length;
