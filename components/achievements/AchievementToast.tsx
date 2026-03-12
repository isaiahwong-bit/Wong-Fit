"use client";

import { useEffect } from "react";
import { useAchievementStore } from "@/lib/store/useAchievementStore";
import { useAccent } from "@/lib/hooks/useAccent";

export function AchievementToast() {
  const recentUnlock = useAchievementStore((s) => s.recentUnlock);
  const dismissRecent = useAchievementStore((s) => s.dismissRecent);
  const { accent } = useAccent();

  useEffect(() => {
    if (recentUnlock) {
      const timer = setTimeout(dismissRecent, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlock, dismissRecent]);

  if (!recentUnlock) return null;

  return (
    <div
      className="glass fixed left-1/2 top-4 z-[200] -translate-x-1/2 rounded-xl px-5 py-3 shadow-lg"
      style={{
        border: `1px solid ${accent}`,
        animation: "slideDown 300ms ease-out",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{recentUnlock.icon}</span>
        <div>
          <div className="font-mono text-[10px] font-bold tracking-wider" style={{ color: accent }}>
            ACHIEVEMENT UNLOCKED
          </div>
          <div className="font-display text-lg font-bold text-white">
            {recentUnlock.title}
          </div>
          <div className="font-mono text-[11px] text-text-muted">
            {recentUnlock.description}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
