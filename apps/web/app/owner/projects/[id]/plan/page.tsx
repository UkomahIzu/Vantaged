import type { Metadata } from "next";
import { ProjectPlanReviewPage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Pre-Construction Plan Review (${id}) | Vantaged`,
    description: "Review and approve stages, payment schedule, and mobilization deposit before construction begins.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectPlanReviewPage projectId={id} />
    </div>
  );
}
