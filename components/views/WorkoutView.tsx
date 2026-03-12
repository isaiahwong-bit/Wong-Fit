"use client";

import { useState } from "react";
import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAccent } from "@/lib/hooks/useAccent";
import { PROGRAMS } from "@/lib/data/programs";
import { StatCard } from "@/components/ui/StatCard";
import { WeeklyCalendar } from "@/components/workout/WeeklyCalendar";
import { DayHeader } from "@/components/workout/DayHeader";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { RestDayCard } from "@/components/workout/RestDayCard";
import { WorkoutTimerFlow } from "@/components/timer/WorkoutTimerFlow";

export function WorkoutView() {
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const activeDay = useWorkoutStore((s) => s.activeDay);
  const logs = useWorkoutStore((s) => s.logs[activeUser]);
  const { accent } = useAccent();
  const program = PROGRAMS[activeUser];
  const dayProgram = program[activeDay];

  const [showTimer, setShowTimer] = useState(false);

  const todayLogs = logs.filter(
    (l) => l.date === new Date().toLocaleDateString()
  );
  const uniqueDays = new Set(logs.map((l) => l.date)).size;

  return (
    <>
      {showTimer && dayProgram.exercises.length > 0 && (
        <WorkoutTimerFlow
          exerciseKeys={dayProgram.exercises}
          onClose={() => setShowTimer(false)}
        />
      )}

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        <StatCard label="LOGGED TODAY" value={todayLogs.length} accent={accent} />
        <StatCard label="TOTAL SESSIONS" value={uniqueDays} accent={accent} />
        <StatCard
          label="STREAK"
          value={`${Math.min(uniqueDays, 7)}d`}
          accent={accent}
        />
      </div>

      {/* Weekly calendar */}
      <WeeklyCalendar />

      {/* Day header */}
      <DayHeader />

      {/* Start workout button */}
      {dayProgram.exercises.length > 0 && dayProgram.type !== "rest" && (
        <button
          onClick={() => setShowTimer(true)}
          className="mb-5 w-full cursor-pointer rounded-lg py-3 font-mono text-[12px] font-bold tracking-wider transition-all duration-200"
          style={{
            background: "transparent",
            color: accent,
            border: `1px solid ${accent}`,
          }}
        >
          ▶ START GUIDED WORKOUT
        </button>
      )}

      {/* Exercise cards or rest day */}
      {dayProgram.type === "rest" && dayProgram.exercises.length === 0 ? (
        <RestDayCard note={dayProgram.note} />
      ) : (
        <div>
          {dayProgram.exercises.map((exKey) => (
            <ExerciseCard key={exKey} exKey={exKey} />
          ))}
        </div>
      )}
    </>
  );
}
