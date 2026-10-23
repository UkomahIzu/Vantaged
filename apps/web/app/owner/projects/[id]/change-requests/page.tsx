import type { Metadata } from "next";
import { ProjectChangeRequestsPage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Change Requests & Variations (${id}) | Vantaged`,
    description: "PRD 7.8 scope modifications, cost adjustments, and timeline extensions.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectChangeRequestsPage projectId={id} />
    </main>
  );
}
