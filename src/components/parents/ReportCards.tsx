"use client";

import { getFramework } from "@/content/frameworks";
import { GRADE_LABEL } from "@/content/subjects";
import { ReportCardGuide } from "../ReportCardGuide";
import { Panel } from "./common";
import { useChild } from "./common";

export function ReportCardsPage() {
  const child = useChild();
  const framework = getFramework(child?.framework);
  return (
    <div className="flex flex-col gap-5">
      <Panel>
        <ReportCardGuide framework={framework} grade={child?.grade} />
      </Panel>
      <Panel title="Talking with your child's teacher">
        <ul className="flex list-disc flex-col gap-2 pl-5 font-read">
          <li>Which learning areas should we focus on at home{child ? ` for ${GRADE_LABEL[child.grade]}` : ""}?</li>
          <li>What does “Proficient” look like for this area? Can you show me an example?</li>
          <li>How can I tell if practice at home is helping?</li>
          <li>Which Core Competency is my child working on, and how can we support it?</li>
        </ul>
        <p className="mt-3 text-sm text-ink-soft">
          The levels in this app come from practice results and are a guide only. They don&apos;t replace your child&apos;s teacher&apos;s assessment.
        </p>
      </Panel>
    </div>
  );
}
