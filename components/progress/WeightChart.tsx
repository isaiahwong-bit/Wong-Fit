"use client";

import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAccent } from "@/lib/hooks/useAccent";
import { EXERCISES } from "@/lib/data/exercises";

export function WeightChart() {
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const logs = useWorkoutStore((s) => s.logs[activeUser]);
  const { accent } = useAccent();

  // Group logs by exercise, get max weight per exercise
  const exerciseWeights: { name: string; weight: number }[] = [];
  const byExercise: Record<string, number> = {};

  for (const log of logs) {
    if (log.weight && log.weight > 0) {
      const key = log.exerciseKey;
      if (!byExercise[key] || log.weight > byExercise[key]) {
        byExercise[key] = log.weight;
      }
    }
  }

  for (const [key, weight] of Object.entries(byExercise)) {
    exerciseWeights.push({
      name: EXERCISES[key]?.name || key,
      weight,
    });
  }

  exerciseWeights.sort((a, b) => b.weight - a.weight);
  const top = exerciseWeights.slice(0, 8);

  if (top.length === 0) {
    return (
      <div className="py-6 text-center font-mono text-[11px] text-text-ghost">
        Log exercises with weight to see your strength chart.
      </div>
    );
  }

  const maxWeight = Math.max(...top.map((t) => t.weight));

  return (
    <div className="mb-6 rounded-lg border border-border-subtle bg-surface-2 p-4">
      <div className="mb-4 font-mono text-[11px] font-bold text-text-dim">
        PERSONAL BESTS (KG)
      </div>
      <div className="space-y-2">
        {top.map((item) => {
          const pct = (item.weight / maxWeight) * 100;
          return (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-secondary">
                  {item.name}
                </span>
                <span
                  className="font-mono text-[11px] font-bold"
                  style={{ color: accent }}
                >
                  {item.weight}kg
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: accent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
