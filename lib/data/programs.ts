import type { UserKey, DayProgram } from "@/lib/types";

export const PROGRAMS: Record<UserKey, DayProgram[]> = {
  isaiah: [
    {
      day: "Mon", label: "Upper Push", type: "strength",
      exercises: ["barbell_bench", "incline_db_press", "overhead_press", "db_lateral", "plank"],
    },
    {
      day: "Tue", label: "Lower Power", type: "strength",
      exercises: ["barbell_squat", "deadlift", "front_squat", "kb_swing", "ab_wheel"],
    },
    {
      day: "Wed", label: "Active Rest / Core", type: "rest",
      exercises: ["farmer_walk", "plank", "ab_wheel"],
      note: "Light day — loaded carries, core, and mobility.",
    },
    {
      day: "Thu", label: "Upper Pull", type: "strength",
      exercises: ["barbell_row", "pullup", "pendlay_row", "kb_row", "face_pull_band"],
    },
    {
      day: "Fri", label: "HIIT + Power", type: "hiit",
      exercises: ["push_press", "thruster", "ball_slam", "kb_circuit"],
    },
    { day: "Sat", label: "Rest", type: "rest", exercises: [], note: "Recovery. Walk, stretch, hydrate." },
    { day: "Sun", label: "Rest", type: "rest", exercises: [], note: "Recovery. Walk, stretch, hydrate." },
  ],
  caitlyn: [
    {
      day: "Mon", label: "Glutes & Quads A", type: "tone",
      exercises: ["goblet_squat", "db_lunge", "glute_bridge", "curtsy_lunge", "banded_clamshell", "stretch_cool"],
    },
    {
      day: "Tue", label: "HIIT + Core", type: "hiit",
      exercises: ["hiit_run", "jump_squat", "mountain_climbers", "ball_crunch", "dead_bug", "stretch_cool"],
    },
    {
      day: "Wed", label: "Rest", type: "rest", exercises: [], note: "Recovery. Walk, stretch, hydrate.",
    },
    {
      day: "Thu", label: "Glutes & Hamstrings B", type: "tone",
      exercises: ["rdl", "hip_thrust", "sumo_squat", "single_leg_bridge", "lateral_band_walk", "stretch_cool"],
    },
    {
      day: "Fri", label: "Full Body Tone", type: "tone",
      exercises: ["bulgarian_split_squat", "db_shoulder_press", "step_up", "kb_swing", "frog_pump", "plank", "stretch_cool"],
    },
    { day: "Sat", label: "Rest", type: "rest", exercises: [], note: "Recovery. Walk, stretch, hydrate." },
    { day: "Sun", label: "Rest", type: "rest", exercises: [], note: "Recovery. Walk, stretch, hydrate." },
  ],
};
