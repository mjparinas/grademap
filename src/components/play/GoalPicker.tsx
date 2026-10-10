"use client";

import { useState } from "react";
import { GOAL_LABEL, goalOptions, type GoalLevel } from "@/lib/goal";
import { dayKey } from "@/lib/model";
import { useActiveProfile, useChildSettings, useDerived, useStore } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { Dialog } from "../ui";

const LEVELS: GoalLevel[] = ["easy", "regular", "stretch"];
const BLURB: Record<GoalLevel, string> = {
  easy: "A lighter day",
  regular: "Just right",
  stretch: "Go the extra mile for a bonus",
};

/** The minutes label under the home-screen bubble. Tapping it lets a child choose today's goal. */
export function GoalChip({ minutes, goal }: { minutes: number; goal: number }) {
  const settings = useChildSettings();
  const [open, setOpen] = useState(false);
  const label = (
    <span className="text-sm font-semibold whitespace-nowrap text-ink-soft">
      ⏱ {minutes}/{goal} min
    </span>
  );
  if (settings?.lockGoal) return label;
  return (
    <>
      <button type="button" className="inline-flex min-h-12 items-center gap-1 rounded-full px-2 text-sm font-semibold whitespace-nowrap text-ink-soft" aria-label={`Today's goal is ${goal} minutes. Change it`} onClick={() => setOpen(true)}>
        ⏱ {minutes}/{goal} min <span aria-hidden>✏️</span>
      </button>
      {open && <GoalDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function GoalDialog({ onClose }: { onClose: () => void }) {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const d = useDerived();
  const log = useStore((s) => s.log);
  const today = dayKey(useNow());
  const options = goalOptions(settings?.dailyGoalMinutes ?? 15);
  const current = d.goalPicks[today]?.level ?? "regular";
  const choose = (level: GoalLevel) => {
    if (level !== current) log([{ type: "goal", day: today, level, minutes: options[level] }]);
    onClose();
  };
  return (
    <Dialog open title={`How much today, ${profile.name}?`} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => choose(level)}
            aria-pressed={level === current}
            className={`btn min-h-16 justify-between gap-3 px-4 text-left ${level === current ? "btn-good" : "btn-soft"}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-3xl">{GOAL_LABEL[level].icon}</span>
              <span>
                <span className="block text-xl font-bold">{GOAL_LABEL[level].name}</span>
                <span className="block text-sm font-semibold">{BLURB[level]}</span>
              </span>
            </span>
            <span className="text-lg font-bold">{options[level]} min</span>
          </button>
        ))}
      </div>
    </Dialog>
  );
}
