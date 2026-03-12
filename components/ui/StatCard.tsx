"use client";

type Props = {
  label: string;
  value: string | number;
  accent: string;
};

export function StatCard({ label, value, accent }: Props) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-2 p-3 text-center">
      <div
        className="font-display text-2xl font-extrabold"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[9px] text-text-dim">{label}</div>
    </div>
  );
}
