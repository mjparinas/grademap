import type { ReactNode } from "react";
import { SitePage } from "@/components/site/SiteChrome";

/** A small centred card for the pages that emailed links open. */
export function LinkCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SitePage>
      <div className="mx-auto max-w-md">
        <div className="card flex flex-col gap-4 p-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </SitePage>
  );
}
