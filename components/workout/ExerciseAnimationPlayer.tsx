"use client";

type Props = {
  /** Path to looping video clip in /public/videos/exercises/ */
  videoSrc?: string;
};

function VideoSkeleton() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-[280px] w-[240px] animate-pulse rounded-xl bg-surface-1" />
    </div>
  );
}

export function ExerciseAnimationPlayer({ videoSrc }: Props) {
  if (!videoSrc) {
    return <VideoSkeleton />;
  }

  return (
    <div className="flex items-center justify-center py-4">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="h-[280px] w-[240px] rounded-xl object-cover"
      />
    </div>
  );
}
