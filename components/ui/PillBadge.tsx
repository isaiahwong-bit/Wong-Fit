import type { WorkoutType } from "@/lib/types";

const TYPE_STYLES: Record<WorkoutType, { bg: string; border: string; text: string }> = {
  strength: { bg: "#1a1f00", border: "#E8FF3A", text: "#E8FF3A" },
  tone: { bg: "#1a0010", border: "#FF6B9D", text: "#FF6B9D" },
  hiit: { bg: "#2a1500", border: "#FF8C42", text: "#FF8C42" },
  rest: { bg: "#1a1a1a", border: "#222", text: "#444" },
};

type Props = {
  type: WorkoutType;
};

export function PillBadge({ type }: Props) {
  const style = TYPE_STYLES[type];
  return (
    <span
      className="rounded-full px-3 py-1 font-mono text-[11px] font-bold"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      {type.toUpperCase()}
    </span>
  );
}
