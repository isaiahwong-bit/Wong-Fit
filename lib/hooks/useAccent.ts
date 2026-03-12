"use client";

import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { USERS } from "@/lib/data/users";

export function useAccent() {
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const user = USERS[activeUser];
  return {
    accent: user.accent,
    accentDim: user.accentDim,
    accentGlow: user.accentGlow,
    user,
    activeUser,
  };
}
