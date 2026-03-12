import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Dip: front-view. Figure on parallel bars/bench, lowers body by
 * bending elbows, then pushes back up. Legs hang or extend forward.
 */
export const DipAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Progress: 0 = top (arms locked), 1 = bottom (elbows bent)
  const p = interpolate(t, [0, cycle * 0.45, cycle], [0, 1, 0], { easing: ease });

  const cx = 100;
  const groundY = 240;

  // Parallel bars (fixed)
  const barY = 110;
  const barWidth = 70;
  const handLX = cx - 30;
  const handRX = cx + 30;

  // Body drops as elbows bend
  const bodyDrop = interpolate(p, [0, 1], [0, 35]);

  const shoulderY = barY + 15 + bodyDrop;
  const shoulderX = cx;
  const headY = shoulderY - 22;

  // Hip below shoulders
  const hipY = shoulderY + 58;

  // Elbows — on bars, bend backward
  const elbowBend = interpolate(p, [0, 1], [5, 55]); // degrees
  const [elbLX, elbLY] = endPoint(handLX, barY + 3, elbowBend, 28);
  const [elbRX, elbRY] = endPoint(handRX, barY + 3, -elbowBend, 28);

  // Legs — hanging, slightly forward
  const legAngle = 8;
  const thighLen = 46;
  const shinLen = 42;
  const [knLX, knLY] = endPoint(cx - 4, hipY, legAngle, thighLen);
  const [knRX, knRY] = endPoint(cx + 4, hipY, -legAngle, thighLen);
  const [footLX, footLY] = endPoint(knLX, knLY, 3, shinLen);
  const [footRX, footRY] = endPoint(knRX, knRY, -3, shinLen);

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      {/* Parallel bars */}
      <line x1={cx - barWidth / 2} y1={barY} x2={cx + barWidth / 2} y2={barY} stroke={accent} strokeWidth={4} strokeLinecap="round" opacity={0.4} />
      {/* Bar supports */}
      <line x1={cx - barWidth / 2} y1={barY} x2={cx - barWidth / 2} y2={groundY} stroke={accent} strokeWidth={3} opacity={0.2} />
      <line x1={cx + barWidth / 2} y1={barY} x2={cx + barWidth / 2} y2={groundY} stroke={accent} strokeWidth={3} opacity={0.2} />

      {/* Arms: hand on bar → elbow → shoulder */}
      <Limb x1={handLX} y1={barY + 3} x2={elbLX} y2={elbLY} color={accent} width={3.5} />
      <Joint cx={elbLX} cy={elbLY} r={3} />
      <Limb x1={elbLX} y1={elbLY} x2={shoulderX - 8} y2={shoulderY} color={accent} width={3.5} />

      <Limb x1={handRX} y1={barY + 3} x2={elbRX} y2={elbRY} color={accent} width={3.5} />
      <Joint cx={elbRX} cy={elbRY} r={3} />
      <Limb x1={elbRX} y1={elbRY} x2={shoulderX + 8} y2={shoulderY} color={accent} width={3.5} />

      {/* Hand grips */}
      <circle cx={handLX} cy={barY + 3} r={3} fill="#fff" opacity={0.9} />
      <circle cx={handRX} cy={barY + 3} r={3} fill="#fff" opacity={0.9} />

      {/* Spine */}
      <Limb x1={shoulderX} y1={shoulderY} x2={cx} y2={hipY} color={bodyColor} width={5} />

      {/* Head */}
      <Head cx={cx} cy={headY} fill={accent} />

      {/* Shoulder + Hip */}
      <Joint cx={shoulderX} cy={shoulderY} />
      <Joint cx={cx} cy={hipY} />

      {/* Left leg */}
      <Limb x1={cx - 4} y1={hipY} x2={knLX} y2={knLY} color={bodyColor} width={5} />
      <Joint cx={knLX} cy={knLY} />
      <Limb x1={knLX} y1={knLY} x2={footLX} y2={footLY} color={bodyColor} width={5} />
      <Foot x={footLX - 8} y={footLY} fill={accent} />

      {/* Right leg */}
      <Limb x1={cx + 4} y1={hipY} x2={knRX} y2={knRY} color={bodyColor} width={5} />
      <Joint cx={knRX} cy={knRY} />
      <Limb x1={knRX} y1={knRY} x2={footRX} y2={footRY} color={bodyColor} width={5} />
      <Foot x={footRX - 8} y={footRY} fill={accent} />
    </svg>
  );
};
