import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, PullupBar, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Pull-up: figure hangs from bar, pulls body up until chin is above bar,
 * then lowers. Arms go from extended to bent, body translates up.
 */
export const PullupAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Progress: 0 = hanging, 1 = chin above bar
  const p = interpolate(t, [0, cycle * 0.4, cycle], [0, 1, 0], { easing: ease });

  const cx = 100;
  const barY = 40;

  // Hands stay on bar, body moves up
  const bodyLift = interpolate(p, [0, 1], [0, -50]);

  // Shoulder position relative to hands on bar
  const shoulderY = barY + 55 + bodyLift;
  const shoulderX = cx;

  // Head
  const headY = shoulderY - 18;

  // Spine + hip
  const hipY = shoulderY + 60;
  const hipX = cx;

  // Arms: from bar down to shoulders
  const handLX = cx - 18;
  const handRX = cx + 18;

  // Elbow position — bends as we pull up
  const elbowBend = interpolate(p, [0, 1], [10, 70]);
  const [elbLX, elbLY] = endPoint(handLX, barY + 3, elbowBend - 10, 25);
  const [elbRX, elbRY] = endPoint(handRX, barY + 3, -(elbowBend - 10), 25);

  // Legs — hanging, slightly bent at knees
  const kneeBend = interpolate(p, [0, 1], [5, 15]);
  const thighLen = 48;
  const shinLen = 44;
  const [knLX, knLY] = endPoint(hipX - 4, hipY, kneeBend, thighLen);
  const [knRX, knRY] = endPoint(hipX + 4, hipY, -kneeBend, thighLen);
  const [footLX, footLY] = endPoint(knLX, knLY, -5, shinLen);
  const [footRX, footRY] = endPoint(knRX, knRY, 5, shinLen);

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      {/* Pull-up bar */}
      <PullupBar x={40} y={barY} width={120} accent={accent} />

      {/* Arms: hand → elbow → shoulder */}
      <Limb x1={handLX} y1={barY + 3} x2={elbLX} y2={elbLY} color={accent} width={3.5} />
      <Joint cx={elbLX} cy={elbLY} r={3} />
      <Limb x1={elbLX} y1={elbLY} x2={shoulderX - 8} y2={shoulderY} color={accent} width={3.5} />

      <Limb x1={handRX} y1={barY + 3} x2={elbRX} y2={elbRY} color={accent} width={3.5} />
      <Joint cx={elbRX} cy={elbRY} r={3} />
      <Limb x1={elbRX} y1={elbRY} x2={shoulderX + 8} y2={shoulderY} color={accent} width={3.5} />

      {/* Spine */}
      <Limb x1={shoulderX} y1={shoulderY} x2={hipX} y2={hipY} color={bodyColor} width={5} />

      {/* Head */}
      <Head cx={cx} cy={headY} fill={accent} />

      {/* Shoulder + Hip */}
      <Joint cx={shoulderX} cy={shoulderY} />
      <Joint cx={hipX} cy={hipY} />

      {/* Left leg */}
      <Limb x1={hipX - 4} y1={hipY} x2={knLX} y2={knLY} color={bodyColor} width={5} />
      <Joint cx={knLX} cy={knLY} />
      <Limb x1={knLX} y1={knLY} x2={footLX} y2={footLY} color={bodyColor} width={5} />
      <Foot x={footLX - 8} y={footLY} fill={accent} />

      {/* Right leg */}
      <Limb x1={hipX + 4} y1={hipY} x2={knRX} y2={knRY} color={bodyColor} width={5} />
      <Joint cx={knRX} cy={knRY} />
      <Limb x1={knRX} y1={knRY} x2={footRX} y2={footRY} color={bodyColor} width={5} />
      <Foot x={footRX - 8} y={footRY} fill={accent} />

      {/* Hand grips on bar */}
      <circle cx={handLX} cy={barY + 3} r={3} fill="#fff" opacity={0.9} />
      <circle cx={handRX} cy={barY + 3} r={3} fill="#fff" opacity={0.9} />
    </svg>
  );
};
