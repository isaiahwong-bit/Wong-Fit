"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserKey, Achievement, WorkoutLog } from "@/lib/types";
import { PROGRAMS } from "@/lib/data/programs";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "FIRST_LOG", title: "First Rep", description: "Every journey starts with a single rep.", icon: "💪", trigger: "FIRST_LOG", unlockedAt: null },
  { id: "FULL_DAY", title: "Day Destroyer", description: "Full session. Zero excuses.", icon: "🔥", trigger: "FULL_DAY", unlockedAt: null },
  { id: "FULL_WEEK", title: "Week Warrior", description: "Monday through Friday. Every session. Unstoppable.", icon: "⚡", trigger: "FULL_WEEK", unlockedAt: null },
  { id: "PR_WEIGHT", title: "New Record", description: "Heavier than ever before. Progress.", icon: "🏆", trigger: "PR_WEIGHT", unlockedAt: null },
  { id: "STREAK_3", title: "Three-Peat", description: "Three days straight. Momentum building.", icon: "🔗", trigger: "STREAK_3", unlockedAt: null },
  { id: "STREAK_7", title: "Iron Week", description: "A full week of showing up.", icon: "🗓️", trigger: "STREAK_7", unlockedAt: null },
  { id: "STREAK_14", title: "Fortnight Force", description: "Two weeks. Habit formed.", icon: "💎", trigger: "STREAK_14", unlockedAt: null },
  { id: "TOTAL_50", title: "Half Century", description: "50 exercises in the books.", icon: "📈", trigger: "TOTAL_50", unlockedAt: null },
  { id: "TOTAL_100", title: "Century Club", description: "100 logged. This IS the lifestyle.", icon: "👑", trigger: "TOTAL_100", unlockedAt: null },
];

type AchievementState = {
  achievements: Record<UserKey, Achievement[]>;
  recentUnlock: Achievement | null;
  checkAndUnlock: (userId: UserKey, logs: WorkoutLog[]) => void;
  dismissRecent: () => void;
};

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: {
        isaiah: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
        caitlyn: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
      },
      recentUnlock: null,

      checkAndUnlock: (userId, logs) => {
        const state = get();
        const userAchievements = state.achievements[userId];
        const now = new Date().toISOString();
        let newUnlock: Achievement | null = null;

        const updated = userAchievements.map((a) => {
          if (a.unlockedAt) return a;

          let triggered = false;
          switch (a.trigger) {
            case "FIRST_LOG":
              triggered = logs.length >= 1;
              break;
            case "TOTAL_50":
              triggered = logs.length >= 50;
              break;
            case "TOTAL_100":
              triggered = logs.length >= 100;
              break;
            case "FULL_DAY": {
              const today = new Date().toLocaleDateString();
              const todayLogs = logs.filter((l) => l.date === today);
              const program = PROGRAMS[userId];
              const dayIndex = [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];
              const dayExercises = program[dayIndex]?.exercises || [];
              triggered = dayExercises.length > 0 && dayExercises.every((exKey) =>
                todayLogs.some((l) => l.exerciseKey === exKey)
              );
              break;
            }
            case "FULL_WEEK": {
              const program = PROGRAMS[userId];
              const workoutDays = program.filter((d) => d.exercises.length > 0);
              const loggedDays = new Set(logs.map((l) => l.date));
              triggered = loggedDays.size >= workoutDays.length;
              break;
            }
            case "PR_WEIGHT": {
              const weights = logs.filter((l) => l.weight !== null).map((l) => l.weight as number);
              if (weights.length >= 2) {
                const latest = weights[weights.length - 1];
                const previousMax = Math.max(...weights.slice(0, -1));
                triggered = latest > previousMax;
              }
              break;
            }
            case "STREAK_3":
            case "STREAK_7":
            case "STREAK_14": {
              const target = a.trigger === "STREAK_3" ? 3 : a.trigger === "STREAK_7" ? 7 : 14;
              const uniqueDays = new Set(logs.map((l) => l.date));
              triggered = uniqueDays.size >= target;
              break;
            }
            default:
              break;
          }

          if (triggered) {
            newUnlock = { ...a, unlockedAt: now };
            return newUnlock;
          }
          return a;
        });

        if (newUnlock) {
          set({
            achievements: { ...state.achievements, [userId]: updated },
            recentUnlock: newUnlock,
          });
        }
      },

      dismissRecent: () => set({ recentUnlock: null }),
    }),
    {
      name: "wong-fit-achievements",
      partialize: (state) => ({ achievements: state.achievements }),
    }
  )
);
