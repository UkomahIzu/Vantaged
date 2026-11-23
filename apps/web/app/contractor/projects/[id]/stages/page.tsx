import type { Metadata } from "next";
import { ContractorProjectStagesPage } from "../../../../../company/Director dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Stages & Proof | Vantaged Contractor",
  description: "Execute construction milestones, complete checklists, and submit proof for owner review.",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ContractorProjectStagesPage projectId={id} />
    </div>
  );
}
