"use client";

import { UserSwitcher } from "./UserSwitcher";
import { NavTabs } from "./NavTabs";
import { useAccent } from "@/lib/hooks/useAccent";

export function Header() {
  const { accent, user } = useAccent();

  return (
    <div className="glass sticky top-0 z-50 px-5">
      <div className="mx-auto max-w-xl">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <div
              className="font-display text-[28px] font-black leading-none tracking-[3px]"
              style={{ color: accent }}
            >
              WONG FIT
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-text-dim">
              {user.tag.toUpperCase()}
            </div>
          </div>
          <UserSwitcher />
        </div>

        {/* Nav */}
        <NavTabs />
      </div>
    </div>
  );
}
