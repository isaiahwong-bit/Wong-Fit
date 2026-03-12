"use client";

import type { Achievement } from "@/lib/types";

type Props = {
  achievement: Achievement;
  accent: string;
};

export function AchievementCard({ achievement, accent }: Props) {
  const unlocked = !!achievement.unlockedAt;

  return (
    <div
      className="flex items-center gap-3 rounded-lg border p-3.5 transition-all duration-200"
      style={{
        background: unlocked ? "#0d0d0d" : "#0a0a0a",
        borderColor: unlocked ? accent : "#1e1e1e",
        opacity: unlocked ? 1 : 0.4,
      }}
    >
      <div className="text-2xl">{unlocked ? achievement.icon : "🔒"}</div>
      <div>
        <div
          className="font-display text-base font-bold"
          style={{ color: unlocked ? accent : "#444" }}
        >
          {achievement.title}
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-text-muted">
          {achievement.description}
        </div>
        {unlocked && achievement.unlockedAt && (
          <div className="mt-1 font-mono text-[9px] text-text-dim">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
