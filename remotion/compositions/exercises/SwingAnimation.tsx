import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, Kettlebell, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Kettlebell Swing: figure hinges at hips, swinging KB between legs
 * at bottom and up to chest height at top. Explosive hip extension.
 */
export const SwingAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 1.6;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Progress: 0 = KB down between legs, 1 = KB at chest height
  const p = interpolate(t, [0, cycle * 0.4, cycle], [0, 1, 0], { easing: ease });

  const cx = 100;
  const groundY = 235;
  const ankleY = groundY - 6;

  // Hip hinges: more forward at bottom, upright at top
  const hipY = interpolate(p, [0, 1], [148, 132]);
  const hipX = cx + interpolate(p, [0, 1], [-5, 0]);
  const torsoAngle = interpolate(p, [0, 1], [-40, -5]);
  const spineLen = 58;
  const [shoulderX, shoulderY] = endPoint(hipX, hipY, torsoAngle, -spineLen);
  const headY = shoulderY - 17;

  // Arms swing with KB — from between legs to chest height
  const armSwing = interpolate(p, [0, 1], [70, -30]); // angle from vertical
  const armLen = 50;
  const [handX, handY] = endPoint(shoulderX, shoulderY, armSwing, armLen);

  // KB at hands
  const kbX = handX;
  const kbY = handY + 8;

  // Knees — bend more at bottom
  const kneeBend = interpolate(p, [0, 1], [28, 5]);
  const footLX = cx - 16;
  const footRX = cx + 4;
  const [knLX, knLY] = endPoint(hipX - 5, hipY, kneeBend, 48);
  const [knRX, knRY] = endPoint(hipX + 5, hipY, kneeBend, 48);

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <Ground y={groundY} />

      {/* Spine */}
      <Limb x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} color={bodyColor} width={5} />

      {/* Head */}
      <Head cx={shoulderX} cy={headY} fill={accent} />

      {/* Shoulder */}
      <Joint cx={shoulderX} cy={shoulderY} />

      {/* Arms (together holding KB) */}
      <Limb x1={shoulderX - 3} y1={shoulderY} x2={handX} y2={handY} color={accent} width={3.5} />
      <Limb x1={shoulderX + 3} y1={shoulderY} x2={handX} y2={handY} color={accent} width={3.5} />

      {/* Kettlebell */}
      <Kettlebell cx={kbX} cy={kbY} accent={accent} />

      {/* Hip */}
      <Joint cx={hipX} cy={hipY} />

      {/* Left leg */}
      <Limb x1={hipX - 5} y1={hipY} x2={knLX} y2={knLY} color={bodyColor} width={5} />
      <Joint cx={knLX} cy={knLY} />
      <Limb x1={knLX} y1={knLY} x2={footLX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footLX} y={ankleY} fill={accent} />

      {/* Right leg */}
      <Limb x1={hipX + 5} y1={hipY} x2={knRX} y2={knRY} color={bodyColor} width={5} />
      <Joint cx={knRX} cy={knRY} />
      <Limb x1={knRX} y1={knRY} x2={footRX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={footRX} y={ankleY} fill={accent} />
    </svg>
  );
};
