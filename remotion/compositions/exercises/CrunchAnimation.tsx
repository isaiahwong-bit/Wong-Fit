import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground, endPoint } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Crunch: figure lies on back with knees bent, feet flat.
 * Curls upper body up (shoulders lift off ground) then lowers.
 * Side view — head on left, feet on right.
 */
export const CrunchAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 1.8;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Progress: 0 = lying flat, 1 = crunched up
  const p = interpolate(t, [0, cycle * 0.4, cycle], [0, 1, 0], { easing: ease });

  const groundY = 220;

  // Lower back stays on floor
  const lowerBackX = 80;
  const lowerBackY = groundY - 8;

  // Upper body curls — shoulder lifts and rotates forward
  const crunchAngle = interpolate(p, [0, 1], [0, -35]); // degrees
  const spineLen = 50;
  const [shoulderX, shoulderY] = endPoint(lowerBackX, lowerBackY, crunchAngle - 90, spineLen);

  // Head follows shoulders
  const [headX, headY] = endPoint(shoulderX, shoulderY, crunchAngle - 90, 16);

  // Hands behind head
  const handX = headX + 5;
  const handY = headY + 3;

  // Hips — on the ground
  const hipX = lowerBackX + 15;
  const hipY = groundY - 6;

  // Knees bent, feet flat
  const kneeX = 130;
  const kneeY = groundY - 38;
  const ankleX = 150;
  const ankleY = groundY - 6;

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <Ground y={groundY} />

      {/* Head */}
      <Head cx={headX} cy={headY} r={11} fill={accent} />

      {/* Arms — hands behind head */}
      <Limb x1={shoulderX} y1={shoulderY} x2={handX} y2={handY} color={accent} width={3} />

      {/* Upper spine: lower back → shoulder (the crunching part) */}
      <Limb x1={lowerBackX} y1={lowerBackY} x2={shoulderX} y2={shoulderY} color={bodyColor} width={5} />
      <Joint cx={shoulderX} cy={shoulderY} />
      <Joint cx={lowerBackX} cy={lowerBackY} />

      {/* Lower body on floor: lower back → hip */}
      <Limb x1={lowerBackX} y1={lowerBackY} x2={hipX} y2={hipY} color={bodyColor} width={5} />
      <Joint cx={hipX} cy={hipY} />

      {/* Thigh: hip → knee */}
      <Limb x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} color={bodyColor} width={5} />
      <Joint cx={kneeX} cy={kneeY} />

      {/* Shin: knee → ankle */}
      <Limb x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} color={bodyColor} width={5} />
      <Foot x={ankleX - 8} y={ankleY} fill={accent} />
    </svg>
  );
};
