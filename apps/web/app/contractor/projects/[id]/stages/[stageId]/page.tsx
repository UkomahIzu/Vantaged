import type { Metadata } from "next";
import { ContractorProjectStageDetailPage } from "../../../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string; stageId: string }>;
}

export const metadata: Metadata = {
  title: "Stage Checklist & Proof | Vantaged Contractor",
  description: "Upload geo-tagged photos, videos, and lab reports and mark stages ready for review.",
};

export default async function Page({ params }: PageProps) {
  const { id, stageId } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorProjectStageDetailPage projectId={id} stageId={stageId} />
    </div>
  );
}
