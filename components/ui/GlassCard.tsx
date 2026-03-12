import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-xl border border-border-subtle bg-surface-2 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
