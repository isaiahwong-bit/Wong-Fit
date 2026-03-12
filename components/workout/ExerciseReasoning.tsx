"use client";

type Props = {
  reasoning: string;
  accent: string;
};

export function ExerciseReasoning({ reasoning, accent }: Props) {
  return (
    <div className="mb-3.5 rounded-md bg-surface-1 p-3">
      <div className="mb-1.5 font-mono text-[11px] font-bold" style={{ color: accent }}>
        WHY THIS EXERCISE
      </div>
      <p className="font-mono text-[12px] leading-relaxed text-text-secondary">
        {reasoning}
      </p>
    </div>
  );
}
