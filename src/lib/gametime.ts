import type { Derived } from "./derive";
import { dayKey, type ChildSettings } from "./model";

// The learn-to-play timer: every N minutes of learning earns M minutes of
// arcade games, up to a daily cap. Parents set all three numbers.

export interface GameTime {
  enabled: boolean;
  freePlay: boolean;
  earnedSeconds: number;
  usedSeconds: number;
  availableSeconds: number;
  /** Learning seconds until the next reward. */
  nextInSeconds: number;
  capSeconds: number;
  learnSecondsToday: number;
}

export function gameTime(settings: ChildSettings | undefined, d: Derived, now = Date.now()): GameTime {
  const today = d.days[dayKey(now)];
  const learn = today?.learnSeconds ?? 0;
  const used = today?.playSeconds ?? 0;
  const per = Math.max(1, (settings?.learnMinutesPerReward ?? 20) * 60);
  const reward = (settings?.rewardGameMinutes ?? 5) * 60;
  const cap = (settings?.maxGameMinutesPerDay ?? 20) * 60;
  const earned = Math.min(cap, Math.floor(learn / per) * reward);
  const freePlay = settings?.freePlay ?? false;
  const available = Math.max(0, (freePlay ? cap : earned) - used);
  return {
    enabled: settings?.gamesEnabled ?? true,
    freePlay,
    earnedSeconds: earned,
    usedSeconds: used,
    availableSeconds: available,
    nextInSeconds: earned >= cap ? 0 : per - (learn % per),
    capSeconds: cap,
    learnSecondsToday: learn,
  };
}
