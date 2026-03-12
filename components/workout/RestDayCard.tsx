type Props = {
  note?: string;
};

export function RestDayCard({ note }: Props) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-2 px-5 py-10 text-center">
      <div className="mb-3 text-5xl">🛌</div>
      <div className="mb-2 font-display text-[22px] font-bold text-text-ghost">
        REST DAY
      </div>
      <div className="font-mono text-[12px] text-text-ghost">
        {note || "Recovery is part of the program."}
      </div>
    </div>
  );
}
