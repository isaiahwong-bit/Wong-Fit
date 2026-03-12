"use client";

type Props = {
  totalSets: number;
  setsDone: number;
  onSetToggle: (setIndex: number) => void;
  accent: string;
};

export function SetTracker({ totalSets, setsDone, onSetToggle, accent }: Props) {
  return (
    <div className="mb-3.5">
      <div className="mb-2 font-mono text-[11px] text-text-muted">
        SETS COMPLETED
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalSets }).map((_, i) => {
          const done = i < setsDone;
          return (
            <button
              key={i}
              onClick={() => onSetToggle(i)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full font-mono text-[13px] font-bold transition-all duration-150"
              style={{
                border: `2px solid ${done ? accent : "#333"}`,
                background: done ? accent : "transparent",
                color: done ? "#000" : "#555",
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
