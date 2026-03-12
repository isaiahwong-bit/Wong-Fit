"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  seconds: number;
  accent: string;
};

export function RestTimer({ seconds, accent }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const [active, setActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setActive(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, remaining]);

  const pct = ((seconds - remaining) / seconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const circumference = 2 * Math.PI * 22;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-[52px] w-[52px]">
        <svg
          width="52"
          height="52"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="26" cy="26" r="22"
            fill="none" stroke="#222" strokeWidth="4"
          />
          <circle
            cx="26" cy="26" r="22"
            fill="none" stroke={accent} strokeWidth="4"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold"
          style={{ color: remaining === 0 ? accent : "#fff" }}
        >
          {remaining === 0 ? "GO" : `${mins}:${String(secs).padStart(2, "0")}`}
        </div>
      </div>

      <button
        onClick={() => {
          if (remaining === 0) {
            setRemaining(seconds);
            setActive(false);
          } else {
            setActive((a) => !a);
          }
        }}
        className="cursor-pointer rounded-sm px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all duration-150"
        style={{
          background: active ? "#333" : accent,
          color: active ? accent : "#000",
          border: `1px solid ${accent}`,
        }}
      >
        {active ? "PAUSE" : remaining === 0 ? "RESET" : "START"}
      </button>

      <span className="font-mono text-[11px] text-text-tertiary">
        REST {seconds}s
      </span>
    </div>
  );
}
