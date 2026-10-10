"use client";

import { getFramework } from "@/content/frameworks";
import { GRADE_LABEL } from "@/content/subjects";
import { ReportCardGuide } from "../ReportCardGuide";
import { ChildTabs, Panel, useChild } from "./common";
import { ConferenceSheet } from "./ConferenceSheet";

export function ReportCardsPage({ childId }: { childId?: string }) {
  const child = useChild(childId);
  const framework = getFramework(child?.framework);
  return (
    <div className="flex flex-col gap-5">
      <div className="print:hidden">
        <ChildTabs base="report-cards" current={child} />
      </div>
      <ConferenceSheet childId={child?.id} />
      <Panel className="print:hidden">
        <ReportCardGuide framework={framework} grade={child?.grade} />
      </Panel>
      <Panel title="Talking with your child's teacher" className="print:hidden">
        <ul className="flex list-disc flex-col gap-2 pl-5 font-read">
          <li>Which learning areas should we focus on at home{child ? ` for ${GRADE_LABEL[child.grade]}` : ""}?</li>
          <li>What does “Proficient” look like for this area? Can you show me an example?</li>
          <li>How can I tell if practice at home is helping?</li>
          <li>Which learning skills and work habits is my child working on, and how can we support them?</li>
        </ul>
        <p className="mt-3 text-sm text-ink-soft">
          The levels in this app come from practice results and are a guide only. They don&apos;t replace your child&apos;s teacher&apos;s assessment.
        </p>
      </Panel>
    </div>
  );
}
