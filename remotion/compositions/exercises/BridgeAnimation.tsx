import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type Props = { accent: string; bodyColor: string };

/**
 * Glute Bridge — side view (head on left, feet on right).
 *
 * Research-accurate form:
 * - Supine position (lying on back), shoulders stay on ground
 * - Feet flat, hip-width apart, ~6-8 inches from glutes
 * - Knees bent at ~90° at the top
 * - Hips drive up until body forms straight line: shoulders → hips → knees
 * - Arms flat on ground beside body, palms down
 * - Head neutral, resting on floor
 *
 * Lottie-inspired: filled capsule limbs, rounded joints, smooth spring motion.
 */
export const BridgeAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-driven hip raise cycle
  const up = spring({ frame: frame % (fps * 2), fps, config: { damping: 14, stiffness: 70, mass: 0.9 } });
  const down = spring({ frame: Math.max(0, (frame % (fps * 2)) - fps), fps, config: { damping: 16, stiffness: 50, mass: 1 } });
  const p = up - down; // 0→1→0

  const groundY = 205;

  // --- FIXED POSITIONS ---
  // Head rests on ground (left side)
  const headX = 38;
  const headY = groundY - 14;

  // Shoulders stay on ground
  const shoulderX = 58;
  const shoulderY = groundY - 8;

  // Feet stay planted (right side), flat on ground
  const footX = 155;
  const ankleX = 152;
  const ankleY = groundY - 4;

  // --- ANIMATED HIP ---
  // Bottom: hips near ground. Top: hips raised to form straight line shoulders→hips→knees
  const hipX = 100;
  const hipY = interpolate(p, [0, 1], [groundY - 10, groundY - 52]);

  // Knees: stay ~90° at top, feet planted
  // Knee position adjusts as hip rises
  const kneeX = interpolate(p, [0, 1], [138, 132]);
  const kneeY = interpolate(p, [0, 1], [groundY - 35, groundY - 45]);

  // Arms: flat on ground beside body
  const armFrontEndX = shoulderX + 18;
  const armBackEndX = shoulderX - 18;
  const armY = groundY - 3;

  // Upper back on ground (shoulder blades stay down)
  const upperBackX = headX + 14;
  const upperBackY = groundY - 10;

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
      {/* Ground / mat */}
      <rect x={10} y={groundY} width={180} height={4} rx={2} fill="#555" opacity={0.15} />
      <line x1={0} y1={groundY} x2={200} y2={groundY} stroke="#555" strokeWidth={1.5} opacity={0.3} />

      {/* --- ARMS (on ground) --- */}
      {capsule(shoulderX, shoulderY + 2, armFrontEndX, armY, accent, 4, 0.5)}
      {capsule(shoulderX, shoulderY + 2, armBackEndX, armY, accent, 4, 0.5)}
      {/* Palms */}
      <rect x={armFrontEndX - 2} y={armY - 2} width={6} height={4} rx={2} fill={accent} opacity={0.4} />
      <rect x={armBackEndX - 4} y={armY - 2} width={6} height={4} rx={2} fill={accent} opacity={0.4} />

      {/* --- UPPER BACK on ground --- */}
      {capsule(upperBackX, upperBackY, shoulderX, shoulderY, bodyColor, 8)}

      {/* --- TORSO / SPINE (the bridge arc) --- */}
      {/* Shoulder → hip: this is the segment that rises */}
      {capsule(shoulderX, shoulderY, hipX, hipY, bodyColor, 8)}

      {/* --- THIGH: hip → knee --- */}
      {capsule(hipX, hipY, kneeX, kneeY, bodyColor, 7.5)}

      {/* --- SHIN: knee → ankle (near vertical at top) --- */}
      {capsule(kneeX, kneeY, ankleX, ankleY, bodyColor, 7)}

      {/* Joints */}
      <circle cx={shoulderX} cy={shoulderY} r={4} fill="#fff" opacity={0.4} />
      <circle cx={hipX} cy={hipY} r={4.5} fill="#fff" opacity={0.5} />
      <circle cx={kneeX} cy={kneeY} r={4} fill="#fff" opacity={0.4} />

      {/* --- FOOT (flat on ground) --- */}
      <rect x={footX - 6} y={ankleY - 2} width={18} height={6} rx={3} fill={accent} opacity={0.8} />

      {/* --- HEAD (resting on ground) --- */}
      <circle cx={headX} cy={headY} r={12} fill={accent} opacity={0.85} />
      {/* Eye */}
      <circle cx={headX + 5} cy={headY - 3} r={1.5} fill="#fff" opacity={0.5} />

      {/* Subtle glow on hip at top of bridge */}
      {p > 0.5 && (
        <circle cx={hipX} cy={hipY} r={8} fill={accent} opacity={interpolate(p, [0.5, 1], [0, 0.15])} />
      )}

      {/* Shadow */}
      <ellipse cx={100} cy={groundY + 3} rx={50} ry={3} fill="#000" opacity={0.08} />
    </svg>
  );
};
