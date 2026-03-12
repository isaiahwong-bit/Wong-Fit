import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, Barbell, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Overhead Press: standing figure pushes barbell from shoulder height
 * to full lockout overhead. Arms extend upward.
 */
export const PressAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Progress: 0 = bar at shoulders, 1 = locked out overhead
  const p = interpolate(t, [0, cycle * 0.4, cycle], [0, 1, 0], { easing: ease });

  const cx = 100;
  const groundY = 235;
  const ankleY = groundY - 6;

  // Body stays mostly upright, slight lean back at lockout
  const hipY = 135;
  const hipX = cx;
  const torsoAngle = interpolate(p, [0, 1], [-3, -8]);
  const spineLen = 62;
  const [shoulderX, shoulderY] = endPoint(hipX, hipY, torsoAngle, -spineLen);
  const headY = shoulderY - 18;

  // Arms: upper arm angle transitions from out-to-sides to overhead
  const upperArmAngle = interpolate(p, [0, 1], [-50, -15]); // angle from vertical
  const forearmAngle = interpolate(p, [0, 1], [35, -8]);
  const armLen1 = 28;
  const armLen2 = 26;

  // Left arm
  const [elbLX, elbLY] = endPoint(shoulderX, shoulderY, -(upperArmAngle + 10), armLen1);
  const [handLX, handLY] = endPoint(elbLX, elbLY, -(forearmAngle + 10), armLen2);

  // Right arm
  const [elbRX, elbRY] = endPoint(shoulderX, shoulderY, upperArmAngle + 10, armLen1);
  const [handRX, handRY] = endPoint(elbRX, elbRY, forearmAngle + 10, armLen2);

  // Barbell y tracks the hands
  const barY = (handLY + handRY) / 2;

  // Legs — standing straight
  const footLX = cx - 14;
  const footRX = cx + 2;
  const kneeY = 185;

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <Ground y={groundY} />

      {/* Barbell */}
      <Barbell x={cx - 55} y={barY} width={110} accent={accent} />

      {/* Spine */}
      <Limb x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} color={bodyColor} width={5} />

      {/* Head */}
      <Head cx={shoulderX} cy={headY} fill={accent} />

      {/* Shoulder */}
      <Joint cx={shoulderX} cy={shoulderY} />

      {/* Left arm */}
      <Limb x1={shoulderX} y1={shoulderY} x2={elbLX} y2={elbLY} color={accent} width={3.5} />
      <Joint cx={elbLX} cy={elbLY} r={3} />
      <Limb x1={elbLX} y1={elbLY} x2={handLX} y2={handLY} color={accent} width={3.5} />

      {/* Right arm */}
      <Limb x1={shoulderX} y1={shoulderY} x2={elbRX} y2={elbRY} color={accent} width={3.5} />
      <Joint cx={elbRX} cy={elbRY} r={3} />
      <Limb x1={elbRX} y1={elbRY} x2={handRX} y2={handRY} color={accent} width={3.5} />

      {/* Hip */}
      <Joint cx={hipX} cy={hipY} />

      {/* Left leg */}
      <Limb x1={hipX - 4} y1={hipY} x2={cx - 8} y2={kneeY} color={bodyColor} width={5} />
      <Joint cx={cx - 8} cy={kneeY} />
      <Limb x1={cx - 8} y1={kneeY} x2={footLX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footLX} y={ankleY} fill={accent} />

      {/* Right leg */}
      <Limb x1={hipX + 4} y1={hipY} x2={cx + 8} y2={kneeY} color={bodyColor} width={5} />
      <Joint cx={cx + 8} cy={kneeY} />
      <Limb x1={cx + 8} y1={kneeY} x2={footRX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footRX} y={ankleY} fill={accent} />
    </svg>
  );
};
