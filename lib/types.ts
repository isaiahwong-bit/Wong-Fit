export type UserKey = "isaiah" | "caitlyn";

export type UserProfile = {
  name: string;
  label: "HIS" | "HERS";
  accent: string;
  accentDim: string;
  accentGlow: string;
  tag: string;
};

export type AnimationType =
  | "squat" | "deadlift" | "row" | "press" | "pullup"
  | "swing" | "lunge" | "bridge" | "plank" | "crunch"
  | "run" | "slam" | "lateral" | "dip";

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  equipment: string;
  muscles: string;
  cue: string;
  anim: AnimationType;
  instructions: string[];
  reasoning: string;
  safetyNotes?: string;
  /** Path to a looping video clip in /public/videos/exercises/ */
  videoSrc?: string;
};

export type WorkoutType = "strength" | "tone" | "hiit" | "rest";

export type DayProgram = {
  day: string;
  label: string;
  type: WorkoutType;
  exercises: string[];
  note?: string;
};

export type WorkoutLog = {
  id: string;
  exerciseKey: string;
  weight: number | null;
  setsCompleted: number;
  date: string;
  dayLabel: string;
};

export type AchievementTrigger =
  | "FIRST_LOG"
  | "FULL_DAY"
  | "FULL_WEEK"
  | "PR_WEIGHT"
  | "STREAK_3" | "STREAK_7" | "STREAK_14"
  | "TOTAL_50" | "TOTAL_100";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  trigger: AchievementTrigger;
  unlockedAt: string | null;
};
