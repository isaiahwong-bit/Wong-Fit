"use client";

type Props = {
  instructions: string[];
  accent: string;
  safetyNotes?: string;
};

export function ExerciseInstructions({ instructions, accent, safetyNotes }: Props) {
  return (
    <div className="mb-3.5 rounded-md bg-surface-1 p-3">
      <div className="mb-2 font-mono text-[11px] font-bold" style={{ color: accent }}>
        HOW TO PERFORM
      </div>
      <ol className="space-y-1.5">
        {instructions.map((step, i) => (
          <li key={i} className="flex gap-2 font-mono text-[12px] leading-relaxed text-text-secondary">
            <span className="shrink-0 font-bold" style={{ color: accent }}>
              {i + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {safetyNotes && (
        <div className="mt-3 border-t border-border-subtle pt-2">
          <span className="font-mono text-[11px] font-bold text-red-400">SAFETY: </span>
          <span className="font-mono text-[11px] text-text-tertiary">{safetyNotes}</span>
        </div>
      )}
    </div>
  );
}
