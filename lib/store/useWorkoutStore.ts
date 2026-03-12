"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserKey, WorkoutLog } from "@/lib/types";
import { useAchievementStore } from "./useAchievementStore";

function getTodayIndex(): number {
  const d = new Date().getDay();
  return [6, 0, 1, 2, 3, 4, 5][d]; // Convert Sun=0 to Mon=0
}

type WorkoutState = {
  activeUser: UserKey;
  activeDay: number;
  view: "workout" | "progress" | "achievements";
  logs: Record<UserKey, WorkoutLog[]>;

  setActiveUser: (user: UserKey) => void;
  setActiveDay: (day: number) => void;
  setView: (view: WorkoutState["view"]) => void;
  addLog: (log: Omit<WorkoutLog, "id">) => void;
  getLogsForExercise: (exerciseKey: string) => WorkoutLog[];
  isExerciseLogged: (exerciseKey: string) => boolean;
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeUser: "isaiah",
      activeDay: getTodayIndex(),
      view: "workout",
      logs: { isaiah: [], caitlyn: [] },

      setActiveUser: (user) => {
        set({ activeUser: user, activeDay: getTodayIndex() });
      },
      setActiveDay: (day) => set({ activeDay: day }),
      setView: (view) => set({ view }),

      addLog: (log) => {
        const userId = get().activeUser;
        const newLog: WorkoutLog = { ...log, id: crypto.randomUUID() };
        const updatedLogs = [...get().logs[userId], newLog];
        set((state) => ({
          logs: {
            ...state.logs,
            [userId]: updatedLogs,
          },
        }));
        // Check achievements after logging
        useAchievementStore.getState().checkAndUnlock(userId, updatedLogs);
      },

      getLogsForExercise: (exerciseKey: string) => {
        const state = get();
        return state.logs[state.activeUser].filter(
          (l) => l.exerciseKey === exerciseKey
        );
      },

      isExerciseLogged: (exerciseKey: string) => {
        const state = get();
        const today = new Date().toLocaleDateString();
        return state.logs[state.activeUser].some(
          (l) => l.exerciseKey === exerciseKey && l.date === today
        );
      },
    }),
    { name: "wong-fit-workout" }
  )
);
