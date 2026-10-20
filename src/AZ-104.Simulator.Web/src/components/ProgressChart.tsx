import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useTheme } from "../theme/ThemeContext";
import { PASS_MARK_PERCENT } from "../constants";
import { formatDateShort, formatDateTime, formatDuration } from "../utils/format";
import type { ExamAttemptDto } from "../types/answer";

const HEIGHT = 210;
// Margine destro largo: l'etichetta della soglia sta fuori dall'area dei punti.
const PAD = { top: 16, right: 64, bottom: 34, left: 44 };
// Sotto questa distanza il trascinamento e' un clic: il tooltip dei pallini resta raggiungibile al tocco.
const DRAG_THRESHOLD = 4;
// Respiro sopra e sotto i punteggi estremi, prima di arrotondare al passo.
const Y_MARGIN = 3;

type Range = [number, number];

interface ProgressChartProps {
  /** Tutti i tentativi, dal piu' vecchio. */
  attempts: ExamAttemptDto[];
  /** Indici inclusi in attempts; null = tutto. */
  range: Range | null;
  onRangeChange: (range: Range | null) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Scala Y adattata ai punteggi visibili, soglia compresa, con estremi multipli del passo:
 * cosi' le tacche cadono su valori tondi e nessun punto finisce sul bordo.
 */
function yScale(scores: number[]): { lo: number; hi: number; step: number } {
  const min = Math.min(PASS_MARK_PERCENT, ...scores) - Y_MARGIN;
  const max = Math.max(PASS_MARK_PERCENT, ...scores) + Y_MARGIN;
  const span = max - min;
  const step = span <= 30 ? 5 : span <= 60 ? 10 : 20;
  return { lo: clamp(Math.floor(min / step) * step, 0, 100), hi: clamp(Math.ceil(max / step) * step, 0, 100), step };
}

/** In pixel misurati, non in un viewBox riscalato, che deformerebbe pallini ed etichette. */
export function ProgressChart({ attempts, range, onRangeChange }: ProgressChartProps) {
  const { tokens: t } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);
  const [activeId, setActiveId] = useState<number | null>(null);
  // Fascia in corso di selezione, in pixel dentro l'area del grafico.
  const [selection, setSelection] = useState<{ from: number; to: number } | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Un trascinamento ancora aperto quando il componente si smonta non deve lasciare listener su window.
  useEffect(() => () => cleanupRef.current?.(), []);

  const total = attempts.length;
  const [start, end] = range ?? [0, Math.max(0, total - 1)];
  const visible = attempts.slice(start, end + 1);
  const n = visible.length;
  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const plotRight = width - PAD.right;
  const { lo, hi, step } = yScale(visible.map((a) => a.percentage));

  // Spaziatura uniforme, non proporzionale alle date: un buco di un mese schiaccerebbe il resto.
  const x = (i: number) => (n === 1 ? PAD.left + innerW / 2 : PAD.left + (i / (n - 1)) * innerW);
  const y = (pct: number) => PAD.top + (1 - (pct - lo) / (hi - lo)) * innerH;

  const points = visible.map((a, i) => ({ x: x(i), y: y(a.percentage), attempt: a }));
  const hovered = selection ? null : points.find((p) => p.attempt.id === activeId) ?? null;
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v += step) ticks.push(v);

  /** Indici visibili i cui punti cadono dentro la fascia. */
  const selectedIndexes = (sel: { from: number; to: number }): Range | null => {
    if (n < 2) return null;
    const [a, b] = sel.from < sel.to ? [sel.from, sel.to] : [sel.to, sel.from];
    const first = Math.ceil(((a - PAD.left) / innerW) * (n - 1));
    const last = Math.floor(((b - PAD.left) / innerW) * (n - 1));
    return last > first ? [first, last] : null;
  };

  // --- selezione del periodo: si trascina sul grafico, al rilascio si zooma sulle sessioni comprese.
  // Listener su window e non pointer capture: un tocco senza trascinamento resta un clic sul pallino.
  function beginSelection(e: ReactPointerEvent<SVGSVGElement>) {
    if (e.button !== 0 || n < 3) return;
    const rect = plotRef.current!.getBoundingClientRect();
    const toPlotX = (clientX: number) => clamp(clientX - rect.left, PAD.left, PAD.left + innerW);
    const originX = e.clientX;
    const from = toPlotX(originX);
    let current: { from: number; to: number } | null = null;

    const onMove = (ev: PointerEvent) => {
      if (!current && Math.abs(ev.clientX - originX) < DRAG_THRESHOLD) return;
      current = { from, to: toPlotX(ev.clientX) };
      setSelection(current);
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", cleanup);
      cleanupRef.current = null;
      setSelection(null);
    };
    const onUp = () => {
      const picked = current && selectedIndexes(current);
      cleanup();
      if (!picked) return;
      const [s, e2] = [start + picked[0], start + picked[1]];
      onRangeChange(s === 0 && e2 === total - 1 ? null : [s, e2]);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", cleanup);
    cleanupRef.current = cleanup;
  }

  const passVisible = PASS_MARK_PERCENT >= lo && PASS_MARK_PERCENT <= hi;
  const picked = selection && selectedIndexes(selection);
  const isPicked = (i: number) => !!picked && i >= picked[0] && i <= picked[1];

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {width > 0 && (
        <svg
          ref={plotRef}
          width={width}
          height={HEIGHT}
          style={{ display: "block", overflow: "visible", userSelect: "none", touchAction: "pan-y" }}
          onPointerDown={beginSelection}
          onDoubleClick={() => onRangeChange(null)}
          onMouseLeave={() => setActiveId(null)}
        >
          {/* Area sensibile anche dove non c'e' disegnato nulla. */}
          <rect
            x={PAD.left} y={PAD.top} width={innerW} height={innerH} fill="transparent"
            style={{ cursor: n >= 3 ? "crosshair" : "default" }}
          />

          {ticks.map((v) => (
            <g key={v} pointerEvents="none">
              <line x1={PAD.left} y1={y(v)} x2={plotRight} y2={y(v)} stroke={t.bd2} strokeWidth={1} />
              <text x={PAD.left - 10} y={y(v) + 3.5} textAnchor="end" fontSize={10} fill={t.fa} style={{ fontVariantNumeric: "tabular-nums" }}>
                {v}%
              </text>
            </g>
          ))}

          {passVisible && (
            <g pointerEvents="none">
              <line
                x1={PAD.left} y1={y(PASS_MARK_PERCENT)} x2={plotRight} y2={y(PASS_MARK_PERCENT)}
                stroke={t.ok} strokeWidth={1} strokeDasharray="4 4" opacity={0.7}
              />
              <text x={plotRight + 8} y={y(PASS_MARK_PERCENT) + 3.5} fontSize={9.5} fill={t.ok}>
                Pass {PASS_MARK_PERCENT}%
              </text>
            </g>
          )}

          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerH} stroke={t.bd3} strokeWidth={1} />

          {selection && (
            <g pointerEvents="none">
              <rect
                x={Math.min(selection.from, selection.to)} y={PAD.top}
                width={Math.abs(selection.to - selection.from)} height={innerH}
                fill={t.ac} fillOpacity={0.12} stroke={t.ac} strokeOpacity={0.5}
              />
              <text
                x={(selection.from + selection.to) / 2} y={PAD.top - 4} textAnchor="middle"
                fontSize={10.5} fontWeight={600} fill={picked ? t.ac : t.fa}
              >
                {picked ? `${picked[1] - picked[0] + 1} sessions` : "Select at least 2 sessions"}
              </text>
            </g>
          )}

          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")} pointerEvents="none"
            fill="none" stroke={t.ac} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
            opacity={selection ? 0.45 : 1}
          />
          {points.map((p, i) => {
            const big = p.attempt.id === activeId || isPicked(i);
            // Practice vuote: le statistiche contano solo le Simulation, piene.
            const practice = p.attempt.mode === "practice";
            return (
              <g key={p.attempt.id}>
                <circle
                  cx={p.x} cy={p.y} r={big ? 6 : 4} pointerEvents="none"
                  fill={practice ? t.card : t.ac}
                  stroke={practice ? t.ac : t.card}
                  strokeWidth={practice ? (big ? 2 : 1.5) : big ? 2 : 0}
                  opacity={selection && !isPicked(i) ? 0.45 : 1}
                />
                {/* Area di click piu' grande del pallino. */}
                <circle
                  cx={p.x} cy={p.y} r={15} fill="transparent" tabIndex={0} role="img"
                  aria-label={`${p.attempt.percentage.toFixed(1)}% — ${formatDateTime(p.attempt.endTime)}, ${
                    p.attempt.mode === "practice" ? "practice" : "simulation"}, ${p.attempt.questionCount} questions`}
                  style={{ cursor: selection ? "crosshair" : "pointer", outline: "none" }}
                  onMouseEnter={() => setActiveId(p.attempt.id)}
                  onFocus={() => setActiveId(p.attempt.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => setActiveId((prev) => (prev === p.attempt.id ? null : p.attempt.id))}
                />
              </g>
            );
          })}

          {n > 0 && (
            <g pointerEvents="none">
              <text x={PAD.left} y={HEIGHT - 12} fontSize={10} fill={t.fa}>
                {formatDateShort(visible[0].endTime)}
              </text>
              {n > 1 && (
                <text x={plotRight} y={HEIGHT - 12} textAnchor="end" fontSize={10} fill={t.fa}>
                  {formatDateShort(visible[n - 1].endTime)}
                </text>
              )}
            </g>
          )}
        </svg>
      )}

      {width > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 16px", marginTop: 4,
          padding: `0 ${PAD.right}px 0 ${PAD.left}px`, fontSize: 11.5, color: t.fa,
        }}>
          <span style={{ marginRight: "auto" }}>
            {[n >= 3 && "drag across the chart to zoom on a period", range && "double-click to show every session"]
              .filter(Boolean)
              .join(" · ")
              .replace(/^./, (c) => c.toUpperCase())}
          </span>
          <LegendItem label="Simulation" fill={t.ac} stroke={t.ac} />
          <LegendItem label="Practice" fill={t.card} stroke={t.ac} />
        </div>
      )}

      {hovered && (
        <div
          role="tooltip"
          style={{
            position: "absolute", left: hovered.x, top: hovered.y - 14, pointerEvents: "none",
            transform: `translate(${Math.min(Math.max(hovered.x, 96), Math.max(width - 96, 96)) - hovered.x}px, -100%) translateX(-50%)`,
            background: t.card, border: `1px solid ${t.bd3}`, borderRadius: 10, padding: "9px 12px",
            boxShadow: `0 4px 14px ${t.sh}`, whiteSpace: "nowrap", zIndex: 2,
          }}
        >
          <div style={{
            fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums",
            color: hovered.attempt.percentage >= PASS_MARK_PERCENT ? t.ok : t.er,
          }}>
            {hovered.attempt.percentage.toFixed(1)}%
          </div>
          <div style={{ fontSize: 12, color: t.tx2, marginTop: 2 }}>
            {formatDateTime(hovered.attempt.endTime)}
          </div>
          <div style={{ fontSize: 11.5, color: t.mu, marginTop: 2 }}>
            {hovered.attempt.mode === "practice" ? "Practice" : "Simulation"} · {hovered.attempt.questionCount} questions
            {" · "}{formatDuration(hovered.attempt.startTime, hovered.attempt.endTime)}
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ label, fill, stroke }: { label: string; fill: string; stroke: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
      <svg width={10} height={10} aria-hidden>
        <circle cx={5} cy={5} r={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
      </svg>
      {label}
    </span>
  );
}
