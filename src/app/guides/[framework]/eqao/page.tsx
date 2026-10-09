import { assessmentMetadata, AssessmentView } from "@/components/site/GuideExtras";
import { GUIDE_FRAMEWORKS, guidesFor } from "@/content/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_FRAMEWORKS.filter((f) => guidesFor(f.id).assessment.slug === "eqao").map((f) => ({ framework: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[framework]/eqao">) {
  return assessmentMetadata(params);
}

export default function Page({ params }: PageProps<"/guides/[framework]/eqao">) {
  return <AssessmentView params={params} />;
}
