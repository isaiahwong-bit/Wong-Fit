import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Lunge: side-view. Front leg steps forward and bends to 90°,
 * rear leg extends back with knee dropping toward floor.
 * Torso stays upright throughout.
 */
export const LungeAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 2.2;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Progress: 0 = standing, 1 = deep lunge
  const p = interpolate(t, [0, cycle * 0.45, cycle], [0, 1, 0], { easing: ease });

  const cx = 100;
  const groundY = 235;
  const ankleY = groundY - 6;

  // Hip drops as we lunge
  const hipY = interpolate(p, [0, 1], [130, 158]);
  const hipX = cx;

  // Torso stays upright
  const spineLen = 60;
  const [shoulderX, shoulderY] = endPoint(hipX, hipY, -3, -spineLen);
  const headY = shoulderY - 17;

  // Front leg (left): steps forward, knee bends to 90°
  const frontFootX = cx + interpolate(p, [0, 1], [-8, -30]);
  const frontKneeAngle = interpolate(p, [0, 1], [5, -30]);
  const [frontKnX, frontKnY] = endPoint(hipX - 4, hipY, frontKneeAngle, 48);

  // Rear leg (right): extends back, knee drops toward ground
  const rearFootX = cx + interpolate(p, [0, 1], [8, 35]);
  const rearKneeAngle = interpolate(p, [0, 1], [5, 30]);
  const [rearKnX, rearKnY] = endPoint(hipX + 4, hipY, rearKneeAngle, 48);
  const rearKneeY = Math.min(rearKnY, ankleY - 8);

  // Arms hang at sides, slight swing
  const armSwing = interpolate(p, [0, 1], [5, 12]);
  const armLen = 48;
  const [handLX, handLY] = endPoint(shoulderX, shoulderY, -(armSwing), armLen);
  const [handRX, handRY] = endPoint(shoulderX, shoulderY, armSwing, armLen);

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <Ground y={groundY} />

      {/* Spine */}
      <Limb x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} color={bodyColor} width={5} />

      {/* Head */}
      <Head cx={shoulderX} cy={headY} fill={accent} />

      {/* Shoulder */}
      <Joint cx={shoulderX} cy={shoulderY} />

      {/* Arms */}
      <Limb x1={shoulderX} y1={shoulderY} x2={handLX} y2={handLY} color={accent} width={3.5} />
      <Limb x1={shoulderX} y1={shoulderY} x2={handRX} y2={handRY} color={accent} width={3.5} />

      {/* Hip */}
      <Joint cx={hipX} cy={hipY} />

      {/* Front leg */}
      <Limb x1={hipX - 4} y1={hipY} x2={frontKnX} y2={frontKnY} color={bodyColor} width={5} />
      <Joint cx={frontKnX} cy={frontKnY} />
      <Limb x1={frontKnX} y1={frontKnY} x2={frontFootX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={frontFootX} y={ankleY} fill={accent} />

      {/* Rear leg */}
      <Limb x1={hipX + 4} y1={hipY} x2={rearKnX} y2={rearKneeY} color={bodyColor} width={5} />
      <Joint cx={rearKnX} cy={rearKneeY} />
      <Limb x1={rearKnX} y1={rearKneeY} x2={rearFootX + 8} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={rearFootX} y={ankleY} fill={accent} />
    </svg>
  );
};
