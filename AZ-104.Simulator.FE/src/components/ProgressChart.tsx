import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useTheme } from "../theme/ThemeContext";
import { PASS_MARK_PERCENT } from "../constants";
import { formatDateShort, formatDateTime, formatDuration } from "../utils/format";
import type { ExamAttemptDto } from "../types/answer";

const HEIGHT = 210;
// Margine destro largo: l'etichetta della soglia sta fuori dall'area dei punti.
const PAD = { top: 16, right: 64, bottom: 34, left: 44 };
const BRUSH_HEIGHT = 40;
const Y_STEP = 5;
const MIN_Y_SPAN = 10;

type Range = [number, number];

interface ProgressChartProps {
  /** Tutti i tentativi, dal piu' vecchio. */
  attempts: ExamAttemptDto[];
  /** Indici inclusi in attempts; null = tutto. */
  range: Range | null;
  onRangeChange: (range: Range | null) => void;
  /** Percentuali; null = 0-100. */
  yDomain: Range | null;
  onYDomainChange: (domain: Range | null) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Tacche nell'intervallo visibile, estremi compresi: il passo si stringe con lo zoom. */
function yTicks(lo: number, hi: number): number[] {
  const span = hi - lo;
  const step = span <= 30 ? 5 : span <= 60 ? 10 : 25;
  const ticks = [lo];
  for (let v = Math.ceil((lo + step / 2) / step) * step; v <= hi - step / 2; v += step) ticks.push(v);
  ticks.push(hi);
  return ticks;
}

/** Il puntatore resta catturato dall'elemento finche' non si rilascia, anche fuori dal grafico. */
function startDrag(e: ReactPointerEvent<SVGElement>, onMove: (ev: PointerEvent) => void, onEnd?: () => void) {
  e.preventDefault();
  const target = e.currentTarget;
  target.setPointerCapture(e.pointerId);
  const end = () => {
    target.removeEventListener("pointermove", onMove);
    target.removeEventListener("pointerup", end);
    target.removeEventListener("pointercancel", end);
    onEnd?.();
  };
  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerup", end);
  target.addEventListener("pointercancel", end);
}

/** In pixel misurati, non in un viewBox riscalato, che deformerebbe pallini ed etichette. */
export function ProgressChart({ attempts, range, onRangeChange, yDomain, onYDomainChange }: ProgressChartProps) {
  const { tokens: t } = useTheme();
  const clipId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<SVGSVGElement>(null);
  const brushRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);
  const [activeId, setActiveId] = useState<number | null>(null);
  // Durante il trascinamento di un estremo dell'asse Y: lo zoom si applica al rilascio.
  const [yDrag, setYDrag] = useState<{ which: "lo" | "hi"; value: number } | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const total = attempts.length;
  const [start, end] = range ?? [0, Math.max(0, total - 1)];
  const [lo, hi] = yDomain ?? [0, 100];
  const visible = attempts.slice(start, end + 1);
  const n = visible.length;
  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  // Spaziatura uniforme, non proporzionale alle date: un buco di un mese schiaccerebbe il resto.
  const x = (i: number) => (n === 1 ? PAD.left + innerW / 2 : PAD.left + (i / (n - 1)) * innerW);
  const y = (pct: number) => PAD.top + (1 - (pct - lo) / (hi - lo)) * innerH;

  const points = visible.map((a, i) => ({ x: x(i), y: y(a.percentage), attempt: a }));
  const hovered = points.find((p) => p.attempt.id === activeId) ?? null;

  const emitRange = (s: number, e: number) => onRangeChange(s === 0 && e === total - 1 ? null : [s, e]);
  const emitY = (l: number, h: number) => onYDomainChange(l === 0 && h === 100 ? null : [l, h]);

  // --- asse Y: si trascina un estremo, con la scala di quando si e' cominciato.
  function dragY(which: "lo" | "hi", e: ReactPointerEvent<SVGElement>) {
    const rect = plotRef.current!.getBoundingClientRect();
    const [lo0, hi0] = [lo, hi];
    let value = which === "hi" ? hi0 : lo0;
    setYDrag({ which, value });
    startDrag(
      e,
      (ev) => {
        const raw = hi0 - ((ev.clientY - rect.top - PAD.top) / innerH) * (hi0 - lo0);
        const snapped = Math.round(raw / Y_STEP) * Y_STEP;
        value = which === "hi" ? clamp(snapped, lo0 + MIN_Y_SPAN, 100) : clamp(snapped, 0, hi0 - MIN_Y_SPAN);
        setYDrag({ which, value });
      },
      () => {
        setYDrag(null);
        if (which === "hi") emitY(lo0, value);
        else emitY(value, hi0);
      },
    );
  }

  function keyY(which: "lo" | "hi", e: KeyboardEvent<SVGElement>) {
    const delta = e.key === "ArrowUp" ? Y_STEP : e.key === "ArrowDown" ? -Y_STEP : 0;
    if (!delta) return;
    e.preventDefault();
    if (which === "hi") emitY(lo, clamp(hi + delta, lo + MIN_Y_SPAN, 100));
    else emitY(clamp(lo + delta, 0, hi - MIN_Y_SPAN), hi);
  }

  // --- selettore del periodo: stessa ampiezza orizzontale del grafico, sempre su tutto lo storico.
  const bx = (i: number) => (total === 1 ? PAD.left + innerW / 2 : PAD.left + (i / (total - 1)) * innerW);
  const by = (pct: number) => 5 + (1 - pct / 100) * (BRUSH_HEIGHT - 10);
  const indexAt = (clientX: number) => {
    const rect = brushRef.current!.getBoundingClientRect();
    return clamp(Math.round(((clientX - rect.left - PAD.left) / innerW) * (total - 1)), 0, total - 1);
  };

  function dragHandle(which: "start" | "end", e: ReactPointerEvent<SVGElement>) {
    const [s0, e0] = [start, end];
    startDrag(e, (ev) => {
      const i = indexAt(ev.clientX);
      if (which === "start") emitRange(Math.min(i, e0 - 1), e0);
      else emitRange(s0, Math.max(i, s0 + 1));
    });
  }

  function dragWindow(e: ReactPointerEvent<SVGElement>) {
    const grab = indexAt(e.clientX);
    const [s0, span] = [start, end - start];
    startDrag(e, (ev) => {
      const s = clamp(s0 + indexAt(ev.clientX) - grab, 0, total - 1 - span);
      emitRange(s, s + span);
    });
  }

  function keyHandle(which: "start" | "end", e: KeyboardEvent<SVGElement>) {
    const delta = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!delta) return;
    e.preventDefault();
    if (which === "start") emitRange(clamp(start + delta, 0, end - 1), end);
    else emitRange(start, clamp(end + delta, start + 1, total - 1));
  }

  const showBrush = total > 1;
  const passVisible = PASS_MARK_PERCENT >= lo && PASS_MARK_PERCENT <= hi;
  const plotRight = width - PAD.right;
  const yGuide = yDrag ? clamp(y(yDrag.value), PAD.top, PAD.top + innerH) : null;

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {width > 0 && (
        <svg
          ref={plotRef}
          width={width}
          height={HEIGHT}
          style={{ display: "block", overflow: "visible" }}
          onMouseLeave={() => setActiveId(null)}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={PAD.left - 8} y={PAD.top - 8} width={innerW + 16} height={innerH + 16} />
            </clipPath>
          </defs>

          {yTicks(lo, hi).map((v) => (
            <g key={v}>
              <line x1={PAD.left} y1={y(v)} x2={plotRight} y2={y(v)} stroke={t.bd2} strokeWidth={1} />
              <text x={PAD.left - 10} y={y(v) + 3.5} textAnchor="end" fontSize={10} fill={t.fa} style={{ fontVariantNumeric: "tabular-nums" }}>
                {v}%
              </text>
            </g>
          ))}

          {passVisible && (
            <>
              <line
                x1={PAD.left} y1={y(PASS_MARK_PERCENT)} x2={plotRight} y2={y(PASS_MARK_PERCENT)}
                stroke={t.ok} strokeWidth={1} strokeDasharray="4 4" opacity={0.7}
              />
              <text x={plotRight + 8} y={y(PASS_MARK_PERCENT) + 3.5} fontSize={9.5} fill={t.ok}>
                Pass {PASS_MARK_PERCENT}%
              </text>
            </>
          )}

          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerH} stroke={t.bd3} strokeWidth={1} />

          {/* Un punteggio fuori dall'intervallo zoomato esce dal riquadro invece di schiacciarsi sul bordo. */}
          <g clipPath={`url(#${clipId})`}>
            <polyline
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none" stroke={t.ac} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
            />
            {points.map((p) => {
              const active = p.attempt.id === activeId;
              return (
                <g key={p.attempt.id}>
                  <circle cx={p.x} cy={p.y} r={active ? 6 : 4} fill={t.ac} stroke={t.card} strokeWidth={active ? 2 : 0} />
                  {/* Area di click piu' grande del pallino. */}
                  <circle
                    cx={p.x} cy={p.y} r={15} fill="transparent" tabIndex={0} role="img"
                    aria-label={`${p.attempt.percentage.toFixed(1)}% — ${formatDateTime(p.attempt.endTime)}, ${
                      p.attempt.mode === "practice" ? "practice" : "simulation"}, ${p.attempt.questionCount} questions`}
                    style={{ cursor: "pointer", outline: "none" }}
                    onMouseEnter={() => setActiveId(p.attempt.id)}
                    onFocus={() => setActiveId(p.attempt.id)}
                    onBlur={() => setActiveId(null)}
                    onClick={() => setActiveId((prev) => (prev === p.attempt.id ? null : p.attempt.id))}
                  />
                </g>
              );
            })}
          </g>

          {/* Fascia dell'asse Y: doppio clic per tornare a 0-100%. */}
          <rect
            x={0} y={PAD.top} width={PAD.left} height={innerH} fill="transparent"
            onDoubleClick={() => onYDomainChange(null)}
          >
            <title>Drag the ends of the axis to zoom · double-click to reset</title>
          </rect>

          {yDrag && yGuide !== null && (
            <g pointerEvents="none">
              <line x1={PAD.left} y1={yGuide} x2={plotRight} y2={yGuide} stroke={t.ac} strokeWidth={1.5} />
              <rect x={PAD.left + 6} y={yGuide - 19} width={42} height={16} rx={4} fill={t.ac} />
              <text x={PAD.left + 27} y={yGuide - 7.5} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="#fff">
                {yDrag.value}%
              </text>
            </g>
          )}

          {(["hi", "lo"] as const).map((which) => {
            const cy = yDrag?.which === which && yGuide !== null ? yGuide : which === "hi" ? PAD.top : PAD.top + innerH;
            const value = which === "hi" ? hi : lo;
            return (
              <g
                key={which}
                role="slider"
                tabIndex={0}
                aria-orientation="vertical"
                aria-label={which === "hi" ? "Top of the score axis" : "Bottom of the score axis"}
                aria-valuemin={which === "hi" ? lo + MIN_Y_SPAN : 0}
                aria-valuemax={which === "hi" ? 100 : hi - MIN_Y_SPAN}
                aria-valuenow={value}
                aria-valuetext={`${value}%`}
                style={{ cursor: "ns-resize", touchAction: "none", outline: "none" }}
                onPointerDown={(e) => dragY(which, e)}
                onKeyDown={(e) => keyY(which, e)}
                onDoubleClick={() => onYDomainChange(null)}
              >
                <rect x={PAD.left - 14} y={cy - 10} width={28} height={20} fill="transparent" />
                <rect x={PAD.left - 6} y={cy - 3} width={12} height={6} rx={3} fill={t.card} stroke={t.ac} strokeWidth={1.5} />
              </g>
            );
          })}

          {n > 0 && (
            <>
              <text x={PAD.left} y={HEIGHT - 12} fontSize={10} fill={t.fa}>
                {formatDateShort(visible[0].endTime)}
              </text>
              {n > 1 && (
                <text x={plotRight} y={HEIGHT - 12} textAnchor="end" fontSize={10} fill={t.fa}>
                  {formatDateShort(visible[n - 1].endTime)}
                </text>
              )}
            </>
          )}
        </svg>
      )}

      {width > 0 && showBrush && (
        <svg
          ref={brushRef}
          width={width}
          height={BRUSH_HEIGHT}
          style={{ display: "block", marginTop: 4, overflow: "visible" }}
          onDoubleClick={() => onRangeChange(null)}
        >
          <rect x={PAD.left} y={0} width={innerW} height={BRUSH_HEIGHT} rx={8} fill={t.sub} stroke={t.bd2} />
          <polyline
            points={attempts.map((a, i) => `${bx(i)},${by(a.percentage)}`).join(" ")}
            fill="none" stroke={t.fa2} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round"
          />

          <rect
            x={bx(start)} y={1} width={Math.max(0, bx(end) - bx(start))} height={BRUSH_HEIGHT - 2} rx={6}
            fill={t.ac} fillOpacity={0.14} stroke={t.ac} strokeWidth={1.5}
            style={{ cursor: "grab", touchAction: "none" }}
            onPointerDown={dragWindow}
          >
            <title>Drag to move the period · double-click to show everything</title>
          </rect>

          {(["start", "end"] as const).map((which) => {
            const index = which === "start" ? start : end;
            const hx = bx(index);
            return (
              <g
                key={which}
                role="slider"
                tabIndex={0}
                aria-label={which === "start" ? "First session shown" : "Last session shown"}
                aria-valuemin={which === "start" ? 1 : start + 2}
                aria-valuemax={which === "start" ? end : total}
                aria-valuenow={index + 1}
                aria-valuetext={`Session ${index + 1} of ${total}, ${formatDateShort(attempts[index].endTime)}`}
                style={{ cursor: "ew-resize", touchAction: "none", outline: "none" }}
                onPointerDown={(e) => dragHandle(which, e)}
                onKeyDown={(e) => keyHandle(which, e)}
              >
                <rect x={hx - 12} y={0} width={24} height={BRUSH_HEIGHT} fill="transparent" />
                <rect x={hx - 4} y={BRUSH_HEIGHT / 2 - 12} width={8} height={24} rx={4} fill={t.card} stroke={t.ac} strokeWidth={1.5} />
              </g>
            );
          })}
        </svg>
      )}

      {width > 0 && showBrush && (
        <div style={{ marginTop: 8, paddingLeft: PAD.left, fontSize: 11.5, color: t.fa }}>
          Drag the handles to pick a period and the ends of the % axis to zoom · double-click to reset
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
