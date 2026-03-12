"use client";

import { useAccent } from "@/lib/hooks/useAccent";
import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { useAchievementStore } from "@/lib/store/useAchievementStore";
import { AchievementCard } from "@/components/achievements/AchievementCard";

export function AchievementsView() {
  const { accent, user } = useAccent();
  const activeUser = useWorkoutStore((s) => s.activeUser);
  const achievements = useAchievementStore((s) => s.achievements[activeUser]);

  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);

  return (
    <>
      <div className="mb-5">
        <div className="font-display text-[28px] font-black tracking-wider">
          {user.name.toUpperCase()}&apos;S ACHIEVEMENTS
        </div>
        <div className="mt-1 font-mono text-[11px] text-text-dim">
          {unlocked.length} OF {achievements.length} UNLOCKED
        </div>
      </div>

      {unlocked.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 font-mono text-[11px] font-bold text-text-dim">
            UNLOCKED
          </div>
          <div className="space-y-2">
            {unlocked.map((a) => (
              <AchievementCard key={a.id} achievement={a} accent={accent} />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <div className="mb-3 font-mono text-[11px] font-bold text-text-dim">
            LOCKED
          </div>
          <div className="space-y-2">
            {locked.map((a) => (
              <AchievementCard key={a.id} achievement={a} accent={accent} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
