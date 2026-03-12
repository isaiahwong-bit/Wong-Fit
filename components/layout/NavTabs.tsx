"use client";

import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAccent } from "@/lib/hooks/useAccent";

const TABS = ["workout", "progress", "achievements"] as const;

export function NavTabs() {
  const view = useWorkoutStore((s) => s.view);
  const setView = useWorkoutStore((s) => s.setView);
  const { accent } = useAccent();

  return (
    <div className="flex gap-0">
      {TABS.map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className="cursor-pointer border-b-2 bg-transparent px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-200"
          style={{
            color: view === v ? accent : "#444",
            borderBottomColor: view === v ? accent : "transparent",
          }}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
