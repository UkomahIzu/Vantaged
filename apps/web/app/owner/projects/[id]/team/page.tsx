import type { Metadata } from "next";
import { ProjectTeamSitePage } from "../../../../../client/Owner dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Site & Team (${id}) | Vantaged`,
    description: "Verified contractor profile, site engineers, and assigned client representatives.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ProjectTeamSitePage projectId={id} />
    </div>
  );
}
