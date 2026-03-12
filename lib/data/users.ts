import type { UserKey, UserProfile } from "@/lib/types";

export const USERS: Record<UserKey, UserProfile> = {
  isaiah: {
    name: "Isaiah",
    label: "HIS",
    accent: "#E8FF3A",
    accentDim: "#b8cc1a",
    accentGlow: "#1a1f00",
    tag: "Strength & Power",
  },
  caitlyn: {
    name: "Caitlyn",
    label: "HERS",
    accent: "#FF6B9D",
    accentDim: "#cc4477",
    accentGlow: "#1a0010",
    tag: "Tone & Lower Body",
  },
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
