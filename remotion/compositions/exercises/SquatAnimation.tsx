import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, Barbell, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Squat: side-view. Figure descends by bending hips and knees,
 * torso leans forward slightly. Barbell across shoulders.
 */
export const SquatAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2.2;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Progress 0→1→0 (down then up)
  const p = interpolate(t, [0, cycle * 0.45, cycle], [0, 1, 0], { easing: ease });

  // Key positions
  const cx = 100;
  const groundY = 235;

  // Hip drops and moves back, torso tilts forward
  const hipX = cx + p * -6;
  const hipY = interpolate(p, [0, 1], [130, 170]);
  const torsoAngle = interpolate(p, [0, 1], [-2, -25]); // lean forward in degrees
  const spineLen = 60;
  const [shoulderX, shoulderY] = endPoint(hipX, hipY, torsoAngle, -spineLen);
  const headY = shoulderY - 18;
  const headX = shoulderX;

  // Knees come forward, feet stay planted
  const footLX = cx - 12;
  const footRX = cx + 4;
  const ankleY = groundY - 6;

  // Knee angles — bend more as p increases
  const kneeBend = interpolate(p, [0, 1], [5, 55]);

  // Left leg: hip → knee → ankle
  const [knLX, knLY] = endPoint(hipX - 4, hipY, kneeBend, 48);
  // Right leg
  const [knRX, knRY] = endPoint(hipX + 4, hipY, kneeBend, 48);

  // Arms hold barbell at shoulder level, angled down slightly
  const armLen1 = 28;
  const armLen2 = 24;
  const armAngle = interpolate(p, [0, 1], [15, 40]);
  const [elbLX, elbLY] = endPoint(shoulderX, shoulderY, -(armAngle + 5), armLen1);
  const [handLX, handLY] = endPoint(elbLX, elbLY, armAngle + 60, armLen2);
  const [elbRX, elbRY] = endPoint(shoulderX, shoulderY, armAngle + 5, armLen1);
  const [handRX, handRY] = endPoint(elbRX, elbRY, -(armAngle + 60), armLen2);

  // Barbell across shoulders
  const barY = shoulderY + 2;

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <Ground y={groundY} />

      {/* Barbell */}
      <Barbell x={shoulderX - 55} y={barY} width={110} accent={accent} />

      {/* Spine */}
      <Limb x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} color={bodyColor} width={5} />

      {/* Head */}
      <Head cx={headX} cy={headY} fill={accent} />

      {/* Shoulder joint */}
      <Joint cx={shoulderX} cy={shoulderY} />

      {/* Arms */}
      <Limb x1={shoulderX} y1={shoulderY} x2={elbLX} y2={elbLY} color={accent} width={3.5} />
      <Joint cx={elbLX} cy={elbLY} r={3} />
      <Limb x1={elbLX} y1={elbLY} x2={handLX} y2={handLY} color={accent} width={3.5} />

      <Limb x1={shoulderX} y1={shoulderY} x2={elbRX} y2={elbRY} color={accent} width={3.5} />
      <Joint cx={elbRX} cy={elbRY} r={3} />
      <Limb x1={elbRX} y1={elbRY} x2={handRX} y2={handRY} color={accent} width={3.5} />

      {/* Hip joint */}
      <Joint cx={hipX} cy={hipY} />

      {/* Left leg */}
      <Limb x1={hipX - 4} y1={hipY} x2={knLX} y2={knLY} color={bodyColor} width={5} />
      <Joint cx={knLX} cy={knLY} />
      <Limb x1={knLX} y1={knLY} x2={footLX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footLX} y={ankleY} fill={accent} />

      {/* Right leg */}
      <Limb x1={hipX + 4} y1={hipY} x2={knRX} y2={knRY} color={bodyColor} width={5} />
      <Joint cx={knRX} cy={knRY} />
      <Limb x1={knRX} y1={knRY} x2={footRX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footRX} y={ankleY} fill={accent} />
    </svg>
  );
};
