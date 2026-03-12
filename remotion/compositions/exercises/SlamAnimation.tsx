import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

type Props = { accent: string; bodyColor: string };

/**
 * Medicine Ball Slam — side view.
 *
 * Research-accurate 3-phase movement:
 * Phase 1 (Raise): Slight squat load → explosive triple extension → rise on toes →
 *                   arms extend ball overhead (170-180° shoulder flexion)
 * Phase 2 (Slam):  Rapid hip hinge + knee flexion → torso bends ~45-60° forward →
 *                   arms whip ball down to ground between feet
 * Phase 3 (Reset): Return to neutral standing with ball at chest
 *
 * Key details:
 * - Ball goes from chest → overhead (slight back lean) → slammed to floor
 * - Deep squat on slam (knees 90-120°)
 * - Spine stays neutral (no rounding)
 * - Explosive, dynamic movement
 */
export const SlamAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2; // 2-second cycle
  const t = frame % cycle;

  // 3-phase timeline: raise (0-35%), slam (35-60%), reset (60-100%)
  const raise = interpolate(t, [0, cycle * 0.35], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const slam = interpolate(t, [cycle * 0.35, cycle * 0.6], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reset = interpolate(t, [cycle * 0.6, cycle * 0.95], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const groundY = 232;
  const cx = 100;

  // --- BODY KINEMATICS per phase ---

  // Torso lean from vertical (degrees): 0 = upright, positive = forward lean
  const torsoLean = interpolate(
    t,
    [0, cycle * 0.2, cycle * 0.35, cycle * 0.55, cycle * 0.6, cycle * 0.95, cycle],
    [5, 0, -8, 55, 55, 5, 5],
    { easing: Easing.inOut(Easing.sin) }
  );

  // Hip height (lower on slam for deep squat)
  const hipY = interpolate(
    t,
    [0, cycle * 0.2, cycle * 0.35, cycle * 0.55, cycle * 0.6, cycle * 0.95, cycle],
    [140, 135, 130, 165, 165, 140, 140],
    { easing: Easing.inOut(Easing.sin) }
  );

  // Knee bend angle (degrees from vertical)
  const kneeBend = interpolate(
    t,
    [0, cycle * 0.2, cycle * 0.35, cycle * 0.55, cycle * 0.6, cycle * 0.95, cycle],
    [8, 5, 2, 35, 35, 8, 8],
    { easing: Easing.inOut(Easing.sin) }
  );

  // Rise on toes at peak (overhead position)
  const toeRise = interpolate(
    t,
    [0, cycle * 0.25, cycle * 0.35, cycle * 0.45, cycle],
    [0, 0, 8, 0, 0],
    { easing: Easing.inOut(Easing.sin), extrapolateRight: "clamp" }
  );

  const ankleY = groundY - 4 - toeRise;

  // Calculate body positions
  const rad = (deg: number) => (deg * Math.PI) / 180;

  // Shoulder from hip (torso as rigid segment)
  const spineLen = 62;
  const shoulderX = cx - Math.sin(rad(torsoLean)) * spineLen;
  const shoulderY = hipY - Math.cos(rad(torsoLean)) * spineLen;

  // Head
  const headX = shoulderX - Math.sin(rad(torsoLean)) * 18;
  const headY = shoulderY - Math.cos(rad(torsoLean)) * 18;

  // --- ARM + BALL POSITION ---
  // Ball trajectory: chest (0) → overhead (0.35) → ground (0.6) → chest (1.0)
  const ballX = interpolate(
    t,
    [0, cycle * 0.2, cycle * 0.35, cycle * 0.55, cycle * 0.6, cycle * 0.95, cycle],
    [shoulderX - 15, shoulderX - 10, headX, cx + 10, cx + 10, cx - 10, cx - 10],
    { easing: Easing.inOut(Easing.sin) }
  );
  const ballY = interpolate(
    t,
    [0, cycle * 0.2, cycle * 0.35, cycle * 0.55, cycle * 0.6, cycle * 0.95, cycle],
    [shoulderY + 5, shoulderY - 20, headY - 30, groundY - 15, groundY - 15, shoulderY + 5, shoulderY + 5],
    { easing: Easing.inOut(Easing.sin) }
  );

  // --- LEGS ---
  const thighLen = 46;
  const shinLen = 44;

  // Left leg (front, slightly forward)
  const knLX = cx - 8 + Math.sin(rad(kneeBend)) * thighLen;
  const knLY = hipY + Math.cos(rad(kneeBend)) * thighLen;
  const footLX = cx - 14;

  // Right leg (back, slightly back)
  const knRX = cx + 4 + Math.sin(rad(kneeBend - 3)) * thighLen;
  const knRY = hipY + Math.cos(rad(kneeBend - 3)) * thighLen;
  const footRX = cx + 4;

  const capsule = (
    x1: number, y1: number, x2: number, y2: number,
    color: string, w: number, opacity = 1
  ) => (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={w} strokeLinecap="round" opacity={opacity}
    />
  );

  // Impact flash on slam
  const isSlam = t > cycle * 0.5 && t < cycle * 0.65;
  const flashOpacity = isSlam ? interpolate(t, [cycle * 0.5, cycle * 0.55, cycle * 0.65], [0, 0.4, 0]) : 0;

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      {/* Ground */}
      <line x1={0} y1={groundY} x2={200} y2={groundY} stroke="#555" strokeWidth={1.5} opacity={0.3} />

      {/* Impact flash */}
      {flashOpacity > 0 && (
        <circle cx={ballX} cy={groundY - 10} r={20} fill={accent} opacity={flashOpacity} />
      )}

      {/* --- LEGS --- */}
      {/* Left leg */}
      {capsule(cx - 4, hipY, knLX, knLY, bodyColor, 7)}
      {capsule(knLX, knLY, footLX + 6, ankleY, bodyColor, 6.5)}
      <circle cx={knLX} cy={knLY} r={4} fill={bodyColor} opacity={0.6} />
      <rect x={footLX - 2} y={ankleY - 2} width={18} height={6} rx={3} fill={accent} opacity={0.8} />

      {/* Right leg */}
      {capsule(cx + 4, hipY, knRX, knRY, bodyColor, 7)}
      {capsule(knRX, knRY, footRX + 6, ankleY, bodyColor, 6.5)}
      <circle cx={knRX} cy={knRY} r={4} fill={bodyColor} opacity={0.6} />
      <rect x={footRX - 2} y={ankleY - 2} width={18} height={6} rx={3} fill={accent} opacity={0.8} />

      {/* --- TORSO --- */}
      {capsule(cx, hipY, shoulderX, shoulderY, bodyColor, 8)}
      <circle cx={cx} cy={hipY} r={4.5} fill="#fff" opacity={0.5} />
      <circle cx={shoulderX} cy={shoulderY} r={4} fill="#fff" opacity={0.5} />

      {/* --- HEAD --- */}
      <circle cx={headX} cy={headY} r={13} fill={accent} opacity={0.85} />
      <circle cx={headX - 4} cy={headY - 3} r={1.5} fill="#fff" opacity={0.5} />

      {/* --- ARMS (both reach to ball) --- */}
      {capsule(shoulderX - 3, shoulderY + 2, ballX, ballY, accent, 5, 0.8)}
      {capsule(shoulderX + 3, shoulderY + 2, ballX, ballY, accent, 5, 0.8)}

      {/* --- MEDICINE BALL --- */}
      <circle cx={ballX} cy={ballY} r={11} fill="none" stroke={accent} strokeWidth={2.5} opacity={0.7} />
      <circle cx={ballX} cy={ballY} r={4} fill={accent} opacity={0.3} />
      {/* Cross pattern on ball */}
      <line x1={ballX - 7} y1={ballY} x2={ballX + 7} y2={ballY} stroke={accent} strokeWidth={1} opacity={0.3} />
      <line x1={ballX} y1={ballY - 7} x2={ballX} y2={ballY + 7} stroke={accent} strokeWidth={1} opacity={0.3} />

      {/* Shadow */}
      <ellipse cx={cx} cy={groundY + 2} rx={25} ry={3} fill="#000" opacity={0.1} />
    </svg>
  );
};
