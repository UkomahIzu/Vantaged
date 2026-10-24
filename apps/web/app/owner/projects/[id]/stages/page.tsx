import type { Metadata } from "next";
import { ProjectStagesPage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Stages & Milestones (${id}) | Vantaged`,
    description: "Inspection checklists, GPS-stamped photo proofs, and milestone approvals.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectStagesPage projectId={id} />
    </div>
  );
}
