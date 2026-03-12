import React, { useEffect, useState } from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  accent: string;
  bodyColor: string;
  /** Path to the Lottie JSON file in /public, e.g. "/lottie/squat.json" */
  src: string;
};

/**
 * Generic Lottie exercise player for Remotion.
 * Loads a Lottie JSON from the public folder and plays it
 * synced to Remotion's timeline.
 */
export const LottieExercise: React.FC<Props> = ({ src }) => {
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {
        /* silently fail — SVG fallback will show */
      });
  }, [src]);

  if (!animationData) {
    return null;
  }

  return (
    <Lottie
      animationData={animationData}
      playbackRate={1}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
