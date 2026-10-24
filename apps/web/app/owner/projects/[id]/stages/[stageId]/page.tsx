import type { Metadata } from "next";
import { ProjectStageDetailPage } from "../../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string; stageId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, stageId } = await params;
  return {
    title: `Stage Inspection (${stageId}) | Vantaged`,
    description: "Procore-style stage inspection, checklist verification, GPS-stamped photo proofs, and client review.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id, stageId } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectStageDetailPage projectId={id} stageId={stageId} />
    </div>
  );
}
