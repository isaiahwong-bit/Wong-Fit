"use client";

import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAccent } from "@/lib/hooks/useAccent";
import { PROGRAMS } from "@/lib/data/programs";
import { DAYS } from "@/lib/data/users";
import { PillBadge } from "@/components/ui/PillBadge";

export function DayHeader() {
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const activeDay = useWorkoutStore((s) => s.activeDay);
  const { user } = useAccent();
  const program = PROGRAMS[activeUser];
  const dayProgram = program[activeDay];

  return (
    <div className="mb-5">
      <div className="flex items-start justify-between">
        <div>
          <div
            className="font-display text-[32px] font-black leading-none tracking-wider"
            style={{
              color: dayProgram.type === "rest" ? "#333" : "#fff",
            }}
          >
            {dayProgram.label.toUpperCase()}
          </div>
          <div className="mt-1 font-mono text-[11px] text-text-dim">
            {DAYS[activeDay]} &nbsp;·&nbsp; {user.name.toUpperCase()}
          </div>
        </div>
        <PillBadge type={dayProgram.type} />
      </div>
    </div>
  );
}
