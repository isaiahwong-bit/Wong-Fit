import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Props = { accent: string; bodyColor: string };

/**
 * Dumbbell Lateral Raise — front view.
 *
 * Research-accurate form:
 * - Standing upright, feet shoulder-width
 * - Dumbbells start at sides, palms facing inward
 * - Arms lift laterally with 10-15° elbow bend maintained throughout
 * - Elbows lead (slightly higher than hands)
 * - Top position: arms at shoulder height (90° abduction) forming a "T"
 * - Shoulders stay depressed (no shrugging)
 * - Slight knee bend, torso stays vertical
 *
 * Lottie-inspired: filled capsule limbs, rounded joints, smooth spring.
 */
export const LateralAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-driven raise cycle
  const up = spring({ frame: frame % (fps * 2.5), fps, config: { damping: 16, stiffness: 60, mass: 1 } });
  const down = spring({
    frame: Math.max(0, (frame % (fps * 2.5)) - fps * 1.2),
    fps,
    config: { damping: 18, stiffness: 50, mass: 1.1 },
  });
  const p = up - down; // 0→1→0

  const groundY = 235;
  const cx = 100; // center of figure

  // --- FIXED BODY (front view, standing) ---
  const headY = 52;
  const shoulderY = 80;
  const hipY = 145;
  const kneeY = 192;
  const ankleY = groundY - 5;

  // Slight shoulder width
  const shoulderW = 14;
  const hipW = 8;
  const kneeW = 10;
  const footW = 12;

  // --- ARM ANIMATION ---
  // Arm abduction angle: 0° = at sides, 90° = horizontal (shoulder height)
  const abduction = interpolate(p, [0, 1], [8, 88]); // degrees from vertical

  // Arms maintain 10-15° elbow bend
  const elbowBend = 12; // degrees

  const rad = (deg: number) => (deg * Math.PI) / 180;

  // Upper arm length and forearm length
  const upperArmLen = 30;
  const forearmLen = 28;

  // LEFT ARM (going left)
  const elbLX = cx - shoulderW - Math.sin(rad(abduction)) * upperArmLen;
  const elbLY = shoulderY + Math.cos(rad(abduction)) * upperArmLen;
  // Forearm: continue with slight bend (elbow lower than shoulder, hand lower than elbow)
  const handLX = elbLX - Math.sin(rad(abduction - elbowBend)) * forearmLen;
  const handLY = elbLY + Math.cos(rad(abduction - elbowBend)) * forearmLen;

  // RIGHT ARM (going right, mirrored)
  const elbRX = cx + shoulderW + Math.sin(rad(abduction)) * upperArmLen;
  const elbRY = shoulderY + Math.cos(rad(abduction)) * upperArmLen;
  const handRX = elbRX + Math.sin(rad(abduction - elbowBend)) * forearmLen;
  const handRY = elbRY + Math.cos(rad(abduction - elbowBend)) * forearmLen;

  const capsule = (
    x1: number, y1: number, x2: number, y2: number,
    color: string, w: number, opacity = 1
  ) => (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={w} strokeLinecap="round" opacity={opacity}
    />
  );

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      {/* Ground */}
      <line x1={0} y1={groundY} x2={200} y2={groundY} stroke="#555" strokeWidth={1.5} opacity={0.3} />

      {/* --- LEGS (front view, slight stance) --- */}
      {/* Left leg */}
      {capsule(cx - hipW, hipY, cx - kneeW, kneeY, bodyColor, 7)}
      {capsule(cx - kneeW, kneeY, cx - footW, ankleY, bodyColor, 6.5)}
      <circle cx={cx - kneeW} cy={kneeY} r={4} fill={bodyColor} opacity={0.5} />
      <rect x={cx - footW - 8} y={ankleY - 2} width={18} height={6} rx={3} fill={accent} opacity={0.8} />

      {/* Right leg */}
      {capsule(cx + hipW, hipY, cx + kneeW, kneeY, bodyColor, 7)}
      {capsule(cx + kneeW, kneeY, cx + footW, ankleY, bodyColor, 6.5)}
      <circle cx={cx + kneeW} cy={kneeY} r={4} fill={bodyColor} opacity={0.5} />
      <rect x={cx + footW - 8} y={ankleY - 2} width={18} height={6} rx={3} fill={accent} opacity={0.8} />

      {/* --- TORSO (front view) --- */}
      {capsule(cx, hipY, cx, shoulderY, bodyColor, 8)}
      {/* Shoulder bar */}
      {capsule(cx - shoulderW, shoulderY, cx + shoulderW, shoulderY, bodyColor, 6)}

      {/* Joints */}
      <circle cx={cx} cy={hipY} r={4.5} fill="#fff" opacity={0.4} />
      <circle cx={cx - shoulderW} cy={shoulderY} r={3.5} fill="#fff" opacity={0.4} />
      <circle cx={cx + shoulderW} cy={shoulderY} r={3.5} fill="#fff" opacity={0.4} />

      {/* --- HEAD --- */}
      <circle cx={cx} cy={headY} r={14} fill={accent} opacity={0.85} />
      {/* Eyes */}
      <circle cx={cx - 4} cy={headY - 2} r={1.5} fill="#fff" opacity={0.5} />
      <circle cx={cx + 4} cy={headY - 2} r={1.5} fill="#fff" opacity={0.5} />

      {/* --- LEFT ARM + DUMBBELL --- */}
      {capsule(cx - shoulderW, shoulderY, elbLX, elbLY, accent, 5, 0.85)}
      <circle cx={elbLX} cy={elbLY} r={3} fill="#fff" opacity={0.6} />
      {capsule(elbLX, elbLY, handLX, handLY, accent, 4.5, 0.85)}

      {/* Left dumbbell (vertical orientation) */}
      <g opacity={0.75}>
        <line x1={handLX} y1={handLY - 8} x2={handLX} y2={handLY + 8} stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={handLX} cy={handLY - 8} r={5} fill="none" stroke={accent} strokeWidth={2} />
        <circle cx={handLX} cy={handLY + 8} r={5} fill="none" stroke={accent} strokeWidth={2} />
      </g>

      {/* --- RIGHT ARM + DUMBBELL --- */}
      {capsule(cx + shoulderW, shoulderY, elbRX, elbRY, accent, 5, 0.85)}
      <circle cx={elbRX} cy={elbRY} r={3} fill="#fff" opacity={0.6} />
      {capsule(elbRX, elbRY, handRX, handRY, accent, 4.5, 0.85)}

      {/* Right dumbbell */}
      <g opacity={0.75}>
        <line x1={handRX} y1={handRY - 8} x2={handRX} y2={handRY + 8} stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={handRX} cy={handRY - 8} r={5} fill="none" stroke={accent} strokeWidth={2} />
        <circle cx={handRX} cy={handRY + 8} r={5} fill="none" stroke={accent} strokeWidth={2} />
      </g>

      {/* Shadow */}
      <ellipse cx={cx} cy={groundY + 2} rx={22} ry={3} fill="#000" opacity={0.1} />
    </svg>
  );
};
