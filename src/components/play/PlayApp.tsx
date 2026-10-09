"use client";

import { useEffect } from "react";
import { ageBandFor } from "@/content/subjects";
import type { FrameworkId, GradeId, SubjectId } from "@/content/types";
import type { Mode } from "@/lib/model";
import { PLACEMENT_SUBJECTS } from "@/lib/placement";
import { useRoute } from "@/lib/router";
import { useActiveProfile, useProfiles, useReady, useStore } from "@/lib/store";
import { startBackgroundSync } from "@/lib/sync";
import { prefetchGrades } from "@/lib/useGradeContent";
import { BandProvider } from "../band";
import { ContentGate } from "../ContentGate";
import { LoadingScreen } from "../ui";
import { Arcade, GameScreen } from "./Arcade";
import { Hub } from "./Hub";
import { SpeedPicker, SubjectPicker, UnitList } from "./Practice";
import { PlacementTest } from "./PlacementTest";
import { Session } from "./Session";
import { Shop } from "./Shop";
import { FirstRun, Picker } from "./Start";
import { Toasts } from "./Toasts";
import { TrophyRoom } from "./Trophies";

const MODES: Mode[] = ["practice", "adventure", "review", "speed", "daily", "challenge"];

function Screen() {
  const { path, query } = useRoute();
  switch (path[0]) {
    case "practice":
      return path[1] ? <UnitList key={path[1]} subject={path[1] as SubjectId} /> : <SubjectPicker />;
    case "speed":
      return <SpeedPicker />;
    case "session": {
      const mode = query.get("mode") as Mode;
      const scope = query.get("scope") ?? "mix";
      if (!MODES.includes(mode)) return <Hub />;
      // A new key restarts the session cleanly when "Play again" is pressed.
      return <Session key={`${mode}:${scope}:${query.get("r") ?? ""}`} mode={mode} scope={scope} />;
    }
    case "placement":
      if (!PLACEMENT_SUBJECTS.includes(path[1] as SubjectId)) return <Hub />;
      return <PlacementTest key={path[1]} subject={path[1] as SubjectId} />;
    case "arcade":
      return path[1] ? <GameScreen key={path[1]} id={path[1]} /> : <Arcade />;
    case "trophies":
      return <TrophyRoom />;
    case "shop":
      return <Shop />;
    default:
      return <Hub />;
  }
}

export function PlayApp() {
  const ready = useReady();
  const profiles = useProfiles();
  const active = useActiveProfile();

  useEffect(() => {
    // Keyed on `ready` so a hot-reloaded (reset) store in development loads again.
    if (ready) return;
    void useStore
      .getState()
      .init()
      .then(() => startBackgroundSync());
  }, [ready]);

  if (!ready) return <LoadingScreen />;
  if (profiles.length === 0) return <FirstRun />;
  if (!active) return <Picker />;

  const band = ageBandFor(active.grade);
  return (
    <ContentGate targets={[{ grade: active.grade, framework: active.framework }]} onSwitch={profiles.length > 1 ? () => useStore.getState().setActive(null) : undefined}>
      <Prefetch />
      <BandProvider value={band}>
        <div data-band={band} key={active.id}>
          <Screen />
        </div>
        <Toasts />
      </BandProvider>
    </ContentGate>
  );
}

/** Once the active child's lessons are in, quietly download siblings' and nearby grades for offline use. */
function Prefetch() {
  const profiles = useProfiles();
  const active = useActiveProfile();
  const targets = [...new Set([active, ...profiles].filter(Boolean).map((p) => `${p!.framework}:${p!.grade}`))].join(",");
  useEffect(() => {
    if (targets) {
      prefetchGrades(
        targets.split(",").map((t) => {
          const [framework, grade] = t.split(":");
          return { framework: framework as FrameworkId, grade: grade as GradeId };
        }),
      );
    }
  }, [targets]);
  return null;
}
