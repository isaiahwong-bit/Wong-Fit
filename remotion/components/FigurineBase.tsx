import React from "react";

/**
 * Stick-figure building blocks for exercise animations.
 *
 * All animations use a SIDE-VIEW perspective with consistent proportions:
 *   - viewBox is 200×260 (compositionWidth=240, compositionHeight=280, with padding)
 *   - Standing figure: head at ~45, shoulders at ~65, hips at ~130, knees at ~180, feet at ~230
 *   - Limb stroke width: 5 (legs) or 4 (arms)
 *   - Joints: small white circles (r=3.5)
 *   - Head: circle r=14
 *   - Feet: rounded rects 16×6
 */

/* ── Primitives ────────────────────────────────────────────── */

export function Head({
  cx,
  cy,
  r = 14,
  fill,
}: {
  cx: number;
  cy: number;
  r?: number;
  fill: string;
}) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} opacity={0.9} />;
}

export function Joint({
  cx,
  cy,
  r = 3.5,
}: {
  cx: number;
  cy: number;
  r?: number;
}) {
  return <circle cx={cx} cy={cy} r={r} fill="#fff" opacity={0.85} />;
}

export function Limb({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 4,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

export function Foot({
  x,
  y,
  w = 16,
  fill,
}: {
  x: number;
  y: number;
  w?: number;
  fill: string;
}) {
  return <rect x={x} y={y} width={w} height={6} rx={3} fill={fill} />;
}

export function Ground({ y = 238, w = 200 }: { y?: number; w?: number }) {
  return (
    <line
      x1={0}
      y1={y}
      x2={w}
      y2={y}
      stroke="#333"
      strokeWidth={1.5}
      opacity={0.5}
    />
  );
}

/* ── Equipment ─────────────────────────────────────────────── */

export function Barbell({
  x,
  y,
  width = 120,
  accent,
}: {
  x: number;
  y: number;
  width?: number;
  accent: string;
}) {
  const plateR = 10;
  return (
    <g>
      {/* Bar */}
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke={accent}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* Left plate */}
      <circle
        cx={x + 5}
        cy={y}
        r={plateR}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        opacity={0.6}
      />
      {/* Right plate */}
      <circle
        cx={x + width - 5}
        cy={y}
        r={plateR}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        opacity={0.6}
      />
    </g>
  );
}

export function Dumbbell({
  cx,
  cy,
  accent,
}: {
  cx: number;
  cy: number;
  accent: string;
}) {
  return (
    <g>
      <line
        x1={cx - 8}
        y1={cy}
        x2={cx + 8}
        y2={cy}
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.7}
      />
      <circle cx={cx - 8} cy={cy} r={5} fill="none" stroke={accent} strokeWidth={2} opacity={0.6} />
      <circle cx={cx + 8} cy={cy} r={5} fill="none" stroke={accent} strokeWidth={2} opacity={0.6} />
    </g>
  );
}

export function Kettlebell({
  cx,
  cy,
  accent,
}: {
  cx: number;
  cy: number;
  accent: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="none" stroke={accent} strokeWidth={2.5} opacity={0.6} />
      <path
        d={`M${cx - 4},${cy - 6} Q${cx - 4},${cy - 13} ${cx},${cy - 13} Q${cx + 4},${cy - 13} ${cx + 4},${cy - 6}`}
        fill="none"
        stroke={accent}
        strokeWidth={2}
        opacity={0.6}
      />
    </g>
  );
}

export function PullupBar({
  x,
  y,
  width = 100,
  accent,
}: {
  x: number;
  y: number;
  width?: number;
  accent: string;
}) {
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke={accent}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.5}
      />
      {/* Supports */}
      <line x1={x} y1={y} x2={x} y2={y - 15} stroke={accent} strokeWidth={3} opacity={0.3} />
      <line x1={x + width} y1={y} x2={x + width} y2={y - 15} stroke={accent} strokeWidth={3} opacity={0.3} />
    </g>
  );
}

/* ── Helper: get end point of a limb segment given origin, angle, length ── */

export function endPoint(
  ox: number,
  oy: number,
  angleDeg: number,
  length: number
): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [ox + Math.sin(rad) * length, oy + Math.cos(rad) * length];
}

/* ── Composed standing figure (for reference, not used directly) ── */

export function StandingFigure({
  cx = 100,
  accent,
  bodyColor,
}: {
  cx?: number;
  accent: string;
  bodyColor: string;
}) {
  const headY = 45;
  const shoulderY = 68;
  const hipY = 130;
  const kneeY = 182;
  const ankleY = 228;

  return (
    <g>
      <Head cx={cx} cy={headY} fill={accent} />
      {/* Spine */}
      <Limb x1={cx} y1={headY + 14} x2={cx} y2={hipY} color={bodyColor} width={5} />
      {/* Shoulders */}
      <Joint cx={cx} cy={shoulderY} />
      {/* Hip */}
      <Joint cx={cx} cy={hipY} />
      {/* Left leg */}
      <Limb x1={cx} y1={hipY} x2={cx - 8} y2={kneeY} color={bodyColor} width={5} />
      <Joint cx={cx - 8} cy={kneeY} />
      <Limb x1={cx - 8} y1={kneeY} x2={cx - 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={cx - 16} y={ankleY} fill={accent} />
      {/* Right leg */}
      <Limb x1={cx} y1={hipY} x2={cx + 8} y2={kneeY} color={bodyColor} width={5} />
      <Joint cx={cx + 8} cy={kneeY} />
      <Limb x1={cx + 8} y1={kneeY} x2={cx + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={cx} y={ankleY} fill={accent} />
      {/* Arms */}
      <Limb x1={cx} y1={shoulderY} x2={cx - 15} y2={shoulderY + 30} color={accent} width={3.5} />
      <Joint cx={cx - 15} cy={shoulderY + 30} r={3} />
      <Limb x1={cx - 15} y1={shoulderY + 30} x2={cx - 12} y2={shoulderY + 55} color={accent} width={3.5} />
      <Limb x1={cx} y1={shoulderY} x2={cx + 15} y2={shoulderY + 30} color={accent} width={3.5} />
      <Joint cx={cx + 15} cy={shoulderY + 30} r={3} />
      <Limb x1={cx + 15} y1={shoulderY + 30} x2={cx + 12} y2={shoulderY + 55} color={accent} width={3.5} />
      <Ground />
    </g>
  );
}
