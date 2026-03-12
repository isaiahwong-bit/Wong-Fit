"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { EXERCISES } from "@/lib/data/exercises";
import { useAccent } from "@/lib/hooks/useAccent";

type TimerPhase =
  | { phase: "intro"; exerciseIndex: number }
  | { phase: "countdown"; exerciseIndex: number }
  | { phase: "working"; exerciseIndex: number; setNumber: number }
  | { phase: "resting"; exerciseIndex: number; setNumber: number; remaining: number }
  | { phase: "complete" };

type Props = {
  exerciseKeys: string[];
  onClose: () => void;
};

export function WorkoutTimerFlow({ exerciseKeys, onClose }: Props) {
  const { accent } = useAccent();
  const [state, setState] = useState<TimerPhase>({ phase: "intro", exerciseIndex: 0 });
  const [countdownVal, setCountdownVal] = useState(3);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentExKey = state.phase !== "complete" ? exerciseKeys[state.exerciseIndex] : null;
  const currentEx = currentExKey ? EXERCISES[currentExKey] : null;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto-advance from intro after 3s
  useEffect(() => {
    if (state.phase === "intro" && !paused) {
      const t = setTimeout(() => {
        setCountdownVal(3);
        setState({ phase: "countdown", exerciseIndex: state.exerciseIndex });
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [state, paused]);

  // Countdown 3-2-1
  useEffect(() => {
    if (state.phase === "countdown" && !paused) {
      if (countdownVal <= 0) {
        setState({ phase: "working", exerciseIndex: state.exerciseIndex, setNumber: 1 });
        return;
      }
      const t = setTimeout(() => setCountdownVal((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [state, countdownVal, paused]);

  // Resting countdown
  useEffect(() => {
    if (state.phase === "resting" && !paused) {
      if (state.remaining <= 0) {
        // Next set or next exercise
        const ex = EXERCISES[exerciseKeys[state.exerciseIndex]];
        if (ex && state.setNumber < ex.sets) {
          setState({ phase: "working", exerciseIndex: state.exerciseIndex, setNumber: state.setNumber + 1 });
        } else if (state.exerciseIndex + 1 < exerciseKeys.length) {
          setState({ phase: "intro", exerciseIndex: state.exerciseIndex + 1 });
        } else {
          setState({ phase: "complete" });
        }
        return;
      }
      const t = setTimeout(
        () => setState({ ...state, remaining: state.remaining - 1 }),
        1000
      );
      return () => clearTimeout(t);
    }
  }, [state, paused, exerciseKeys]);

  function handleDoneSet() {
    if (state.phase !== "working") return;
    const ex = EXERCISES[exerciseKeys[state.exerciseIndex]];
    const restTime = ex?.rest || 30;
    setState({
      phase: "resting",
      exerciseIndex: state.exerciseIndex,
      setNumber: state.setNumber,
      remaining: restTime,
    });
  }

  function handleSkip() {
    if (state.phase === "complete") return;
    const idx = state.exerciseIndex;
    if (idx + 1 < exerciseKeys.length) {
      setState({ phase: "intro", exerciseIndex: idx + 1 });
    } else {
      setState({ phase: "complete" });
    }
  }

  return (
    <div
      className="glass-heavy fixed inset-0 z-[150] flex flex-col items-center justify-center"
      style={{ padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 cursor-pointer font-mono text-[13px] text-text-muted hover:text-white"
      >
        ✕ END
      </button>

      {/* INTRO */}
      {state.phase === "intro" && currentEx && (
        <div className="text-center">
          <div className="mb-2 font-mono text-[11px] font-bold tracking-wider text-text-dim">
            EXERCISE {state.exerciseIndex + 1} OF {exerciseKeys.length}
          </div>
          <div className="font-display text-4xl font-black tracking-wider" style={{ color: accent }}>
            {currentEx.name.toUpperCase()}
          </div>
          <div className="mt-3 font-mono text-lg text-text-secondary">
            {currentEx.sets} × {currentEx.reps}
          </div>
          <div className="mt-1 font-mono text-[12px] text-text-dim">
            {currentEx.equipment}
          </div>
        </div>
      )}

      {/* COUNTDOWN */}
      {state.phase === "countdown" && (
        <div className="text-center">
          <div
            className="font-display text-[120px] font-black leading-none"
            style={{ color: countdownVal === 0 ? accent : "#fff" }}
          >
            {countdownVal === 0 ? "GO" : countdownVal}
          </div>
        </div>
      )}

      {/* WORKING */}
      {state.phase === "working" && currentEx && (
        <div className="text-center">
          <div className="mb-2 font-mono text-[11px] text-text-dim">
            {currentEx.name.toUpperCase()}
          </div>
          <div className="mb-4 font-display text-2xl font-bold text-white">
            SET {state.setNumber} OF {currentEx.sets}
          </div>
          <div className="mb-2 font-mono text-4xl font-bold" style={{ color: accent }}>
            {currentEx.reps}
          </div>
          <div className="mb-8 font-mono text-[12px] text-text-muted">
            {currentEx.cue}
          </div>
          <button
            onClick={handleDoneSet}
            className="cursor-pointer rounded-lg px-8 py-4 font-mono text-lg font-bold tracking-wider"
            style={{ background: accent, color: "#000" }}
          >
            DONE ✓
          </button>
        </div>
      )}

      {/* RESTING */}
      {state.phase === "resting" && currentEx && (
        <div className="text-center">
          <div className="mb-2 font-mono text-[11px] text-text-dim">REST</div>
          <div className="mb-6 font-display text-[80px] font-black leading-none text-white">
            {state.remaining}
          </div>
          <div className="font-mono text-[12px] text-text-muted">
            Set {state.setNumber} of {currentEx.sets} complete
          </div>
          {state.exerciseIndex + 1 < exerciseKeys.length && state.setNumber >= currentEx.sets && (
            <div className="mt-4 font-mono text-[11px] text-text-dim">
              UP NEXT: {EXERCISES[exerciseKeys[state.exerciseIndex + 1]]?.name}
            </div>
          )}
        </div>
      )}

      {/* COMPLETE */}
      {state.phase === "complete" && (
        <div className="text-center">
          <div className="mb-4 text-6xl">🏆</div>
          <div className="font-display text-4xl font-black" style={{ color: accent }}>
            WORKOUT COMPLETE
          </div>
          <div className="mt-3 font-mono text-[13px] text-text-secondary">
            {exerciseKeys.length} exercises finished
          </div>
          <button
            onClick={onClose}
            className="mt-8 cursor-pointer rounded-lg px-8 py-3 font-mono text-sm font-bold"
            style={{ background: accent, color: "#000" }}
          >
            CLOSE
          </button>
        </div>
      )}

      {/* Bottom controls */}
      {state.phase !== "complete" && (
        <div className="absolute bottom-8 flex gap-4">
          <button
            onClick={() => setPaused((p) => !p)}
            className="cursor-pointer rounded-sm border border-border-strong px-5 py-2.5 font-mono text-[11px] font-bold text-text-secondary"
          >
            {paused ? "RESUME" : "PAUSE"}
          </button>
          <button
            onClick={handleSkip}
            className="cursor-pointer rounded-sm border border-border-strong px-5 py-2.5 font-mono text-[11px] font-bold text-text-secondary"
          >
            SKIP →
          </button>
        </div>
      )}
    </div>
  );
}
