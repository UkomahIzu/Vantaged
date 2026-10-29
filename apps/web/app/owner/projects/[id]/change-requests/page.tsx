import type { Metadata } from "next";
import { ProjectChangeRequestsPage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Change Requests & Variations (${id}) | Vantaged`,
    description: "Manage project scope modifications, cost adjustments, and timeline extensions with milestone protection.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectChangeRequestsPage projectId={id} />
    </div>
  );
}
