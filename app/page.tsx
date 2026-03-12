"use client";

import { Header } from "@/components/layout/Header";
import { useWorkoutStore } from "@/lib/store/useWorkoutStore";
import { WorkoutView } from "@/components/views/WorkoutView";
import { ProgressView } from "@/components/views/ProgressView";
import { AchievementsView } from "@/components/views/AchievementsView";
import { AchievementToast } from "@/components/achievements/AchievementToast";
import { useHydration } from "@/lib/hooks/useHydration";

export default function Home() {
  const hydrated = useHydration();
  const view = useWorkoutStore((s) => s.view);
  const activeUser = useWorkoutStore((s) => s.activeUser);

  if (!hydrated) {
    return <div className="min-h-screen bg-base-primary" />;
  }

  return (
    <div className="min-h-screen" data-user={activeUser}>
      <Header />
      <AchievementToast />
      <div className="mx-auto max-w-xl px-4 py-6">
        {view === "workout" && <WorkoutView />}
        {view === "progress" && <ProgressView />}
        {view === "achievements" && <AchievementsView />}
      </div>
    </div>
  );
}
