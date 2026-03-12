import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Head, Joint, Limb, Foot, Ground } from "../../components/FigurineBase";

type Props = { accent: string; bodyColor: string };

/**
 * Plank: side-view. Figure holds horizontal position on forearms and toes.
 * Subtle breathing motion — body micro-sags then re-engages core.
 * Head on left, feet on right.
 */
export const PlankAnimation: React.FC<Props> = ({ accent, bodyColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 3;
  const t = frame % cycle;
  const ease = Easing.inOut(Easing.sin);

  // Subtle sag in the middle — isometric hold breathing
  const sag = interpolate(t, [0, cycle * 0.5, cycle], [0, 4, 0], { easing: ease });

  const groundY = 220;

  // Elbows on ground
  const elbowX = 45;
  const elbowY = groundY - 8;

  // Shoulders above elbows
  const shoulderX = 55;
  const shoulderY = groundY - 45;

  // Head looking forward/down
  const headX = 35;
  const headY = shoulderY - 10;

  // Hip — middle of body, slight sag
  const hipX = 110;
  const hipY = groundY - 42 + sag;

  // Ankles/toes on ground
  const toeX = 170;
  const toeY = groundY - 5;

  // Knee — between hip and toes
  const kneeX = 140;
  const kneeY = groundY - 40 + sag * 0.5;

  // Forearms on ground
  const handX = 30;
  const handY = groundY - 4;

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <Ground y={groundY} />

      {/* Head */}
      <Head cx={headX} cy={headY} r={11} fill={accent} />

      {/* Forearm (on ground) */}
      <Limb x1={shoulderX} y1={shoulderY} x2={elbowX} y2={elbowY} color={accent} width={3.5} />
      <Joint cx={elbowX} cy={elbowY} r={3} />
      <Limb x1={elbowX} y1={elbowY} x2={handX} y2={handY} color={accent} width={3.5} />

      {/* Upper body: shoulder → hip */}
      <Limb x1={shoulderX} y1={shoulderY} x2={hipX} y2={hipY} color={bodyColor} width={5} />

      {/* Shoulder */}
      <Joint cx={shoulderX} cy={shoulderY} />

      {/* Hip */}
      <Joint cx={hipX} cy={hipY} />

      {/* Upper leg: hip → knee */}
      <Limb x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} color={bodyColor} width={5} />
      <Joint cx={kneeX} cy={kneeY} />

      {/* Lower leg: knee → toe */}
      <Limb x1={kneeX} y1={kneeY} x2={toeX} y2={toeY} color={bodyColor} width={5} />

      {/* Toe contact point */}
      <Foot x={toeX - 4} y={toeY} w={10} fill={accent} />

      {/* Subtle engagement indicator — pulsing glow at core */}
      <circle
        cx={hipX - 15}
        cy={hipY - 2}
        r={interpolate(t, [0, cycle * 0.5, cycle], [3, 5, 3], { easing: ease })}
        fill={accent}
        opacity={0.2}
      />
    </svg>
  );
};
