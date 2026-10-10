"use client";

import { growthStage } from "@/lib/buddy";
import { useActiveProfile, useDerived } from "@/lib/store";
import { Critter, type Mood } from "../Critter";

/** The child's own buddy, dressed for how far they have grown. */
export function Companion({ mood = "happy", size = 120, className = "" }: { mood?: Mood; size?: number; className?: string }) {
  const profile = useActiveProfile();
  const d = useDerived();
  return <Critter id={profile?.companion} mood={mood} size={size} className={className} stage={growthStage(d.level).stage} />;
}
