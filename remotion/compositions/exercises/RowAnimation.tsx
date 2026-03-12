import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Props = { accent: string; bodyColor: string };

/**
 * Bent-Over Dumbbell Row — side view.
 *
 * Research-accurate form:
 * - Torso hinged at hips ~45° from vertical (constant throughout)
 * - Slight knee bend (~15-20°), shins near vertical
 * - Arms hang straight down at start, elbows drive back to ~90° at top
 * - Dumbbells travel from shin-height to lower ribcage
 * - Spine stays neutral (flat back) throughout
 *
 * Lottie-inspired style: rounded capsule limbs, filled body, smooth spring motion.
 */
export const RowAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-driven pull cycle
  const pullUp = spring({ frame: frame % (fps * 2), fps, config: { damping: 14, stiffness: 80, mass: 0.8 } });
  const release = spring({ frame: Math.max(0, (frame % (fps * 2)) - fps), fps, config: { damping: 16, stiffness: 60, mass: 1 } });
  const p = pullUp - release; // 0→1→0

  const groundY = 232;

  // --- FIXED BODY POSITIONS (side view, facing left) ---
  // Feet: flat on ground, slight stance
  const footBackX = 130;
  const footFrontX = 110;
  const ankleY = groundY - 4;

  // Knees: slight bend (~15°)
  const kneeBackX = 125;
  const kneeFrontX = 115;
  const kneeY = 190;

  // Hip: center of hinge
  const hipX = 115;
  const hipY = 148;

  // Torso: hinged forward at ~45° from vertical
  // Shoulder is forward and up from hip
  const shoulderX = 72;
  const shoulderY = 105;

  // Head: extends forward from shoulder
  const headX = 58;
  const headY = 94;

  // --- ANIMATED ARMS ---
  // At rest (p=0): arms hang straight down from shoulders
  // At top (p=1): elbows pulled back, forearms angled, dumbbells at ribcage

  // Elbow position
  const elbowX = interpolate(p, [0, 1], [72, 95]);
  const elbowY = interpolate(p, [0, 1], [145, 112]);

  // Hand/dumbbell position
  const handX = interpolate(p, [0, 1], [72, 82]);
  const handY = interpolate(p, [0, 1], [170, 130]);

  // Slight scapular retraction at top (shoulders pull back a tiny bit)
  const scapRetract = interpolate(p, [0, 1], [0, 3]);

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

      {/* --- LEGS --- */}
      {/* Back leg: hip → knee → ankle */}
      {capsule(hipX + 2, hipY, kneeBackX, kneeY, bodyColor, 7)}
      {capsule(kneeBackX, kneeY, footBackX, ankleY, bodyColor, 6.5)}
      {/* Front leg */}
      {capsule(hipX - 2, hipY, kneeFrontX, kneeY, bodyColor, 7)}
      {capsule(kneeFrontX, kneeY, footFrontX, ankleY, bodyColor, 6.5)}

      {/* Knee joints */}
      <circle cx={kneeBackX} cy={kneeY} r={4} fill={bodyColor} opacity={0.6} />
      <circle cx={kneeFrontX} cy={kneeY} r={4} fill={bodyColor} opacity={0.6} />

      {/* Feet */}
      <rect x={footBackX - 2} y={ankleY - 2} width={18} height={6} rx={3} fill={accent} opacity={0.8} />
      <rect x={footFrontX - 6} y={ankleY - 2} width={18} height={6} rx={3} fill={accent} opacity={0.8} />

      {/* --- TORSO (flat back, hinged forward ~45°) --- */}
      {capsule(hipX, hipY, shoulderX + scapRetract, shoulderY, bodyColor, 8)}

      {/* Hip joint */}
      <circle cx={hipX} cy={hipY} r={4.5} fill="#fff" opacity={0.5} />

      {/* Shoulder joint */}
      <circle cx={shoulderX + scapRetract} cy={shoulderY} r={4} fill="#fff" opacity={0.5} />

      {/* --- HEAD --- */}
      <circle cx={headX + scapRetract * 0.5} cy={headY} r={13} fill={accent} opacity={0.85} />
      {/* Eye dot for direction */}
      <circle cx={headX + scapRetract * 0.5 - 5} cy={headY - 2} r={1.5} fill="#fff" opacity={0.6} />

      {/* --- ARMS (pulling dumbbells) --- */}
      {/* Upper arm: shoulder → elbow */}
      {capsule(shoulderX + scapRetract, shoulderY + 3, elbowX, elbowY, accent, 5, 0.85)}
      {/* Forearm: elbow → hand */}
      {capsule(elbowX, elbowY, handX, handY, accent, 4.5, 0.85)}

      {/* Elbow joint */}
      <circle cx={elbowX} cy={elbowY} r={3} fill="#fff" opacity={0.7} />

      {/* --- DUMBBELLS --- */}
      <g opacity={0.75}>
        {/* Dumbbell handle */}
        <line
          x1={handX - 10} y1={handY}
          x2={handX + 10} y2={handY}
          stroke={accent} strokeWidth={3} strokeLinecap="round"
        />
        {/* Dumbbell weights */}
        <circle cx={handX - 10} cy={handY} r={5.5} fill="none" stroke={accent} strokeWidth={2.5} />
        <circle cx={handX + 10} cy={handY} r={5.5} fill="none" stroke={accent} strokeWidth={2.5} />
      </g>

      {/* Subtle shadow under figure */}
      <ellipse cx={110} cy={groundY + 2} rx={30} ry={3} fill="#000" opacity={0.1} />
    </svg>
  );
};
