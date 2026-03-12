import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Running: side-view. Alternating leg stride with opposing arm swing,
 * body has slight forward lean and vertical bounce.
 */
export const RunAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = Math.round(fps * 0.7); // fast stride
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Stride progress oscillates -1 to 1
  const stride = interpolate(t, [0, cycle / 2, cycle], [-1, 1, -1], { easing: ease });

  // Vertical bounce — highest at mid-stride
  const bounce = interpolate(t, [0, cycle * 0.25, cycle * 0.5, cycle * 0.75, cycle], [0, -6, 0, -6, 0], { easing: ease });

  const cx = 100;
  const groundY = 235;

  // Slight forward lean
  const hipY = 130 + bounce;
  const hipX = cx;
  const torsoAngle = -8;
  const spineLen = 58;
  const [shoulderX, shoulderY] = endPoint(hipX, hipY, torsoAngle, -spineLen);
  const headY = shoulderY - 16;

  // Leg swing — opposing legs
  const frontLegAngle = stride * 35; // degrees from vertical
  const rearLegAngle = -stride * 30;

  // Front leg
  const frontThighLen = 46;
  const frontShinLen = 42;
  const frontKneeBend = Math.abs(stride) * 20 + 10;
  const [frontKnX, frontKnY] = endPoint(hipX, hipY, frontLegAngle, frontThighLen);
  const [frontFootX, frontFootY] = endPoint(frontKnX, frontKnY, frontLegAngle * 0.3 + frontKneeBend * (stride > 0 ? -0.3 : 0.3), frontShinLen);

  // Rear leg
  const rearKneeBend = Math.abs(stride) * 25 + 5;
  const [rearKnX, rearKnY] = endPoint(hipX, hipY, rearLegAngle, frontThighLen);
  const [rearFootX, rearFootY] = endPoint(rearKnX, rearKnY, rearLegAngle * 0.5, frontShinLen);

  // Arms — oppose legs
  const frontArmAngle = -stride * 30;
  const rearArmAngle = stride * 25;
  const armLen = 42;
  const [handFX, handFY] = endPoint(shoulderX, shoulderY, frontArmAngle, armLen);
  const [handRX, handRY] = endPoint(shoulderX, shoulderY, rearArmAngle, armLen);

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
      <Limb x1={shoulderX} y1={shoulderY} x2={handFX} y2={handFY} color={accent} width={3.5} />
      <Limb x1={shoulderX} y1={shoulderY} x2={handRX} y2={handRY} color={accent} width={3.5} />

      {/* Hip */}
      <Joint cx={hipX} cy={hipY} />

      {/* Front leg */}
      <Limb x1={hipX} y1={hipY} x2={frontKnX} y2={frontKnY} color={bodyColor} width={5} />
      <Joint cx={frontKnX} cy={frontKnY} />
      <Limb x1={frontKnX} y1={frontKnY} x2={frontFootX} y2={frontFootY} color={bodyColor} width={5} />
      <Foot x={frontFootX - 8} y={frontFootY} fill={accent} />

      {/* Rear leg */}
      <Limb x1={hipX} y1={hipY} x2={rearKnX} y2={rearKnY} color={bodyColor} width={5} />
      <Joint cx={rearKnX} cy={rearKnY} />
      <Limb x1={rearKnX} y1={rearKnY} x2={rearFootX} y2={rearFootY} color={bodyColor} width={5} />
      <Foot x={rearFootX - 8} y={rearFootY} fill={accent} />
    </svg>
  );
};
