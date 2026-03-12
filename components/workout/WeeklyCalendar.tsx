"use client";

import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAccent } from "@/lib/hooks/useAccent";
import { PROGRAMS } from "@/lib/data/programs";
import type { WorkoutType } from "@/lib/types";

const TYPE_COLORS: Record<WorkoutType, string> = {
  strength: "#E8FF3A",
  tone: "#FF6B9D",
  hiit: "#FF8C42",
  rest: "#333",
};

const TYPE_LABELS: Record<WorkoutType, string> = {
  strength: "STR",
  tone: "TONE",
  hiit: "HIIT",
  rest: "REST",
};

export function WeeklyCalendar() {
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const activeDay = useWorkoutStore((s) => s.activeDay);
  const setActiveDay = useWorkoutStore((s) => s.setActiveDay);
  const { accent } = useAccent();
  const program = PROGRAMS[activeUser];

  const todayIdx = new Date().getDay();
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sun=0 -> Mon=0
  const todayMapped = dayMap[todayIdx];

  return (
    <div className="mb-6 grid grid-cols-7 gap-1.5">
      {program.map((d, i) => {
        const isToday = todayMapped === i;
        const isActive = activeDay === i;
        const tc = TYPE_COLORS[d.type];
        return (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-md p-2.5 transition-all duration-150"
            style={{
              background: isActive ? "#1a1a1a" : "#0d0d0d",
              border: `1px solid ${isActive ? accent : isToday ? tc : "#1e1e1e"}`,
            }}
          >
            <span
              className="font-mono text-[10px]"
              style={{ color: isToday ? accent : "#555" }}
            >
              {d.day}
            </span>
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: d.type === "rest" ? "#222" : tc }}
            />
            <span
              className="font-mono text-[9px]"
              style={{ color: isActive ? accent : "#444" }}
            >
              {TYPE_LABELS[d.type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
