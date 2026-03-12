"use client";

import { useState } from "react";
import { EXERCISES } from "@/lib/data/exercises";
import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAccent } from "@/lib/hooks/useAccent";
import { ExerciseAnimationPlayer } from "./ExerciseAnimationPlayer";
import { ExerciseInstructions } from "./ExerciseInstructions";
import { ExerciseReasoning } from "./ExerciseReasoning";
import { SetTracker } from "./SetTracker";
import { RestTimer } from "./RestTimer";
import { PROGRAMS } from "@/lib/data/programs";

type Props = {
  exKey: string;
};

export function ExerciseCard({ exKey }: Props) {
  const ex = EXERCISES[exKey];
  const { accent } = useAccent();
  const addLog = useWorkoutStore((s) => s.addLog);
  const isLogged = useWorkoutStore((s) => s.isExerciseLogged(exKey));
  const activeDay = useWorkoutStore((s) => s.activeDay);
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const dayLabel = PROGRAMS[activeUser][activeDay]?.label || "";

  const [open, setOpen] = useState(false);
  const [setsDone, setSetsDone] = useState(0);
  const [weight, setWeight] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  if (!ex) return null;
  const totalSets = ex.sets;

  function handleSetToggle(index: number) {
    setSetsDone(index < setsDone ? index : index + 1);
  }

  function handleLog() {
    addLog({
      exerciseKey: exKey,
      weight: weight ? Number(weight) : null,
      setsCompleted: setsDone,
      date: new Date().toLocaleDateString(),
      dayLabel,
    });
  }

  return (
    <div
      className="mb-2.5 overflow-hidden rounded-lg transition-all duration-200"
      style={{
        background: isLogged ? "#0d1a00" : "#111",
        border: `1px solid ${isLogged ? accent : "#222"}`,
      }}
    >
      {/* Header — always visible */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center justify-between px-4 py-3.5"
      >
        <div>
          <div
            className="font-display text-lg font-bold tracking-wide"
            style={{ color: isLogged ? accent : "#fff" }}
          >
            {ex.name}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-text-muted">
            {ex.sets} × {ex.reps} &nbsp;·&nbsp; {ex.equipment}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {isLogged && <span style={{ color: accent, fontSize: 16 }}>✓</span>}
          <span className="text-lg text-text-dim">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-border-subtle px-4 py-4">
          {/* Animation */}
          <ExerciseAnimationPlayer videoSrc={ex.videoSrc} />

          {/* Quick form cue */}
          <div className="mb-3.5 rounded-md bg-surface-1 p-3 font-mono text-[12px] leading-relaxed text-text-secondary">
            <span className="font-bold" style={{ color: accent }}>FORM: </span>
            {ex.cue}
          </div>

          {/* Toggle sections */}
          <div className="mb-3.5 flex gap-2">
            <button
              onClick={() => setShowInstructions((s) => !s)}
              className="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider transition-all duration-150"
              style={{
                background: showInstructions ? accent : "#1a1a1a",
                color: showInstructions ? "#000" : "#666",
                border: `1px solid ${showInstructions ? accent : "#333"}`,
              }}
            >
              {showInstructions ? "HIDE" : "SHOW"} INSTRUCTIONS
            </button>
            <button
              onClick={() => setShowReasoning((s) => !s)}
              className="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider transition-all duration-150"
              style={{
                background: showReasoning ? accent : "#1a1a1a",
                color: showReasoning ? "#000" : "#666",
                border: `1px solid ${showReasoning ? accent : "#333"}`,
              }}
            >
              {showReasoning ? "HIDE" : "WHY"} THIS EXERCISE
            </button>
          </div>

          {showInstructions && (
            <ExerciseInstructions
              instructions={ex.instructions}
              accent={accent}
              safetyNotes={ex.safetyNotes}
            />
          )}

          {showReasoning && (
            <ExerciseReasoning reasoning={ex.reasoning} accent={accent} />
          )}

          {/* Muscle tags */}
          <div className="mb-3.5 flex flex-wrap gap-2">
            {ex.muscles.split(", ").map((m) => (
              <span
                key={m}
                className="rounded-full bg-surface-4 px-2.5 py-1 font-mono text-[11px] text-text-tertiary"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Set tracker */}
          <SetTracker
            totalSets={totalSets}
            setsDone={setsDone}
            onSetToggle={handleSetToggle}
            accent={accent}
          />

          {/* Weight input + log */}
          <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
            <input
              type="number"
              placeholder="kg used"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-24 rounded-sm border border-border-strong bg-surface-1 px-3 py-2 font-mono text-[13px] text-white outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleLog}
              disabled={setsDone < totalSets}
              className="cursor-pointer rounded-sm px-4 py-2 font-mono text-[12px] font-bold transition-all duration-200"
              style={{
                background: setsDone >= totalSets ? accent : "#1a1a1a",
                color: setsDone >= totalSets ? "#000" : "#444",
                cursor: setsDone >= totalSets ? "pointer" : "not-allowed",
              }}
            >
              LOG SET ✓
            </button>
          </div>

          {/* Rest timer */}
          {ex.rest > 0 && <RestTimer seconds={ex.rest} accent={accent} />}
        </div>
      )}
    </div>
  );
}
