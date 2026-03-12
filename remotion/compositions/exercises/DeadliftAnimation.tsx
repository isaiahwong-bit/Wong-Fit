import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, Barbell, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Deadlift: side-view. Figure hinges at hips to pick up barbell from floor,
 * then stands upright. Knees slightly bent, back stays straight.
 */
export const DeadliftAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2.5;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.quad);

  // Progress: 0 = bottom (hinged), 1 = standing
  const p = interpolate(t, [0, cycle * 0.45, cycle], [0, 1, 0], { easing: ease });

  const cx = 100;
  const groundY = 235;

  // Hip position — rises as we stand
  const hipY = interpolate(p, [0, 1], [155, 130]);
  const hipX = cx + interpolate(p, [0, 1], [-8, 0]);

  // Torso angle from vertical — hinged forward at bottom
  const torsoAngle = interpolate(p, [0, 1], [-55, -5]);
  const spineLen = 62;
  const [shoulderX, shoulderY] = endPoint(hipX, hipY, torsoAngle, -spineLen);
  const headX = shoulderX;
  const headY = shoulderY - 18;

  // Knee bend — slight at bottom, straight at top
  const kneeBend = interpolate(p, [0, 1], [25, 5]);

  // Feet stay planted
  const ankleY = groundY - 6;
  const footLX = cx - 14;
  const footRX = cx + 2;

  // Legs
  const thighLen = 50;
  const shinLen = 46;
  const [knLX, knLY] = endPoint(hipX - 3, hipY, kneeBend, thighLen);
  const [knRX, knRY] = endPoint(hipX + 3, hipY, kneeBend, thighLen);

  // Arms hang straight down from shoulders toward the bar
  const barY = interpolate(p, [0, 1], [groundY - 14, hipY + 45]);
  const armAngle = interpolate(p, [0, 1], [60, 10]);
  const [elbLX, elbLY] = endPoint(shoulderX - 2, shoulderY, armAngle, 30);
  const [elbRX, elbRY] = endPoint(shoulderX + 2, shoulderY, armAngle, 30);
  const handY = barY - 3;

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <Ground y={groundY} />

      {/* Barbell */}
      <Barbell x={cx - 55} y={barY} width={110} accent={accent} />

      {/* Spine */}
      <Limb x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} color={bodyColor} width={5} />

      {/* Head */}
      <Head cx={headX} cy={headY} fill={accent} />

      {/* Shoulder */}
      <Joint cx={shoulderX} cy={shoulderY} />

      {/* Arms — reach to bar */}
      <Limb x1={shoulderX - 2} y1={shoulderY} x2={elbLX} y2={elbLY} color={accent} width={3.5} />
      <Joint cx={elbLX} cy={elbLY} r={3} />
      <Limb x1={elbLX} y1={elbLY} x2={cx - 15} y2={handY} color={accent} width={3.5} />

      <Limb x1={shoulderX + 2} y1={shoulderY} x2={elbRX} y2={elbRY} color={accent} width={3.5} />
      <Joint cx={elbRX} cy={elbRY} r={3} />
      <Limb x1={elbRX} y1={elbRY} x2={cx + 15} y2={handY} color={accent} width={3.5} />

      {/* Hip */}
      <Joint cx={hipX} cy={hipY} />

      {/* Left leg */}
      <Limb x1={hipX - 3} y1={hipY} x2={knLX} y2={knLY} color={bodyColor} width={5} />
      <Joint cx={knLX} cy={knLY} />
      <Limb x1={knLX} y1={knLY} x2={footLX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footLX} y={ankleY} fill={accent} />

      {/* Right leg */}
      <Limb x1={hipX + 3} y1={hipY} x2={knRX} y2={knRY} color={bodyColor} width={5} />
      <Joint cx={knRX} cy={knRY} />
      <Limb x1={knRX} y1={knRY} x2={footRX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footRX} y={ankleY} fill={accent} />
    </svg>
  );
};
