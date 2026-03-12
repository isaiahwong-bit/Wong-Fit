"use client";

import { useAccent } from "@/lib/hooks/useAccent";
import { WeightChart } from "@/components/progress/WeightChart";
import { ProgressLog } from "@/components/progress/ProgressLog";

export function ProgressView() {
  const { user } = useAccent();

  return (
    <>
      <div className="mb-5">
        <div className="font-display text-[28px] font-black tracking-wider">
          {user.name.toUpperCase()}&apos;S PROGRESS
        </div>
        <div className="mt-1 font-mono text-[11px] text-text-dim">
          LOGGED EXERCISES
        </div>
      </div>
      <WeightChart />
      <ProgressLog />
    </>
  );
}
