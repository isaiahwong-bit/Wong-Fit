"use client";

import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAccent } from "@/lib/hooks/useAccent";
import { EXERCISES } from "@/lib/data/exercises";

export function ProgressLog() {
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const logs = useWorkoutStore((s) => s.logs[activeUser]);
  const { accent } = useAccent();

  const recent = [...logs].reverse().slice(0, 20);

  if (recent.length === 0) {
    return (
      <div className="py-10 text-center font-mono text-[12px] text-text-ghost">
        No sessions logged yet. Complete workouts to see progress.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recent.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-2 px-3.5 py-3"
        >
          <div>
            <div className="font-display text-base font-semibold text-white">
              {EXERCISES[log.exerciseKey]?.name || log.exerciseKey}
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-text-muted">
              {log.setsCompleted} sets &nbsp;·&nbsp;{" "}
              {log.weight ? `${log.weight}kg` : "bodyweight"} &nbsp;·&nbsp;{" "}
              {log.date}
            </div>
          </div>
          <span className="text-xl" style={{ color: accent }}>
            ✓
          </span>
        </div>
      ))}
    </div>
  );
}
