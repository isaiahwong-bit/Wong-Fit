"use client";

import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { USERS } from "@/lib/data/users";
import type { UserKey } from "@/lib/types";

export function UserSwitcher() {
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const setActiveUser = useWorkoutStore((s) => s.setActiveUser);

  return (
    <div className="flex overflow-hidden rounded-md border border-border-default bg-surface-3">
      {(Object.entries(USERS) as [UserKey, (typeof USERS)[UserKey]][]).map(
        ([key, u]) => (
          <button
            key={key}
            onClick={() => setActiveUser(key)}
            className="cursor-pointer px-4 py-2 font-mono text-[11px] font-bold transition-all duration-150"
            style={{
              background: activeUser === key ? u.accent : "transparent",
              color: activeUser === key ? "#000" : "#555",
            }}
          >
            {u.label}
          </button>
        )
      )}
    </div>
  );
}
